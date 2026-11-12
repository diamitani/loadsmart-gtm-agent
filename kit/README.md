# Loadsmart ABM OS

A ready-to-run kit for Loadsmart's AE/SDR Account Based Selling pods: one daily pipeline from signal to sequenced outreach, three products (Opendock, ShipperGuide, Loadsmart AI) kept to their own buyers, approval gates on every send and CRM write, and a dashboard that shows where the program leaks.

Built by Patrick Diamitani, November 2026. The full playbook (ICP, personas, messaging, cadences, KPIs, rhythm) is the companion doc.

## What's inside

| Folder | What it is |
| --- | --- |
| `skills/` | 11 skills, one per pipeline step, plus an orchestrator |
| `skills-zips/` | The same skills zipped one per file, ready to upload to claude.ai (Settings > Capabilities > Skills) |
| `config/` | ICP, persona map, pods and caps, sending and dialer setup, daily schedule, Salesforce fields |
| `agent/` | Pod Copilot system prompt (Claude Project or any agent) and `CLAUDE.md` for Claude Code |
| `dashboard/index.html` | Pod dashboard. Opens in any browser; import the daily CSV; nothing leaves the browser |
| `templates/` | Dashboard CSV template, disqualification reason codes |

## The pipeline

| When | Skill | Does |
| --- | --- | --- |
| Week 1, once | `la-crm-audit` | Inventories and ICP-scores the existing CRM so outreach starts from what Loadsmart owns |
| Daily 06:00 | `la-signal` | Dated, sourced why-now signals mapped to a product |
| Weekly Mon | `la-abm-tag` | 20 accounts per pod with written scores (RevOps approves) |
| Daily 07:00 | `la-persona-enrich` | Verified contacts per product persona, gaps only |
| Daily 07:30 | `la-research` | Sourced brief per contact |
| Daily 08:00 | `la-email` | Body-only emails 1-3, QA-checked |
| Daily 08:30 | `la-sequence` | Pod approves batch; Gong flow with email, dialer + voicemail drop, LinkedIn |
| Daily 17:00 | `la-daily-report` | Funnel, leak flags, digest |
| Weekly | `la-list-qa`, `la-pod-feedback` | Quality scorecard; rep feedback turned into shipped changes |

## Setup, in order (no coding)

1. **RevOps:** create the Salesforce fields in `config/salesforce-fields.md`.
2. **Fill the placeholders** in `config/` (anything in `[brackets]` or marked ASSUMPTION). Marketing fills `approved_proof_points` in `personas.yaml`.
3. **Sending:** buy secondary sending domains, create 5 inboxes per rep, set SPF/DKIM/DMARC, start warm-up on day 1 (2-3 weeks before any cold send). See `config/sending.yaml`.
4. **Orchestrator:** in n8n (or Make.com), create one scheduled workflow per row of `config/schedule.yaml`. Rule-based steps are workflow nodes; Claude is one node for research, copy and scoring rationale. Store keys in the tool's credential store, never in a config file.
5. **Skills:** upload the zips in `skills-zips/` to Claude, or point Claude Code at this folder (`agent/CLAUDE.md`).
6. **Copilot:** create a Claude Project, paste `agent/pod-copilot-system-prompt.md` into its instructions, add `config/` and `skills/` as knowledge.
7. **Run `la-crm-audit` first**, then a dry run of the daily pipeline with 3 accounts and nothing sent.
8. **Legal review** of cold email footer, voicemail drop and any Canadian contacts before going live.
9. **Dashboard:** open `dashboard/index.html`, click Import CSV and load the file `la-daily-report` produces.

## Ground rules

- Nothing sends, enrolls or writes to Salesforce without a human yes for that batch.
- Nothing in copy is invented. Missing facts stay as `[placeholders]`; website claims are used only once Marketing approves them.
- One product and one persona per email. Cross-product touches per account are capped.
- Thresholds in the skills are starting points; replace them with Loadsmart's 30-day baseline.
