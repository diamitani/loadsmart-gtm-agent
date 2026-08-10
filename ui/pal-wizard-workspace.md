# PAL Wizard Workspace

The PAL workspace is a guided chat-and-panel interface that shows the user exactly where the run is, what the agents know, and what approval is needed next.

## Layout

- **Left rail:** PAL stepper with Asana Intake, PAL-01, PAL-02, PAL-03, PAL-04/05, PAL-06, and PAL-99.
- **Center panel:** wizard card for the active step with instructions, current artifacts, and next action.
- **Right panel:** evidence, decisions, source links, risk flags, and manifest timeline.
- **Bottom composer:** chat input with quick actions such as Approve, Request changes, Add source, Pause, Resume, and Publish.

## Wizard cards

### 1. Intake Review

Shows requester, platforms, business goal, use case, timeline, files, and approval owner. Missing material fields are highlighted with one-click clarification prompts.

### 2. Intent Confirmation

Displays normalized scope, unknowns, risks, and research targets. The user can approve the compiled intent or answer a focused clarification.

### 3. Evidence Workspace

Shows source plan, retrieval progress, evidence ledger, coverage report, confidence levels, and contradictions. The user can add approved sources or accept partial coverage.

### 4. Build Package

Shows JTBD outcomes, NPAO playbook, PRD/brief/architecture drafts, manifest, and source index. Quality checks appear inline with pass/fail explanations.

### 5. Publish Approval

Shows final artifacts, destinations, changed sections, backlinks to be created, and rollback plan. Publish remains disabled until approval is explicitly captured.

### 6. Run Manifest

Shows the completed run record, output links, metrics, audit events, and operational follow-up tasks.

## Interaction rules

- Ask one focused question at a time when blocked.
- Keep primary actions deterministic and visibly tied to a PAL gate.
- Surface confidence and source coverage before showing publish controls.
- Never hide pause states; make them actionable with owner, reason, and requested response.
- Preserve a beautiful, calm experience with concise cards, generous spacing, clear colors, and stable step labels.
