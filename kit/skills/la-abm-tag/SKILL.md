---
name: la-abm-tag
description: Step 2 of Loadsmart's ABM pipeline. Scores candidate accounts on fit, timing and persona coverage, proposes 20 accounts per pod with written reasons, and after RevOps approval sets ABM_Account__c, ABM_Pod__c and ABM_Reason__c in Salesforce. Use for building or refreshing pod account lists, explaining why an account was picked, or replacing disqualified accounts.
---

# la-abm-tag: pick and flag the 20 accounts

**Runs:** weekly, Monday 06:30 CT (and on demand to backfill a disqualified slot). **Reads:** `config/icp.yaml`, `config/pods.yaml`, `Signal__c`, closed-won history. **Writes (after approval):** `ABM_Account__c`, `ABM_Pod__c`, `ABM_Reason__c`, `ABM_Fit_Score__c`, `ABM_Priority__c`.

## Replace "find companies like X" with a written score

1. **Fit (0-1):** weighted match to `icp.yaml` (industry, size, footprint, tech context). Show each component.
2. **Timing (0-1):** from `la-signal`.
3. **Coverage (0-1):** share of the 3 product personas with a verified contact (from the last enrichment run; 0 if never enriched).
4. **Priority = fit x (0.5 + 0.5 x timing) x (0.5 + 0.5 x coverage).** Fit dominates; timing and coverage reorder.
5. Apply exclusions from `icp.yaml`. An account that already uses one Loadsmart product is flagged `cross-sell` and routed to its account manager, not dropped silently.
6. Keep current active accounts unless disqualified; fill open slots from the top of the ranked pool, balancing industries across pods.

## Approval gate

Present to RevOps, per pod: the 20 accounts, each with priority, the three scores, the top reason in one line, and which accounts are new this week. Wait for an explicit approval. Only then write the fields. A partial approval writes only the approved rows.

## ABM_Reason__c format

`Fit 0.82 (CPG, 6 DCs, has WMS) | Timing 0.9 (new DC in [city], [date], [source]) | Coverage 0.33 (Opendock persona only)`

## Rules

- Every score shows its inputs; no black-box picks.
- Read last week's disqualification reasons first; an account disqualified for "wrong industry" or "too small" does not come back unless the ICP changed.
- Never write to Salesforce without the approval for that specific list.
