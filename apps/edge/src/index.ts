// Cloudflare Worker scheduler for the Loadsmart ABM daily graph.
// Maps each cron to a pipeline step and calls the app with a shared secret.
// Deploy: cd apps/edge && npx wrangler secret put CRON_SECRET && npx wrangler deploy

interface Env {
  APP_URL: string;
  CRON_SECRET: string;
}

const CRON_TO_STEP: Record<string, string> = {
  "0 12 * * 1-5": "la-signal",
  "30 12 * * 1": "la-abm-tag",
  "0 13 * * 1-5": "la-persona-enrich",
  "30 13 * * 1-5": "la-research",
  "0 14 * * 1-5": "la-email",
  "30 14 * * 1-5": "la-sequence",
  "0 23 * * 1-5": "la-daily-report",
};

async function runStep(env: Env, step: string) {
  const res = await fetch(`${env.APP_URL}/api/pipeline/run?step=${step}`, {
    method: "POST",
    headers: { authorization: `Bearer ${env.CRON_SECRET}` },
  });
  const body = await res.text();
  console.log(JSON.stringify({ step, status: res.status, body: body.slice(0, 500) }));
  if (!res.ok) throw new Error(`${step} failed with ${res.status}`);
}

export default {
  async scheduled(event: { cron: string }, env: Env, ctx: { waitUntil(p: Promise<unknown>): void }) {
    const step = CRON_TO_STEP[event.cron];
    if (!step) {
      console.log(`No step mapped for cron ${event.cron}`);
      return;
    }
    ctx.waitUntil(runStep(env, step));
  },

  // Manual trigger for testing: POST /run/<step> with the same bearer secret.
  async fetch(req: Request, env: Env) {
    const url = new URL(req.url);
    const m = url.pathname.match(/^\/run\/([a-z0-9-]+)$/);
    if (req.method !== "POST" || !m) return new Response("Loadsmart ABM scheduler", { status: 200 });
    if (req.headers.get("authorization") !== `Bearer ${env.CRON_SECRET}`) return new Response("Unauthorized", { status: 401 });
    await runStep(env, m[1]);
    return new Response(`ran ${m[1]}`, { status: 200 });
  },
};
