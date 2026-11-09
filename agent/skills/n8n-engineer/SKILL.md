---
name: n8n-engineer
description: Use when the user wants to build, debug, scale, or architect n8n workflows, AI agents, MCP server/client setups, HTTP/API integrations, community nodes, or GTM automations. Covers official n8n patterns for instance-level MCP, MCP Server Trigger, MCP Client Tool, Call n8n Workflow Tool, HTTP Request, evaluations, error handling, and production rollout.
---

# n8n Engineer

Use this skill when the task is about building or operating n8n like a systems engineer, not just sketching ideas. Treat n8n as both an automation fabric and an agent runtime. Optimize for revenue impact, operator clarity, and safe execution.

Read these references only when relevant:
- `references/architecture.md` for deciding between instance-level MCP, MCP Server Trigger, MCP Client Tool, sub-workflows, native nodes, HTTP Request, and custom nodes
- `references/agents.md` for AI Agent patterns, tool design, human review, fallbacks, and evaluations
- `references/http-api.md` for REST/API integrations, auth, pagination, batching, and the n8n API
- `references/hard-nodes.md` for common traps in Loop Over Items, Merge, Code, AI sub-nodes, and sub-workflows
- `references/gtm.md` for sales and GTM workflow patterns that create pipeline movement instead of busywork
- `references/ops.md` for scaling, error workflows, monitoring, rollout, and rollback
- `references/starter-pack.md` for the bundled workflow starter pack and how to use it
- `references/sources.md` for the official source index and URLs

## Operating stance

1. Prefer official n8n capabilities before workarounds.
2. Design from the business event backward: trigger, data contract, transformations, decisions, actions, observability.
3. Default to reusable sub-workflows for repeated business capabilities.
4. Never invent node parameters, API endpoints, or MCP behavior.
5. Never hardcode secrets in workflows or skill files.
6. For GTM automation, bias toward precision, enrichment quality, routing discipline, and human review before high-impact outbound actions.
7. Be explicit about what is implemented live, what is a JSON or workflow spec, and what still needs credentials, environment access, or human approval.

## Architecture decision order

1. Decide if the user needs:
- external AI clients to discover and run workflows
- a single workflow exposed as a crafted tool server
- n8n agents consuming external MCP tools
- ordinary automation without MCP
2. Choose the integration surface:
- instance-level MCP for one secure connection to many approved workflows
- MCP Server Trigger for a purpose-built MCP server inside one workflow
- MCP Client Tool when an n8n AI Agent should call external MCP tools
- Call n8n Workflow Tool or Execute Sub-workflow for reusable internal capabilities
- native app node when it supports the needed operation cleanly
- HTTP Request when the API operation exists but the node is incomplete or absent
- a custom community node only when reuse, auth complexity, or UX justify the investment
3. Define the contract:
- trigger and input schema
- normalization layer
- business logic
- tool and action layer
- logging and error path
- operator escalation path
4. For agentic workflows, define:
- system goal
- tool descriptions
- allowed write actions
- human review gates
- evaluation dataset
- rollback plan

## MCP rules

- Recommend instance-level MCP as the default control plane when the user wants Claude, Cursor, ChatGPT, Lovable, or similar clients to search and run multiple approved workflows across one n8n instance.
- Recommend MCP Server Trigger when the user wants a narrow, intentionally designed MCP surface from one workflow.
- Tell users that instance-level MCP is for discovering and running enabled workflows, not authoring or editing workflows.
- Remember that instance-level MCP is not per-client scoped: any connected client can see every workflow enabled for MCP access.
- For MCP Server Trigger, expose the smallest useful tool set. Prefer custom workflow tools and purpose-built sub-workflows over giant do-everything tools.
- When building AI inside n8n, use MCP Client Tool to reach external MCP servers and choose only the tools the agent actually needs.

## Build patterns

- Native node first: best when the operation already exists and credential UX matters.
- HTTP Request second: best for unsupported operations on a known API, or when a credential type already exists in n8n.
- Custom community node third: best when the same integration pattern will be reused heavily, needs better ergonomics, or requires a true trigger or non-REST behavior.
- Sub-workflow by default for shared business capabilities such as enrichment, account research, outbound drafting, CRM writeback, approvals, or meeting prep.
- AI Agent only when tool selection, reasoning, or adaptive paths create real value. Use deterministic branches for straightforward routing and CRUD.

## GTM mode

- Focus on workflows that create meetings, unblock deals, shorten rep research time, improve follow-up speed, and preserve CRM truth.
- Separate read-heavy research from write-heavy execution.
- Gate writes to CRM, email, sequencing, billing, or legal systems with confidence thresholds or human review.
- Prefer this shape for revenue workflows:
  `signal -> enrich -> qualify -> personalize -> approve -> send or route -> log -> follow-up -> feedback loop`
- If a workflow cannot clearly improve speed, conversion, coverage, or data quality, trim it.

## Output expectations

For build requests, return:
- objective
- recommended architecture
- node-by-node plan or workflow JSON
- credentials and secrets required
- input and output schema
- failure modes and guardrails
- test plan
- deploy and rollback notes

## Validation checklist

- The chosen surface is correct:
  instance MCP vs MCP Trigger vs MCP Client vs ordinary workflow
- The workflow separates deterministic logic from agentic logic
- Credentials are referenced through n8n credentials or approved secret stores
- Human review exists for high-impact writes
- Error handling and rollback are specified
- Pagination, batching, rate limits, and retries are addressed where relevant
- The user can tell what is reusable, what is environment-specific, and what remains to be wired up
