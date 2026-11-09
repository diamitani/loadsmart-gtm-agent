import "server-only";
import { env } from "@/lib/env";

/**
 * Client for the Cloudflare durable run agent (workers/gtm-durable).
 *
 * Each GTM run is a Durable Object ("virtual actor") addressed by run id.
 * It survives serverless timeouts, sleeps with zero compute while waiting
 * for approvals, and calls back into this app to continue the build.
 */
export async function dispatchToDurable(runId: string, remainingWaves: string[][]): Promise<{ ok: boolean; error?: string }> {
  const e = env();
  if (!e.durableUrl) return { ok: false, error: "CF_AGENT_URL not configured" };
  try {
    const res = await fetch(`${e.durableUrl.replace(/\/$/, "")}/runs/${encodeURIComponent(runId)}/start`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${e.durableSecret}` },
      body: JSON.stringify({ remainingWaves, appUrl: appUrl() }),
    });
    return res.ok ? { ok: true } : { ok: false, error: `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** Ask the durable agent to hold an action until a human approves it (zero compute while waiting). */
export async function requestDurableApproval(runId: string, action: { kind: string; summary: string; payload: unknown }) {
  const e = env();
  if (!e.durableUrl) return { ok: false as const, error: "CF_AGENT_URL not configured" };
  const res = await fetch(`${e.durableUrl.replace(/\/$/, "")}/runs/${encodeURIComponent(runId)}/approval`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${e.durableSecret}` },
    body: JSON.stringify(action),
  });
  return res.ok ? { ok: true as const, ...(await res.json()) } : { ok: false as const, error: `HTTP ${res.status}` };
}

export function appUrl() {
  if (process.env.ENABLY_APP_URL) return process.env.ENABLY_APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/** Shared-secret check for callbacks from the durable agent. */
export function verifyDurableCallback(req: Request): boolean {
  const secret = env().durableSecret;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}
