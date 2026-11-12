---
name: la-signal
description: Step 1 of Loadsmart's ABM pipeline. Finds dated, sourced buying signals per account and maps each to the Loadsmart product it opens (Opendock, ShipperGuide, Loadsmart AI), then updates the account timing score. Use when asked for signals, "why now" reasons, account timing, or when building or testing the signal layer.
---

# la-signal: find why-now reasons

**Runs:** daily 06:00 CT. **Reads:** `config/icp.yaml`, target accounts (ABM accounts plus the candidate pool). **Writes:** `Signal__c` rows, `Account.ABM_Timing_Score__c`.

## Signal catalog

| Type | Look for | Opens | Default strength |
| --- | --- | --- | --- |
| New site | New DC, warehouse or plant announced; site GM job post in a new city | Opendock | 0.9 |
| Hiring ops | 5+ open warehouse, receiving or yard roles | Opendock | 0.6 |
| Hiring transport | Transportation manager, freight analyst, logistics planner roles | ShipperGuide | 0.6 |
| TMS change | Job post names a TMS or a TMS implementation; technographic change | ShipperGuide | 0.8 |
| Leadership change | New VP/Head of Supply Chain, Logistics or Transportation (under 120 days) | Loadsmart AI | 0.8 |
| Earnings mention | Public filing or call mentions freight cost, automation, headcount discipline | Loadsmart AI | 0.7 |
| Intent | ZoomInfo intent on dock scheduling, yard management, TMS, freight automation | Matching product | 0.5 |
| Product network | Account facilities or carriers already touch Opendock (needs data access) | Opendock | 0.9 |
| Engagement | Reply, site visit, event attendance | Any | 0.7 |

Strengths are starting values; `la-pod-feedback` tunes them monthly on which signals produced meetings.

## Steps

1. For each account, query the configured sources (ZoomInfo intent and scoops, Sales Navigator alerts, job boards via Clay, news search, filings for public companies).
2. Keep a signal only if it has a **source URL**, an **event date**, and a one-sentence factual summary. No URL, no signal.
3. Map it to one product using the catalog. If it fits two, write two rows.
4. Dedupe: same type + same account within 30 days = one signal (keep the strongest source).
5. Timing score = max over signals of `strength x decay`, where decay is 1.0 under 30 days, 0.5 under 60, 0.25 under 90, 0 after.
6. Write rows and scores. Report: accounts scanned, signals found by type, accounts with no signal.

## Rules

- Never infer a signal from the company name or industry alone.
- Never write a signal sentence that says more than the source says.
- Carrier-side products (CarrierGuide, Loadboard, Factoring) are out of scope for these pods.
