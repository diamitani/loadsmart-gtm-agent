import { billingConfig } from "@/lib/billing/config";
import { getBillingStore } from "@/lib/billing/store";
import { creditsFromEvent, verifyStripeSignature, type CheckoutSessionLike } from "@/lib/billing/stripe";

export const dynamic = "force-dynamic";

/**
 * Stripe webhook. Register https://<your-app>/api/billing/webhook in Stripe for
 * `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
 * The signature is verified against the raw body; grants are idempotent on the
 * Checkout Session id, so Stripe retries never double-credit.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: "webhook not configured" }, { status: 503 });
  const payload = await req.text();
  try {
    verifyStripeSignature(payload, req.headers.get("stripe-signature"), secret);
  } catch (err) {
    console.warn("[enably] rejected Stripe webhook:", (err as Error).message);
    return Response.json({ error: "invalid signature" }, { status: 400 });
  }
  let event: { id?: string; type: string; data: { object: CheckoutSessionLike } };
  try {
    event = JSON.parse(payload);
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  const grant = creditsFromEvent(event, billingConfig().packs);
  if (!grant) return Response.json({ received: true, ignored: event.type });
  try {
    const r = await getBillingStore().grant(grant.accountId, grant.credits, "purchase", grant.ref);
    return Response.json({ received: true, applied: r.applied });
  } catch (err) {
    console.error("[enably] credit grant failed:", (err as Error).message);
    return Response.json({ error: "grant failed" }, { status: 500 }); // Stripe retries
  }
}
