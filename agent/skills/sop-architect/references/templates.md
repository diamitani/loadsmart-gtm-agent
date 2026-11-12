# SOP templates

## Contents
- SOP
- Checklist
- Quick reference
- Training course module
- JSON schema
- Worked example

## SOP

```markdown
# SOP-[###]: [Title]
Role / department: [ ] | Owner: [ ] | Version: [ ] | Last reviewed: [date]

## Purpose and scope
- Purpose: [why this exists, outcome]
- In scope: [ ] | Out of scope: [ ]

## Tools and access
| Tool | Access level needed | Who grants it |
|---|---|---|

## Steps
| # | Owner | Action | Tool | Output | If / then |
|---|---|---|---|---|---|
| 1 | | | | | |

## Outcomes and metrics
| Metric | Definition | Target (user-supplied) |
|---|---|---|

## Best practices
- 

## Common mistakes and fixes
| Mistake | Fix |
|---|---|

## References
- [Internal doc / tool doc link]

## Review cadence
- Review every [quarter] by [owner]; change log below.

## Change log
| Date | Change | By |
|---|---|---|
```

## Checklist

```markdown
## Checklist: [SOP title]
- [ ] Step 1: [action] (owner)
- [ ] Step 2: ...
Done when: [observable outcome]
```

## Quick reference

One page: when to use, 5 to 7 key steps, the 3 most common mistakes, who to ask.

## Training course module

```markdown
# Module [n]: [Title] | Duration: [ ]
Objectives: by the end, the learner can [verb] [skill].
Lessons:
1. [Lesson]: [summary]
Exercise: [real task or role-play], success looks like [ ].
Quiz:
1. [Question] (Answer: [ ])
Completion check: [manager signs off on X]
```

Example course arc (AE onboarding, 4 weeks): Week 1 product and ICP / Week 2 discovery practice / Week 3 demo and objection handling / Week 4 pipeline management and forecasting habits. Each week ends with an exercise and quiz.

## JSON schema

```json
{
  "sop_id": "string", "title": "string", "role": "string", "owner": "string",
  "tools": ["string"],
  "steps": [{"n": 1, "owner": "string", "action": "string", "tool": "string", "output": "string", "branches": ["string"]}],
  "metrics": [{"metric": "string", "definition": "string"}],
  "review_cadence": "string",
  "assumptions": ["string"]
}
```

## Worked example

"SOP for handling inbound demo requests in HubSpot for BDRs":
1. BDR: confirm the request is logged in HubSpot as a contact with lifecycle stage set. Output: contact record.
2. BDR: enrich company and role (enrichment tool `[tool]`). Output: filled firmographic fields.
3. BDR: qualify against ICP; if not a fit -> send nurture template and close; if fit -> continue.
4. BDR: assign to AE within the response-time target (Assumption: 2 business hours; validate).
5. BDR: send confirmation email with booking link; log the activity.
Metrics: time to first response, request-to-meeting rate.
