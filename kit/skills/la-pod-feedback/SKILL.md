---
name: la-pod-feedback
description: Weekly feedback loop for Loadsmart's ABM pods. Groups AE/SDR disqualification reason codes, email ratings, call-review tags and huddle notes into themes, turns each into a change ticket with an owner, and writes the stakeholder reports for Sales, Marketing and RevOps. Use for pod feedback, weekly changes, retros, or "what should we change".
---

# la-pod-feedback: from rep feedback to shipped changes

**Runs:** weekly, Monday 09:00 CT. **Reads:** `ABM_DQ_Reason__c` + notes, `AI_Email_Rating__c` + reasons, Gong call tags (objection, product), Friday huddle notes, last week's changelog. **Writes:** themes, change tickets, a changelog entry, three short reports.

## Steps

1. **Count.** Group last week's inputs by reason code and by pod. Show counts, not adjectives.
2. **Theme.** Merge into at most 5 themes. Each theme: what happened, how often, which pods, 1-2 example records.
3. **Route.** Each theme becomes a ticket with one owner:
   - Account selection or ICP -> RevOps (`icp.yaml`, la-abm-tag weights)
   - Persona map, messaging, proof points -> Marketing (`personas.yaml`, la-email rules)
   - Sequence steps, call scripts, qualification -> Sales leadership
   - Data quality -> RevOps (la-persona-enrich, vendors)
4. **Ship and version.** Approved changes are edits to the config or skill files, with a changelog line: date, file, change, reason, metric to watch.
5. **Check last week.** For each change shipped last week, compare its metric before vs after. No movement after 2 weeks -> propose a rollback.

## Reports

| Audience | Content |
| --- | --- |
| Sales (Director of SaaS Sales) | Meetings and stage 2 opps by pod and product; at-risk pods; what changes in their reps' week |
| Marketing (Head of Marketing) | Reply rate by persona and product; top objections from calls; copy changes and why |
| RevOps (Head of RevOps) | Quality scorecard trend; data issues; process and field changes; system health |

Keep each report under 200 words plus one table. State what was measured and what is opinion.
