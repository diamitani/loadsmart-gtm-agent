---
artifact_type: stack-adr
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: eng
reviewers: [architect, operator]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.99
---

# 11. Architectural Decision Records (ADR): Technology Stack

## ADR-01: Framework Selection — Next.js 16 (App Router)
- **Decision:** Use Next.js 16 with React 19 and Server-Sent Events (SSE) streaming.
- **Context:** Requires enterprise-grade performance, Vercel native edge deployment, server actions, and seamless integration with the Vercel AI SDK.
- **Alternatives Considered:** Remix (lacks direct Vercel AI SDK first-party ergonomics), Vite SPA (requires separate backend server).
- **Consequences:** Instant deploys, optimized server components, unified codebase for API and UI.

## ADR-02: AI Brain — Vercel AI SDK v7 with Multi-Model Routing
- **Decision:** Standardize on Vercel AI SDK v7 (`ai`, `@ai-sdk/google`, `@ai-sdk/anthropic`, `@ai-sdk/openai`).
- **Context:** Loadsmart GTM operations require low-latency streaming for the Copilot and high reasoning capacity for research synthesis.
- **Model Hierarchy:**
  1. Primary: Google Gemini 2.5 / 1.5 Pro via `@ai-sdk/google` (high context, rapid tool calling).
  2. Fallback / Alternative: Anthropic Claude 3.5 Sonnet via `@ai-sdk/anthropic`.
  3. Offline / Zero-Key Mode: Deterministic mock generator yielding real Loadsmart pod artifacts.
- **Consequences:** Resilience against upstream provider outages or rate limits.

## ADR-03: Persistence Strategy — Dual-Tier Local/Supabase
- **Decision:** Implement a dual-tier persistence layer: local file JSON storage (`.data/loadsmart-gtm.json`) for instant preview and dev, with automated Supabase client activation when environment variables are supplied.
- **Context:** Avoids blocking local development on external database credentials while providing enterprise RLS in production.
- **Consequences:** Frictionless developer onboarding; clean production scaling.

## ADR-04: Workflow Engine — Decoupled n8n & Webhooks
- **Decision:** Ship production-ready n8n workflow blueprints and provide a standard webhook dispatch layer.
- **Context:** Reps and RevOps need visual, auditable workflow execution for complex multi-tool enrichment without embedding brittle proprietary scrapers inside Next.js.
- **Consequences:** Clear operational separation between agent intelligence (Next.js) and external infrastructure (n8n, Salesforce, Gong).
