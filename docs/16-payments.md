---
artifact_type: payments
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: product
reviewers: [gtm-lead, operator]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.98
---

# 16. Commercial Architecture & Credit Model: Loadsmart GTM OS

## 1. Internal Operating Economics & Credit Allocation
While the Loadsmart GTM Agent OS is an enterprise-internal sales enablement platform for Loadsmart's sales organization, it implements a strict credit and token budget per pod to prevent uncontrolled API spend.

| Resource | Unit Cost | Pod Daily Allocation | Monthly Cap (4 Pods) |
|---|---|---|---|
| Gemini 2.5 / 1.5 Pro Tokens | ~$1.25 / 1M tokens | 250,000 tokens | 20M tokens |
| Claude 3.5 Sonnet Tokens | ~$3.00 / 1M tokens | 100,000 tokens | 8M tokens |
| Clay / Waterfall Credits | ~$0.10 / verified contact | 20 reveals | 1,600 reveals |
| Secondary Mailbox Costs | ~$5.00 / inbox / month | 5 inboxes / rep | 40 inboxes ($200/mo) |
| Total Estimated Cloud Spend | — | ~$12.50 / pod / day | ~$1,000 / month |

## 2. Customer Pricing & Commercial Packaging (Loadsmart Offerings)
The Copilot incorporates Loadsmart's real commercial packaging when calculating pipeline values:
- **ShipperGuide (TMS):** Annual software subscription ($25,000–$120,000 ARR) based on annual freight volume and user seats.
- **Opendock:** Tiered annual SaaS ($6,000–$48,000 ARR) based on facility count and appointment volume.
- **Loadsmart AI:** Usage-based logistics automation fee ($0.75–$2.50 per automated transaction) or annual enterprise license ($50,000+ ARR).
- **Freight Brokerage:** Take-rate margin (8%–15% gross margin on freight spend).
