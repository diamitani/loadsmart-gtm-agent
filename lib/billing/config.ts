import { encryptionKey } from "./crypto";
import { authMode } from "@/lib/auth/config";

export const BYOK_PROVIDERS = ["anthropic", "openai", "gateway"] as const;
export type ByokProvider = (typeof BYOK_PROVIDERS)[number];

export const BYOK_LABELS: Record<ByokProvider, string> = {
  anthropic: "Anthropic",
  openai: "OpenAI",
  gateway: "Vercel AI Gateway",
};

/** Default models per BYOK provider (override per key in the UI, or with env). */
export function byokModels(provider: ByokProvider): { main: string; fast: string } {
  const e = process.env;
  if (provider === "anthropic") return { main: e.ENABLY_BYOK_ANTHROPIC_MODEL || "claude-sonnet-5-5", fast: e.ENABLY_BYOK_ANTHROPIC_FAST_MODEL || "claude-haiku-5-5" };
  if (provider === "openai") return { main: e.ENABLY_BYOK_OPENAI_MODEL || "gpt-5.5", fast: e.ENABLY_BYOK_OPENAI_FAST_MODEL || "gpt-5.4-mini" };
  return { main: e.ENABLY_MODEL || "anthropic/claude-sonnet-5.5", fast: e.ENABLY_FAST_MODEL || "anthropic/claude-haiku-5.5" };
}

export interface CreditPack {
  id: string;
  label: string;
  credits: number;
  /** Price in the smallest currency unit (cents). Used with inline price_data when no priceId. */
  amountCents: number;
  currency: string;
  /** Optional Stripe Price ID (price_...). When set, Checkout uses it instead of inline price_data. */
  priceId?: string;
}

export const DEFAULT_PACKS: CreditPack[] = [
  { id: "starter", label: "Starter", credits: 100, amountCents: 500, currency: "usd" },
  { id: "growth", label: "Growth", credits: 500, amountCents: 2000, currency: "usd" },
  { id: "scale", label: "Scale", credits: 1500, amountCents: 5000, currency: "usd" },
];

export function parsePacks(raw: string | undefined): CreditPack[] {
  if (!raw?.trim()) return DEFAULT_PACKS;
  try {
    const list = JSON.parse(raw) as Partial<CreditPack>[];
    const packs = list
      .filter((p) => p && typeof p.id === "string" && Number.isInteger(p.credits) && (p.credits as number) > 0 && (p.priceId || (Number.isInteger(p.amountCents) && (p.amountCents as number) >= 50)))
      .map((p) => ({ id: p.id!, label: p.label || p.id!, credits: p.credits!, amountCents: p.amountCents ?? 0, currency: (p.currency || "usd").toLowerCase(), priceId: p.priceId }));
    return packs.length ? packs : DEFAULT_PACKS;
  } catch {
    console.warn("[enably] ENABLY_CREDIT_PACKS is not valid JSON — using default packs");
    return DEFAULT_PACKS;
  }
}

/** Whether billing can keep durable state (purchased credits must never live only in memory). */
export function durableBillingStore(): boolean {
  const hasSupabase = !!((process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) && process.env.SUPABASE_SERVICE_ROLE_KEY);
  return hasSupabase || !process.env.VERCEL;
}

export function billingConfig() {
  const e = process.env;
  const accounts = authMode() !== "unconfigured";
  const byok = !!encryptionKey();
  const durable = durableBillingStore();
  return {
    /** Signed-in user accounts are available (Supabase Auth, or the dev user locally). */
    accounts,
    /** House-key usage is metered with credits. Off with ENABLY_BILLING=off. */
    metered: accounts && (e.ENABLY_BILLING || "on").toLowerCase() !== "off",
    /** Users can store their own provider key. */
    byok: accounts && byok,
    creditsPerCall: Math.max(1, Math.floor(Number(e.ENABLY_CREDITS_PER_CALL || 1)) || 1),
    freeCredits: Math.max(0, Math.floor(Number(e.ENABLY_FREE_CREDITS || 0)) || 0),
    packs: parsePacks(e.ENABLY_CREDIT_PACKS),
    /** Stripe Checkout is live only with keys AND a durable store. */
    stripe: !!(e.STRIPE_SECRET_KEY && e.STRIPE_WEBHOOK_SECRET) && durable && accounts,
    stripeKeysPresent: !!(e.STRIPE_SECRET_KEY && e.STRIPE_WEBHOOK_SECRET),
    durable,
  };
}

export type BillingConfig = ReturnType<typeof billingConfig>;
