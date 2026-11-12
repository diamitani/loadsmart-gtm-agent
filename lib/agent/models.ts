import "server-only";
import { wrapLanguageModel, type LanguageModel } from "ai";
import { createGateway } from "@ai-sdk/gateway";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "@/lib/env";
import { byokModels, BYOK_LABELS } from "@/lib/billing/config";
import { getBillingStore } from "@/lib/billing/store";
import { currentAiContext, InsufficientCreditsError, type AiContext } from "./ai-context";

/**
 * Model routing.
 *   1. BYOK — the signed-in browser's own key (Gemini, Anthropic, OpenAI or AI Gateway); no credits used
 *   2. House key — Gemini, Vercel AI Gateway (AI_GATEWAY_API_KEY, or OIDC on Vercel), Anthropic, OpenAI.
 *      When billing is on, every model call deducts credits from the caller's account.
 *   3. Demo mode / out of credits → null (the deterministic engine + templates still produce a full package)
 */
export function getModel(kind: "main" | "fast" = "main", ctx: AiContext | undefined = currentAiContext()): LanguageModel | null {
  if (ctx?.mode === "none") return null;
  if (ctx?.mode === "byok" && ctx.byok) return byokModel(ctx.byok, kind);
  const house = houseModel(kind);
  if (!house) return null;
  if (ctx?.mode === "house" && ctx.accountId) return meter(house, ctx.accountId, ctx.creditsPerCall);
  return house;
}

function houseModel(kind: "main" | "fast") {
  const e = env();
  const id = kind === "fast" ? e.fastModel : e.model;
  if (e.provider === "gemini") {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY;
    return createGoogleGenerativeAI({ apiKey })(id);
  }
  if (e.provider === "gateway") return createGateway({ apiKey: process.env.AI_GATEWAY_API_KEY })(id);
  if (e.provider === "anthropic") return createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })(id);
  if (e.provider === "openai") return createOpenAI({ apiKey: process.env.OPENAI_API_KEY })(id);
  return null;
}

function byokModel(k: NonNullable<AiContext["byok"]>, kind: "main" | "fast") {
  const d = byokModels(k.provider);
  const id = kind === "main" && k.model ? k.model : d[kind];
  if (k.provider === "gemini") return createGoogleGenerativeAI({ apiKey: k.apiKey })(id);
  if (k.provider === "anthropic") return createAnthropic({ apiKey: k.apiKey })(id);
  if (k.provider === "openai") return createOpenAI({ apiKey: k.apiKey })(id);
  return createGateway({ apiKey: k.apiKey })(id);
}

/** Wrap a model so each call reserves credits up front and refunds them if the call fails. */
export function meter<M extends Exclude<LanguageModel, string>>(model: M, accountId: string, cost: number) {
  const reserve = async () => {
    const ref = `call:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
    const left = await getBillingStore().consume(accountId, cost, "ai_call", ref);
    if (left === null) throw new InsufficientCreditsError();
    return ref;
  };
  const refund = (ref: string) => getBillingStore().grant(accountId, cost, "refund", `refund:${ref}`).catch(() => undefined);
  return wrapLanguageModel({
    model: model as Parameters<typeof wrapLanguageModel>[0]["model"],
    middleware: {
      wrapGenerate: async ({ doGenerate }) => {
        const ref = await reserve();
        try {
          return await doGenerate();
        } catch (err) {
          await refund(ref);
          throw err;
        }
      },
      wrapStream: async ({ doStream }) => {
        const ref = await reserve();
        try {
          return await doStream();
        } catch (err) {
          await refund(ref);
          throw err;
        }
      },
    },
  });
}

export function modelLabel(ctx: AiContext | undefined = currentAiContext()): string {
  if (ctx?.mode === "byok" && ctx.byok) {
    const d = byokModels(ctx.byok.provider);
    return `${ctx.byok.model || d.main} (your ${BYOK_LABELS[ctx.byok.provider]} key)`;
  }
  if (ctx?.mode === "none") return ctx.reason === "no_credits" ? "templates (out of credits)" : "demo (deterministic templates)";
  const e = env();
  return e.provider === "demo" ? "demo (deterministic templates)" : `${e.model} (${e.provider})`;
}
