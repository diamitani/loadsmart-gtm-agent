import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Artifact, RunRecord } from "@/lib/pal/types";
import type { Activity, AuditEvent, Conversation, EvalRun, KnowledgeDoc, Store, Suppression } from "./types";
import { newId, nowIso } from "@/lib/utils";
import { currentScope, ownerFor, type DataScope } from "@/lib/auth/scope";

let cachedClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!cachedClient) {
    cachedClient = createClient(url, key, { auth: { persistSession: false } });
  }
  return cachedClient;
}

/**
 * Supabase (Postgres) store. Server-side only — uses the service-role key,
 * which bypasses RLS, so every query is explicitly scoped by workspace_id.
 * Schema: supabase/migrations/0001_enably_gtm.sql
 */
export function createSupabaseStore(url: string, serviceKey: string, workspaceId: string): Store {
  const db: SupabaseClient = createClient(url, serviceKey, { auth: { persistSession: false } });
  const ws = workspaceId;

  const must = <T>(res: { data: T; error: { message: string } | null }): T => {
    if (res.error) throw new Error(`Supabase: ${res.error.message}`);
    return res.data;
  };

  /** Restrict a query to the caller's rows. Returns null when the caller may see nothing. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const own = (sc: DataScope, q: any): any => (sc.kind === "none" ? null : sc.kind === "user" ? q.eq("user_id", sc.userId) : q);
  /** undefined = no such row; null = row without an owner. */
  const existingOwner = async (table: string, id: string): Promise<string | null | undefined> => {
    const row = must(await db.from(table).select("user_id").eq("workspace_id", ws).eq("id", id).maybeSingle()) as { user_id: string | null } | null;
    return row ? row.user_id : undefined;
  };

  return {
    driver: "supabase",

    async getConversation(id) {
      const q = own(await currentScope(), db.from("conversations").select("*").eq("workspace_id", ws).eq("id", id));
      if (!q) return null;
      const row = must<any>(await q.maybeSingle());
      return row ? toConversation(row) : null;
    },
    async listConversations(limit = 50) {
      const q = own(await currentScope(), db.from("conversations").select("*").eq("workspace_id", ws));
      if (!q) return [];
      const rows = must<any>(await q.order("updated_at", { ascending: false }).limit(limit));
      return (rows ?? []).map(toConversation);
    },
    async saveConversation(c) {
      const userId = ownerFor(await currentScope(), c.userId, await existingOwner("conversations", c.id));
      must(
        await db.from("conversations").upsert({
          id: c.id,
          workspace_id: ws,
          user_id: userId,
          title: c.title,
          messages: c.messages,
          last_run_id: c.lastRunId ?? null,
          pending: c.pending ?? null,
          created_at: c.createdAt,
          updated_at: c.updatedAt,
        }),
      );
    },
    async deleteConversation(id) {
      const q = own(await currentScope(), db.from("conversations").delete().eq("workspace_id", ws).eq("id", id));
      if (q) must(await q);
    },

    async saveRun(r) {
      r.userId = ownerFor(await currentScope(), r.userId, await existingOwner("runs", r.id));
      must(
        await db.from("runs").upsert({
          id: r.id,
          workspace_id: ws,
          user_id: r.userId,
          conversation_id: r.conversationId ?? null,
          status: r.status,
          title: r.title,
          source: r.source,
          model: r.model,
          wholeness: r.foundation?.W ?? null,
          quality_score: r.quality?.score ?? null,
          duration_ms: r.durationMs ?? null,
          record: r,
          created_at: r.createdAt,
          updated_at: r.updatedAt,
        }),
      );
    },
    async getRun(id) {
      const q = own(await currentScope(), db.from("runs").select("record").eq("workspace_id", ws).eq("id", id));
      if (!q) return null;
      const row = must<any>(await q.maybeSingle());
      return (row?.record as RunRecord) ?? null;
    },
    async listRuns(limit = 50) {
      const q = own(await currentScope(), db.from("runs").select("record").eq("workspace_id", ws));
      if (!q) return [];
      const rows = must<any>(await q.order("created_at", { ascending: false }).limit(limit));
      return (rows ?? []).map((r: Row) => r.record as RunRecord);
    },

    async saveArtifacts(list) {
      if (!list.length) return;
      const sc = await currentScope();
      const runIds = [...new Set(list.map((a) => a.runId).filter((x): x is string => !!x))];
      const runOwners = new Map<string, string | null>();
      if (runIds.length) for (const r of must(await db.from("runs").select("id, user_id").eq("workspace_id", ws).in("id", runIds)) as { id: string; user_id: string | null }[]) runOwners.set(r.id, r.user_id);
      const existing = new Map<string, string | null>();
      for (const r of must(await db.from("artifacts").select("id, user_id").eq("workspace_id", ws).in("id", list.map((a) => a.id))) as { id: string; user_id: string | null }[]) existing.set(r.id, r.user_id);
      for (const a of list) a.userId = ownerFor(sc, a.userId ?? (a.runId ? runOwners.get(a.runId) : undefined), existing.has(a.id) ? existing.get(a.id)! : undefined);
      must(await db.from("artifacts").upsert(list.map((a) => fromArtifact(a, ws))));
    },
    async getArtifact(id) {
      const q = own(await currentScope(), db.from("artifacts").select("*").eq("workspace_id", ws).eq("id", id));
      if (!q) return null;
      const row = must<any>(await q.maybeSingle());
      return row ? toArtifact(row) : null;
    },
    async listArtifacts(filter = {}) {
      const base = own(await currentScope(), db.from("artifacts").select("*").eq("workspace_id", ws));
      if (!base) return [];
      let q = base;
      if (filter.runId) q = q.eq("run_id", filter.runId);
      if (filter.group) q = q.eq("artifact_group", filter.group);
      const rows = must<any>(await q.order("created_at", { ascending: false }).limit(filter.limit ?? 500));
      return (rows ?? []).map(toArtifact);
    },
    async updateArtifact(id, patch) {
      const current = await this.getArtifact(id);
      if (!current) return null;
      const next: Artifact = { ...current, ...patch, version: patch.markdown ? current.version + 1 : current.version };
      must(await db.from("artifacts").upsert(fromArtifact(next, ws)));
      return next;
    },

    async addKnowledge(k) {
      const userId = ownerFor(await currentScope(), k.userId, undefined);
      must(
        await db.from("knowledge_docs").insert({
          id: k.id,
          workspace_id: ws,
          user_id: userId,
          name: k.name,
          kind: k.kind,
          source: k.source ?? null,
          content: k.text,
          chars: k.chars,
          created_at: k.createdAt,
        }),
      );
    },
    async listKnowledge() {
      const q = own(await currentScope(), db.from("knowledge_docs").select("*").eq("workspace_id", ws));
      if (!q) return [];
      const rows = must<any>(await q.order("created_at", { ascending: false }));
      return (rows ?? []).map(
        (r: Row): KnowledgeDoc => ({
          id: r.id,
          workspaceId: r.workspace_id,
          userId: r.user_id ?? null,
          name: r.name,
          kind: r.kind,
          source: r.source ?? undefined,
          text: r.content,
          chars: r.chars,
          createdAt: r.created_at,
        }),
      );
    },
    async deleteKnowledge(id) {
      const q = own(await currentScope(), db.from("knowledge_docs").delete().eq("workspace_id", ws).eq("id", id));
      if (q) must(await q);
    },

    async saveEval(e) {
      must(
        await db.from("eval_runs").upsert({
          id: e.id,
          workspace_id: ws,
          name: e.name,
          model: e.model,
          summary: e.summary,
          results: e.results,
          langsmith_url: e.langsmithUrl ?? null,
          created_at: e.createdAt,
        }),
      );
    },
    async listEvals(limit = 20) {
      const rows = must(await db.from("eval_runs").select("*").eq("workspace_id", ws).order("created_at", { ascending: false }).limit(limit));
      return (rows ?? []).map(
        (r): EvalRun => ({
          id: r.id,
          workspaceId: r.workspace_id,
          name: r.name,
          model: r.model,
          summary: r.summary,
          results: r.results,
          langsmithUrl: r.langsmith_url ?? undefined,
          createdAt: r.created_at,
        }),
      );
    },

    async logActivity(a) {
      must(
        await db.from("activities").insert({
          id: a.id, workspace_id: ws, type: a.type, account: a.account, contact: a.contact ?? null, count: a.count,
          stage: a.stage ?? null, notes: a.notes ?? null, occurred_at: a.occurredAt, created_at: a.createdAt, crm_ref: a.crmRef ?? null,
        }),
      );
    },
    async listActivities(filter = {}) {
      let q = db.from("activities").select("*").eq("workspace_id", ws);
      if (filter.since) q = q.gte("occurred_at", filter.since);
      if (filter.account) q = q.ilike("account", `%${filter.account}%`);
      const rows = must(await q.order("occurred_at", { ascending: false }).limit(filter.limit ?? 500));
      return (rows ?? []).map(
        (r): Activity => ({
          id: r.id, workspaceId: r.workspace_id, type: r.type, account: r.account, contact: r.contact ?? undefined, count: r.count,
          stage: r.stage ?? undefined, notes: r.notes ?? undefined, occurredAt: r.occurred_at, createdAt: r.created_at, crmRef: r.crm_ref ?? undefined,
        }),
      );
    },
    async addSuppression(s) {
      must(await db.from("suppressions").upsert({ workspace_id: ws, value: s.value.toLowerCase(), reason: s.reason, created_at: s.createdAt }));
    },
    async isSuppressed(v) {
      const value = v.toLowerCase().trim();
      const domain = value.includes("@") ? value.split("@")[1] : value;
      const rows = must(await db.from("suppressions").select("value").eq("workspace_id", ws).in("value", [value, domain]).limit(1));
      return (rows ?? []).length > 0;
    },
    async listSuppressions() {
      const rows = must(await db.from("suppressions").select("*").eq("workspace_id", ws).order("created_at", { ascending: false }));
      return (rows ?? []).map((r): Suppression => ({ value: r.value, reason: r.reason, createdAt: r.created_at }));
    },
    async audit(e) {
      must(
        await db.from("audit_events").insert({
          id: newId("evt"),
          workspace_id: ws,
          at: nowIso(),
          actor: e.actor,
          action: e.action,
          target: e.target ?? null,
          detail: e.detail ?? null,
        }),
      );
    },
    async listAudit(limit = 50) {
      const rows = must(await db.from("audit_events").select("*").eq("workspace_id", ws).order("at", { ascending: false }).limit(limit));
      return (rows ?? []).map(
        (r): AuditEvent => ({ id: r.id, workspaceId: r.workspace_id, at: r.at, actor: r.actor, action: r.action, target: r.target ?? undefined, detail: r.detail ?? undefined }),
      );
    },
  };
}

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

function toConversation(r: Row): Conversation {
  return {
    id: r.id,
    workspaceId: r.workspace_id,
    userId: r.user_id ?? null,
    title: r.title,
    messages: r.messages ?? [],
    lastRunId: r.last_run_id ?? undefined,
    pending: r.pending ?? undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function fromArtifact(a: Artifact, ws: string): Row {
  return {
    id: a.id,
    workspace_id: ws,
    user_id: a.userId ?? null,
    run_id: a.runId ?? null,
    kind: a.kind,
    artifact_group: a.group,
    code: a.code ?? null,
    title: a.title,
    markdown: a.markdown,
    status: a.status,
    version: a.version,
    provenance: a.provenance,
    created_at: a.createdAt,
  };
}

function toArtifact(r: Row): Artifact {
  return {
    id: r.id,
    runId: r.run_id ?? undefined,
    userId: r.user_id ?? null,
    kind: r.kind,
    group: r.artifact_group,
    code: r.code ?? undefined,
    title: r.title,
    markdown: r.markdown,
    status: r.status,
    version: r.version,
    createdAt: r.created_at,
    provenance: r.provenance,
  };
}
