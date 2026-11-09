import "server-only";
import { cookies, headers } from "next/headers";
import { ACCOUNT_COOKIE, ACCOUNT_HEADER, ACCOUNT_ID_RE, verifyAccount } from "./account-cookie";
import { billingConfig } from "./config";
import { getBillingStore } from "./store";

/**
 * The current browser's account id. The proxy verifies (or issues) the signed
 * cookie on every /app and /api request and forwards the id in a header it
 * controls; we re-verify the cookie directly as a fallback.
 */
export async function currentAccountId(): Promise<string | null> {
  if (!billingConfig().accounts) return null;
  const h = (await headers()).get(ACCOUNT_HEADER);
  if (h && ACCOUNT_ID_RE.test(h)) return h;
  return verifyAccount((await cookies()).get(ACCOUNT_COOKIE)?.value);
}

/** Creates the account record on first use and applies the one-time free grant (ENABLY_FREE_CREDITS). */
export async function ensureAccount(id: string): Promise<void> {
  const store = getBillingStore();
  await store.ensureAccount(id);
  const free = billingConfig().freeCredits;
  if (free > 0) await store.grant(id, free, "free_grant", `free:${id}`);
}
