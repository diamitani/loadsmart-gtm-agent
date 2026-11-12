---
name: la-daily-report
description: Step 7 of Loadsmart's ABM pipeline. Pulls the day's pipeline, sequence and rep activity numbers per pod and product, flags leaks against thresholds, and answers questions like "how is pod 2 doing" or "which accounts are single-threaded". Use for daily ABM reports, dashboard data, or program health questions.
---

# la-daily-report: the honest daily numbers

**Runs:** daily 17:00 CT, and on demand. **Reads:** Salesforce (accounts, contacts, activities, opportunities), Gong (flow stats, tasks). **Writes:** dashboard dataset (`dashboard-data.csv` in the format of `templates/dashboard-import-template.csv`), a Slack digest.

## Numbers per pod (and per product)

Funnel: accounts active -> accounts with a fresh signal -> covered accounts (2+ personas) -> contacts verified -> briefs ready -> emails approved -> enrolled -> replied -> meetings held -> stage 2 opportunities.

Activity: emails sent, delivered, hard bounced, replied (positive / negative); call tasks due vs done within 2 days; LinkedIn tasks due vs done; disqualifications with reason codes.

## Leak flags (thresholds are starting assumptions; replace with baseline after 30 days)

| Flag | Rule |
| --- | --- |
| List leak | Pod acceptance (kept / assigned) under 80% |
| Timing leak | Under 50% of active accounts with a signal under 60 days old |
| Coverage leak | Under 70% of accounts covered |
| Data leak | Hard bounce over 2% (over 3% = pause sends for the pod) |
| Copy leak | Replies under baseline while delivered and coverage are healthy |
| Follow-through leak | Under 70% of call/LinkedIn tasks done within 2 days |
| Conversion leak | Meetings held but under baseline stage 2 conversion |

Always name the **highest** leaking stage first: a stage below a leak is probably a symptom.

## Answering questions

Answer with the number, the period, the pod and the source system. If a number is missing, say which system or field is missing; never estimate. Opens are shown only as a deliverability check, never as success.
