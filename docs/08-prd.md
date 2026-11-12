---
artifact_type: prd
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: product
reviewers: [architect, gtm-lead, operator]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.99
---

# 08. Product Requirements Document (PRD): Loadsmart GTM Agent OS

## 1. Problem
Loadsmart AE/SDR pods operate across 3 different software products (ShipperGuide, Opendock, Loadsmart AI) without an automated daily pipeline. As a result, reps:
- Spend 4 hours/day prospecting manually in disparate tools.
- Pitch Opendock features to TMS buyers or vice versa.
- Damage secondary domain reputations by burning unverified emails.
- Lack actionable feedback on why accounts drop out of sequences.

## 2. Product Objectives & Desired Outcomes
1. **Automate the 10-Step Daily Engine:** Fully automate daily steps from 06:00 Signal Scout to 08:30 Copy Staging for 20 accounts per pod.
2. **Eliminate Outreach Hallucinations:** Enforce the Calibrated Truth Guard against the Loadsmart Claims Library.
3. **Preserve Human Control:** Provide a 1-click batch approval drawer for reps before any CRM write or sequence enrollment.
4. **Actionable Pod Diagnostics:** Give RevOps a single dashboard showing leaks, stuck accounts, and mailbox deliverability.

## 3. Detailed Functional Requirements (FR)

### FR-01: Pod Selector & Multi-Pod State
- System must allow switching between Pod 1 (Mid-Market FTL), Pod 2 (Enterprise TMS), Pod 3 (Opendock Facilities), Pod 4 (Loadsmart AI Operations), or All Pods.
- Changing pod immediately recalculates all metrics, funnel steps, stuck accounts, and active mailboxes.

### FR-02: Real-Time GTM Copilot (Vercel AI SDK v7)
- Chat interface streaming responses with sub-second latency.
- Native tool calling for:
  - `nominateAccounts({ podId, product, count })`
  - `auditCRM({ accountDomains })`
  - `enrichContacts({ accountIds, persona })`
  - `generatePASCopy({ contactId, product })`
  - `checkMailboxHealth({ podId })`
  - `stageSequence({ accountIds })`
  - `runLeakReport({ podId })`
- Graceful offline/simulation fallback when AI provider keys are not configured.

### FR-03: Funnel & Leak Diagnostic Engine
- Visual tracking of accounts across 7 primary funnel stages.
- Automated leak tagging for accounts parked due to:
  - `CODE_01: MISSING_FREIGHT_SPEND`
  - `CODE_02: NO_VERIFIED_DECISION_MAKER`
  - `CODE_03: ACTIVE_SALESFORCE_OPPORTUNITY`
  - `CODE_04: MAILBOX_WARMUP_THROTTLED`
  - `CODE_05: UNAPPROVED_COPY_STALLED`

### FR-04: Mailbox Deliverability Sentinel
- Matrix tracking 5 mailboxes per rep with:
  - Domain age, warmup status, daily limit, sends today, bounce rate, and spam complaint rate.
  - Automatic sending cutoff if bounce rate exceeds 2.0%.

### FR-05: Automation Engineers & Connectors Center
- Repository of production-ready n8n workflows:
  - Daily Signal Scout n8n JSON
  - Clay Waterfall Enrichment n8n JSON
  - Gong Sequence Enrollment n8n JSON
  - Pod Leak Digest n8n JSON
- Schema definitions for Clay, Salesforce custom fields, and HubSpot properties.

## 4. Non-Functional Requirements (NFR)
- **Performance:** Initial page load < 1.5s; client route transitions < 100ms.
- **Reliability:** 99.9% uptime; zero downtime deployments on Vercel.
- **Security:** Secrets stored in environment variables; zero PII leakage into client bundles or logs.
