---
artifact_type: evidence
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: research
reviewers: [architect, operator]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.99
---

# 25. Evidence Ledger & Knowledge Sources

## 1. Verified Primary Sources

| Source Document | Author / Origin | Key Facts Extracted |
|---|---|---|
| **Loadsmart Sales Playbook v2** | Patrick Diamitani (Nov 11, 2026) | Complete pod motion, ICP definitions, personas, email cadences, Gong sequences, Salesforce fields, objection handling. |
| **Loadsmart ABM OS Kit** | Patrick Diamitani (Enably / SalesGency) | 10-step daily pipeline (`la-signal` to `la-daily-report`), multi-mailbox setup, schedule.yaml, pod quotas. |
| **Loadsmart Public Announcements** | Loadsmart (Oct 20, 2026 release) | 11 AI logistics agents + Freight Experts model; 1,800 customers; 4,500 warehouses; 230,000 carriers; 14M dock appointments. |
| **SalesGency Prospect Automation Engine** | Patrick Diamitani | 5-Pillar outbound architecture (Trigger Ingest, CRM Shield, Data Reveal, PAS Copy, Sequencer). |
| **Enably GTM Architect** | SalesGency / ROSTR Platform | PAL pipeline ($W = 1.00$ foundation, middle-out compressor, calibrated truth guard, POP 11-doc package). |
| **Sovereign GTM Agent OS** | ROSTR Platform | n8n workflows, Clay recipes, HubSpot/Amplemarket sequences. |

## 2. Gap Analysis & Validation Checklist
- [x] All 3 core products (ShipperGuide, Opendock, Loadsmart AI) segregated by buyer persona.
- [x] Human approval gate strictly placed prior to sequence enrollment.
- [x] Secondary mailbox rotation and warm-up ramp documented and enforced.
- [x] Complete 25-document Site Empire OS suite compiled in `docs/`.
