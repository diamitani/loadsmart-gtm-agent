import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Artifact, RunRecord } from "@/lib/pal/types";
import type { Activity, AuditEvent, Conversation, EvalRun, KnowledgeDoc, Store, Suppression } from "./types";
import { newId, nowIso } from "@/lib/utils";

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

  return {
    driver: "supabase",

    async getConversation(id) {
      const row = must(await db.from("conversations").select("*").eq("workspace_id", ws).eq("id", id).maybeSingle());
      return row ? toConversation(row) : null;
    },
    async listConversations(limit = 50) {
      const rows = must(await db.from("conversations").select("*").eq("workspace_id", ws).order("updated_at", { ascending: false }).limit(limit));
      return (rows ?? []).map(toConversation);
    },
    async saveConversation(c) {
      must(
        await db.from("conversations").upsert({
          id: c.id,
          workspace_id: ws,
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
      must(await db.from("conversations").delete().eq("workspace_id", ws).eq("id", id));
    },

    async saveRun(r) {
      must(
        await db.from("runs").upsert({
          id: r.id,
          workspace_id: ws,
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
      const row = must(await db.from("runs").select("record").eq("workspace_id", ws).eq("id", id).maybeSingle());
      return (row?.record as RunRecord) ?? null;
    },
    async listRuns(limit = 50) {
      const rows = must(await db.from("runs").select("record").eq("workspace_id", ws).order("created_at", { ascending: false }).limit(limit));
      return (rows ?? []).map((r) => r.record as RunRecord);
    },

    async saveArtifacts(list) {
      if (!list.length) return;
      must(await db.from("artifacts").upsert(list.map((a) => fromArtifact(a, ws))));
    },
    async getArtifact(id) {
      const row = must(await db.from("artifacts").select("*").eq("workspace_id", ws).eq("id", id).maybeSingle());
      return row ? toArtifact(row) : null;
    },
    async listArtifacts(filter = {}) {
      let q = db.from("artifacts").select("*").eq("workspace_id", ws);
      if (filter.runId) q = q.eq("run_id", filter.runId);
      if (filter.group) q = q.eq("artifact_group", filter.group);
      const rows = must(await q.order("created_at", { ascending: false }).limit(filter.limit ?? 500));
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
      must(
        await db.from("knowledge_docs").insert({
          id: k.id,
          workspace_id: ws,
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
      const rows = must(await db.from("knowledge_docs").select("*").eq("workspace_id", ws).order("created_at", { ascending: false }));
      return (rows ?? []).map(
        (r): KnowledgeDoc => ({
          id: r.id,
          workspaceId: r.workspace_id,
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
      must(await db.from("knowledge_docs").delete().eq("workspace_id", ws).eq("id", id));
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
