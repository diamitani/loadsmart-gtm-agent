import { currentAccountId, ensureAccount } from "@/lib/billing/account";
import { billingConfig } from "@/lib/billing/config";
import { createCheckoutSession } from "@/lib/billing/stripe";

/** Start a Stripe Checkout session for one credit pack. Credits are granted only by the verified webhook. */
export async function POST(req: Request) {
  const cfg = billingConfig();
  if (!cfg.stripe) return Response.json({ error: cfg.stripeKeysPresent && !cfg.durable ? "Purchases need a database (Supabase) so credits are never lost." : "Purchases are not configured yet." }, { status: 503 });
  const accountId = await currentAccountId();
  if (!accountId) return Response.json({ error: "No account" }, { status: 401 });
  const { packId } = (await req.json().catch(() => ({}))) as { packId?: string };
  const pack = cfg.packs.find((p) => p.id === packId);
  if (!pack) return Response.json({ error: "Unknown credit pack" }, { status: 400 });
  await ensureAccount(accountId);
  const origin = (process.env.ENABLY_APP_URL || new URL(req.url).origin).replace(/\/$/, "");
  try {
    const session = await createCheckoutSession(pack, accountId, origin);
    return Response.json({ url: session.url });
  } catch (err) {
    console.error("[enably] checkout failed:", (err as Error).message);
    return Response.json({ error: "Could not start checkout. Try again in a moment." }, { status: 502 });
  }
}
