import { generateText, Output, stepCountIs, tool } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import { z } from "zod";
import { integrationStatus, env } from "@/lib/env";
import { getStore } from "@/lib/db";
import { agentManifest } from "@/lib/agent/manifest";
import { getModel } from "@/lib/agent/models";
import { systemInstructions } from "@/lib/agent/skills";
import { architectTools } from "@/lib/agent/tools";
import { sdrTools } from "@/lib/connectors/sdr-tools";

/**
 * Liveness + agent wiring check (public, secret-free).
 *
 *   GET /api/health                    → store, integrations, and whether the agent's soul, skills and
 *                                        subagents were bundled and load at runtime.
 *   GET /api/health?probe=model        → also makes one tiny call with the house model (AI Gateway / OIDC).
 *   GET /api/health?probe=agent        → text + tool call + structured output — what the agent needs.
 *                                        plus the real agent loop: soul + all 24 tools, one free tool call
 *                                        (truth_check) and one approval-gated call that must pause.
 *       &model=provider/id             → try a specific gateway model instead of ENABLY_FAST_MODEL.
 *   Probes are disabled in production so they can't be used to spend tokens;
 *   preview deployments sit behind Vercel Authentication.
 */
export async function GET(req: Request) {
  const agent = agentManifest();
  const body: Record<string, unknown> = {
    ok: agent.ok,
    store: getStore().driver,
    integrations: integrationStatus().map(({ id, ok }) => ({ id, ok })),
    agent: { ok: agent.ok, forge: agent.forge, soulChars: agent.soulChars, skills: agent.skills.length, subagents: agent.subagents.length, tools: agent.tools.length, problems: agent.problems },
  };
  const q = new URL(req.url).searchParams;
  const probe = q.get("probe");
  if (probe === "model" || probe === "agent") body.model = await probeModel(q.get("model"), probe === "agent");
  return Response.json(body, { status: agent.ok ? 200 : 500 });
}

async function probeModel(override: string | null, full: boolean) {
  if (process.env.VERCEL_ENV === "production") return { ok: false, skipped: "disabled in production" };
  const e = env();
  const id = override && /^[a-z0-9-]+\/[a-z0-9.\-]+$/i.test(override) && e.provider === "gateway" ? override : null;
  const model = id ? createGateway({ apiKey: process.env.AI_GATEWAY_API_KEY })(id) : getModel("fast", { accountId: null, mode: "unmetered", balance: 0, creditsPerCall: 0 });
  const name = id ?? e.fastModel;
  if (!model) return { ok: false, provider: e.provider, error: "no house model configured (demo mode)" };
  const out: Record<string, unknown> = { provider: e.provider, model: name };
  const run = async (key: string, fn: () => Promise<boolean | string>) => {
    const t0 = Date.now();
    try {
      const r = await fn();
      out[key] = { ok: r === true || (typeof r === "string" && /pong/i.test(r)), ...(typeof r === "string" ? { reply: r.slice(0, 40) } : {}), ms: Date.now() - t0 };
    } catch (err) {
      out[key] = { ok: false, error: (err as Error).message.slice(0, 300), ms: Date.now() - t0 };
    }
  };
  await run("text", async () => (await generateText({ model, prompt: "Reply with exactly one word: pong", maxOutputTokens: 16, maxRetries: 0 })).text);
  if (full) {
    await run("toolCall", async () => {
      const r = await generateText({
        model,
        tools: { lookup_account: tool({ description: "Look up a CRM account by company name.", inputSchema: z.object({ company: z.string() }), execute: async ({ company }) => ({ company, stage: "discovery", owner: "Pat" }) }) },
        prompt: "What stage is the Acme Corp account in? Use the lookup_account tool, then answer in one short sentence.",
        stopWhen: stepCountIs(3),
        maxOutputTokens: 200,
        maxRetries: 0,
      });
      const calls = r.steps.flatMap((s) => s.toolCalls);
      return calls.some((c) => c.toolName === "lookup_account" && /acme/i.test(JSON.stringify(c.input))) && /discovery/i.test(r.text);
    });
    await run("structured", async () => {
      const { output } = await generateText({ model, output: Output.object({ schema: z.object({ company: z.string(), motion: z.enum(["outbound", "inbound", "plg"]) }) }), prompt: "Acme sells payroll software with an outbound sales team. Extract company and motion.", maxRetries: 0 });
      return /acme/i.test(output.company) && output.motion === "outbound";
    });
  }
  if (full) {
    // The real agent: soul + every tool. Main model unless overridden.
    const main = id ? model : getModel("main", { accountId: null, mode: "unmetered", balance: 0, creditsPerCall: 0 })!;
    out.agentModel = id ?? e.model;
    const tools = { ...architectTools({}), ...sdrTools() };
    await run("agentTool", async () => {
      const r = await generateText({ model: main, system: systemInstructions(), tools, prompt: "Use the truth_check tool on this copy, then tell me in one sentence what needs verifying: \"Call Dana at 555-123-4567 — Acme grew revenue 300% last year.\"", stopWhen: stepCountIs(3), maxOutputTokens: 600, maxRetries: 0 });
      return r.steps.some((s) => s.toolResults.some((t) => t.toolName === "truth_check"));
    });
    await run("approvalGate", async () => {
      const r = await generateText({ model: main, system: systemInstructions(), tools, prompt: "Send the current package to my automation workflow to create Asana tasks. Call send_to_workflow now.", stopWhen: stepCountIs(3), maxOutputTokens: 400, maxRetries: 0 });
      const requested = r.steps.some((s) => s.content.some((c) => c.type === "tool-approval-request"));
      const executed = r.steps.some((s) => s.toolResults.some((t) => t.toolName === "send_to_workflow"));
      return requested && !executed;
    });
  }
  out.ok = ["text", "toolCall", "structured", "agentTool", "approvalGate"].every((k) => !(k in out) || (out[k] as { ok: boolean }).ok);
  return out;
}
