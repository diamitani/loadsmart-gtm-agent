---
name: la-crm-audit
description: One-time (then quarterly) audit and ICP scoring of Loadsmart's Salesforce before any data credits or research tokens are spent. Inventories accounts, contacts, opportunities, contracts and reports, scores every account against the ICP, maps existing contacts to product personas, and produces the CRM-first outreach list. Use when starting the program, before buying enrichment, or when asked "what do we already have in the CRM?"
---

# la-crm-audit: use what Loadsmart already owns first

**Runs:** once in week 1, then quarterly. **Reads:** Salesforce (read-only), `config/icp.yaml`, `config/personas.yaml`. **Writes (after RevOps approval):** `ABM_Fit_Score__c`, a tier tag, `Persona__c` on existing contacts, `Existing_Products__c`.

## Step 1: inventory (read-only)

Produce a one-page inventory:

| Object | Count | Key fields filled (%) | Notes |
| --- | --- | --- | --- |
| Accounts | | industry, employees, revenue, locations | |
| Contacts / leads | | title, email, phone, last activity | |
| Opportunities | | product, stage, close reason, amount | won / lost / open by product |
| Contracts / customers | | product, start, renewal | who already uses which product |
| Campaigns / activities | | last touch date | prior engagement |
| Reports and dashboards | | owner, last run | which ones are actually used |

## Step 2: score every account

1. Fit score against `icp.yaml` from CRM fields only (no paid enrichment yet). Record which fields were missing.
2. Tier: **T1** fit 0.75+ and (prior engagement or a won/lost history); **T2** fit 0.6+; **Hold** below that or missing too many fields; **Cross-sell** already a customer of at least one product; **Exclude** per `icp.yaml`.
3. Learn from history: compare won vs lost by industry, size and product. Report the 3 strongest patterns with counts. These become the first draft of ICP weights.

## Step 3: contacts already in hand

1. Map existing contacts to product personas by title and function.
2. Flag former champions (contacts on won or late-stage opps) who moved to a new company: high-priority T1 leads.
3. List persona slots still empty per T1/T2 account. **Only these gaps go to `la-persona-enrich`.**

## Output: the CRM-first outreach list

- Closed-lost and stalled accounts that still fit (re-open with a new signal)
- Cross-sell accounts (route to the account manager, product the customer doesn't have yet)
- Former champions at new ICP accounts
- T1 accounts with empty persona slots (enrichment queue, with credit estimate)

## Rules

- Read-only until RevOps approves the write-back.
- Never re-buy a contact already verified in the CRM within 90 days.
- Count tokens and credits saved: records served from the CRM vs records that needed enrichment.
