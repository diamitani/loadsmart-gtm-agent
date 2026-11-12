# Loadsmart Live GTM Sovereign Agent OS

**The internal Account-Based Selling (ABM) engine and Pod Copilot for Loadsmart.**

Built for Loadsmart's hybrid AE/SDR pods, RevOps, and sales leadership. Standardizes the daily journey from signal to sequenced outreach across four dedicated product lines:
1. **Opendock**: Dock appointment scheduling and yard management for multi-facility warehouse operators and 3PLs (4,500+ warehouses, 14M+ appointments).
2. **ShipperGuide**: Enterprise cloud TMS for freight planning, spot procurement, routing guides, and track & trace (shippers spending $10M–$150M+).
3. **Loadsmart AI**: 11 autonomous freight agents handling repetitive spot quotes, tracking, and carrier vetting inside existing shipper systems, backed by human Freight Experts.
4. **Freight Services**: Full Truckload (Dry Van, Reefer, Flatbed), LTL, and multimodal brokerage backed by 230,000+ vetted carriers.

Built on **Next.js 16 (App Router)** · **Vercel AI SDK v7** · **Google Gemini 2.5 Pro & Claude 3.7** · **Cloudflare Agents** (durable runs) · **LangSmith** (tracing + evals) · **Supabase Postgres + RLS**.

---

## What's inside this repository

| Directory | Contents |
|---|---|
| `app/` | Next.js App Router: Pod Copilot (`/app`), Daily Pipeline (`/app/pipeline`), Pod Dashboard (`/app/dashboard`), Products & Personas (`/app/products`), Playbook v2 (`/app/playbook`), Skills (`/app/agents`), BYOK (`/app/billing`) |
| `app/api/` | Secure server routes: `/api/chat`, `/api/pods`, `/api/pipeline`, `/api/byok`, `/api/billing`, `/api/artifacts`, `/api/knowledge`, `/api/mcp` |
| `agent/skills/loadsmart/` | 11 Loadsmart ABM Skills (`la-signal`, `la-crm-audit`, `la-abm-tag`, `la-persona-enrich`, `la-research`, `la-email`, `la-sequence`, `la-daily-report`, `la-list-qa`, `la-pod-feedback`, `loadsmart-abm-orchestrator`) |
| `docs/loadsmart/` | `Loadsmart_Sales_Playbookv2.md` (31 sections), `loadsmart-abm-os-README.md`, `PAL-agent-setup-guide.md`, and PDF library |
| `docs/loadsmart/specs/` | Complete Site Empire OS specification set (01-intent-spec through 25-evidence) |
| `knowledge/loadsmart/` | YAML configs: `icp.yaml`, `personas.yaml`, `pods.yaml`, `salesforce-fields.md`, `schedule.yaml`, `sending.yaml`, `claims-library.md`, `body-patterns.md` |
| `public/downloads/` | `loadsmart-abm-os.zip` (ready-to-run skill pack for Claude.ai or internal distribution) |
| `public/dashboards/` | Standalone client-side HTML dashboards (`loadsmart-abm-pod-dashboard.html`, `loadsmart-pod-dashboard.html`) |
| `templates/loadsmart/` | `dashboard-import-template.csv`, `disqualification-reason-codes.csv` |

---

## The Daily ABM Pipeline (06:00 to 17:00 CT)

| Time (CT) | Skill | Action |
|---|---|---|
| **Daily 06:00** | `la-signal` | Dated, sourced why-now signals (tender rejections, warehouse expansions) mapped to products |
| **06:30** | `la-crm-audit` | Evaluates domains against Salesforce CRM shield; parks colliding accounts |
| **Weekly Mon 07:00** | `la-abm-tag` | Allocates 20 target accounts per pod with written fit rationale approved by RevOps |
| **Daily 07:15** | `la-persona-enrich` | Clay waterfall discovery for verified logistics, warehousing, and transportation leaders |
| **Daily 07:45** | `la-research` | 6-part sourced account briefs separating confirmed facts from AI inference |
| **Daily 08:15** | `la-email` | 1-to-1 PAS cold email touchpoints synthesized with 100% claims compliance |
| **Daily 08:30** | `la-sequence` | Human batch approval drawer: pod confirms enrollments into Gong Engage or Apollo |
| **Daily 17:00** | `la-daily-report` | End-of-day conversion funnel digest, leak flag identification, and rep scorecards |

---

## Operating Invariants & Ground Rules

1. **REQUIRE_APPROVAL = true:** Zero blind sends. Nothing in outbound (emails, calls, sequence enrollments) or CRM writes executes without explicit human batch approval.
2. **Verified Claims Library:** No hallucinated metrics or fabricated customer references. Claims adhere strictly to Loadsmart's approved claims library (1,800 global customers, 4,500 warehouses, 230,000 vetted carriers, 14M+ appointments, SOC 2 Type II).
3. **Product Boundaries:** Keep Opendock (dock/yard), ShipperGuide (transportation/TMS), and Loadsmart AI (operations) to their respective buyer personas. Cross-product touches are strictly capped.
4. **CRM Collision Shield:** Accounts with active opportunities or existing customer contracts are flagged and parked.

---

## Quickstart

### 1. Install dependencies
```bash
npm install
```

### 2. Run local development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the Loadsmart GTM Sovereign Agent OS.

### 3. Build & Verify
```bash
npm run build
```

### 4. Configure Environment
Copy `.env.example` to `.env.local` to enable Gemini 2.5 Pro, Claude 3.7, BYOK encryption, Salesforce/HubSpot connectors, or LangSmith observability.

---

## Authors & Origin
- **Architected by:** Patrick Diamitani (Diamitani Industries, Inc. / Enably / SalesGency)
- **Built for:** Loadsmart Inc. Revenue Operations & Enablement
- **System Standard:** Site Empire OS · SDLC × PAL × AWS Well-Architected Framework
