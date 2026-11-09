import { currentAccountId } from "@/lib/billing/account";
import { billingStatus } from "@/lib/billing/status";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await billingStatus(await currentAccountId()), { headers: { "cache-control": "no-store" } });
}
