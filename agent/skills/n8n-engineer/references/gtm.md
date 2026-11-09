# GTM Automation Playbook

This file is design guidance inferred from official n8n capabilities for agents, MCP, tool review, evaluations, and production rollout. Use it when the user wants revenue workflows that actually move deals.

## GTM design principles

- Build for speed to action, not dashboard theater.
- Put the rep, AE, SDR, or AM at the center of the workflow.
- Favor account context, buying signals, and next-best action over generic volume.
- Make every workflow write back to the system of record.
- Separate research, decisioning, and execution so approvals are easy.

## High-value revenue workflows

### 1. Inbound qualification and routing

Pattern:
- form or webhook trigger
- normalize company and contact
- enrich firmographic and intent context
- deterministic qualification
- route owner
- create tasks and notes
- notify the rep with a concise brief

### 2. Account research copilot

Pattern:
- trigger from CRM stage change, list membership, or MCP request
- gather website, LinkedIn, news, technographics, prior activity, and open opp context
- synthesize into a rep brief
- optionally generate talk tracks and objection angles

Use AI for:
- synthesis
- hypothesis generation
- personalization

Do not use AI for:
- ownership rules
- territory logic
- stage transitions without checks

### 3. Outbound personalization engine

Pattern:
- target list or account event trigger
- enrich account and persona context
- generate personalized angle and draft
- human review for sends or sequence enrollment
- log draft and outcome back to CRM

### 4. Deal acceleration workflow

Pattern:
- stage change, meeting completion, or procurement signal
- compile timeline, blockers, stakeholders, and action items
- create follow-ups, internal tasks, and exec alerts
- escalate high-risk deals to humans fast

### 5. Post-call capture

Pattern:
- call transcript arrives
- summarize decisions, risks, competitors, and next steps
- create CRM note
- open tasks
- update mutual action plan
- produce a manager-ready summary

## Recommended GTM build shape

1. Signals
- inbound demo requests
- product usage spikes
- meeting completion
- champion replies
- closed-lost reason updates

2. Research
- enrich company
- enrich persona
- collect historical CRM context
- optional external MCP tools for deep research

3. Decision
- deterministic scoring and routing first
- agentic synthesis second

4. Action
- CRM update
- task creation
- draft creation
- approval request
- send or sequence enrollment

5. Feedback loop
- write outcomes back
- evaluate what improved meetings, reply rate, stage movement, or close rate

## Approval rules

Always consider human review for:
- first-touch outbound
- pricing or contractual language
- sequence enrollment
- CRM edits on active opportunities
- legal, finance, or procurement messages

## Anti-patterns

- one giant workflow that does everything
- agent deciding territory or compensation logic
- outbound sends with no approval path
- enrichment with no writeback discipline
- dashboards with no downstream action

## What "GTM assassin" should mean in practice

- compress research from hours to minutes
- surface the right action at the right account moment
- remove admin drag from reps
- preserve CRM quality
- create more qualified conversations and faster follow-up

If a workflow does not measurably improve one of those outcomes, redesign it.
