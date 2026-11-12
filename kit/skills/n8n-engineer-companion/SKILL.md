---
name: n8n-engineer-companion
description: Companion engineering skill for configuring, credentialing, testing, and operating the Loadsmart 6-Step Prospect Automation n8n workflow and companion Error Alert handler safely in production.
---

# n8n Engineer Companion (Loadsmart Stack)

Operational handbook for deploying and maintaining `00-loadsmart-6step-prospect-engine.json` and `05-loadsmart-error-alert-handler.json` inside Loadsmart's n8n instance.

## Stack Credentials Checklist

Configure these credentials inside n8n Credentials Manager (never hardcode keys inside JSON nodes):

1. **Salesforce OAuth2**: Read `Account`, `Opportunity`, `Contact`; write `Task` / ABM custom fields (`ABM_Pod__c`, `ICP_Score__c`).
2. **Anthropic / Claude API (`ANTHROPIC_API_KEY`)**: Powers Step 4 synthesis & Step 5 PAS copywriting (`claude-sonnet`).
3. **Clay Webhook & Waterfall Keys**: Inbound/outbound webhook connecting ZoomInfo, Apollo, Hunter, Prospeo.
4. **Perplexity / Search API**: Step 1 signal discovery & Step 4 SEC/news research.
5. **Gong Engage / Apollo API**: Step 6 sequence enrollment (inactive while `dry_run = true`).
6. **Slack Bot / Incoming Webhook**: Routes Step 6 approval cards (`#gtm-pod-approvals`) and `05` error alerts (`#gtm-ops-alerts`).

## Rollout Protocol (Safe Mode -> Live)

1. Import `00-loadsmart-6step-prospect-engine.json` and `05-loadsmart-error-alert-handler.json`.
2. Assign `05-loadsmart-error-alert-handler` as the Error Workflow in Workflow Settings.
3. Keep `dry_run = true` and `require_approval = true` inside the `Config & Guardrails` node.
4. Trigger manually on **2 test domains** and inspect:
   - Did Salesforce Shield quarantine an existing customer?
   - Did Step 4 attach real source URLs + dates?
   - Did Step 5 Claims Linter reject unapproved numbers?
   - Did Step 6 pause at Slack preview without enrolling?
5. Only after RevOps + Pod Lead sign-off, toggle `dry_run = false` for Pod 1 at 10 accounts/day.
