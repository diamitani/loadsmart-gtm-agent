# Best practices combined from past Enably builds

This repo is the consolidation of eight earlier attempts. Here is what was kept, from where, and what was deliberately left behind.

| Source | What we kept | Where it lives now |
|---|---|---|
| `enablygtm` (this repo, v0) | PAL intake-to-build process, agent contracts, evidence ledger, run manifest, wizard workspace spec | `docs/pal-intake/`, `agent/agents/pal-process/`, `agent/references/pal-process/`; the wizard spec became the chat + run inspector UI |
| `enablygtm` (v0) Python | OpenClaw / Azure / OpenCode bootstrap and GTM metric helpers | `legacy/python/` (fixed a duplicate `[project]` table so its 14 tests run again) |
| `Enably1/enably-web` | Vercel AI SDK chat route, senior-strategist voice, "give the actual thing" rule, assistant-ui patterns | `agent/instructions/system.md`, `app/api/chat/route.ts` |
| `enably-gtm-os` | GTM Architect GPT instructions, Wizard spec (ICP, persona, email, DM, use case, USP generators), Enably Platform dashboard spec (Library, Knowledge, Assistants, API keys), ROSTRv2 orchestrator + artifact envelope + approval-token rule | Skills in `agent/skills/`, dashboard pages in `app/app/`, artifact provenance in `lib/pal/types.ts#Artifact` |
| `enably` (v0 app) | Dashboard sections: research, metrics, pipeline, assets | Runs, Library, Evals pages |
| `enably-sales-command-center` / `enably-a749cf29` | Supabase-backed lead + activity model, KPI scorecards | `supabase/migrations/`, KPI skill |
| Agent OS whitepaper (ROSTR) | One Must Act wholeness W, middle-out DAG compressor, latency watchdog, durable virtual actors, Calibrated Truth Protocol, POP 11-artifact guarantee | `lib/pal/*` — each implemented as tested code |
| Web App Development Process skill | 0 → 1 → 2–99 → 100, quality-gate weights, one-next-action rule, approval policy, harness directory layout | `lib/pal/quality-gate.ts`, `lib/pal/pop.ts#nextActionFor`, `agent/` |
| Prospector skill v0.3.0 | Signal-to-email prospecting with PAL protocol, scoring, approval-bound verification | `agent/skills/prospector/` |
| Enably SDR Assistant spec | 14 function schemas, Lean vs Advanced flows, accuracy > compliance > speed, confirm-before-send, audit every mutation | `agent/skills/sdr-assistant`, `lib/connectors/` |
| Sales Enablement Assistant instructions | Activity tracker, template rules (subject/body/placeholders), confirm CRM pushes, never simulate API calls | `agent/skills/sales-enablement`, `/app/activity` |
| ICP Architect GPT | 11-field ICP, one segment per ICP, JSON export, minimal/standard/enriched | `agent/skills/icp` |
| Enably PRD | Modular agents, knowledge base, integrations, success metrics | `docs/PRD-STATUS.md` |
| Sales Operations Setup Guide | 6-step sales-ops build incl. email DNS (SPF/DKIM/DMARC) + warm-up | `agent/skills/sales-ops-setup`, `sales_ops_plan` asset |
| n8n-engineer skill | Architecture decision order, MCP rules, 4 GTM starter workflows | `agent/skills/n8n-engineer/`, `agent/workflows/` |

## Engineering decisions

1. **Deterministic first, AI as a multiplier.** The PAL engine (`lib/pal`) has no AI dependency and is covered by unit tests. The model refines intent and writes assets; it never decides whether the foundation is complete.
2. **One storage interface, two drivers.** Local file store for zero-setup development; Supabase for production. Same `Store` interface (`lib/db/types.ts`).
3. **Structured streaming instead of opaque chat.** The chat streams typed `data-stage`, `data-artifact` and `data-run` parts, so the UI shows real pipeline state rather than parsing prose.
4. **Approvals are tool-level, not prompt-level.** `send_to_workflow` uses the AI SDK's `needsApproval`; the model cannot skip it.
5. **Durable work goes to Durable Objects.** Cloudflare Agents give each run an addressable actor with SQLite state, a scheduler and hibernation — the same "virtual actor" pattern the whitepaper describes with Dapr/Diagrid, without running a separate cluster.
6. **Tracing that can't break the app.** LangSmith `traceable` wraps each stage; with no key it's a pass-through.
7. **Honest metrics.** Plan compression is shown as an *estimate*; real durations are measured per stage. No benchmark numbers are claimed that this code hasn't measured.

## Left behind (on purpose)

- OpenAI Assistants API threads (deprecated pattern) → AI SDK UI messages persisted per conversation.
- The fantasy "wizard" voice → kept the guided, one-question-at-a-time interaction, dropped the theme for a tier-one professional look.
- Hard-coded provider keys in client code → server-only env (`lib/env.ts`).
