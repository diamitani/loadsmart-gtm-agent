---
name: prospect-step-4-research
description: Step 4 of the 6-step prospect automation workflow. Produces a 6-part evidence-backed Loadsmart account brief using Perplexity, SEC EDGAR filings, and operational news with strict zero-hallucination provenance.
---

# Step 4: Deep Account Research & Evidence Ledger

Synthesize why this shipper needs Loadsmart right now in a concise, citation-backed brief every AE and SDR can read in 90 seconds.

## 6-Part Account Brief Structure

1. **Logistics Footprint**: Headcount, warehouse/DC locations, freight modes (FTL, LTL, drayage, intermodal), seasonal peaks.
2. **Dated Buying Trigger**: Exact event from Step 1 with source URL, quote/excerpts, and date.
3. **Likely Operational Bottleneck**: Dock congestion/detention (Opendock), manual spot quoting & carrier compliance (ShipperGuide), or fragmented invoice/dispatch ops (Loadsmart AI).
4. **Incumbent Stack Clues**: Known ERP/WMS/TMS mentions from job descriptions or press releases (labeled `observed` vs `unknown` — never guessed).
5. **Persona-Specific Hooks**: One concrete talking point per enriched contact from Step 3.
6. **Verified Claims Match**: List any pre-approved `claims-library.md` IDs relevant to this vertical, or mark `[NO_PREAPPROVED_CLAIM_NEEDED]` if relying solely on the prospect's public facts.

## Evidence Ledger Standard

Every metric or operational assertion must carry:
- `source_url`
- `retrieved_date`
- `evidence_tier` (`SEC_FILING` | `COMPANY_RELEASE` | `JOB_POST` | `NEWS_MEDIA`)

If an account's private freight spend or dock count is unavailable publicly, record `unknown` rather than estimating.
