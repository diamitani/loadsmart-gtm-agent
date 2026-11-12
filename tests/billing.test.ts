import { createHmac, randomBytes } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MockLanguageModelV4 } from "ai/test";
import { open, parseKey, seal } from "@/lib/billing/crypto";
import { checkoutForm, creditsFromEvent, verifyStripeSignature } from "@/lib/billing/stripe";
import { billingConfig, DEFAULT_PACKS, parsePacks } from "@/lib/billing/config";
import { createLocalBillingStore, getBillingStore } from "@/lib/billing/store";
import { resolveAiContext } from "@/lib/agent/ai-context";
import { getModel, meter } from "@/lib/agent/models";

const KEY = randomBytes(32);
const ENV_KEYS = [
  "BYOK_ENCRYPTION_KEY",
  "ENABLY_SESSION_SECRET",
  "ENABLY_BILLING",
  "AI_GATEWAY_API_KEY",
  "ANTHROPIC_API_KEY",
  "GEMINI_API_KEY",
  "GOOGLE_GENERATIVE_AI_API_KEY",
  "GOOGLE_API_KEY",
  "OPENAI_API_KEY",
  "VERCEL_OIDC_TOKEN",
  "ENABLY_FREE_CREDITS",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "VERCEL",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "VERCEL_ENV",
];
let saved: Record<string, string | undefined> = {};
beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));
  for (const k of ENV_KEYS) delete process.env[k];
});
afterEach(() => {
  for (const k of ENV_KEYS) (saved[k] === undefined ? delete process.env[k] : (process.env[k] = saved[k]));
});

describe("BYOK encryption (AES-256-GCM)", () => {
  it("round-trips and binds the ciphertext to the account", () => {
    const s = seal("sk-ant-secret-value-1234", "acct_a", KEY);
    expect(s.ciphertext).not.toContain("secret");
    expect(open(s, "acct_a", KEY)).toBe("sk-ant-secret-value-1234");
    expect(() => open(s, "acct_b", KEY)).toThrow();
    expect(() => open({ ...s, ciphertext: Buffer.from("tampered!").toString("base64") }, "acct_a", KEY)).toThrow();
    expect(() => open(s, "acct_a", randomBytes(32))).toThrow();
  });
  it("accepts 32-byte base64 or hex keys only", () => {
    expect(parseKey(KEY.toString("base64"))?.length).toBe(32);
    expect(parseKey(KEY.toString("hex"))?.length).toBe(32);
    expect(parseKey("too-short")).toBeNull();
    expect(parseKey("")).toBeNull();
  });
});

