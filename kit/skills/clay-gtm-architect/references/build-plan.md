# Clay build plan template

## Contents
- Build plan sections
- Claybook spec
- Operator runbook
- Handover assets
- Worked example

## Build plan sections

```markdown
# Clay build: [Name] | Version [v1.0] | Date [ ]

## 1. Objective and constraints
- Goal: [ ] | Volume: [rows per run] | Cadence: [ ]
- Titles/seniority: [ ] | Geo: [ ] | Destination: [ ]
- Spend cap: [credits or $, user-supplied] | Test run size: [e.g. 25 rows]

## 2. Table schema
| Column | Type | Source | Sample value |
|---|---|---|---|
| domain | text | seed | example.com |
| company | text | enrich | |
| industry | text | enrich | |
| employee_range | text | enrich | |
| [tech signal] | boolean | enrich | |
| persona_title | text | person search | |
| linkedin_profile | url | person search | |
| email | email | waterfall | |
| email_status | enum | verification | verified / acceptable / unknown / invalid |
| icp_score | number | formula | |
| source | text | system | |
| run_id | text | system | |

## 3. Enrichment sequence
| Step | Action | Input | Output | Filter after? |
|---|---|---|---|---|
| 1 | Seed | criteria | domains | yes: exclude out-of-ICP |
| 2 | Company enrich | domain | industry, size, HQ | yes: size, geo |
| 3 | Person search | domain + titles | name, title, LinkedIn | yes: seniority |
| 4 | Email waterfall | name + domain | email | |
| 5 | Verify | email | email_status | yes: keep verified/acceptable |

## 4. Filters and dedupe
- Exclude: free email domains, competitors, existing customers, internal domains
- Dedupe: email + domain; keep earliest first-touch; log canonical record
- Suppression: match against [list] before export

## 5. ICP scoring
| Rule | Points |
|---|---|
| [signal] | +3 |
Threshold: score >= [n] -> Tier 1; [m to n-1] -> Tier 2

## 6. Export mapping
| Clay column | Destination field |
|---|---|

## 7. QA checklist
- [ ] Sample 25 rows; spot-check titles and company fit
- [ ] Deliverable share meets target (e.g. >= 95% verified/acceptable)
- [ ] No suppressed or duplicate records
- [ ] Credits used within cap

## 8. Claybook spec (see below)
```

## Claybook spec

```markdown
# Claybook: [name] | v[1.0]
- Use when: [repeatable task, multiple users, or scheduled run]
- Inputs: geo, employee_range, title_keywords, industry, limit
- Steps: [source -> enrichers -> filters -> scoring -> output], in Markdown
- Outputs: required columns, export target, success criteria
- QA: test run size, pass criteria, failure handling
- Changelog: | date | change | why | owner |
- Rollback: revert to previous version; restore last snapshot CSV
```

## Operator runbook

Who runs it, when (e.g. weekly Tuesday 9am), steps to run, QA to do before export, where to notify (channel), what to do on failure (rerun failed rows only; append run_id), who to ask.

## Handover assets

"How this Claybook works" one-pager (goal, inputs, steps, outputs, SLA) / operator SOP (via sop-architect) / changelog / rollback plan.

## Worked example

"US mid-market e-commerce brands on Shopify, Growth/Marketing leads, verified emails, weekly to HubSpot":
- Constraints: 1k rows/week, Head or Director of Growth/Marketing, US, verified only.
- Score: +3 uses Shopify, +2 50 to 500 employees, +1 US; threshold >= 5.
- Export to HubSpot: email, firstname, lastname, company, jobtitle, domain, industry, employee range, LinkedIn URL, source, lifecycle stage = lead.
- Runbook: weekly, notify ops channel, rerun only failed rows.
