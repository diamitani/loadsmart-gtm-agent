---
artifact_type: backend-infra
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: eng
reviewers: [architect, operator]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.99
---

# 15. Backend & Infrastructure Specifications

## 1. Hosting & Runtime Topology
- **Primary Hosting:** Vercel Serverless Edge Platform (Global Anycast Network).
- **Node Runtime:** Node.js 20+ (standalone output build).
- **Edge Routing:** Next.js App Router route handlers with streaming SSE responses.
- **Durable Worker Layer (Optional):** Cloudflare Workers / Durable Objects client configured via `CF_AGENT_URL` for stateful batch tasks exceeding 60-second timeouts.

## 2. Secrets Management & Environment Isolation
- Secrets are never checked into Git, displayed in chat transcripts, or rendered into client bundles.
- Environment variables:
  - `GOOGLE_GENERATIVE_AI_API_KEY`: Google Gemini API key.
  - `ANTHROPIC_API_KEY`: Anthropic Claude API key.
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`: Supabase database credentials.
  - `N8N_WEBHOOK_URL`: n8n dispatch endpoint.
- Local development automatically defaults to `.data/loadsmart-gtm.json` with zero keys required.

## 3. Deployment Configuration (`vercel.json`)
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs"
}
```
Deployment triggered via Vercel GitHub integration upon commits pushed to `main`.
