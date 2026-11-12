# PRD: Loadsmart ABM OS (v0.1)

Owner: Patrick Diamitani · Status: v0.1 live demo · Updated: 2026-11-11

## One Must Act

- **100 (outcome):** Loadsmart's ABM pods produce more stage 2 opportunities per account worked, by product, with rep prep time under 15 minutes a day. Measured weekly from Salesforce and Gong once connected.
- **1 (foundation, this release):** a live site where Sales, Marketing and RevOps can read the full plan, download the skills, explore the dashboard with their own CSV, and ask the Pod Copilot questions grounded in the playbook.
- **Multipliers (later, in order):** n8n/Make orchestration with Salesforce + Gong (v1.1) → Supabase approvals and feedback log with pod login (v1.1) → live dashboard feed (v1.2) → copilot tools that read live pod state (v1.2).
- **0 (what exists):** Loadsmart's stack (Salesforce, Salesloft, Gong, ZoomInfo, Clay, Apollo, Sales Navigator, Claude), the current hybrid ABM motion, Patrick's prior intent-to-outreach and prospect pipelines.
- **Non-goals for v0.1:** sending email, writing to any CRM, storing customer data, user accounts.

## Users and jobs

| User | Job |
| --- | --- |
| AE / SDR in a pod | "When I start my day, I want my calls and LinkedIn touches ranked, so I sell all morning." |
| RevOps | "When reps disqualify accounts, I want the reason coded, so selection improves every week." |
| Marketing | "When copy goes out, I want it tied to one persona and an approved claim, so the brand stays credible." |
| Sales leadership | "When results move, I want to know which stage caused it, so I change the right thing." |

## Features (v0.1)

| Feature | Priority | Status |
| --- | --- | --- |
| Landing: thesis, pipeline, seven answers | P0 | Done |
| Playbook page with section nav | P0 | Done |
| Skills library + per-skill and full-kit downloads | P0 | Done |
| Pod dashboard with CSV import and labeled sample data | P0 | Done |
| Pod Copilot with read-only tools, rate limit, honest "not connected" answers | P0 | Done |
| Architecture page with live-vs-scaffolded status | P1 | Done |
| Agent spec (Agent Forge YAML) + A2A card | P1 | Done |
| Cloudflare cron scheduler + dry-run pipeline endpoint | P1 | Scaffolded |
| Supabase schema with RLS (runs, approvals, feedback) | P1 | Scaffolded |

## Success metrics for the demo

- The case panel can open every page on desktop and mobile without errors.
- The copilot answers the four acceptance tests in `agents/loadsmart-pod-copilot/agent.yaml` correctly.
- Nothing on the site presents an invented Loadsmart number as fact.

## Risks

| Risk | Mitigation |
| --- | --- |
| Public chat spends model budget | Per-IP rate limit, 20-message history cap, 1,800 output tokens, 6 tool steps |
| Model route not configured on deploy | `/api/health` shows the route; chat shows a plain error instead of failing silently |
| Readers mistake it for a Loadsmart property | Footer and headers state it is an independent proposal |