describe("Stripe", () => {
  const secret = "whsec_test";
  const sign = (payload: string, t: number) => `t=${t},v1=${createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex")}`;
  it("verifies webhook signatures", () => {
    const now = 1_800_000_000;
    const body = JSON.stringify({ type: "checkout.session.completed" });
    expect(() => verifyStripeSignature(body, sign(body, now), secret, 300, now)).not.toThrow();
    expect(() => verifyStripeSignature(body + " ", sign(body, now), secret, 300, now)).toThrow(/mismatch/);
    expect(() => verifyStripeSignature(body, sign(body, now - 1000), secret, 300, now)).toThrow(/tolerance/);
    expect(() => verifyStripeSignature(body, null, secret, 300, now)).toThrow();
    expect(() => verifyStripeSignature(body, `t=${now},v1=deadbeef,${sign(body, now).split(",")[1]}`, secret, 300, now)).not.toThrow();
  });
  it("grants only for paid checkout sessions, using the server-side pack size", () => {
    const ev = (o: object, type = "checkout.session.completed") => ({ type, data: { object: { id: "cs_1", payment_status: "paid", metadata: { account_id: "acct_x", pack_id: "growth", credits: "999999" }, ...o } } });
    expect(creditsFromEvent(ev({}), DEFAULT_PACKS)).toEqual({ accountId: "acct_x", credits: 500, ref: "stripe:cs_1", packId: "growth" });
    expect(creditsFromEvent(ev({ payment_status: "unpaid" }), DEFAULT_PACKS)).toBeNull();
    expect(creditsFromEvent(ev({}, "payment_intent.succeeded"), DEFAULT_PACKS)).toBeNull();
    expect(creditsFromEvent(ev({}, "checkout.session.async_payment_succeeded"), DEFAULT_PACKS)?.credits).toBe(500);
    expect(creditsFromEvent(ev({ metadata: {} }), DEFAULT_PACKS)).toBeNull();
  });
  it("builds checkout params with inline price_data or a Price ID", () => {
    const inline = checkoutForm(DEFAULT_PACKS[0], "acct_x", "https://app.test");
    expect(inline.get("mode")).toBe("payment");
    expect(inline.get("client_reference_id")).toBe("acct_x");
    expect(inline.get("line_items[0][price_data][unit_amount]")).toBe("500");
    expect(inline.get("success_url")).toContain("{CHECKOUT_SESSION_ID}");
    const priced = checkoutForm({ ...DEFAULT_PACKS[0], priceId: "price_123" }, "acct_x", "https://app.test");
    expect(priced.get("line_items[0][price]")).toBe("price_123");
    expect(priced.has("line_items[0][price_data][currency]")).toBe(false);
  });
  it("builds subscription checkout params and credits recurring renewal invoices", () => {
    const subPack = DEFAULT_PACKS.find((p) => p.mode === "subscription");
    expect(subPack).toBeDefined();
    const subForm = checkoutForm(subPack!, "acct_sub", "https://app.test");
    expect(subForm.get("mode")).toBe("subscription");
    expect(subForm.get("line_items[0][price_data][recurring][interval]")).toBe("month");

    // Renewal invoice test:
    const invCycle = {
      type: "invoice.paid",
      data: {
        object: {
          id: "in_cycle_123",
          paid: true,
          billing_reason: "subscription_cycle",
          subscription_details: { metadata: { account_id: "acct_sub", pack_id: subPack!.id } },
        },
      },
    };
    const grant = creditsFromEvent(invCycle, DEFAULT_PACKS);
    expect(grant).toEqual({ accountId: "acct_sub", credits: subPack!.credits, ref: "stripe:inv_in_cycle_123", packId: subPack!.id });

    // Creation invoice (ignored to avoid double credit with checkout session completed):
    const invCreate = {
      type: "invoice.paid",
      data: {
        object: {
          id: "in_create_123",
          paid: true,
          billing_reason: "subscription_create",
          subscription_details: { metadata: { account_id: "acct_sub", pack_id: subPack!.id } },
        },
      },
    };
    expect(creditsFromEvent(invCreate, DEFAULT_PACKS)).toBeNull();
  });
  it("parses custom packs and falls back on bad config", () => {
    expect(parsePacks('[{"id":"x","credits":10,"amountCents":100}]')).toMatchObject([{ id: "x", credits: 10, currency: "usd" }]);
    expect(parsePacks("nope")).toBe(DEFAULT_PACKS);
    expect(parsePacks('[{"id":"x","credits":-1,"amountCents":100}]')).toBe(DEFAULT_PACKS);
  });
  it("pauses purchases on Vercel until a durable store exists", () => {
    process.env.BYOK_ENCRYPTION_KEY = KEY.toString("base64");
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
    expect(billingConfig().stripe).toBe(true);
    process.env.VERCEL = "1";
    expect(billingConfig().stripe).toBe(false);
    process.env.SUPABASE_URL = "https://x.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "k";
    // Durable store but no sign-in configured: still paused (no accounts to credit).
    expect(billingConfig().stripe).toBe(false);
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    expect(billingConfig().stripe).toBe(true);
  });
});

describe("credit ledger", () => {
  it("grants idempotently and never goes negative", async () => {
    const s = createLocalBillingStore();
    const id = newAccountId();
    expect((await s.grant(id, 10, "purchase", "stripe:cs_a")).applied).toBe(true);
    expect((await s.grant(id, 10, "purchase", "stripe:cs_a")).applied).toBe(false);
    expect(await s.balance(id)).toBe(10);
    expect(await s.consume(id, 4, "ai_call", "c1")).toBe(6);
    expect(await s.consume(id, 7, "ai_call", "c2")).toBeNull();
    expect(await s.balance(id)).toBe(6);
    const all = await Promise.all(Array.from({ length: 10 }, (_, i) => s.consume(id, 1, "ai_call", `p${i}`)));
    expect(all.filter((x) => x !== null)).toHaveLength(6);
    expect(await s.balance(id)).toBe(0);
    expect((await s.ledger(id)).map((l) => l.delta).slice(-2)).toEqual([-4, 10]);
  });
});

