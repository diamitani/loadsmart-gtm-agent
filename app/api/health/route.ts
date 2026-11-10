import { generateText } from "ai";
import { integrationStatus, env } from "@/lib/env";
import { getStore } from "@/lib/db";
import { agentManifest } from "@/lib/agent/manifest";
import { getModel } from "@/lib/agent/models";

/**
 * Liveness + agent wiring check (public, secret-free).
 *
 *   GET /api/health              → store, integrations, and whether the agent's soul, skills and
 *                                  subagents were bundled and load at runtime.
 *   GET /api/health?probe=model  → also makes one tiny call with the house model (AI Gateway / OIDC).
 *                                  Disabled in production so it can't be used to spend tokens;
 *                                  preview deployments sit behind Vercel Authentication.
 */
export async function GET(req: Request) {
  const agent = agentManifest();
  const body: Record<string, unknown> = {
    ok: agent.ok,
    store: getStore().driver,
    integrations: integrationStatus().map(({ id, ok }) => ({ id, ok })),
    agent: { ok: agent.ok, soulChars: agent.soulChars, skills: agent.skills.length, subagents: agent.subagents.length, tools: agent.tools.length, problems: agent.problems },
  };
  if (new URL(req.url).searchParams.get("probe") === "model") body.model = await probeModel();
  return Response.json(body, { status: agent.ok ? 200 : 500 });
}

async function probeModel() {
  if (process.env.VERCEL_ENV === "production") return { ok: false, skipped: "disabled in production" };
  const e = env();
  const model = getModel("fast", { accountId: null, mode: "unmetered", balance: 0, creditsPerCall: 0 });
  if (!model) return { ok: false, provider: e.provider, error: "no house model configured (demo mode)" };
  const t0 = Date.now();
  try {
    const { text } = await generateText({ model, prompt: "Reply with exactly one word: pong", maxOutputTokens: 16, maxRetries: 0 });
    return { ok: /pong/i.test(text), provider: e.provider, model: e.fastModel, reply: text.slice(0, 40), ms: Date.now() - t0 };
  } catch (err) {
    return { ok: false, provider: e.provider, model: e.fastModel, error: (err as Error).message.slice(0, 300), ms: Date.now() - t0 };
  }
}
