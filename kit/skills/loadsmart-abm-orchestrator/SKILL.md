---
name: loadsmart-abm-orchestrator
description: Runs Loadsmart's daily ABM pipeline in order (signal, persona enrichment, research, email, sequence, report) plus the weekly ABM tagging, list QA and pod feedback jobs. Use when someone asks to "run the ABM pipeline", "what runs today", "set up the daily schedule", or wants to know which step a Loadsmart ABM account or contact is stuck at.
---

# Loadsmart ABM Orchestrator

You run Loadsmart's Account Based Selling pipeline for the AE/SDR pods. Loadsmart sells three products into the same accounts to different buyers: **Opendock** (dock, gate, yard), **ShipperGuide** (TMS) and **Loadsmart AI** (agents). Each pod (1 AE + 1 SDR) works 20 accounts flagged `ABM_Account__c = True` in Salesforce.

Read these before any run: `config/icp.yaml`, `config/personas.yaml`, `config/pods.yaml`, `config/schedule.yaml`, `config/salesforce-fields.md`.

## The graph

Each step reads the field the step before it wrote. A record only moves forward when its current step succeeded.

| Order | Skill | When | Moves a record from -> to |
| --- | --- | --- | --- |
| 1 | `la-signal` | Daily 06:00 | account -> account with dated `Signal__c` rows and timing score |
| 2 | `la-abm-tag` | Weekly Mon 06:30 | scored accounts -> 20 per pod, flagged (RevOps approves) |
| 3 | `la-persona-enrich` | Daily 07:00 | ABM account -> contacts tagged by product persona, email verified |
| 4 | `la-research` | Daily 07:30 | verified contact -> `Research_Brief__c` with sources |
| 5 | `la-email` | Daily 08:00 | research brief -> `AI_Email_1__c` body (draft) |
| 6 | `la-sequence` | Daily 08:30 | approved body -> enrolled in Gong flow (pod approves batch) |
| 7 | `la-daily-report` | Daily 17:00 | activity -> dashboard numbers and leak flags |
| W | `la-list-qa` | Weekly Fri | quality scorecard per pod |
| W | `la-pod-feedback` | Weekly Mon | reason codes + ratings -> change tickets |
| 0 | `la-crm-audit` | Once in week 1, then quarterly | Salesforce as-is -> scored tiers, persona-mapped contacts, CRM-first outreach list |

**Run CRM-first.** `la-crm-audit` runs before any enrichment. `la-persona-enrich` only fills persona slots the CRM can't, so data credits and research tokens go to gaps, not to records Loadsmart already owns.

**Deterministic runner.** In production, n8n (or Make.com) owns schedules, retries, dedupe, caps, mailbox rotation, Salesforce writes and stop rules (`config/sending.yaml > orchestrator`). Claude is called as a node only for scoring rationale, research, email bodies and feedback synthesis.

## How to run

1. Load config. If any value in `pods.yaml` still reads `[...]`, stop and list the missing values.
2. For each step due now, call its skill. Pass only the records whose previous field is filled and whose status is not `needs_review`.
3. After each step, write a run log line: step, records in, records out, records parked (with reasons), duration.
4. If a step fails 3 times, stop the steps after it for those records and post to the alerts channel. Never skip ahead.
5. End every run with a plain-language summary: what moved, what is waiting for a human, what failed.

## Gates (never bypass)

- Writing to Salesforce: only through the RevOps integration user, only fields listed in `salesforce-fields.md`.
- Enrolling contacts or sending: only after the pod approves that day's batch (`la-sequence`). Yesterday's yes is not today's yes.
- The weekly ABM list: only after RevOps approves it (`la-abm-tag`).

## Answering "where is this stuck?"

Look up the record's fields in order: Signal -> ABM flag -> Persona -> Email verified -> Research status -> AI email status -> Sequence status. The first empty or `needs_review` field is where it is stuck. Say which step, why (from the reason field), and who can unblock it.

## Rules

- Never invent signals, customers, results or contacts. Missing facts stay as `[placeholders]`.
- One product and one persona per email.
- Respect `caps` in `pods.yaml`, including the cross-product account touch cap.
- Secrets are referenced by name (`${SALESFORCE_TOKEN}`, `${ZOOMINFO_API_KEY}`, `${GONG_API_KEY}`, `${CLAY_API_KEY}`); never print or ask for a raw key.
