import { currentAccountId } from "@/lib/billing/account";
import { currentUser } from "@/lib/auth/user";
import { billingStatus } from "@/lib/billing/status";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await billingStatus(await currentAccountId(), (await currentUser())?.email ?? null), { headers: { "cache-control": "no-store" } });
}
