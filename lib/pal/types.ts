/**
 * PAL (Prompt Abstraction Layer) engine types.
 *
 * The pipeline mirrors the Enably architecture diagram:
 *   INPUT → STORE → COMPILE (MASTER.md) → PAL (RAG-DAL · Extract Intent ·
 *   One Must Act/JTBD · Instruct · Intended Output) → BUILD DOCS (POP) →
 *   BUILD ASSETS → TEST → ASSEMBLE → DELIVER (webhook) → PRESENT
 *
 * Every stage is deterministic TypeScript. The LLM is a *multiplier* layered
 * on top (One Must Act: never multiply an incomplete foundation).
 */

export const STAGES = [
  "intake",
  "intent",
  "foundation",
  "instruct",
  "plan",
  "build",
  "test",
  "present",
] as const;
export type StageId = (typeof STAGES)[number];

export const STAGE_LABELS: Record<StageId, { title: string; blurb: string }> = {
  intake: { title: "Intake", blurb: "Capture inputs, links, files and compile MASTER.md" },
  intent: { title: "Extract intent", blurb: "Stated goal, latent goal, deliverables, constraints" },
  foundation: { title: "Foundation", blurb: "One Must Act wholeness check (W) + JTBD" },
  instruct: { title: "Enhance instructions", blurb: "Compile skills + context into system instructions" },
  plan: { title: "Plan", blurb: "Middle-out DAG compression into parallel waves" },
  build: { title: "Build", blurb: "Generate GTM assets and POP documentation" },
  test: { title: "Test", blurb: "Calibrated truth guard + quality gate scorecard" },
  present: { title: "Present", blurb: "Assemble the package and the next action" },
};

export type StageStatus = "pending" | "running" | "done" | "blocked" | "skipped" | "error";

export interface StageEvent {
  stage: StageId;
  status: StageStatus;
  summary: string;
  ms?: number;
  data?: Record<string, unknown>;
}

/* ----------------------------------------------------------------- Intake */

export interface IntakeFile {
  name: string;
  text: string;
}

export interface IntakeInput {
  /** All user turns for this request, oldest first (follow-up answers accumulate). */
  messages: string[];
  links?: string[];
  files?: IntakeFile[];
  /** Structured questionnaire answers (from the intake form or a webhook). */
  questionnaire?: Record<string, string>;
  source?: "chat" | "form" | "webhook" | "api";
}

export interface Intake {
  source: NonNullable<IntakeInput["source"]>;
  text: string;
  links: string[];
  files: IntakeFile[];
  questionnaire: Record<string, string>;
  /** Compiled single source of truth for the run (the MASTER.md in the diagram). */
  masterMd: string;
  wordCount: number;
}

/* ----------------------------------------------------------------- Intent */

export const ASSET_KINDS = [
  "icp",
  "personas",
  "positioning",
  "email_sequence",
  "linkedin_dm",
  "call_script",
  "battlecard",
  "objection_handling",
  "kpi_scorecard",
  "gtm_playbook",
  "launch_plan",
  "prospecting_plan",
  "automation_blueprint",
  "use_cases",
  "sales_ops_plan",
] as const;
export type AssetKind = (typeof ASSET_KINDS)[number];

export type GtmMotion = "outbound" | "inbound" | "plg" | "partner" | "hybrid";
export type GtmStage = "pre-launch" | "beta" | "post-mvp" | "scaling";
export type Audience = "internal" | "sales" | "investor" | "customer" | "partner";

export interface Intent {
  statedGoal: string;
  latentGoal: string;
  company?: string;
  offer?: string;
  icp?: string;
  industry?: string;
  geography?: string;
  motion?: GtmMotion;
  stage?: GtmStage;
  audience?: Audience;
  competitors: string[];
  requestedAssets: AssetKind[];
  /** True when the user did not name specific assets and we fell back to the starter pack. */
  usedDefaultAssets: boolean;
  constraints: string[];
  urls: string[];
  /** Creative (warm, unrestricted) vs operational (strict grounding) — Calibrated Truth Protocol. */
  domain: "creative" | "operational" | "mixed";
  confidence: number;
}

