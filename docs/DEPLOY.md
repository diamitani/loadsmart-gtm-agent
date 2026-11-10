# Deploying Enably GTM Architect

Do these in order. Steps 1 and 2 (app + Supabase with sign-in) are required for a public deployment: **on Vercel the app stays closed ("Sign-in isn't configured") until Supabase Auth is connected.** Everything after that is optional.

## 1. Vercel (the app)

1. Push this repo to GitHub (already done if you're reading this there).
2. Go to **vercel.com → Add New → Project**, import `enablygtm`. Framework: Next.js (auto-detected). Click **Deploy**.
3. In the project: **Settings → Environment Variables**. Add at least:
   - The AI key: on Vercel, use **AI Gateway** through the project's OIDC token by setting `ENABLY_AI_GATEWAY_OIDC=1`, or add `AI_GATEWAY_API_KEY` / `ANTHROPIC_API_KEY`.
4. Do step 2 next — until Supabase is connected, every `/app` page shows *Sign-in isn't configured* and the APIs return 503.

## 2. Supabase (database + sign-in)

Users sign up and sign in at `/signup` and `/signin` with **Google** or **email + password** (Supabase Auth). Every `/app` page and every metered API requires a signed-in user; the landing page stays public. Each user's conversations, Library (runs + artifacts), Knowledge, credits and saved AI key are private to them.

### 2.1 Create the project and connect it to Vercel

1. Create a project at **supabase.com** — or, easiest, in Vercel: **enablygtm → Storage / Integrations → Supabase → Connect project**. The integration adds the variables below to the Vercel project automatically.
2. Otherwise add them by hand (**Supabase → Project Settings → API**, then **Vercel → enablygtm → Settings → Environment Variables**, Production + Preview):

| Variable | Value | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, `https://<project-ref>.supabase.co` | no |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` / publishable key (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` also works) | no — safe in the browser, protected by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` / secret key | **yes — server only, never `NEXT_PUBLIC_`** |
| `SUPABASE_URL` | optional; defaults to `NEXT_PUBLIC_SUPABASE_URL` | no |

### 2.2 Run the migrations

**SQL Editor → New query**, paste and **Run** each file in order:
`0001_enably_gtm.sql`, `0002_sales_activity.sql`, `0003_restrict_membership_fn.sql`, `0004_billing.sql`, `0005_auth_per_user.sql`.
(Or `supabase link --project-ref <ref> && supabase db push`.) They are safe to re-run.

`0005` adds a `user_id` (→ `auth.users`) to conversations, runs, artifacts and knowledge, and replaces the read policies with owner-only RLS. The server also filters every query by user. Rows created before sign-in existed have no owner and are hidden; to give them to your account run the `update … set user_id = …` snippet at the top of `0005_auth_per_user.sql` with your email.

### 2.3 Google sign-in

1. **Google Cloud Console → APIs & Services → OAuth consent screen**: External, app name "Enably", support email, authorized domains `supabase.co` and `salesgency.com`. Scopes: `openid`, `email`, `profile`. Publish the app (or add test users while in testing).
2. **Credentials → Create credentials → OAuth client ID → Web application**:
   - Authorized JavaScript origins: `https://enably.salesgency.com`, `https://enablygtm.vercel.app` (and `http://localhost:3000` for local dev)
   - Authorized redirect URI: **`https://<project-ref>.supabase.co/auth/v1/callback`** (shown in Supabase under Authentication → Sign In / Providers → Google as "Callback URL")
3. **Supabase → Authentication → Sign In / Providers → Google**: enable, paste the **Client ID** and **Client Secret**, save.

### 2.4 Redirect URLs

**Supabase → Authentication → URL Configuration**:

- **Site URL**: `https://enably.salesgency.com` (the production domain; used in confirmation emails)
- **Redirect URLs** (add each):
  - `https://enably.salesgency.com/auth/callback`
  - `https://enablygtm.vercel.app/auth/callback`
  - `https://enablygtm-*-gptpat.vercel.app/**` (Vercel preview deployments)
  - `http://localhost:3000/**` (local dev, optional)

### 2.5 Email sign-up

