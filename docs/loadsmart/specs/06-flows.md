---
artifact_type: flows
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: design
reviewers: [architect, product]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.98
---

# 06. User Flows & State Transitions: Loadsmart GTM Agent OS

## 1. Daily 10-Step Deterministic Flow

```mermaid
sequenceDiagram
    autonumber
    participant Rep as SDR / AE Pod
    participant Cron as Orchestrator (06:00)
    participant Signal as Signal Scout
    participant CRM as CRM Shield
    participant Enrich as Waterfall Enricher
    participant Copy as PAS Copywriter
    participant Human as Human Approval Gate
    participant Seq as Sequencer (Gong/Amplemarket)

    Cron->>Signal: Ingest dated triggers (facility, hiring, 10-K)
    Signal->>CRM: Nominate 20 target accounts per pod
    CRM->>CRM: Cross-reference Salesforce/HubSpot & DNC list
    CRM-->>Enrich: 18 cleared accounts (2 parked as customer/active deal)
    Enrich->>Enrich: Waterfall reveal (Clay/Apollo/Hunter) for target personas
    Enrich->>Copy: Verified contact dossiers ($W = 1.00$)
    Copy->>Copy: Draft 3 1-to-1 emails using claims-library.md
    Copy->>Human: Present batch for review & signature
    Rep->>Human: Approve batch (or edit specific placeholders)
    Human->>Seq: Dispatch payload via webhook
    Seq-->>Rep: Sequence enrolled with multi-mailbox rotation
```

## 2. Account Lifecycle States

| State | Definition | Next Permitted Transition |
|---|---|---|
| `NOMINATED` | Identified by Signal Scout; pending CRM Shield check. | `PARKED_CRM_COLLISION` or `CRM_CLEARED` |
| `PARKED_CRM_COLLISION` | Active customer or existing open opportunity in Salesforce. | None (Requires RevOps manual override) |
| `CRM_CLEARED` | Verified no conflicts; ready for contact reveal. | `ENRICHING` |
| `ENRICHED` | Target persona discovered and email syntax/deliverability validated. | `RESEARCHING` or `DISQUALIFIED_NO_BUYER` |
| `RESEARCHED` | Account intelligence brief compiled ($W = 1.00$). | `COPY_DRAFTED` |
| `COPY_DRAFTED` | 1-to-1 PAS copy staged; waiting in human approval drawer. | `APPROVED` or `REJECTED_NEEDS_EDIT` |
| `APPROVED` | Signed off by pod AE/SDR. | `SEQUENCED` |
| `SEQUENCED` | Enrolled in Gong Engage / Amplemarket sequence. | `REPLIED`, `MEETING_BOOKED`, or `UNRESPONSIVE_14D` |
| `MEETING_BOOKED` | Converted to qualified sales opportunity. | `PIPELINE_WON` or `PIPELINE_LOST` |
