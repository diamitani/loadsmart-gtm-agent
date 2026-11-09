/**
 * Enably GTM — durable run agent (Cloudflare Agents on Durable Objects).
 *
 * One Durable Object per GTM run = a "virtual actor":
 *  • Continues builds that would exceed a serverless timeout (watchdog hand-off).
 *  • Waits for human approvals with ZERO compute (the object hibernates; state is in SQLite).
 *  • Retries callbacks with exponential backoff using the built-in scheduler.
 *
 * Routes (all require `Authorization: Bearer <CF_AGENT_SECRET>`):
 *   POST /runs/:id/start      { remainingWaves, appUrl }      → continue the build via the app
 *   POST /runs/:id/approval   { kind, summary, payload }      → park an action until approved
 *   POST /runs/:id/decision   { approvalId, approved, by }    → resume (or cancel) the parked action
 *   GET  /runs/:id            → current actor state
 */
import { Agent, getAgentByName } from "agents";

export interface Env {
  GtmRunAgent: DurableObjectNamespace<GtmRunAgent>;
  CF_AGENT_SECRET: string;
}

interface PendingApproval {
  id: string;
  kind: string;
  summary: string;
  payload: unknown;
  requestedAt: string;
  decidedAt?: string;
  approved?: boolean;
  by?: string;
}

interface RunState {
  runId?: string;
  appUrl?: string;
  status: "idle" | "building" | "completed" | "failed" | "awaiting_approval";
  remainingWaves: string[][];
  attempts: number;
  lastError?: string;
  approvals: PendingApproval[];
  history: { at: string; event: string }[];
}

const MAX_ATTEMPTS = 6;

export class GtmRunAgent extends Agent<Env, RunState> {
  initialState: RunState = { status: "idle", remainingWaves: [], attempts: 0, approvals: [], history: [] };

  private log(event: string, patch: Partial<RunState> = {}) {
    const history = [...this.state.history, { at: new Date().toISOString(), event }].slice(-100);
    this.setState({ ...this.state, ...patch, history });
  }

  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const [, , runId, action] = url.pathname.split("/"); // /runs/:id/:action

    if (request.method === "GET") return Response.json(this.state);

    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    if (action === "start") {
      this.log("start", {
        runId,
        appUrl: String(body.appUrl ?? this.state.appUrl ?? ""),
        status: "building",
        remainingWaves: (body.remainingWaves as string[][]) ?? [],
        attempts: 0,
        lastError: undefined,
      });
      await this.schedule(1, "continueBuild");
      return Response.json({ accepted: true, runId }, { status: 202 });
    }

    if (action === "approval") {
      const approval: PendingApproval = {
        id: crypto.randomUUID(),
        kind: String(body.kind ?? "action"),
        summary: String(body.summary ?? ""),
        payload: body.payload ?? null,
        requestedAt: new Date().toISOString(),
      };
      this.log(`approval requested: ${approval.kind}`, {
        runId: runId ?? this.state.runId,
        status: "awaiting_approval",
        approvals: [...this.state.approvals, approval],
      });
      // Nudge after 24h if nobody has decided. Until then: no compute, no tokens.
      await this.schedule(60 * 60 * 24, "approvalReminder", approval.id);
      return Response.json({ approvalId: approval.id, status: "awaiting_approval" });
    }

    if (action === "decision") {
      const id = String(body.approvalId ?? "");
      const approved = body.approved === true;
      const approvals = this.state.approvals.map((a) =>
        a.id === id ? { ...a, approved, by: String(body.by ?? "unknown"), decidedAt: new Date().toISOString() } : a,
      );
      const decided = approvals.find((a) => a.id === id);
      if (!decided) return Response.json({ error: "unknown approval" }, { status: 404 });
      const stillPending = approvals.some((a) => a.decidedAt === undefined);
      this.log(`approval ${approved ? "granted" : "rejected"}: ${decided.kind}`, {
        approvals,
        status: stillPending ? "awaiting_approval" : this.state.status === "awaiting_approval" ? "completed" : this.state.status,
      });
      if (approved) await this.callApp(`/api/runs/${this.state.runId}/approved`, decided);
      return Response.json({ ok: true, approval: decided });
    }

    return Response.json({ error: "not found" }, { status: 404 });
  }

  /** Scheduled: ask the app to continue the remaining waves. Retries with exponential backoff. */
  async continueBuild() {
    if (!this.state.runId || !this.state.appUrl) return;
    const ok = await this.callApp(`/api/runs/${this.state.runId}/continue`, { remainingWaves: this.state.remainingWaves });
    if (ok) {
      this.log("build completed", { status: "completed", remainingWaves: [] });
      return;
    }
    const attempts = this.state.attempts + 1;
    if (attempts >= MAX_ATTEMPTS) {
      this.log("build failed — max attempts", { status: "failed", attempts });
      return;
    }
    this.log(`retry ${attempts}`, { attempts });
    await this.schedule(2 ** attempts * 5, "continueBuild");
  }

  async approvalReminder(approvalId: string) {
    const a = this.state.approvals.find((x) => x.id === approvalId);
    if (a && !a.decidedAt) {
      this.log(`reminder: approval still pending (${a.kind})`);
      await this.callApp(`/api/runs/${this.state.runId}/reminder`, a);
    }
  }

  private async callApp(path: string, payload: unknown): Promise<boolean> {
    try {
      const res = await fetch(`${this.state.appUrl}${path}`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${this.env.CF_AGENT_SECRET}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) this.log(`callback ${path} → HTTP ${res.status}`, { lastError: `HTTP ${res.status}` });
      return res.ok;
    } catch (err) {
      this.log(`callback ${path} failed`, { lastError: (err as Error).message });
      return false;
    }
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "/health") return Response.json({ ok: true, service: "enably-gtm-durable" });

    if (!env.CF_AGENT_SECRET || request.headers.get("authorization") !== `Bearer ${env.CF_AGENT_SECRET}`) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
    const match = url.pathname.match(/^\/runs\/([\w-]+)(?:\/[\w-]+)?$/);
    if (!match) return Response.json({ error: "not found" }, { status: 404 });

    const agent = await getAgentByName(env.GtmRunAgent, match[1]);
    return agent.fetch(request);
  },
} satisfies ExportedHandler<Env>;
