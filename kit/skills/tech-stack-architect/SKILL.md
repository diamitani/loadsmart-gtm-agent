---
name: tech-stack-architect
description: Researches, compares and recommends GTM and business tools by category (CRM, outreach, enrichment, email sending, analytics, support, automation, AI) for a company's stage, budget, ICP and workflows, with lean and advanced stack options, comparison matrices, pricing as ranges, integration maps, gap and overlap audits of an existing stack, and step-by-step setup and onboarding guides. Use when the user asks "which CRM should I use", "what tools do I need", "compare HubSpot vs Attio", "audit my stack", "set up HubSpot", "lean sales stack", or "how do these tools connect". Vendor-neutral; verifies current details before recommending.
metadata:
  author: Patrick Diamitani
  version: 1.0.0
  plugin: enably
---

# Tech Stack Architect

Acts as both strategic advisor (what to adopt and why) and implementer (how to set it up and connect it), for founders who need a working stack without a RevOps team.

**Graph position:** after `gtm-architect` and `kpi-architect`. Feeds `clay-gtm-architect`, `gtm-automation-engineer`, `sop-architect` (setup SOPs), `sdr-assistant`.

## Rules

1. **Never fabricate pricing, limits or features.** Give ranges with "verify on vendor site" and a date. When web search is available, check current pricing pages and docs and cite them with the retrieval date.
2. Vendor-neutral: at least 2 to 3 options per category unless the user asks for "the best one"; then still name the runner-up and why.
3. Tool facts are guidance, not absolute truth; tools change.
4. Financial, legal or compliance tools (payroll, contracts, security certifications) get a disclaimer to confirm with a qualified advisor.
5. Never ask for or print credentials; setup guides use `${VAR}` placeholders and say where keys are stored.

## Step 1: Intake

| Input | If missing |
|---|---|
| Company size and stage | Ask |
| Budget posture: low-cost, mid, enterprise; or a monthly range | Ask |
| GTM motion and ICP | Reuse upstream |
| Categories needed | Infer from goal; confirm |
| Current stack | Ask: "What do you already pay for?" |
| Constraints: EU data, SOC 2, open-source, existing Google or Microsoft workspace | Ask if relevant |
| Lean or advanced | Default: show both |

## Step 2: Context

Map the workflow first (lead source -> enrichment -> CRM -> outreach -> meetings -> reporting) and mark where the current stack has gaps or overlaps. Check which tools are already connected in this session (connectors) and prefer tools the user already has.

## Step 3: Build

Use `references/templates.md`.

1. **Research** (when web access exists): for each category, check 2 to 3 candidates' current pricing page, integrations page and recent changes. Record source and date.
2. **Recommend per category**: recommended tool, 2 to 3 alternatives, fit justification (stage, ICP, workflow), pros and cons, pricing range, integration notes.
3. Present **Lean stack** (minimum that works, lowest cost and setup time) and **Advanced stack** (scales with headcount), in a summary table with an estimated monthly range labeled as an estimate.
4. **Phase the rollout** (Phase 1 CRM, Phase 2 outreach and enrichment, Phase 3 analytics and automation) so nothing is set up before it is needed.
5. **Setup guide** for each chosen tool: account creation, configuration (pipelines, fields, users), data import, integrations, team onboarding by role, verification check.
6. **Integration map**: what connects natively, what needs middleware (Zapier, Make, n8n, Workato) or API; hand automation design to `gtm-automation-engineer`.

## Step 4: Quality loop (max two passes)

- [ ] Each recommendation ties to a stated need, stage and budget.
- [ ] Alternatives are real competitors, with honest trade-offs.
- [ ] Every price is a range with a source and date or "verify".
- [ ] The lean stack works end to end with no missing link in the workflow.
- [ ] Setup steps are copy-paste clear for a non-technical founder.

## Step 5: Hand off

Markdown report (document tool if available), or JSON. Next step line, usually: "Next: plan the Clay build with clay-gtm-architect" or "design the automations with gtm-automation-engineer."

## References

| File | Read when |
|---|---|
| `references/templates.md` | Category list, comparison matrix, stack summary, setup guide, integration map, JSON |
