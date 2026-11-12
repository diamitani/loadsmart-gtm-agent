# Team review (v0.1)

Pass run 2026-11-11 against the live local build (desktop 1400px and mobile 390px).

| Area | Finding | Status |
| --- | --- | --- |
| UI | Footer links wrapped on desktop | Fixed (nowrap) |
| UI | No favicon (404 in console) | Fixed (`app/icon.svg`) |
| UX | Copilot needed a clear "not connected to live data" stance so the panel doesn't read invented numbers | Done in the page copy, system prompt and acceptance tests |
| UX | Dashboard download button blocked in some hosted viewers | Template text also appears in the digest box |
| UX | Dashboard funnel mixed non-nested stages | Fixed earlier: outcome funnel + separate readiness bars with targets |
| Design | One type scale, HSL-free token set in `globals.css`, consistent cards and radii across pages | OK |
| Backend | Chat route: input caps, 20-message window, 6 tool steps, 1,800 output tokens, readable error | OK |
| Backend | Rate limit is in-memory per instance (best effort) | Known; durable limiter is v1.1 |
| Security | No secrets in repo or client; `/api/health` reports booleans only; pipeline endpoint bearer-protected | OK |
| Security | Copilot tools are read-only; no send/write capability exists in v0.1 | OK |
| Database | Supabase schema has RLS on every table; server-only inserts for runs/approvals; idempotency key | OK (not connected) |
| QA | All routes return 200; no runtime errors except the favicon (fixed); CSV import verified | OK |
| Accessibility | Labeled chat input, aria-live on messages, focus-visible rings, keyboard-usable nav | OK; full WCAG audit not run |
| Scale | Static pages + one serverless route; free tiers fine for a demo | OK |
| Funnel | Landing → playbook / copilot / dashboard in one click; download in the nav | OK |

## Open items

1. Verify the copilot on the live Vercel URL (needs AI Gateway credits or an `ANTHROPIC_API_KEY`).
2. Connect n8n/Make + Salesforce in a Loadsmart sandbox before any live step.
3. Swap the in-memory rate limiter for a durable one before wider sharing.
