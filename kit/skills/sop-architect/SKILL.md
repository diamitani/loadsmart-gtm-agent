---
name: sop-architect
description: Turns any process, role or tool workflow into clear Standard Operating Procedures, checklists, quick-reference guides, role onboarding handbooks and multi-module training courses with objectives, lessons, exercises and quizzes, from prompts, meeting notes, transcripts or existing docs. Use when the user asks for an "SOP", "process doc", "runbook", "checklist", "onboarding guide", "training course", "how we do X", "document this process", or "ramp plan for new BDRs/AEs". Versions by startup vs enterprise and technical vs non-technical audience.
metadata:
  author: Patrick Diamitani
  version: 1.0.0
  plugin: enably
---

# SOP Architect

Codifies how work gets done so anyone can repeat it and get the same result: who does what, with which tool, in what order, and how you know it worked.

**Graph position:** utility node. Consumes any process (from `sales-playbook-architect`, `clay-gtm-architect`, `gtm-automation-engineer`, user notes). Feeds `sales-enablement-assistant` and team onboarding.

## Rules

1. Never invent compliance or legal requirements. If a step may have one, flag it: "Check whether [requirement] applies".
2. Every step is an action with a role owner. No vague steps ("ensure quality").
3. Tool-specific clicks only when the tool is confirmed; otherwise describe the action and mark the tool `[tool]`.
4. Flag every assumption inline as `Assumption:` so the user can validate it.

## Step 1: Intake

| Input | If missing |
|---|---|
| Process or role | Ask |
| Who performs it (role, team) | Ask or infer |
| Tools involved | Ask; else generic |
| Format: SOP, checklist, quick reference, course, handbook | Default SOP + checklist |
| Audience: technical or not; startup or enterprise | Default non-technical startup |

**Adaptive logic:**
- Role only -> onboarding guide + the top 5 SOPs for that role (titles first; build on request).
- Process only -> one end-to-end SOP.
- Uploaded doc or transcript -> convert to SOP; list the gaps found as questions.
- Training requested -> course (Objectives, Lessons, Exercises, Quiz).

## Step 2: Context

Reuse upstream Enably outputs (playbooks, automation runbooks, Clay runbooks). From transcripts, pull the steps people actually described and quote ambiguities back as questions.

## Step 3: Build

Use `references/templates.md`.

1. Map the process first as a short numbered flow with decision points, so the user can confirm the shape.
2. Write the SOP: ID and title, role, purpose and scope, tools and access, numbered steps (owner, action, tool, output, decision branches), outcomes and metrics, best practices, common mistakes and fixes, references, review cadence and owner.
3. Add the matching **checklist** (one line per step, checkbox).
4. **Startup** version: fewer approvals, fastest path. **Enterprise** version: add approvals, governance, audit trail, separation of duties.
5. For **courses**: modules with objectives, lesson summary, exercise (role-play, real task), 3 to 5 quiz questions with answers, and a completion check.
6. Offer a Mermaid flowchart when there are 2 or more decision branches.

## Step 4: Quality loop (max two passes)

- [ ] A new hire could follow it without asking anyone.
- [ ] Every step has an owner and a visible output.
- [ ] Decision branches cover the common exceptions.
- [ ] Metrics measure the process outcome (speed, quality, conversion).
- [ ] Assumptions flagged; no invented compliance.
- [ ] Review cadence and owner set.

## Step 5: Hand off

Markdown for Notion or Confluence, document tool if available, JSON for LMS import on request. Next step line, usually: "Want the training course version for onboarding?"

## References

| File | Read when |
|---|---|
| `references/templates.md` | SOP, checklist, course module, quick reference, JSON |
