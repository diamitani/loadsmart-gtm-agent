import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { CreditPack } from "./config";

/**
 * Minimal Stripe client: Checkout Session creation + webhook signature
 * verification (https://docs.stripe.com/webhooks#verify-manually). No SDK
 * dependency; the secret key never leaves the server.
 */

const API = "https://api.stripe.com/v1";

export function checkoutForm(pack: CreditPack, accountId: string, origin: string, email?: string | null): URLSearchParams {
  const f = new URLSearchParams();
  f.set("mode", "payment");
  f.set("success_url", `${origin}/app/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`);
  f.set("cancel_url", `${origin}/app/billing?checkout=cancelled`);
  f.set("client_reference_id", accountId);
  f.set("metadata[account_id]", accountId);
  f.set("metadata[pack_id]", pack.id);
  f.set("metadata[credits]", String(pack.credits));
  if (email) f.set("customer_email", email);
  f.set("line_items[0][quantity]", "1");
  if (pack.priceId) {
    f.set("line_items[0][price]", pack.priceId);
  } else {
    f.set("line_items[0][price_data][currency]", pack.currency);
    f.set("line_items[0][price_data][unit_amount]", String(pack.amountCents));
    f.set("line_items[0][price_data][product_data][name]", `Enably credits — ${pack.label} (${pack.credits})`);
  }
  return f;
}

export async function createCheckoutSession(pack: CreditPack, accountId: string, origin: string, email?: string | null): Promise<{ id: string; url: string }> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured");
  const res = await fetch(`${API}/checkout/sessions`, {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/x-www-form-urlencoded" },
    body: checkoutForm(pack, accountId, origin, email),
  });
  const json = (await res.json().catch(() => ({}))) as { id?: string; url?: string; error?: { message?: string } };
  if (!res.ok || !json.url || !json.id) throw new Error(`Stripe: ${json.error?.message ?? `HTTP ${res.status}`}`);
  return { id: json.id, url: json.url };
}

/** Verifies a Stripe-Signature header against the raw body. Throws on failure. */
export function verifyStripeSignature(payload: string, header: string | null, secret: string, toleranceSec = 300, nowSec = Math.floor(Date.now() / 1000)): void {
  if (!header) throw new Error("missing Stripe-Signature header");
  let t = "";
  const sigs: string[] = [];
  for (const part of header.split(",")) {
    const [k, v] = part.split("=", 2).map((s) => s?.trim());
    if (k === "t") t = v ?? "";
    else if (k === "v1" && v) sigs.push(v);
  }
  const ts = Number(t);
  if (!t || !Number.isFinite(ts) || !sigs.length) throw new Error("malformed Stripe-Signature header");
  if (Math.abs(nowSec - ts) > toleranceSec) throw new Error("Stripe signature timestamp outside tolerance");
  const expected = Buffer.from(createHmac("sha256", secret).update(`${t}.${payload}`, "utf8").digest("hex"), "utf8");
  const ok = sigs.some((s) => {
    const b = Buffer.from(s, "utf8");
    return b.length === expected.length && timingSafeEqual(b, expected);
  });
  if (!ok) throw new Error("Stripe signature mismatch");
}

export interface CheckoutSessionLike {
  id: string;
  payment_status?: string;
  client_reference_id?: string | null;
  metadata?: Record<string, string> | null;
  customer_details?: { email?: string | null } | null;
}

/** Decide what a verified event grants. Pure, so it is unit-tested. */
export function creditsFromEvent(event: { type: string; data: { object: CheckoutSessionLike } }, packs: CreditPack[]): { accountId: string; credits: number; ref: string; packId: string } | null {
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") return null;
  const s = event.data.object;
  if (s.payment_status !== "paid") return null; // async methods grant on async_payment_succeeded
  const accountId = s.metadata?.account_id || s.client_reference_id || "";
  const packId = s.metadata?.pack_id || "";
  const pack = packs.find((p) => p.id === packId);
  const credits = pack ? pack.credits : Number(s.metadata?.credits);
  if (!accountId || !Number.isInteger(credits) || credits <= 0) return null;
  return { accountId, credits, ref: `stripe:${s.id}`, packId };
}
