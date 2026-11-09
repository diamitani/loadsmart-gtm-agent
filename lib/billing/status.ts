import "server-only";
import { billingConfig, BYOK_LABELS, byokModels } from "./config";
import { getBillingStore } from "./store";
import { ensureAccount } from "./account";
import { env } from "@/lib/env";

/** Everything the Credits & keys page shows. Never includes key material. */
export async function billingStatus(accountId: string | null) {
  const cfg = billingConfig();
  const house = env().provider;
  const base = {
    accountId,
    accounts: cfg.accounts,
    metered: cfg.metered,
    byokEnabled: cfg.byok,
    stripeEnabled: cfg.stripe,
    stripeKeysPresent: cfg.stripeKeysPresent,
    durable: cfg.durable,
    houseProvider: house,
    creditsPerCall: cfg.creditsPerCall,
    packs: cfg.packs.map(({ id, label, credits, amountCents, currency }) => ({ id, label, credits, amountCents, currency })),
    providers: (Object.keys(BYOK_LABELS) as (keyof typeof BYOK_LABELS)[]).map((p) => ({ id: p, label: BYOK_LABELS[p], defaultModel: byokModels(p).main })),
  };
  if (!accountId) return { ...base, balance: 0, key: null, ledger: [] };
  const store = getBillingStore();
  await ensureAccount(accountId);
  const [balance, key, ledger] = await Promise.all([store.balance(accountId), cfg.byok ? store.getKey(accountId) : null, store.ledger(accountId, 25)]);
  return {
    ...base,
    balance,
    key: key ? { provider: key.provider, label: BYOK_LABELS[key.provider], last4: key.last4, model: key.model ?? null, updatedAt: key.updatedAt } : null,
    ledger: ledger.map(({ delta, balanceAfter, reason, createdAt }) => ({ delta, balanceAfter, reason, createdAt })),
  };
}

export type BillingStatus = Awaited<ReturnType<typeof billingStatus>>;