/* ------------------------------------------------------------- Foundation */

export interface Criterion {
  id: string;
  label: string;
  met: boolean;
  value?: string;
  /** Critical criteria gate the run (W must equal 1.00 over these). */
  critical: boolean;
  /** One focused clarification question when unmet. */
  question: string;
  /** Reversible default used (and labelled) when a non-critical criterion is unmet. */
  fallback?: string;
}

export interface Jtbd {
  actor: string;
  trigger: string;
  struggle: string;
  functionalJob: string;
  emotionalJob: string;
  desiredOutcome: string;
  successMetric: string;
}

export interface Foundation {
  /** Wholeness W = (1/m) Σ I(c_i) over the critical criteria. */
  W: number;
  /** Wholeness over every criterion, critical or not (shown for transparency). */
  coverage: number;
  ready: boolean;
  criteria: Criterion[];
  missing: Criterion[];
  assumptions: string[];
  outcome100: string;
  foundation1: string;
  jtbd: Jtbd;
}

/* ---------------------------------------------------------------- Instruct */

export interface InstructionPack {
  system: string;
  skills: string[];
  knowledgeSnippets: { source: string; text: string; score: number }[];
  guardrails: string[];
}

/* -------------------------------------------------------------------- Plan */

export interface PlanNode {
  id: string;
  kind: AssetKind | "research";
  title: string;
  deps: string[];
  /** Estimated duration if run on its own (used to report compression honestly). */
  estMs: number;
}

export interface Plan {
  nodes: PlanNode[];
  pruned: { id: string; reason: string }[];
  waves: string[][];
  sequentialEstMs: number;
  waveEstMs: number;
  compression: number;
}

/* ------------------------------------------------------------------- Build */

export type ArtifactGroup = "asset" | "pop";

export interface Artifact {
  id: string;
  runId?: string;
  /** Owner (Supabase auth user id). */
  userId?: string | null;
  kind: string;
  group: ArtifactGroup;
  code?: string;
  title: string;
  markdown: string;
  status: "draft" | "approved" | "rejected" | "archived";
  version: number;
  createdAt: string;
  provenance: {
    agentId: string;
    model: string;
    promptVersion: string;
    inputRefs: string[];
  };
}

/* -------------------------------------------------------------------- Test */

export interface TruthFinding {
  type: "email" | "phone" | "address" | "date_commitment" | "statistic" | "money" | "customer_claim" | "url";
  value: string;
  artifactId?: string;
  grounded: boolean;
}

export interface TruthReport {
  domain: Intent["domain"];
  findings: TruthFinding[];
  ungrounded: number;
  notice: string | null;
}

export interface QualityDimension {
  id: string;
  label: string;
  weight: number;
  score: number;
  note: string;
}

export interface QualityReport {
  score: number;
  verdict: "Ready" | "Ready with assumptions" | "Needs clarification" | "Blocked";
  dimensions: QualityDimension[];
  checks: { id: string; label: string; pass: boolean; detail?: string }[];
}

/* ----------------------------------------------------------------- Present */

export interface NextAction {
  action: string;
  owner: string;
  due: string;
  proof: string;
}

export type RunStatus = "running" | "needs_input" | "completed" | "failed" | "handed_off";

export interface RunRecord {
  id: string;
  conversationId?: string;
  workspaceId: string;
  /** Owner (Supabase auth user id). */
  userId?: string | null;
  status: RunStatus;
  title: string;
  source: Intake["source"];
  createdAt: string;
  updatedAt: string;
  durationMs?: number;
  intake?: Intake;
  intent?: Intent;
  foundation?: Foundation;
  plan?: Plan;
  truth?: TruthReport;
  quality?: QualityReport;
  nextAction?: NextAction;
  stages: StageEvent[];
  artifactIds: string[];
  model: string;
  traceUrl?: string;
}
