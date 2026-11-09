import type { Artifact, RunRecord } from "@/lib/pal/types";

export interface Conversation {
  id: string;
  workspaceId: string;
  /** Owner (Supabase auth user id). Null for legacy/system rows. */
  userId?: string | null;
  title: string;
  /** AI SDK UIMessage[] — stored as JSON so the chat restores exactly. */
  messages: unknown[];
  lastRunId?: string;
  /** User turns collected for a request that is waiting on clarification (W < 1). */
  pending?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDoc {
  id: string;
  workspaceId: string;
  userId?: string | null;
  name: string;
  kind: "file" | "text" | "url";
  source?: string;
  text: string;
  chars: number;
  createdAt: string;
}

export interface EvalCaseResult {
  caseId: string;
  input: string;
  scores: Record<string, number>;
  pass: boolean;
  notes?: string;
}

export interface EvalRun {
  id: string;
  workspaceId: string;
  name: string;
  model: string;
  createdAt: string;
  summary: Record<string, number>;
  results: EvalCaseResult[];
  langsmithUrl?: string;
}

export interface AuditEvent {
  id: string;
  workspaceId: string;
  at: string;
  actor: string;
  action: string;
  target?: string;
  detail?: Record<string, unknown>;
}

export const ACTIVITY_TYPES = ["call", "email", "linkedin", "dm", "meeting", "post", "sms", "note"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

/** Sales activity tracker entry (Enably Sales Enablement Assistant). */
export interface Activity {
  id: string;
  workspaceId: string;
  type: ActivityType;
  account: string;
  contact?: string;
  count: number;
  stage?: "cold" | "follow_up" | "closing" | "other";
  notes?: string;
  occurredAt: string;
  createdAt: string;
  /** Set when the activity was mirrored to an external CRM. */
  crmRef?: string;
}

/** Opt-outs and do-not-contact entries. Checked before every send. */
export interface Suppression {
  value: string; // email or domain, lower-cased
  reason: string;
  createdAt: string;
}

export interface Store {
  readonly driver: "local" | "supabase";
  // conversations
  getConversation(id: string): Promise<Conversation | null>;
  listConversations(limit?: number): Promise<Conversation[]>;
  saveConversation(c: Conversation): Promise<void>;
  deleteConversation(id: string): Promise<void>;
  // runs
  saveRun(r: RunRecord): Promise<void>;
  getRun(id: string): Promise<RunRecord | null>;
  listRuns(limit?: number): Promise<RunRecord[]>;
  // artifacts (the GTM Library)
  saveArtifacts(a: Artifact[]): Promise<void>;
  getArtifact(id: string): Promise<Artifact | null>;
  listArtifacts(filter?: { runId?: string; group?: Artifact["group"]; limit?: number }): Promise<Artifact[]>;
  updateArtifact(id: string, patch: Partial<Pick<Artifact, "markdown" | "status" | "title">>): Promise<Artifact | null>;
  // knowledge base
  addKnowledge(d: KnowledgeDoc): Promise<void>;
  listKnowledge(): Promise<KnowledgeDoc[]>;
  deleteKnowledge(id: string): Promise<void>;
  // evals
  saveEval(e: EvalRun): Promise<void>;
  listEvals(limit?: number): Promise<EvalRun[]>;
  // sales activity + compliance
  logActivity(a: Activity): Promise<void>;
  listActivities(filter?: { since?: string; account?: string; limit?: number }): Promise<Activity[]>;
  addSuppression(s: Suppression): Promise<void>;
  isSuppressed(emailOrDomain: string): Promise<boolean>;
  listSuppressions(): Promise<Suppression[]>;
  // audit
  audit(e: Omit<AuditEvent, "id" | "at" | "workspaceId">): Promise<void>;
  listAudit(limit?: number): Promise<AuditEvent[]>;
}
