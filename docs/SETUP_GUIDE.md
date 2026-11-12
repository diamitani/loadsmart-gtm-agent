# Setup guide (no coding needed)

## 1. Run it on Vercel

1. Push this repo to GitHub (already done for `loadsmart-abm-os`).
2. In Vercel: **Add New → Project → Import** the repo. Framework: Next.js. Click **Deploy**.
3. Open `https://<your-project>.vercel.app/api/health`. You should see `"model": "gateway:anthropic/claude-sonnet-5.5"`.
4. Open `/copilot` and ask: "Write a LinkedIn note for a DC ops manager at a shipper opening a new site." If you get an answer, the agent works.

**If the copilot shows "couldn't reach its model":** the AI Gateway needs credits or billing on your Vercel team. Either:
- Vercel → **AI Gateway** → check credits/billing, then redeploy, or
- Vercel → Project → **Settings → Environment Variables** → add `ANTHROPIC_API_KEY` (from console.anthropic.com) for Production → **Redeploy**.

## 2. Optional: the scheduler (Cloudflare)

Only needed when you want the daily pipeline to fire on time.

1. Make up a long random password and add it in Vercel as `CRON_SECRET` (Production), then redeploy.
2. In a terminal: `cd apps/edge`, then `npx wrangler login`.
3. Edit `wrangler.toml`: set `APP_URL` to your Vercel URL.
4. `npx wrangler secret put CRON_SECRET` and paste the same password.
5. `npx wrangler deploy`. Test: `curl -X POST https://<worker>.workers.dev/run/la-signal -H "authorization: Bearer <password>"` should return `ran la-signal`.

In v0.1 the pipeline endpoint is dry-run: it confirms the step and returns what it would do. Live steps go in n8n/Make in v1.1.

## 3. Optional: Supabase (v1.1)

1. Create a Supabase project → **SQL Editor** → run `supabase/migrations/0001_abm_os.sql`.
2. Test RLS with two users in different pods: neither should see the other's runs, approvals or feedback.
3. Add the three Supabase variables from `.env.example` to Vercel.

## Common issues

| Problem | Fix |
| --- | --- |
| Build fails on Vercel | Check the build log; run `npm run build` locally to reproduce |
| `/api/health` shows the wrong model | Check which of `ANTHROPIC_API_KEY` / `AI_MODEL` is set in Vercel env |
| Dashboard template button does nothing | Some viewers block downloads; the template text appears in the digest box to copy |
| Chat says rate limit reached | Raise `CHAT_RATE_LIMIT_PER_HOUR` or wait an hour |
