import { z } from "zod";
import { currentAccountId } from "@/lib/billing/account";
import { billingConfig, BYOK_PROVIDERS } from "@/lib/billing/config";
import { seal } from "@/lib/billing/crypto";
import { getBillingStore } from "@/lib/billing/store";
import { getStore } from "@/lib/db";

const Body = z.object({
  provider: z.enum(BYOK_PROVIDERS),
  apiKey: z.string().trim().min(16).max(512).regex(/^\S+$/, "API keys contain no spaces"),
  model: z.string().trim().max(120).regex(/^[\w./:-]*$/).optional(),
});

const PREFIX: Partial<Record<(typeof BYOK_PROVIDERS)[number], RegExp>> = {
  anthropic: /^sk-ant-/,
  openai: /^sk-/,
  gemini: /^AIza|^[A-Za-z0-9_-]{20,}$/,
};

/** Save (or replace) this account's own AI key. The key is encrypted at rest and never returned or logged. */
export async function PUT(req: Request) {
  if (!billingConfig().byok) return Response.json({ error: "Bring-your-own-key is not enabled on this server." }, { status: 503 });
  const accountId = await currentAccountId();
  if (!accountId) return Response.json({ error: "No account" }, { status: 401 });
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return Response.json({ error: "Check the provider and key format." }, { status: 400 });
  const { provider, apiKey, model } = parsed.data;
  const prefix = PREFIX[provider];
  if (prefix && !prefix.test(apiKey)) {
    const hint =
      provider === "anthropic"
        ? "Anthropic (sk-ant-…)"
        : provider === "openai"
        ? "OpenAI (sk-…)"
        : provider === "gemini"
        ? "Google Gemini (AIza…)"
        : "valid gateway";
    return Response.json({ error: `That doesn't look like a valid ${hint} key.` }, { status: 400 });
  }
  const now = new Date().toISOString();
  const existing = await getBillingStore().getKey(accountId);
  await getBillingStore().putKey({ accountId, provider, ...seal(apiKey, accountId), last4: apiKey.slice(-4), model: model || null, createdAt: existing?.createdAt ?? now, updatedAt: now });
  await getStore().audit({ actor: accountId, action: "byok.saved", target: provider }).catch(() => undefined);
  return Response.json({ ok: true, provider, last4: apiKey.slice(-4) });
}

export async function DELETE() {
  const accountId = await currentAccountId();
  if (!accountId) return Response.json({ error: "No account" }, { status: 401 });
  await getBillingStore().deleteKey(accountId);
  await getStore().audit({ actor: accountId, action: "byok.removed" }).catch(() => undefined);
  return Response.json({ ok: true });
}
