---
name: la-list-qa
description: Weekly list and contact quality audit for Loadsmart's ABM pods. Scores pod acceptance, persona coverage, verified email rate, bounce rate and title accuracy, samples contacts for spot checks, and lists fixes. Use when asked whether the lists or contacts are good, before adding volume, or after a bounce spike.
---

# la-list-qa: are the lists and contacts good?

**Runs:** weekly, Friday 12:00 CT, and before any volume increase. **Reads:** ABM accounts, contacts, bounces, disqualifications. **Writes:** a quality scorecard per pod, a fix list.

## Scorecard

| Metric | Definition | Starting target |
| --- | --- | --- |
| Pod acceptance | Accounts kept / accounts assigned (this quarter) | 80%+ |
| Persona coverage | Accounts with 2+ of 3 personas verified | 70%+ |
| Verified email rate | Enrolled contacts with valid/acceptable email | 95%+ |
| Hard bounce rate | Hard bounces / sent (7 days) | Under 2% |
| Title accuracy | Spot-check of 20 random contacts per pod: still in role, right function | 90%+ |
| Freshness | Contacts verified in the last 90 days | 90%+ |
| ICP drift | Active accounts that fail any ICP exclusion | 0 |

## Steps

1. Compute the scorecard per pod and compare to last week.
2. Draw 20 random contacts per pod; check current role and function against LinkedIn/ZoomInfo. Record mismatches by type (left company, wrong function, wrong seniority).
3. Check every active account against `icp.yaml` exclusions (current customer of same product, open opp elsewhere, broker/3PL).
4. Write the fix list: each item names the records, the rule broken, and the owner (RevOps for data, la-abm-tag for list, la-persona-enrich for contacts).
5. If hard bounce is over 3% for a pod, recommend pausing that pod's sends until fixed (the pause itself needs a human yes).
