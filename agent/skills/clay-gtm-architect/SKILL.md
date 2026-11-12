---
name: clay-gtm-architect
description: Turns a list-building goal into a concrete Clay build plan and click-by-click guide covering table schema, enrichment sequence (company then person, waterfall enrichment), filters, dedupe, email verification, ICP scoring, export mapping to CSV, Sheets or CRM, QA checklist, operator runbook and a reusable Claybook recipe with versioning. Use when the user mentions Clay, or asks to "build a lead list", "enrich my leads", "find verified emails", "look-alike accounts", "companies using [tool]", "clean my database", "ABM list", or "export to HubSpot". Credit-conscious by default; plans before spending.
metadata:
  author: Patrick Diamitani
  version: 1.0.0
  plugin: enably
---

# Clay GTM Architect

Translates "we need 500 verified fintech CFO leads in the US" into a Clay build anyone on the team can run, re-run and trust, without wasting credits.

**Graph position:** after `icp-architect` and `tech-stack-architect`. Feeds `sdr-assistant` (verified list), `gtm-automation-engineer` (scheduled runs), `sop-architect` (runbook).

## Rules

1. **Credits hygiene:** preview a small sample first, filter as early as possible, batch runs, never re-enrich unchanged rows. Spending credits needs the user's explicit yes and a spend cap.
2. **Verification gate:** export only verified or acceptable emails; unknown goes to manual review.
3. **Compliance:** check suppression and unsubscribe lists before export; avoid sensitive personal categories; log source per row.
4. Never print provider keys; refer to connections by name or `${VAR}`.
5. Never claim exact pricing, credit costs or rate limits; give ranges and point to Clay docs. Clay's interface and feature names change; when browsing is available, check the current docs and cite them with the retrieval date.
6. "Claybook" is Enably's name for a packaged, reusable Clay recipe; build it with whatever template or workbook feature Clay currently offers.

## Step 1: Intake

Ask only essential questions; otherwise use defaults and label them.

| Input | Default if not given |
|---|---|
| Objective and volume | Ask |
| ICP filters: industry, size, geo, tech, events | Reuse ICP |
| Titles / seniority | Reuse persona |
| Destination: CSV, Sheets, HubSpot, Salesforce, Attio, Zoho | CSV |
| Credit or dollar cap | **Ask; never guess** |
| Cadence: one-off, weekly, monthly | One-off |
| Suppression list | Ask if one exists |

## Step 2: Context

Reuse ICP signals (firmographic, technographic, event) and persona titles. If the Clay connector is available in this session, read workspace context first (read-only); any run that spends credits waits for approval.

## Step 3: Build

Follow the 8-step project template and output sections in `references/build-plan.md`:

1. Objective and constraints
2. Seed (company search, domain list, person search, current customers for look-alikes)
3. Normalize columns
4. Enrich company, then person (titles, seniority, LinkedIn, email via waterfall)
5. Quality gates (dedupe email + domain, verification status, suppression, free-email exclusion)
6. ICP score and tier
7. Export mapping and run log
8. Package as Claybook (inputs, steps, outputs, QA, version, changelog)

Then add the **click-by-click guide** (described against Clay's current UI; mark any step to confirm in docs) and the **operator runbook**. Offer **Lean** (fewest enrichers, lowest cost) vs **Advanced** (waterfalls, AI research columns, scheduled runs).

Pick the matching pattern from `references/patterns.md` when the request fits one (net-new, look-alike, event-based, tech-stack, database cleaning, ABM bundle).

## Step 4: Quality loop (max two passes)

- [ ] Filters run before paid enrichment; sample size stated.
- [ ] Dedupe key and suppression check are explicit.
- [ ] Only verified/acceptable emails reach export.
- [ ] ICP score rules are written as points and a threshold.
- [ ] Export fields map 1:1 to destination fields.
- [ ] Spend cap stated; credit estimates labeled as estimates.
- [ ] Runbook lets a teammate reproduce the run in minutes.

## Step 5: Hand off

Deliver the plan as Markdown (document tool if available). Next step: "Approve a [N]-row test run under a [cap] budget?" After the list exists: "Hand the verified list to sdr-assistant for drafts and the send gate."

## References

| File | Read when |
|---|---|
| `references/build-plan.md` | Writing any build plan, Claybook spec, runbook, QA checklist |
| `references/patterns.md` | The request matches a common list-building pattern |
