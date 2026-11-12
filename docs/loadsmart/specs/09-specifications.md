---
artifact_type: specifications
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: eng
reviewers: [architect, gtm-lead]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.98
---

# 09. Functional & Non-Functional Specifications: Loadsmart GTM OS

## 1. Functional Specifications Pattern

### FS-101: Account Ingest & Signal Scoring
- **Trigger:** Daily cron at 06:00 CT or user prompt via Copilot.
- **Pre-Conditions:** Pod target criteria loaded (`icp.yaml`).
- **Processing:**
  1. Evaluate external data triggers (facility permits, 10-K logistics disclosures, hiring for Director of Supply Chain).
  2. Compute ICP fit score (0–100) based on industry, freight mode, and employee count.
  3. Filter top 20 candidate accounts with score ≥ 75.
- **Post-Conditions:** Accounts added to pod staging queue in `NOMINATED` state.

### FS-102: CRM Shield & Deduplication
- **Trigger:** Immediate follow-up to FS-101.
- **Pre-Conditions:** Salesforce / HubSpot connected or cached CRM ledger present.
- **Processing:**
  1. Lookup domain against CRM Accounts and Contacts.
  2. If status = `Customer` or open opportunity exists within 90 days, mark as `PARKED_CRM_COLLISION`.
  3. Otherwise, set state to `CRM_CLEARED`.
- **Idempotency:** Re-running with identical domains produces identical classifications.

### FS-103: PAS 1-to-1 Copy Synthesis
- **Trigger:** Contact verification complete ($W = 1.00$).
- **Processing:**
  1. Map target product (ShipperGuide, Opendock, Loadsmart AI) to contact persona (Logistics VP, Plant Manager, CIO).
  2. Pull verified claims from `knowledge/claims-library.md`.
  3. Apply 3-touch PAS cadence:
     - Touch 1: Acute Operational Problem + Verifiable Industry Proof.
     - Touch 2: Economic Agitation + System Integration Angle.
     - Touch 3: Low-Friction Offer (e.g. 15-min network benchmark or dock audit).
- **Post-Conditions:** Copy staged in `COPY_DRAFTED` state for rep approval.

## 2. Non-Functional Specifications (SLOs & Guardrails)

| Metric | Target (v1) | Target (Scale) |
|---|---|---|
| Copilot Initial Response | < 800ms | < 300ms |
| Pipeline Step Batch Execution (20 accts) | < 12 seconds | < 5 seconds |
| Lighthouse Performance Score | ≥ 92 / 100 | ≥ 96 / 100 |
| Lighthouse Accessibility Score | 100 / 100 | 100 / 100 |
| Data Recovery Objective (RPO) | 1 hour | Real-time WAL |
| Recovery Time Objective (RTO) | 15 minutes | < 5 minutes |
| Bounce Rate Ceiling | < 2.0% | < 1.0% |
| Spam Complaint Threshold | < 0.1% | < 0.05% |
