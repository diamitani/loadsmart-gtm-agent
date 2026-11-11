# Loadsmart Live GTM Sovereign Agent Operating System

**The Autonomous GTM Command Center & Prospect Automation Engine for Loadsmart's Hybrid AE/SDR Pods.**  
Built by **Patrick Diamitani (Enably / SalesGency)** · November 2026.

Governed by **Site Empire OS** · **PAL Framework (W=1.00)** · **Vercel AI SDK v7** · **Cloudflare Durable Agents** · **Next.js 16** · **Tailwind CSS**.

---

## What It Does

Loadsmart AE/SDR pods execute an account-based selling motion across three distinct product offerings:
1. **ShipperGuide (TMS):** Enterprise transportation management for procurement, execution, and tracking.
2. **Opendock:** Dock appointment scheduling and yard management for manufacturing plants and distribution centers (4,500+ warehouses).
3. **Loadsmart AI:** 11 autonomous logistics agents handling spot quotes, tracking, and carrier vetting backed by Freight Experts.
4. **Freight Brokerage & Multimodal:** Dedicated truckload (FTL), LTL, drayage, and private fleet optimization.

This operating system automates the **deterministic 10-step daily pipeline** (06:00 Signal Scout to 17:00 Daily Leak Digest) while keeping buyers strictly segregated, claims 100% verified against the official claims library, and every send protected by human-in-the-loop signoff.

---

## Key Features

- **Live ABM Pod Dashboard (`/dashboard`):** Real-time multi-pod switcher (Pod 1 FTL, Pod 2 ShipperGuide TMS, Pod 3 Opendock, Pod 4 Loadsmart AI), conversion funnel progression, stuck accounts triage with 1-click unblock, and secondary mailbox deliverability tracking.
- **Real-Time GTM Copilot (`/copilot`):** Vercel AI SDK v7 streaming assistant with tools (`nominateAccounts`, `auditCRM`, `enrichContacts`, `generatePASCopy`, `checkMailboxHealth`, `stageSequence`, `runLeakReport`) and a live human review drawer.
- **10-Step Deterministic Pod Engine (`/pipeline`):** Chronological pipeline controller (`la-signal` -> `la-crm-audit` -> `la-abm-tag` -> `la-persona-enrich` -> `la-research` -> `la-email` -> `la-sequence` -> `la-daily-report`).
- **Interactive Sales Playbook v2 (`/playbook`):** Full Loadsmart Playbook v2, buyer personas (VP Logistics, DC Director, CIO), battlecards vs Oracle/Manhattan, cold call openers, objection handling, and approved claims library.
- **Production Automation Blueprints (`/automations`):** Ready-to-run n8n workflow JSONs, Clay waterfall enrichment schema, and Salesforce custom field mappings.
- **Site Empire OS Document Suite (`docs/`):** Complete 25-document canonical architectural specification from `01-intent-spec.md` to `25-evidence.md`.

---

## Quick Start (No API Keys Required)

The system includes a zero-friction demo mode with Loadsmart benchmark data so it runs cleanly out-of-the-box:

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open executive command center
open http://localhost:3000
```

---

## Connecting Production AI & Integrations

Create `.env.local` based on `.env.example`:

| Key | Purpose |
|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini 2.5 / Flash (Fast multimodal reasoning & tool calling) |
| `ANTHROPIC_API_KEY` | Claude 3.5 Sonnet (GTM synthesis) |
| `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | Production Supabase Postgres with RLS |
| `N8N_WEBHOOK_URL` | Webhook dispatch to n8n workflows |
| `GONG_WEBHOOK_URL` | Staged sequence enrollment in Gong Engage |

---

## Repository Architecture

```text
app/
  page.tsx               # Executive Mission Overview & Pod Hub
  layout.tsx             # Theme, Navigation, System Status Badge
  dashboard/page.tsx     # Interactive ABM Pod Dashboard
  copilot/page.tsx       # Live Multi-Agent GTM Copilot Chat & Approval Drawer
  pipeline/page.tsx      # 10-Step Deterministic Pipeline Engine
  playbook/page.tsx      # Loadsmart Sales Playbook v2 & Battlecards
  automations/page.tsx   # n8n Workflows, Clay Schemas & Salesforce DDL
  settings/page.tsx      # Mailbox Deliverability & API Settings
  api/
    chat/route.ts        # Vercel AI SDK v7 streaming endpoint
    pods/route.ts        # Pod metrics, funnels, accounts, mailboxes
    pipeline/route.ts    # Pipeline stage execution runner
    automations/route.ts # n8n and Clay blueprint loader
    health/route.ts      # Health probe and gateway status
automations/             # Downloadable n8n workflows and Clay schemas
docs/                    # 25 Site Empire OS documents (01-25)
knowledge/               # Loadsmart Playbook v2, ICP, Personas, Claims Library
lib/
  agent/                 # AI models, prompt, and tool definitions
  data/                  # Initial Loadsmart pod seed datasets
  db/                    # Dual-tier persistence (Local JSON + Supabase)
  types.ts               # Complete TypeScript domain interfaces
```

---

## Governance & Safety Invariants

1. **One Must Act ($W = 1.00$):** No outreach is drafted or sequenced unless account, persona, and system-of-record are fully known.
2. **Zero Hallucination:** Every statistic, customer metric, and proof point cited by the AI is strictly validated against `knowledge/claims-library.md`.
3. **Human-in-the-Loop Signoff:** Reps retain absolute authorization over all external sequence enrollments and CRM writes.
4. **Deliverability Protection:** Secondary mailboxes capped at 40/day with automatic pause if bounce rates exceed 2.0%.
