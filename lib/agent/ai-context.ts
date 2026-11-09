import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";
import type { ByokProvider } from "@/lib/billing/config";
import { billingConfig } from "@/lib/billing/config";
import { getBillingStore } from "@/lib/billing/store";
import { open } from "@/lib/billing/crypto";
import { currentAccountId, ensureAccount } from "@/lib/billing/account";
import { env } from "@/lib/env";

/**
 * Per-request AI context: which key pays for model calls.
 *
 *   byok     → the user's own provider key (no credits used)
 *   house    → the operator's key, metered: each model call deducts credits
 *   unmetered→ the operator's key, no metering (billing off, or server-to-server paths)
 *   none     → no usable model (demo mode, or out of credits) → deterministic templates
 *
 * Requests without a context (MCP endpoint, durable callbacks, evals) keep the
 * original behaviour: the house key, unmetered. Those paths are protected by
 * their own secrets.
 */
export interface AiContext {
  accountId: string | null;
  mode: "byok" | "house" | "unmetered" | "none";
  /** Why mode is "none". */
  reason?: "demo" | "no_credits";
  byok?: { provider: ByokProvider; apiKey: string; model?: string | null };
  balance: number;
  creditsPerCall: number;
}

const als = new AsyncLocalStorage<AiContext>();

export function currentAiContext(): AiContext | undefined {
  return als.getStore();
}

export function withAiContext<T>(ctx: AiContext, fn: () => T): T {
  return als.run(ctx, fn);
}

/** Resolve the AI context for an account. Never throws for a bad stored key — falls back to credits. */
export async function resolveAiContext(accountId: string | null): Promise<AiContext> {
  const cfg = billingConfig();
  const houseDemo = env().provider === "demo";
  const base = { accountId, balance: 0, creditsPerCall: cfg.creditsPerCall };
  if (!accountId) return houseDemo ? { ...base, mode: "none", reason: "demo" } : { ...base, mode: "unmetered" };

  const store = getBillingStore();
  await ensureAccount(accountId);
  if (cfg.byok) {
    const k = await store.getKey(accountId);
    if (k) {
      try {
        return { ...base, mode: "byok", byok: { provider: k.provider, apiKey: open(k, accountId), model: k.model }, balance: await store.balance(accountId) };
      } catch {
        console.warn("[enably] stored BYOK key could not be decrypted (was BYOK_ENCRYPTION_KEY rotated?) — ignoring it");
      }
    }
  }
  if (houseDemo) return { ...base, mode: "none", reason: "demo" };
  if (!cfg.metered) return { ...base, mode: "unmetered" };
  const balance = await store.balance(accountId);
  return balance >= cfg.creditsPerCall ? { ...base, mode: "house", balance } : { ...base, mode: "none", reason: "no_credits", balance };
}

/** Convenience for route handlers: resolve for the current browser account. */
export async function requestAiContext(): Promise<AiContext> {
  return resolveAiContext(await currentAccountId());
}

export class InsufficientCreditsError extends Error {
  constructor() {
    super("Out of credits — buy a credit pack or add your own AI key in Credits & keys.");
    this.name = "InsufficientCreditsError";
  }
}
