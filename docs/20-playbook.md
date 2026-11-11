---
artifact_type: playbook
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: product
reviewers: [gtm-lead, operator]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.99
---

# 20. Build Playbook & Critical Path: Loadsmart GTM OS

## 1. Daily Pod Operating Rhythm

| Time (CT) | Pipeline Step | System Action | Human Pod Action |
|---|---|---|---|
| **06:00** | `la-signal` | Ingests market triggers; nominates 20 accounts. | Asleep / Off-shift. |
| **06:30** | `la-crm-audit` | Deduplicates against Salesforce; flags active deals. | Automated check. |
| **07:00** | `la-abm-tag` | Assigns account tiers and pod routing. | RevOps spot-check. |
| **07:15** | `la-persona-enrich` | Waterfall reveal of Logistics/DC decision makers. | Automated check. |
| **07:45** | `la-research` | Assembles account intelligence brief. | Automated check. |
| **08:15** | `la-email` | Drafts 1-to-1 PAS copy via claims library. | Automated check. |
| **08:30** | `la-sequence` | Staged in review drawer. | **AE & SDR Review & Sign Off (15 min).** |
| **09:00** | Sequencer Push | Dispatches approved batch to Gong/Amplemarket. | SDR starts phone call block & LinkedIn touches. |
| **17:00** | `la-daily-report` | Tallies funnel drop-offs, leaks, and replies. | Pod reviews daily metrics & unblocks stuck accounts. |

## 2. Definition of Done (DoD)
A daily batch is considered complete when:
1. 20 target accounts processed through the 10-step pipeline.
2. 0 territory collisions or active customer outreach.
3. Every email touchpoint passes the Calibrated Truth Guard ($W = 1.00$).
4. Human batch approval recorded with timestamp and user attribution.
5. All dispatched mailboxes operate within their daily cap and < 2% bounce rate.
