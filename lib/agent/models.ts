import "server-only";
import type { LanguageModel } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import { createAnthropic } from "@ai-sdk/anthropic";
import { env } from "@/lib/env";

/**
 * Model routing. Preference order:
 *   1. Vercel AI Gateway (AI_GATEWAY_API_KEY, or OIDC on Vercel) — one key, any provider, fallbacks + spend tracking
 *   2. Anthropic direct (ANTHROPIC_API_KEY)
 *   3. Demo mode → null (the deterministic engine + templates still produce a full package)
 */
export function getModel(kind: "main" | "fast" = "main"): LanguageModel | null {
  const e = env();
  const id = kind === "fast" ? e.fastModel : e.model;
  if (e.provider === "gateway") {
    const gateway = createGateway({ apiKey: process.env.AI_GATEWAY_API_KEY });
    return gateway(id);
  }
  if (e.provider === "anthropic") {
    const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return anthropic(id);
  }
  return null;
}

export function modelLabel(): string {
  const e = env();
  return e.provider === "demo" ? "demo (deterministic templates)" : e.model;
}
