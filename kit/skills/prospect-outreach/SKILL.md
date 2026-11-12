---
name: prospect-outreach
description: Master orchestrator for Patrick Diamitani's 6-step prospect automation workflow (Signal, Company, Contact, Research, Email, Outreach) adapted for Loadsmart's GTM stack (Salesforce, ZoomInfo, Clay, Perplexity/EDGAR, Claude, Gong/Apollo). Enforces Calibrated Truth and REQUIRE_APPROVAL=true.
---

# Prospect Outreach Orchestrator (6-Step Loadsmart Engine)

Master pipeline orchestrator connecting six deterministic prospecting stages into one repeatable, human-approved GTM workflow built for Loadsmart's AE/SDR pods across **Opendock**, **ShipperGuide TMS**, **Loadsmart AI**, and **Freight Services**.

## The 6-Step Architecture

| Step | Stage | Primary Skill | Loadsmart Stack Surface | Gate / Guardrail |
| :--- | :--- | :--- | :--- | :--- |
| **Step 1** | Signals | `prospect-step-1-signals` | FreightWaves, ZoomInfo Scoops, Job Boards, SEC EDGAR | URL + event date required; zero inferred signals |
| **Step 2** | Companies | `prospect-step-2-companies` | Salesforce CRM Collision Shield (`Account`, `Opportunity`) | Quarantine active customers & open opportunities |
| **Step 3** | Contacts | `prospect-step-3-contacts` | ZoomInfo + Clay Enrichment Waterfall (Apollo -> Hunter -> Prospeo) | Verified email status required before research |
| **Step 4** | Research | `prospect-step-4-research` | Perplexity, 10-K/Earnings, Warehouse Network Maps | Evidence Ledger check; unknown metrics remain `null` |
| **Step 5** | Email | `prospect-step-5-email` | Claude AI (`claude-sonnet`) + `claims-library.md` | <= 90 words, PAS structure, verified claims only |
| **Step 6** | Outreach | `prospect-step-6-outreach` | Gong Engage / Apollo Multi-Channel + Slack Approval | `REQUIRE_APPROVAL = true` & `dry_run = true` default |

## Execution Sequence

1. **Validate Run Scope**: Confirm `pod_id` (Pod 1–4), target product (`Opendock` | `ShipperGuide` | `Loadsmart AI`), daily account cap (`20`), and suppression list currency.
2. **Execute Steps 1–5 (Read & Draft Only)**: Gather sourced signals, filter out CRM collisions, enrich 3–5 buying committee personas per cleared account, compile sourced briefs, and draft Touch 1–3 emails + LinkedIn/phone openers.
3. **Run Calibrated Truth & Linter Gate**:
   - Every factual claim in copy matches a row in `knowledge/loadsmart/claims-library.md` or a retrieved source URL from Step 4.
   - Check spam words, em-dash overuse, unverified percentages, and product separation rules.
4. **Pause at Step 6 Approval Gate**: Present batch summary in Slack (`#gtm-pod-approvals`) or Pod Copilot drawer. Never enroll or send without explicit human sign-off.

## Non-Negotiable Ground Rules

- Never write to Salesforce or enroll in Gong/Apollo when `dry_run = true`.
- Never mix Carrier-side products (CarrierGuide, Loadboard) into Enterprise Shipper pod sequences.
- Never fabricate customer logos, facility counts, or freight spend numbers.
