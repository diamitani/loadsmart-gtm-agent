# PAL Intake-to-Build Automation

PAL is Enably's approval-aware intake-to-build operating model. It converts an Asana request into traceable product, architecture, and publishing artifacts through deterministic workflow steps and bounded agent reasoning.

## Process goals

- **Deterministic intake:** every run starts from an authoritative source task GID and versioned pipeline definition.
- **Bounded AI work:** agents operate against explicit contracts, reference files, and pass limits.
- **Approval-aware publishing:** material gaps, quality failures, and publish decisions pause the run instead of guessing.
- **Traceable artifacts:** every claim, decision, source, output, and write-back is recorded in a run manifest.
- **Resume-safe execution:** every step is idempotent and can resume from the last completed artifact.

## End-to-end PAL flow

| Step | Agent | Purpose | Primary output | Gate |
| --- | --- | --- | --- | --- |
| Asana Intake | Intake Form Agent | Capture requester, platform, goal, use case, timeline, and files. | Source Asana request task | Required fields complete |
| PAL-01 Event Intake | Event Intake Agent | Acknowledge webhook, verify project membership, fetch authoritative task state, and claim run key. | Run state and task snapshot | Task is in Requests section |
| PAL-02 Intent | Intent Compiler Agent | Normalize task by stable GID and compile goal, scope, risks, unknowns, and research targets. | Intent brief | Material gaps resolved or approved |
| PAL-03 RAG-DAL | Evidence Agent | Build tiered source plan, retrieve/extract evidence, and produce an evidence ledger. | Evidence ledger and coverage report | Sources meet confidence threshold |
| PAL-04/05 Package | Build Package Agent | Convert evidence into JTBD outcomes, NPAO playbook, core deliverables, and source index. | Delivery package | Quality and traceability pass |
| PAL-06 Publish | Publishing Agent | Confirm approval, upsert parent task, publish supported pages/files, and create subtasks/backlinks. | Published run manifest | Explicit publish approval |
| PAL-99 Shared Ops | Operations Agent | Run retries, reconciliation, audit logs, metrics, rollback, and artifact registry. | Operational ledger | Always active |

## Structured run process

1. **Create or update the Asana request** with the PAL request form fields.
2. **Trigger PAL-01** from the signed webhook and immediately acknowledge receipt.
3. **Claim a run key** using `{source_task_gid}:{pipeline_version}` to prevent duplicate processing.
4. **Compile intent** from authoritative task fields and attachments; do not rely on display labels alone.
5. **Pause for clarification** when there is a material gap, conflicting approval state, or missing source dependency.
6. **Run evidence collection** with official and primary sources first, then approved secondary sources if needed.
7. **Package deliverables** only from ledger-backed claims and record acceptance criteria for each job-to-be-done.
8. **Run quality gates** for completeness, traceability, safe dates, dependency coverage, and publish readiness.
9. **Request publish approval** and pause if approval is not present.
10. **Publish idempotently** to the parent task, pages, SharePoint, or subtasks depending on adapter support.
11. **Finalize the run manifest** with artifacts, backlinks, metrics, cost, decisions, and rollback pointers.

## Human approval points

- Material scope, dependency, or evidence gaps.
- Contradictory source claims that affect deliverables.
- Any unsafe assumption about dates, platforms, legal/regulatory constraints, customer commitments, or external dependencies.
- Final publication of customer-facing or stakeholder-facing artifacts.
