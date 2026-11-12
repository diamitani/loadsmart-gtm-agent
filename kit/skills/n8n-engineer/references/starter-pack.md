# Starter Pack

This skill ships with importable starter workflows under `assets/workflows/`.

## Included templates

- `gtm-account-research-copilot.json`
  chat-first research copilot with a self-contained sub-workflow tool pattern
- `gtm-outbound-personalization-gateway.json`
  approval-gated outbound drafting skeleton
- `gtm-deal-acceleration-orchestrator.json`
  at-risk deal triage and executive-summary skeleton
- `mcp-server-gtm-skeleton.json`
  purpose-built MCP server starter for GTM playbooks

## How to use them

1. Import the JSON into n8n.
2. Read the sticky notes first. They mark where credentials, tool descriptions, or downstream writes need to be wired.
3. Replace sample triggers with your real trigger:
- webhook
- schedule
- app trigger
- chat trigger
- instance-level MCP exposure
4. Replace placeholder inputs and sample fields with your environment schema.
5. Add native nodes first, then HTTP Request nodes where the native node is incomplete.
6. Add approval gates before CRM writes, email sends, or sequence enrollment.
7. Publish only after testing and wiring an error workflow.

## Design intent

The templates are deliberately opinionated but still skeletal:
- importable in n8n
- easy to adapt
- separated between deterministic routing and agentic reasoning
- safe to extend without pretending to know your CRM IDs, credential names, or private endpoints

For production builds, pair these templates with:
- `references/architecture.md`
- `references/agents.md`
- `references/http-api.md`
- `references/ops.md`
