import { continueRun } from "@/lib/agent/pipeline";
import { verifyDurableCallback } from "@/lib/durable/client";
import { getStore } from "@/lib/db";

export const maxDuration = 300;

/**
 * Callbacks from the Cloudflare durable run agent (Bearer CF_AGENT_SECRET):
 *   continue  — finish the remaining build waves (idempotent)
 *   approved  — a parked action was approved by a human
 *   reminder  — an approval has been waiting 24h
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string; action: string }> }) {
  if (!verifyDurableCallback(req)) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { id, action } = await params;
  const store = getStore();
  const body = await req.json().catch(() => ({}));

  if (action === "continue") {
    const result = await continueRun(id);
    if (!result) return Response.json({ error: "run not found" }, { status: 404 });
    return Response.json({ status: result.run.status, artifacts: result.artifacts.length });
  }
  if (action === "approved" || action === "reminder") {
    await store.audit({ actor: "durable-agent", action: `approval.${action}`, target: id, detail: body });
    return Response.json({ ok: true });
  }
  return Response.json({ error: "unknown action" }, { status: 404 });
}
