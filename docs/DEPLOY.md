# Deploying Enably GTM Architect

Do these in order. Each step is optional except step 1 — the app works after any of them.

## 1. Vercel (the app)

1. Push this repo to GitHub (already done if you're reading this there).
2. Go to **vercel.com → Add New → Project**, import `enablygtm`. Framework: Next.js (auto-detected). Click **Deploy**.
3. In the project: **Settings → Environment Variables**. Add at least:
   - `ENABLY_ACCESS_CODE` — any password. **Do this first** so strangers can't use your AI credits.
   - The AI key: on Vercel, enable **AI Gateway** for the project (the OIDC token is picked up automatically), or add `AI_GATEWAY_API_KEY` / `ANTHROPIC_API_KEY`.
4. Redeploy. Without a database, Vercel keeps data only in memory (it resets) — do step 2 next.

## 2. Supabase (the database)

1. Create a project at **supabase.com**.
2. **SQL Editor → New query** → paste all of `supabase/migrations/0001_enably_gtm.sql` → **Run**.
3. **Settings → API**: copy the Project URL and the `service_role` key into Vercel as `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. (The service-role key is secret — server only. Never put it in a `NEXT_PUBLIC_` variable.)
4. Redeploy. **Settings** in the app should show *Database: Supabase Postgres*.

## 3. LangSmith (observability + evals)

1. **smith.langchain.com → Settings → API Keys** → create a key.
2. Add `LANGSMITH_API_KEY`, `LANGSMITH_PROJECT=enablygtm`, `LANGSMITH_TRACING=true` to Vercel (and to `.env.local` for local evals).
3. Every run now appears as a trace named `enably.pal.run` with a child span per stage and per asset.
4. Locally, run `npm run eval` — it creates the dataset `enablygtm-golden` and an experiment you can compare across prompt/model changes.

## 4. Cloudflare (durable runs + approvals)

```bash
cd workers/gtm-durable
```

```bash
npm install
```

```bash
npx wrangler login
```

```bash
npx wrangler secret put CF_AGENT_SECRET
```

(paste a long random string — e.g. from a password generator)

```bash
npm run deploy
```

Wrangler prints the worker URL. Add to Vercel:
- `CF_AGENT_URL` = that URL
- `CF_AGENT_SECRET` = the same random string
- `ENABLY_APP_URL` = your Vercel production URL (optional — auto-detected)

Now builds that run past `ENABLY_WATCHDOG_MS` (default 45s) hand their remaining waves to the durable agent, which calls back `/api/runs/:id/continue` with retries and exponential backoff.

## 5. n8n / Make / Zapier (delivery)

1. Create a workflow that starts with a **Webhook** trigger (n8n: *Webhook* node, POST).
2. Put its production URL in `WORKFLOW_WEBHOOK_URL` (optionally a shared secret in `WORKFLOW_WEBHOOK_SECRET`; it arrives as the `x-enably-signature` header).
3. In chat, ask: *"Send the approved package to my workflow to create Asana tasks."* You'll see **Approve & send** — nothing goes out until you click it.
4. Starter n8n workflows are in `agent/workflows/` (import via n8n → Workflows → Import from file).

The payload is:

```json
{ "event": "enably.package.approved", "purpose": "...", "run": { "id": "...", "title": "...", "quality": 94, "nextAction": {} }, "artifacts": [{ "id": "...", "title": "...", "kind": "icp", "markdown": "..." }] }
```

## 6. Connectors & MCP

Add any SDR keys you have (`SERPAPI_API_KEY`, `APOLLO_API_KEY`, `HUNTER_API_KEY`, `HUBSPOT_ACCESS_TOKEN`, `RESEND_API_KEY` + `ENABLY_SENDER_EMAIL` + `ENABLY_SENDER_FOOTER`) and run `supabase/migrations/0002_sales_activity.sql`. Full guide: [`CONNECTORS.md`](CONNECTORS.md).

## Inbound: start a run from a form or webhook

`POST /api/runs` with JSON:

```json
{ "source": "webhook", "message": "Need a battlecard vs Dentrix", "questionnaire": { "offer": "Dental scheduling app", "icp": "multi-location dental groups" } }
```

Returns the run id, status, quality and artifact list (or a `clarification` if W < 1.00). If `ENABLY_ACCESS_CODE` is set, send the `enably_access` cookie.
