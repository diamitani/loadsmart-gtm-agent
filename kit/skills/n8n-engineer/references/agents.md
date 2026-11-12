# n8n Agent Patterns

Use this file when the task is about AI agents, multi-agent orchestration, approvals, or evaluation.

## Core official behaviors

- The AI Agent node now operates as a `Tools Agent` and must have at least one tool connected.
- `Call n8n Workflow Tool` lets an agent run another workflow and fetch its output.
- `AI Agent Tool` lets a primary agent delegate to specialized agents as tools.
- In AI sub-nodes, expressions resolve against the first input item, not each item.
- `$fromAI()` can dynamically fill tool parameters, but only for tools connected to the AI Agent.

## Recommended agent architecture

Use this structure by default:

1. Root agent:
- owns user goal
- decides which capabilities to call
- returns the final answer or action summary

2. Deterministic tools:
- CRUD
- lookup
- routing
- schema transforms
- validation

3. Sub-workflow tools:
- account research
- contact discovery
- personalization generation
- meeting prep
- CRM writeback
- post-call follow-up

4. Optional specialist agents:
- use `AI Agent Tool` only when a narrower specialist really improves accuracy or context management

## Tool design rules

- Write tool descriptions like contracts, not slogans.
- Tell the model exactly when to use the tool.
- Keep tool scope narrow.
- Return structured outputs whenever possible.
- Expose the smallest write surface possible.

Bad tool:
- "Use this for CRM."

Good tool:
- "Use this tool to create or update a HubSpot note after a meeting summary is approved. Input must include contact ID, company ID if known, note body, and meeting date."

## Human review

Official n8n guidance supports tool-level human approval.

Use human review when:
- tools send external communications
- tools modify production records
- actions are irreversible
- business impact is high
- compliance or brand risk exists

Recommended pattern:

1. Let the agent prepare the action.
2. Send the tool call for review through Slack, Teams, Telegram, email, chat, or a custom UI.
3. Show the exact tool name and parameters to the reviewer.
4. On approve, execute.
5. On deny, return control to the agent with a graceful fallback path.

System prompt guidance:
- tell the agent which tools require approval
- explain what to do if approval is denied
- ask the agent to propose alternatives when blocked

## Human fallback

Use human fallback when the agent cannot safely complete a task on its own.

Good fallback cases:
- low-confidence qualification
- missing data for a high-value account
- unclear compliance posture
- ambiguous send/no-send decision

Strong pattern:
- agent tries first
- workflow gathers missing context
- if still blocked, route to a human with the full trace and recommended next step

## Evaluations

Official n8n guidance separates evaluation into two stages:

- Light evaluation for pre-deployment iteration on a small dataset
- Metric-based evaluation for post-deployment regression and score tracking

Recommended working style:

1. Start with 5 to 20 representative examples.
2. Add edge cases every time the workflow fails in real life.
3. Evaluate before changing prompts, models, or tool descriptions.
4. Compare outputs across versions instead of trusting intuition.
5. For large workflows, evaluate reusable sub-workflows independently.

## Prompting and workflow-builder guidance

From n8n's AI Workflow Builder best practices:
- think in iterations
- be explicit about source apps, destination apps, and fields
- clearly describe the flow of data
- do not waste prompt space on role-play fluff

Translate that into build behavior:
- define the first working slice
- validate it
- then add branches, retries, approvals, and polish

## When to avoid an agent

Do not use an AI Agent just because it sounds advanced.

Prefer deterministic logic when:
- the route is obvious
- the rules are fixed
- the operation is a straightforward API call
- auditability matters more than adaptive reasoning

Use an agent when:
- tool choice depends on context
- research or synthesis matters
- the workflow must reason over incomplete information
- the user experience benefits from natural-language interaction
