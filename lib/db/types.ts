import type { Artifact, RunRecord } from "@/lib/pal/types";

export interface Conversation {
  id: string;
  workspaceId: string;
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
  // audit
  audit(e: Omit<AuditEvent, "id" | "at" | "workspaceId">): Promise<void>;
  listAudit(limit?: number): Promise<AuditEvent[]>;
}
