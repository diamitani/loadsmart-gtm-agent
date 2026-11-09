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
2. **SQL Editor → New query** → paste all of `supabase/migrations/0001_enably_gtm.sql` → **Run**. Then run `0002_sales_activity.sql`, `0003_restrict_membership_fn.sql` and `0004_billing.sql` the same way, in order.
3. **Settings → API**: copy the Project URL and the `service_role` key into Vercel as `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. (The service-role key is secret — server only. Never put it in a `NEXT_PUBLIC_` variable.)
4. Redeploy. **Settings** in the app should show *Database: Supabase Postgres*.

## 2b. Credits & bring-your-own-key (BYOK)

Two ways for people to use the Architect's AI:

- **Their own key (BYOK)** — on **Credits & keys** (`/app/billing`) a user pastes an Anthropic, OpenAI or Vercel AI Gateway key. It is encrypted at rest with AES-256-GCM (`BYOK_ENCRYPTION_KEY`, bound to their account id), decrypted only on the server to call their provider, never returned to the browser and never logged. Their calls use no credits.
- **Credits** — everyone else uses the house key (AI Gateway / Anthropic). Each model call reserves `ENABLY_CREDITS_PER_CALL` credits up front (atomic, can't go negative) and refunds them if the call fails. With no credits, builds still run from templates and chat explains how to buy credits or add a key.

Accounts are per browser: a signed, httpOnly `enably_acct` cookie issued by `proxy.ts`. The account id is also the user's **recovery code** (shown on the page) to restore credits and key on another device.

Setup:

1. Add `BYOK_ENCRYPTION_KEY` (`openssl rand -base64 32`) to Vercel. Keep it stable — rotating it invalidates saved keys and cookies.
2. Run `supabase/migrations/0004_billing.sql` in Supabase (accounts, `credit_ledger`, `byok_keys`, and the `enably_grant_credits` / `enably_consume_credits` functions). Without Supabase on Vercel, credits and keys live in memory — so **purchases stay switched off** until the database is connected.
3. Stripe: add `STRIPE_SECRET_KEY` (Developers → API keys). Then **Developers → Webhooks → Add endpoint** `https://<your-app>/api/billing/webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`, and add its signing secret as `STRIPE_WEBHOOK_SECRET`. Credits are granted only by that verified webhook, once per Checkout Session.
4. Optional: `ENABLY_CREDIT_PACKS` (JSON, inline prices or Stripe `priceId`s), `ENABLY_FREE_CREDITS` (keep `0` on a public site), `ENABLY_BILLING=off` to make the house key free for everyone with access.

Notes:
- `ENABLY_ACCESS_CODE` still gates the whole app. Conversations, Library and Knowledge are **shared across the workspace** — credits and keys are per user, but data is not yet. Keep the access code on until per-user workspaces (Supabase Auth) land.
- `POST /api/runs` follows the same rules as chat (caller's key or credits). Server-to-server automations can send `Authorization: Bearer $ENABLY_MCP_TOKEN` to use the house key unmetered. `/api/mcp` and durable callbacks use the house key unmetered (they have their own secrets).
- Test locally with the Stripe CLI: `stripe listen --forward-to localhost:3000/api/billing/webhook` and use the printed `whsec_…`.

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
