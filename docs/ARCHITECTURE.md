# Architecture

```
                      ┌──────────────────────── Vercel (this repo) ────────────────────────┐
 Browser ───────────▶ │ Next.js 16 pages: / · /playbook · /skills · /dashboard · /copilot   │
                      │ /api/chat ── AI SDK 7 streamText ──▶ AI Gateway (OIDC) or Anthropic │
                      │      └─ read-only tools: playbook sections, skills, config          │
                      │ /api/pipeline/run (bearer CRON_SECRET, dry-run in v0.1)             │
                      └───────────────▲─────────────────────────────────────────────────────┘
                                      │ POST /api/pipeline/run?step=…
 Cloudflare Worker (apps/edge) ───────┘  cron: 06:00, 07:00, 07:30, 08:00, 08:30, 17:00 CT

 v1.1:  n8n / Make  ──▶ Salesforce (system of record) · Gong (flows, tasks) · ZoomInfo/Clay/Apollo
                    └─▶ Supabase (pipeline_runs, approvals, feedback; RLS per pod)
```

## Decisions (ADR summary)

| Decision | Why | Reverse by |
| --- | --- | --- |
| Agent is data: prompt + tools come from `kit/` and `agents/*.yaml` | One source of truth for the skills, the site and the copilot | Edit the YAML/markdown, rebuild |
| Kit bundled to JSON at build (`scripts/bundle-kit.mjs`) | Serverless functions read one file; no filesystem tracing surprises | Read files at runtime instead |
| Model via AI Gateway by default, Anthropic key overrides | No secret needed on Vercel; easy to switch providers | Set `ANTHROPIC_API_KEY` |
| Copilot tools are read-only | Public demo; external writes need approval gates and auth (v1.1) | Add gated tools with `needsApproval` once Supabase auth is on |
| Scheduler on Cloudflare, work in n8n/Make | Cron reliability and per-step retries; deterministic steps outside the model | Use Vercel Cron instead (`vercel.json` crons) |
| Dashboard is a self-contained HTML file | Works offline, downloadable, no data leaves the browser | Port to React + Supabase feed (v1.2) |

## Security

- No secrets in the client or repo; `.env*` is git-ignored. `/api/health` reports only whether keys are set.
- `/api/pipeline/run` requires `Authorization: Bearer $CRON_SECRET`.
- Chat input capped (4,000 chars, last 20 messages), per-IP rate limit, output token cap.
- The copilot cannot send, enroll or write. Its prompt tells it to say when it lacks live data.
- Supabase schema has RLS on every table; inserts to runs/approvals are server-only (service role).

## Scale path

v0.1 is static pages + one serverless chat route, so it handles a demo audience on the free tiers. For a real rollout: Supabase auth and pod membership, n8n on a managed instance, idempotency keys per (step, pod, date) — already in the schema — and a durable rate limiter (Upstash or Vercel KV) instead of in-memory.
