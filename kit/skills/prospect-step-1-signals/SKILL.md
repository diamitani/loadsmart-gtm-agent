---
name: prospect-step-1-signals
description: Step 1 of the 6-step prospect automation workflow. Captures dated, source-backed buying signals across freight markets, warehouse openings, logistics hiring, and TMS shifts mapped to Opendock, ShipperGuide, and Loadsmart AI.
---

# Step 1: Signal Acquisition & Timing Scoring

Discover real, dated why-now events that create urgent pain Loadsmart can solve, without relying on static company lists or fabricated intent.

## Signal-to-Product Matrix

| Signal Type | Observable Evidence | Loadsmart Product Match | Base Weight |
| :--- | :--- | :--- | :--- |
| New DC / Facility | Press release, permit, or Plant GM posting in new city | **Opendock** (dock & yard scheduling) | 0.90 |
| Warehouse Hiring Spike | 5+ open receiving, yard, or warehouse coordinator roles | **Opendock** | 0.65 |
| TMS / Tech Shift | Job posting citing legacy TMS or ERP migration | **ShipperGuide TMS** | 0.85 |
| Freight Hiring Surge | Transportation Manager, Freight Analyst, Load Planner roles | **ShipperGuide TMS** | 0.60 |
| Executive Supply Chain Hire | New VP/Head of Supply Chain or Logistics (<120 days) | **Loadsmart AI** | 0.80 |
| Earnings / 10-K Cost Mandate | Public filing highlighting freight margin or automation goals | **Loadsmart AI** | 0.75 |

## Required Output Schema

Every signal record emitted to Step 2 MUST carry:

```json
{
  "company_name": "string",
  "domain": "string",
  "signal_type": "new_facility | hiring_ops | tms_shift | leadership | earnings",
  "target_product": "Opendock | ShipperGuide | Loadsmart AI",
  "event_date": "YYYY-MM-DD",
  "source_url": "https://...",
  "factual_summary": "One sentence stating strictly what the source reports.",
  "timing_score": 0.0
}
```

## Decay & Dedupe Rules

- **Decay**: `1.0x` (<= 30 days), `0.5x` (31–60 days), `0.25x` (61–90 days), `0x` (> 90 days).
- **No URL, No Signal**: Drop any candidate missing a verifiable URL and event date.
- **30-Day Dedupe**: Merge identical `(domain, signal_type)` triggers within 30 days, keeping the highest-authority source.