Email + password works out of the box. Supabase sends a confirmation email that links back to `/auth/callback`. Optional: for confirmations that work when opened on a different device, set **Authentication → Emails → Confirm signup** to link to `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/app`. For real traffic, configure custom SMTP (Supabase's built-in sender is rate limited).

### 2.6 Check it

Redeploy. Visit `/app` → you're sent to `/signin`; sign in with Google → you land in the app with your email and **Sign out** at the bottom of the sidebar. **Settings** should show *Sign-in (Supabase Auth)* and *Database: Supabase Postgres* as connected.

### Access code (optional, off by default)

`ENABLY_ACCESS_CODE` is no longer the gate. If set, signed-in users must *also* enter it (an invite-only extra layer). Leave it unset — or delete it from Vercel — for a normal public sign-up.

### Local development

With no Supabase variables, `next dev` signs everyone in as a local **dev user** (`dev@localhost`) so you can work without OAuth. `next start` locally needs `ENABLY_DEV_AUTH=1` for the same. The dev user is never used on Vercel (`VERCEL` / `VERCEL_ENV` set) — there the app stays closed until Supabase is configured.

## 2b. Credits & bring-your-own-key (BYOK)

Two ways for people to use the Architect's AI:

- **Their own key (BYOK)** — on **Credits & keys** (`/app/billing`) a user pastes an Anthropic, OpenAI or Vercel AI Gateway key. It is encrypted at rest with AES-256-GCM (`BYOK_ENCRYPTION_KEY`, bound to their account id), decrypted only on the server to call their provider, never returned to the browser and never logged. Their calls use no credits.
- **Credits** — everyone else uses the house key (AI Gateway / Anthropic). Each model call reserves `ENABLY_CREDITS_PER_CALL` credits up front (atomic, can't go negative) and refunds them if the call fails. With no credits, builds still run from templates and chat explains how to buy credits or add a key.

Accounts are the signed-in Supabase user: credits and the saved key follow the user to any device. (Accounts from the old per-browser recovery codes are not carried over.)

Setup:

1. Add `BYOK_ENCRYPTION_KEY` (`openssl rand -base64 32`) to Vercel. Keep it stable — rotating it invalidates saved keys.
2. Run `supabase/migrations/0004_billing.sql` in Supabase (accounts, `credit_ledger`, `byok_keys`, and the `enably_grant_credits` / `enably_consume_credits` functions). Without Supabase on Vercel, credits and keys live in memory — so **purchases stay switched off** until the database is connected.
3. Stripe: add `STRIPE_SECRET_KEY` (Developers → API keys). Then **Developers → Webhooks → Add endpoint** `https://<your-app>/api/billing/webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`, and add its signing secret as `STRIPE_WEBHOOK_SECRET`. Credits are granted only by that verified webhook, once per Checkout Session.
4. Optional: `ENABLY_CREDIT_PACKS` (JSON, inline prices or Stripe `priceId`s), `ENABLY_FREE_CREDITS` (keep `0` on a public site), `ENABLY_BILLING=off` to make the house key free for everyone with access.

Notes:
- Conversations, Library and Knowledge are per user. Activity logs, suppressions, audit and evals stay workspace-wide. `/api/mcp` (bearer `ENABLY_MCP_TOKEN`) is the workspace operator and sees all users' data — keep that token private.
- `POST /api/runs` follows the same rules as chat (caller's key or credits). Server-to-server automations can send `Authorization: Bearer $ENABLY_MCP_TOKEN` to use the house key unmetered. `/api/mcp` and durable callbacks use the house key unmetered (they have their own secrets).
- Test locally with the Stripe CLI: `stripe listen --forward-to localhost:3000/api/billing/webhook` and use the printed `whsec_…`.

## 2c. Custom domain (enably.salesgency.com)

The domain is attached to the Vercel project. `salesgency.com` DNS is hosted at GoDaddy (`ns73/ns74.domaincontrol.com`), so add one record there:

| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | `enably` | `db4a37c3e3a62a73.vercel-dns-017.com` (Vercel's project-specific target; `cname.vercel-dns.com` also works) | 1 hour |

Vercel issues the SSL certificate automatically once the record resolves. Then use `https://enably.salesgency.com` as the Supabase Site URL (§2.4).

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

Returns the run id, status, quality and artifact list (or a `clarification` if W < 1.00). Requires a signed-in session cookie (the run is saved to that user), or `Authorization: Bearer $ENABLY_MCP_TOKEN` for server-to-server automations (saved as a workspace run, visible via `/api/mcp`).
