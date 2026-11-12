---
artifact_type: intent-spec
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: product
reviewers: [operator, gtm-lead, architect]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.99
---

# 01. Intent Specification: Loadsmart Live GTM Agent OS

## 1. Problem Statement
Loadsmart sales pods (AE/SDR pairings) spend 15–20 hours per week on manual account research, unqualified list scraping, disconnected contact enrichment, and repetitive email drafting. Because Loadsmart sells three distinct products—**ShipperGuide (TMS)**, **Opendock (Dock/Yard)**, and **Loadsmart AI (Logistics Agents)**—reps frequently pitch the wrong product to the wrong buyer persona or make unsubstantiated claims that damage domain deliverability. Furthermore, RevOps has zero unified visibility into daily pipeline leaks or mailbox warm-up degradation across secondary sending domains.

## 2. Target Audience & Users
1. **Sales Development Reps (SDRs):** Need automated daily signal ingestion, verified freight contact reveals (VP Logistics, Transportation Directors, DC Managers), and 1-to-1 body copy grounded in verified facts.
2. **Account Executives (AEs):** Need account intelligence briefs, system-of-record mapping (incumbent TMS/WMS/ERP), call openers, and custom battlecards before discovery calls.
3. **RevOps & Sales Leadership:** Need real-time pod funnel diagnostics, leak rate detection, mailbox health scores (<2% bounce rate), and enforceable human-in-the-loop approval gates.
4. **Autonomous AI Agents & Swarm:** Need deterministic pipelines to nominate, enrich, research, craft copy, and stage sequences without hallucinating credentials or metrics.

## 3. Product Offerings & Segmentation
- **ShipperGuide:** Transportation Management System (TMS) for mid-market and enterprise shippers (\$10M–\$500M+ freight spend).
- **Opendock:** Online dock appointment scheduling and yard management for manufacturing plants and distribution centers (4,500+ warehouses).
- **Loadsmart AI:** 11 specialized autonomous logistics agents executing repetitive operational tasks inside shipper ERP/TMS systems, backed by human freight experts.
- **Freight Brokerage:** FTL, LTL, drayage, multimodal, and managed transportation.

## 4. Scope & Core Deliverables (v1)
- **Live Interactive ABM Pod Dashboard:** Multi-pod switcher, live funnel conversion, stuck account alerts, mailbox deliverability health matrix, and CSV import/export.
- **Real-Time Multi-Agent GTM Copilot:** Vercel AI SDK v7 streaming assistant with tool invocation (`nominateAccounts`, `enrichContacts`, `generatePASCopy`, `auditCRM`, `checkMailboxHealth`, `stageSequence`, `runLeakReport`).
- **10-Step Deterministic Daily Engine:** Orchestrated daily flow (06:00 Signal → 06:30 CRM Dedupe → 07:00 Reveal → 07:30 Research → 08:00 PAS Copy → 08:30 Approval Gate → 09:00 Sequencer Sync → 17:00 Daily Report).
- **Automation Engineers & Connectors:** Ready-to-deploy n8n workflow JSONs, Clay enrichment schemas, and Salesforce custom field mappings.
- **Complete Sales Playbook v2:** Embedded knowledge base, objection handling scripts, cold call openers, and claims library.

## 5. Non-Goals
- Fully autonomous email sending without human approval (violates safety doctrine).
- Unrestricted AI spending or infinite autonomous loops.
- Overwriting existing Salesforce/HubSpot records without RevOps pre-flight validation.

## 6. Success Metrics
- **Time-to-Value:** Reps review and approve 20 customized account packages in < 15 minutes per morning.
- **Deliverability:** Bounce rate maintained < 2%, spam complaint rate < 0.1% across all secondary domains.
- **Data Completeness:** 100% adherence to the One Must Act ($W = 1.00$) foundation threshold before copy generation.
