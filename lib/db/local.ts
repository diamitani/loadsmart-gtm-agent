import fs from "node:fs";
import path from "node:path";
import type { Artifact, RunRecord } from "@/lib/pal/types";
import type { Activity, AuditEvent, Conversation, EvalRun, KnowledgeDoc, Store, Suppression } from "./types";
import { newId, nowIso } from "@/lib/utils";

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
      return d().conversations[id] ?? null;
    },
    async listConversations(limit = 50) {
      return Object.values(d().conversations).sort(byNewest).slice(0, limit);
    },
    async saveConversation(c) {
      d().conversations[c.id] = c;
      persist();
    },
    async deleteConversation(id) {
      delete d().conversations[id];
      persist();
    },
    async saveRun(r) {
      d().runs[r.id] = r;
      persist();
    },
    async getRun(id) {
      return d().runs[id] ?? null;
    },
    async listRuns(limit = 50) {
      return Object.values(d().runs).sort(byNewest).slice(0, limit);
    },
    async saveArtifacts(list) {
      for (const a of list) d().artifacts[a.id] = a;
      persist();
    },
    async getArtifact(id) {
      return d().artifacts[id] ?? null;
    },
    async listArtifacts(filter = {}) {
      return Object.values(d().artifacts)
        .filter((a) => (!filter.runId || a.runId === filter.runId) && (!filter.group || a.group === filter.group))
        .sort(byNewest)
        .slice(0, filter.limit ?? 500);
    },
    async updateArtifact(id, patch) {
      const a = d().artifacts[id];
      if (!a) return null;
      const next = { ...a, ...patch, version: patch.markdown ? a.version + 1 : a.version };
      d().artifacts[id] = next;
      persist();
      return next;
    },
    async addKnowledge(k) {
      d().knowledge[k.id] = k;
      persist();
    },
    async listKnowledge() {
      return Object.values(d().knowledge).sort(byNewest);
    },
    async deleteKnowledge(id) {
      delete d().knowledge[id];
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
