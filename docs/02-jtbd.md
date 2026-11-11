---
artifact_type: jtbd
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: product
reviewers: [operator, gtm-lead]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.98
---

# 02. Jobs To Be Done (JTBD) Report: Loadsmart GTM Agent OS

## 1. Primary Jobs (Core Value Drivers)

### Job 1: High-Precision Account Targeting & Signal Ingest
- **When** the market opens at 06:00 each morning,
- **The SDR/AE Pod wants** to automatically identify 20 high-fit enterprise accounts experiencing acute logistics triggers (facility expansion, supply chain disruptions, executive hiring, RFP seasons),
- **So that** outreach begins with verifiable "why now" context rather than generic cold spray-and-pray.
- **Success Metric:** 20 qualified accounts nominated per pod daily with ≥ 85 ICP score.

### Job 2: Zero-Hallucination Outbound Copywriting
- **When** targeting a VP of Supply Chain or Director of DC Operations,
- **The Rep wants** customized 1-to-1 emails and LinkedIn touchpoints grounded strictly in Loadsmart's verified claims library and the buyer's documented tech stack,
- **So that** message credibility is immediate and deliverability is protected from AI slop.
- **Success Metric:** 0 invented claims; 100% adherence to approved PAS (Problem-Agitate-Solution) copy templates.

### Job 3: Automated CRM Shield & Deduplication
- **When** new accounts are nominated,
- **RevOps wants** the system to automatically cross-reference active Salesforce/HubSpot accounts, DNC lists, and pod territory assignments,
- **So that** reps never step on each other's pipeline or burn active customer relationships.
- **Success Metric:** 0 territory collisions or duplicate outreach instances.

### Job 4: Executive Pod Funnel & Deliverability Visibility
- **When** reviewing weekly sales performance,
- **Sales Leadership wants** a live dashboard showing account status progression, leak reasons (missing phone numbers, unapproved copy, mailbox warm-up pauses), and mailbox health across secondary domains,
- **So that** bottlenecks are fixed instantly before pipeline targets are missed.
- **Success Metric:** Real-time visibility into all 4 pod pipelines with leak diagnosis down to specific error codes.

---

## 2. Secondary Jobs
- **Battlecard Retrieval:** Providing instant competitive differentiators against legacy TMS (Oracle, Manhattan, SAP) and dock management tools in discovery calls.
- **Voicemail Drop & Phone Scripts:** Equipping reps with 30-second conversational phone scripts and pre-recorded voicemail drop assets mapped to specific personas.
- **Automation Pipeline Sync:** Staging verified contact packages directly into Gong Engage, Amplemarket, or Apollo sequence flows via n8n webhooks.