describe("AI routing: BYOK, credits, unmetered", () => {
  beforeEach(() => {
    process.env.BYOK_ENCRYPTION_KEY = KEY.toString("base64");
    process.env.AI_GATEWAY_API_KEY = "house-key";
  });

  it("blocks the house key when the account has no credits, allows it after a purchase", async () => {
    const id = newAccountId();
    const ctx = await resolveAiContext(id);
    expect(ctx).toMatchObject({ mode: "none", reason: "no_credits", balance: 0 });
    expect(getModel("main", ctx)).toBeNull();
    await getBillingStore().grant(id, 5, "purchase", `stripe:${id}`);
    const paid = await resolveAiContext(id);
    expect(paid).toMatchObject({ mode: "house", balance: 5 });
    expect(getModel("main", paid)).not.toBeNull();
  });

  it("supports Google Gemini as house provider immediately when GEMINI_API_KEY is present", async () => {
    delete process.env.AI_GATEWAY_API_KEY;
    process.env.GEMINI_API_KEY = "AIzaSyTestKey123456789";
    const id = newAccountId();
    await getBillingStore().grant(id, 5, "purchase", `stripe:${id}`);
    const paid = await resolveAiContext(id);
    expect(paid).toMatchObject({ mode: "house", balance: 5 });
    const m = getModel("main", paid);
    expect(m).not.toBeNull();
  });

  it("uses the user's own key and skips credits (Anthropic & Gemini)", async () => {
    const id = newAccountId();
    const now = new Date().toISOString();
    await getBillingStore().putKey({ accountId: id, provider: "anthropic", ...seal("sk-ant-user-key-abcdef", id), last4: "cdef", model: null, createdAt: now, updatedAt: now });
    const ctx = await resolveAiContext(id);
    expect(ctx.mode).toBe("byok");
    expect(ctx.byok).toMatchObject({ provider: "anthropic", apiKey: "sk-ant-user-key-abcdef" });
    expect(getModel("main", ctx)).not.toBeNull();

    // Now test Gemini BYOK
    await getBillingStore().putKey({ accountId: id, provider: "gemini", ...seal("AIzaSyUserGeminiKey998877", id), last4: "8877", model: null, createdAt: now, updatedAt: now });
    const geminiCtx = await resolveAiContext(id);
    expect(geminiCtx.mode).toBe("byok");
    expect(geminiCtx.byok).toMatchObject({ provider: "gemini", apiKey: "AIzaSyUserGeminiKey998877" });
    expect(getModel("main", geminiCtx)).not.toBeNull();
  });

  it("ignores a key that no longer decrypts (rotated secret)", async () => {
    const id = newAccountId();
    const now = new Date().toISOString();
    await getBillingStore().putKey({ accountId: id, provider: "openai", ...seal("sk-user", id, randomBytes(32)), last4: "user", createdAt: now, updatedAt: now });
    expect((await resolveAiContext(id)).mode).toBe("none");
  });

  it("is unmetered with ENABLY_BILLING=off and applies free credits once", async () => {
    process.env.ENABLY_BILLING = "off";
    expect((await resolveAiContext(newAccountId())).mode).toBe("unmetered");
    delete process.env.ENABLY_BILLING;
    process.env.ENABLY_FREE_CREDITS = "3";
    const id = newAccountId();
    expect((await resolveAiContext(id)).balance).toBe(3);
    expect((await resolveAiContext(id)).balance).toBe(3);
  });

  it("demo mode without any key", async () => {
    delete process.env.AI_GATEWAY_API_KEY;
    expect(await resolveAiContext(newAccountId())).toMatchObject({ mode: "none", reason: "demo" });
  });
});

describe("metered model", () => {
  const result = { content: [{ type: "text", text: "ok" }], finishReason: { unified: "stop", raw: "stop" }, usage: {}, warnings: [] };
  it("deducts per call, refunds failed calls, and refuses when empty", async () => {
    const id = newAccountId();
    await getBillingStore().grant(id, 2, "purchase", `stripe:m_${id}`);
    let fail = false;
    const mock = new MockLanguageModelV4({
      doGenerate: async () => {
        if (fail) throw new Error("provider down");
        return result as never;
      },
    });
    const m = meter(mock, id, 1);
    await m.doGenerate({ prompt: [] } as never);
    expect(await getBillingStore().balance(id)).toBe(1);
    fail = true;
    await expect(m.doGenerate({ prompt: [] } as never)).rejects.toThrow("provider down");
    expect(await getBillingStore().balance(id)).toBe(1);
    fail = false;
    await m.doGenerate({ prompt: [] } as never);
    expect(await getBillingStore().balance(id)).toBe(0);
    await expect(m.doGenerate({ prompt: [] } as never)).rejects.toThrow(/out of credits/i);
    expect(mock.doGenerateCalls).toHaveLength(3);
  });
});

/** Billing accounts are keyed by the Supabase auth user id. */
function newAccountId(): string {
  return crypto.randomUUID();
}
