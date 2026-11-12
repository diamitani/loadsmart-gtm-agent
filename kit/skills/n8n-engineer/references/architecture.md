# n8n Architecture Guide

This file captures the recommended architecture for serious n8n build work. It is based on official n8n docs and blog guidance, plus explicit design inferences called out below.

## Best architecture call

Recommended default stack for an "ultimate n8n engineer":

1. Instance-level MCP as the external control plane when users want AI clients to discover and run many approved workflows.
2. MCP Server Trigger for purpose-built tool servers that expose a narrow, business-safe capability surface.
3. AI Agent plus tool nodes for adaptive reasoning inside n8n, with sub-workflows used as reusable capabilities.
4. Native nodes first, HTTP Request second, custom node last.
5. Error workflows, human review, evaluations, and rollback plans as mandatory production guardrails.

This is an inference from the official docs:
- Instance-level MCP is best for centralized authentication and workflow discovery.
- MCP Server Trigger is best for a custom single-workflow tool surface.
- MCP Client Tool is best when n8n consumes external MCP tools.

## Decision matrix

### Instance-level MCP

Use when:
- One n8n instance should expose many approved workflows to AI clients.
- Centralized auth matters.
- Workflow discovery by name and description matters.

Official behavior:
- One connection per instance.
- Centralized authentication.
- Each workflow must still be explicitly enabled for MCP access.
- Clients can search enabled workflows, read metadata, and trigger them.
- This does not let the AI client author or edit workflows.
- Connected clients are not isolated from each other at the workflow-visibility level.

Use this for:
- "Let Claude or Cursor run my approved playbooks."
- "Expose our operations catalog to an AI client."

### MCP Server Trigger

Use when:
- You want a narrow MCP server from one workflow.
- You want to hand-design tool behavior and tool scope.
- You want a workflow to behave like a productized tool server.

Official behavior:
- The trigger exposes a URL for MCP clients.
- It only connects to tool nodes.
- It supports SSE and streamable HTTP.
- You can expose workflows through custom workflow tools.

Use this for:
- "Create an MCP server that only researches accounts and drafts outreach."
- "Expose a safe CRM read server without exposing the rest of the instance."

### MCP Client Tool

Use when:
- An n8n AI Agent should call tools from another MCP server.

Official behavior:
- Supports Bearer, generic header, and OAuth2 auth.
- Lets you include all tools or only selected tools.

Use this for:
- "Let our n8n agent use Notion MCP, Stripe MCP, or internal MCP tools."

### Call n8n Workflow Tool and Execute Sub-workflow

Use when:
- You need internal reuse.
- You want tool-shaped access to reusable logic.
- You want a clean contract between workflows.

Choose:
- `Call n8n Workflow Tool` when an AI Agent should call the workflow as a tool.
- `Execute Sub-workflow` when ordinary workflow logic should call another workflow deterministically.

## Native node vs HTTP Request vs custom node

### Native node

Choose when:
- The node already supports the required action.
- Credential UX, maintainability, and operator friendliness matter most.

### HTTP Request

Choose when:
- The API operation exists, but the node does not expose it.
- The integration is real but not reusable enough to justify a custom node.
- You can reuse predefined credentials or configure generic auth cleanly.

Official guidance:
- n8n recommends predefined credential types when available.
- Use HTTP Request for custom API operations.
- Import curl when docs provide curl examples.

### Custom community node

Choose when:
- The same API pattern will be reused repeatedly across workflows.
- A true trigger is needed.
- The integration is non-REST, needs external dependencies, or needs custom transforms.
- Better UX and long-term maintainability justify the build cost.

Official guidance:
- Use declarative style for most REST nodes.
- Use programmatic style for triggers, non-REST APIs, external dependencies, or incoming-data transforms.
- Use the official `n8n-node` tool to scaffold and test nodes.

## Layered blueprint

### Layer 1: Entry

Possible entry points:
- Webhook
- App trigger
- Schedule
- Chat Trigger
- Instance-level MCP
- MCP Server Trigger

### Layer 2: Normalize

Tasks:
- Validate required fields
- Normalize identifiers
- Map external payloads to an internal schema
- Enrich with environment metadata

### Layer 3: Decide

Use:
- Deterministic branches for thresholds, routing, compliance, and obvious business rules
- AI Agent only where real ambiguity or tool selection exists

### Layer 4: Act

Examples:
- CRM update
- research sub-workflow
- outbound draft
- meeting brief
- approval request
- sequence enrollment

### Layer 5: Observe

Always define:
- execution logs
- error workflow path
- escalation target
- rollback path

## Recommended default for sales and GTM

For revenue teams, a strong default is:

1. Trigger on a revenue signal.
2. Normalize and enrich the account and contact context.
3. Route through deterministic qualification rules first.
4. Use AI only for research synthesis, personalization, summarization, or tool choice.
5. Require approval before high-impact writes or sends.
6. Write every important result back to the source of truth.
7. Feed outcomes into evaluation and iteration.

This GTM blueprint is design guidance inferred from the official n8n agent, MCP, HITL, and production-practices docs.
