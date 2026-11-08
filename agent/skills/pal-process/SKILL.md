# PAL Process Skill

Use this skill when working on Enably PAL intake-to-build runs, agent contracts, process design, or wizard-style workspace flows.

## Operating principles

1. Anchor every run to a stable Asana source task GID and pipeline version.
2. Prefer deterministic integration logic over open-ended reasoning.
3. Use AI only inside bounded contracts with explicit inputs, outputs, and stop conditions.
4. Treat approvals as gates, not suggestions.
5. Record every artifact, source, claim, decision, and write-back in the run manifest.

## Required reference files

Before executing a PAL run or changing PAL behavior, read:

- `references/pal-process/intake-schema.md`
- `references/pal-process/evidence-ledger.md`
- `references/pal-process/run-manifest.md`
- `agents/pal-process/agent-contracts.md`

## Step execution contract

For each step, produce:

- `status`: `complete`, `pause_required`, `skipped`, or `failed`.
- `inputs_read`: artifacts and source IDs used.
- `outputs_written`: artifacts and destinations written.
- `decisions`: approvals, assumptions, scope changes, or risk calls.
- `next_step`: the next PAL step or a required human action.

## Quality bar

A PAL output is acceptable only when it is:

- Clear enough for a stakeholder to understand without agent context.
- Traceable from output claim to source evidence.
- Safe about dates, dependencies, approvals, and customer commitments.
- Useful as a handoff to the next agent without hidden assumptions.
