import { cookies } from "next/headers";
import { ACCOUNT_COOKIE, ACCOUNT_COOKIE_OPTIONS, ACCOUNT_ID_RE, signAccount } from "@/lib/billing/account-cookie";
import { billingConfig } from "@/lib/billing/config";
import { getBillingStore } from "@/lib/billing/store";

/** Switch this browser to an existing account using its recovery code (the account id). */
export async function POST(req: Request) {
  if (!billingConfig().accounts) return Response.json({ error: "Accounts are not enabled" }, { status: 503 });
  const { accountId } = (await req.json().catch(() => ({}))) as { accountId?: string };
  const id = (accountId ?? "").trim();
  // Constant response for malformed and unknown codes.
  if (!ACCOUNT_ID_RE.test(id) || !(await getBillingStore().accountExists(id))) return Response.json({ error: "That recovery code didn't match an account." }, { status: 404 });
  (await cookies()).set(ACCOUNT_COOKIE, await signAccount(id), ACCOUNT_COOKIE_OPTIONS);
  return Response.json({ ok: true });
}
