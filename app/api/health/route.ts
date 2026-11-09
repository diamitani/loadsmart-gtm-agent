import { integrationStatus } from "@/lib/env";
import { getStore } from "@/lib/db";

export async function GET() {
  return Response.json({ ok: true, store: getStore().driver, integrations: integrationStatus().map(({ id, ok }) => ({ id, ok })) });
}
