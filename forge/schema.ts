/**
 * Agent Forge — master agent spec schema (Master Agent Template, spec_version "1.0").
 * Shared by the CLI (scripts/forge.ts) and the runtime manifest check. No server-only imports.
 */
import { z } from "zod";

export const BUILTIN_TOOLS = ["web_search", "http_fetch", "read_file", "write_file", "send_email", "run_code"] as const;
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "must be lowercase-with-dashes");
const nonEmpty = z.string().trim().min(1, "required — fill it or write it in OPEN_QUESTIONS.md");
const tier = z.object({ provider: z.enum(["google", "anthropic", "openai", "gateway"]), model: nonEmpty });

export const AgentSpec = z.object({
  spec_version: z.literal("1.0"),
  identity: z.object({ slug, name: nonEmpty, tagline: z.string().default(""), version: z.string().regex(/^\d+\.\d+\.\d+$/), owner: nonEmpty, voice: nonEmpty }),
  overview: z.object({
    function: nonEmpty,
    description: nonEmpty,
    objective: nonEmpty,
    core_user: nonEmpty,
    stakeholders: z.array(z.string()).default([]),
    intended_outputs: z.array(z.string()).min(1),
    jobs_to_be_done: z.array(z.string().regex(/^When .+, I want .+, so I can .+/i, 'use "When <situation>, I want <action>, so I can <outcome>"')).min(1),
  }),
  capabilities: z.array(z.object({ id: slug, description: nonEmpty, workflow_steps: z.array(z.string()).min(1), guardrails: z.array(z.string()).default([]) })).min(1),
  tools: z.object({
    builtin: z.array(z.enum(BUILTIN_TOOLS)).default([]),
    integrations: z.array(slug).default([]),
    mcp_servers: z.array(z.string()).default([]),
    sub_agents: z.array(slug).default([]),
    skills: z.array(slug).default([]),
    workflows: z.array(z.string()).default([]),
  }),
  knowledge: z.object({ references: z.array(z.string()).default([]), documentation: z.array(z.string()).default([]), rag: z.object({ enabled: z.boolean(), store: z.string(), top_k: z.number().int().min(1).max(50) }) }),
  state: z.object({
    storage: z.object({ provider: z.enum(["supabase", "gdrive", "local"]), per_user: z.boolean(), max_mb_per_user: z.number().positive() }),
    session_index: z.object({ save_on: z.string(), upsert_steps: z.boolean(), compress: z.boolean() }),
    long_term_memory: z.boolean(),
  }),
  runtime: z.object({
    targets: z.array(z.enum(["vercel", "cloudflare", "harness"])).min(1).refine((t) => t.includes("vercel"), "vercel is always a target"),
    profile: z.enum(["lite", "standard", "full"]),
    max_steps: z.number().int().min(1).max(50),
    channels: z.array(z.enum(["web_chat", "api", "cron", "a2a", "mcp_server"])).min(1),
    schedule: z.array(z.string()).default([]),
  }),
  model: z.object({ free: tier, standard: tier, premium: tier, default_tier: z.enum(["free", "standard", "premium"]), data_sensitivity: z.enum(["low", "medium", "high"]) }),
  guardrails: z.object({
    hard_stops: z.array(z.string()).min(1),
    confirm_first: z.array(z.string()).min(1),
    autonomous: z.array(z.string()).default([]),
    abort_conditions: z.array(z.string()).default([]),
    foundation_required: z.array(z.string()).default([]),
    truth_guard_categories: z.array(z.string()).default([]),
  }),
  billing: z.object({ mode: z.enum(["free", "credits", "byok", "hybrid"]), free_runs_per_day: z.number().int().min(0), est_credits_per_run: z.number().min(0), rate_limit_per_hour: z.number().int().min(1) }),
  kpi: z.object({ north_star: nonEmpty, metrics: z.array(z.string()).default([]), pnl_owner: nonEmpty }),
  acceptance_tests: z.array(z.object({ name: nonEmpty, input: nonEmpty, expect: z.array(z.string()).min(1) })).min(2, "write at least the happy-path and missing-input tests"),
  x_enably: z
    .object({ soul: nonEmpty, subagents: nonEmpty, approval_tools: z.array(z.string()).default([]), removed_tools: z.array(z.string()).default([]) })
    .optional(),
}).superRefine((s, ctx) => {
  const names = s.acceptance_tests.map((t) => t.name.toLowerCase());
  if (!names.some((n) => n.includes("happy"))) ctx.addIssue({ code: "custom", path: ["acceptance_tests"], message: "needs a happy path test" });
  if (!names.some((n) => n.includes("missing"))) ctx.addIssue({ code: "custom", path: ["acceptance_tests"], message: "needs a missing input test" });
  if (s.model.data_sensitivity === "high" && s.model.default_tier === "free") ctx.addIssue({ code: "custom", path: ["model", "default_tier"], message: "high data sensitivity blocks the free tier" });
  if (s.runtime.schedule.length && !s.runtime.channels.includes("cron")) ctx.addIssue({ code: "custom", path: ["runtime", "channels"], message: "a schedule needs the cron channel" });
});

export type AgentSpec = z.infer<typeof AgentSpec>;

/** Human-readable errors ("path: message"). */
export function formatIssues(err: z.ZodError): string[] {
  return err.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`);
}
