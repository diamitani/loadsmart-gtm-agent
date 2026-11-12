---
artifact_type: user-stories
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: product
reviewers: [operator, gtm-lead, qa]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.98
---

# 03. Canonical User Stories: Loadsmart GTM Agent OS

## US-01: Pod Dashboard Overview
- **As an** SDR or AE,
- **I want** to see an executive overview of my assigned pod (target accounts, stage in sequence, meetings booked, and mailbox health),
- **So that** I know exactly what needs my attention at the start of my day.
- **Acceptance Criteria:**
  - Given I am on the `/dashboard` route,
  - When I toggle the Pod Selector dropdown,
  - Then all KPI metrics, funnel charts, and stuck accounts dynamically filter to the selected pod.

## US-02: Live Copilot Signal & Account Nomination
- **As an** SDR,
- **I want** to ask the Copilot to nominate 20 accounts based on recent freight signals,
- **So that** I don't waste time manual prospecting in LinkedIn or ZoomInfo.
- **Acceptance Criteria:**
  - Given I am chatting with the Copilot on `/copilot`,
  - When I ask "Nominate 20 enterprise accounts for ShipperGuide",
  - Then the Copilot calls `nominateAccounts`, displays the candidate list with ICP scores and buying triggers, and provides an approval drawer.

## US-03: CRM Deduplication & Shield
- **As a** RevOps Manager,
- **I want** the system to block any nominated account currently active in Salesforce,
- **So that** outbound outreach never conflicts with existing enterprise deals.
- **Acceptance Criteria:**
  - Given an account is evaluated during the daily ingest,
  - When the CRM Shield tool runs,
  - Then accounts with active opportunities or designated "Customer" status are flagged as `PARKED_CRM_COLLISION` with the existing AE named.

## US-04: Waterfall Contact Reveal & Enrichment
- **As an** SDR,
- **I want** the system to uncover verified email addresses and direct phone numbers for designated buyer personas (e.g. VP Logistics, Transportation Director),
- **So that** my outreach actually reaches decision-makers.
- **Acceptance Criteria:**
  - Given an account is nominated and cleared by CRM Shield,
  - When the contact enrichment step triggers,
  - Then verified contacts are added with validation status (`VERIFIED`, `CATCH_ALL`, `INVALID`), and emails with > 5% bounce risk are excluded.

## US-05: PAS 1-to-1 Copy Generation with Claims Guard
- **As an** SDR,
- **I want** 3 customized email touchpoints drafted per contact based on the Problem-Agitate-Solution framework,
- **So that** the messaging speaks directly to their pains without hallucinated customer logos or fake ROI statistics.
- **Acceptance Criteria:**
  - Given a contact has complete persona and system-of-record metadata ($W = 1.00$),
  - When the copywriter agent generates the draft,
  - Then every claim maps to `knowledge/claims-library.md`, and any missing piece is surfaced as an explicit `[placeholder]`.

## US-06: Human-in-the-Loop Sequence Staging
- **As an** AE or SDR Pod,
- **I want** to review, edit, and approve email copy and multichannel steps before enrollment,
- **So that** nothing is ever sent without human authorization.
- **Acceptance Criteria:**
  - Given copy has been generated,
  - When I click "Approve Batch" in the review drawer,
  - Then the status updates to `STAGE_READY_FOR_SEQUENCE` and dispatches payload to the sequencer webhook (Gong/Amplemarket).

## US-07: Mailbox Health Sentinel
- **As an** Operator / RevOps Lead,
- **I want** real-time monitoring of secondary domain health, warm-up status, daily send counts, and bounce rates,
- **So that** domain reputation is preserved and sending throttles are enacted automatically if bounce rates exceed 2%.
- **Acceptance Criteria:**
  - Given 5 mailboxes per rep are configured,
  - When a mailbox reaches its daily cap (e.g. 40 sends),
  - Then the system routes further sends to healthy mailboxes in rotation.

## US-08: Leak Detection & Daily Reporting
- **As a** Sales Director,
- **I want** an end-of-day summary detailing account drop-offs, stuck accounts, and conversion rates,
- **So that** coaching and pipeline repairs happen on the same day.
- **Acceptance Criteria:**
  - Given the daily pipeline completes at 17:00,
  - When `la-daily-report` executes,
  - Then a diagnostic report is rendered with counts by disqualification code (`NO_FREIGHT_SPEND`, `INVALID_EMAIL`, `NO_REPLY_14D`).
