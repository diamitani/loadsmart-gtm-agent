import fs from "node:fs";
import path from "node:path";
import type { Artifact, RunRecord } from "@/lib/pal/types";
import type { Activity, AuditEvent, Conversation, EvalRun, KnowledgeDoc, Store, Suppression } from "./types";
import { newId, nowIso } from "@/lib/utils";
import { currentScope, ownerFor, visible } from "@/lib/auth/scope";

/**
 * Local store — zero setup. Keeps everything in memory and, outside
 * serverless, mirrors it to `.data/enably.json` so data survives restarts in
 * development. Swap to Supabase by setting SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
 */

interface Data {
  conversations: Record<string, Conversation>;
  runs: Record<string, RunRecord>;
  artifacts: Record<string, Artifact>;
  knowledge: Record<string, KnowledgeDoc>;
  evals: Record<string, EvalRun>;
  audit: AuditEvent[];
  activities: Activity[];
  suppressions: Record<string, Suppression>;
}

const empty = (): Data => ({ conversations: {}, runs: {}, artifacts: {}, knowledge: {}, evals: {}, audit: [], activities: [], suppressions: {} });

const FILE = path.join(process.cwd(), ".data", "enably.json");
const canPersist = !process.env.VERCEL && !process.env.ENABLY_EPHEMERAL;

const g = globalThis as unknown as { __enablyData?: Data };

function load(): Data {
  if (g.__enablyData) return g.__enablyData;
  let data = empty();
  if (canPersist && fs.existsSync(FILE)) {
    try {
      data = { ...empty(), ...JSON.parse(fs.readFileSync(FILE, "utf8")) };
    } catch {
      data = empty();
    }
  }
  g.__enablyData = data;
  return data;
}

let timer: ReturnType<typeof setTimeout> | null = null;
function persist() {
  if (!canPersist) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      fs.mkdirSync(path.dirname(FILE), { recursive: true });
      // Keep eval results written by `npm run eval` (a separate process).
      if (fs.existsSync(FILE)) {
        const onDisk = (JSON.parse(fs.readFileSync(FILE, "utf8")) as Partial<Data>).evals ?? {};
        load().evals = { ...onDisk, ...load().evals };
      }
      fs.writeFileSync(FILE, JSON.stringify(load()));
    } catch {
      /* read-only filesystem — stay in memory */
    }
  }, 150);
}

const byNewest = <T extends { createdAt?: string; updatedAt?: string }>(a: T, b: T) =>
  (b.updatedAt ?? b.createdAt ?? "").localeCompare(a.updatedAt ?? a.createdAt ?? "");

export function createLocalStore(workspaceId: string): Store {
  const d = load;
  return {
    driver: "local",
    async getConversation(id) {
      const sc = await currentScope();
      const c = d().conversations[id];
      return c && visible(sc, c.userId) ? c : null;
    },
    async listConversations(limit = 50) {
      const sc = await currentScope();
      return Object.values(d().conversations).filter((c) => visible(sc, c.userId)).sort(byNewest).slice(0, limit);
    },
    async saveConversation(c) {
      const sc = await currentScope();
      const existing = d().conversations[c.id];
      const userId = ownerFor(sc, c.userId, existing ? (existing.userId ?? null) : undefined);
      d().conversations[c.id] = { ...c, userId };
      persist();
    },
    async deleteConversation(id) {
      const sc = await currentScope();
      const c = d().conversations[id];
      if (c && visible(sc, c.userId)) delete d().conversations[id];
      persist();
    },
    async saveRun(r) {
      const sc = await currentScope();
      const existing = d().runs[r.id];
      r.userId = ownerFor(sc, r.userId, existing ? (existing.userId ?? null) : undefined);
      d().runs[r.id] = r;
      persist();
    },
    async getRun(id) {
      const sc = await currentScope();
      const r = d().runs[id];
      return r && visible(sc, r.userId) ? r : null;
    },
    async listRuns(limit = 50) {
      const sc = await currentScope();
      return Object.values(d().runs).filter((r) => visible(sc, r.userId)).sort(byNewest).slice(0, limit);
    },
    async saveArtifacts(list) {
      const sc = await currentScope();
      for (const a of list) {
        const existing = d().artifacts[a.id];
        const runOwner = a.runId ? d().runs[a.runId]?.userId : undefined;
        a.userId = ownerFor(sc, a.userId ?? runOwner, existing ? (existing.userId ?? null) : undefined);
        d().artifacts[a.id] = a;
      }
      persist();
    },
    async getArtifact(id) {
      const sc = await currentScope();
      const a = d().artifacts[id];
      return a && visible(sc, a.userId) ? a : null;
    },
    async listArtifacts(filter = {}) {
      const sc = await currentScope();
      return Object.values(d().artifacts)
        .filter((a) => visible(sc, a.userId) && (!filter.runId || a.runId === filter.runId) && (!filter.group || a.group === filter.group))
        .sort(byNewest)
        .slice(0, filter.limit ?? 500);
    },
    async updateArtifact(id, patch) {
      const a = await this.getArtifact(id);
      if (!a) return null;
      const next = { ...a, ...patch, version: patch.markdown ? a.version + 1 : a.version };
      d().artifacts[id] = next;
      persist();
      return next;
    },
    async addKnowledge(k) {
      const sc = await currentScope();
      const existing = d().knowledge[k.id];
      d().knowledge[k.id] = { ...k, userId: ownerFor(sc, k.userId, existing ? (existing.userId ?? null) : undefined) };
      persist();
    },
    async listKnowledge() {
      const sc = await currentScope();
      return Object.values(d().knowledge).filter((k) => visible(sc, k.userId)).sort(byNewest);
    },
    async deleteKnowledge(id) {
      const sc = await currentScope();
      const k = d().knowledge[id];
      if (k && visible(sc, k.userId)) delete d().knowledge[id];
      persist();
    },
    async saveEval(e) {
      d().evals[e.id] = e;
      persist();
    },
    async listEvals(limit = 20) {
      // Evals are written by a separate process (`npm run eval`), so merge from disk.
      if (canPersist && fs.existsSync(FILE)) {
        try {
          Object.assign(d().evals, (JSON.parse(fs.readFileSync(FILE, "utf8")) as Partial<Data>).evals ?? {});
        } catch {
          /* ignore */
        }
      }
      return Object.values(d().evals).sort(byNewest).slice(0, limit);
    },
    async logActivity(a) {
      d().activities.unshift(a);
      d().activities = d().activities.slice(0, 5000);
      persist();
    },
    async listActivities(filter = {}) {
      return d()
        .activities.filter((a) => (!filter.since || a.occurredAt >= filter.since) && (!filter.account || a.account.toLowerCase().includes(filter.account.toLowerCase())))
        .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
        .slice(0, filter.limit ?? 500);
    },
    async addSuppression(s) {
      d().suppressions[s.value.toLowerCase()] = { ...s, value: s.value.toLowerCase() };
      persist();
    },
    async isSuppressed(v) {
      const value = v.toLowerCase().trim();
      const domain = value.includes("@") ? value.split("@")[1] : value;
      return !!(d().suppressions[value] || d().suppressions[domain]);
    },
    async listSuppressions() {
      return Object.values(d().suppressions).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async audit(e) {
      d().audit.unshift({ id: newId("evt"), at: nowIso(), workspaceId, ...e });
      d().audit = d().audit.slice(0, 500);
      persist();
    },
    async listAudit(limit = 50) {
      return d().audit.slice(0, limit);
    },
  };
}
