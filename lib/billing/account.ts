import "server-only";
import { currentUser } from "@/lib/auth/user";
import { billingConfig } from "./config";
import { getBillingStore } from "./store";

/** The billing account is the signed-in Supabase auth user (id = auth.users.id). */
export async function currentAccountId(): Promise<string | null> {
  if (!billingConfig().accounts) return null;
  return (await currentUser())?.id ?? null;
}

/** Creates the account record on first use and applies the one-time free grant (ENABLY_FREE_CREDITS). */
export async function ensureAccount(id: string, email?: string | null): Promise<void> {
  const store = getBillingStore();
  await store.ensureAccount(id, email);
  const free = billingConfig().freeCredits;
  if (free > 0) await store.grant(id, free, "free_grant", `free:${id}`);
}
