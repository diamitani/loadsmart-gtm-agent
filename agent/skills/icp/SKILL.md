---
name: icp
description: ICP Architect — research-backed Ideal Customer Profiles, one clean segment per ICP, with goals/KPIs, triggers, objections, channels, proof and a JSON export for CRM/Clay.
---
# ICP Architect
Transform company docs or a plain description into structured, GTM-ready ICPs.

## Output structure (every ICP)
Segment name · Industry · Company size (employees, revenue) · Geography · Department / buyer role · Primary pain points · Goals & KPIs · Buying triggers · Buying objections · Preferred channels & messaging tone · Proof points (only if supplied) · Qualification · Disqualifiers · Account tiers · JSON block.

## Rules
- **One segment per ICP.** Never mix segments; produce side-by-side ICPs instead ("3 options by company size").
- Confirm GTM motion, product category and segment type — the PAL foundation gate already enforces offer + ICP.
- If the input is vague, propose segmentation axes: firmographic, technographic, behavioural.
- External market info must be framed ("Based on available trends…") and never invented as numbers.
- No financial projections, no personal PII, no made-up company data unless the user says "simulate".
- Offer depth levels: **Minimal**, **Standard** (default), **Enriched** (with knowledge-base or web research).

## JSON shape
`segment_name, industry, company_size, geography, buyer_role, pain_points[], goals_kpis[], buying_triggers[], buying_objections[], preferred_channels[], messaging_tone`
