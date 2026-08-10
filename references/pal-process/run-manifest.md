# PAL Run Manifest

## Manifest sections

- Run identity: run key, source task GID, pipeline version, environment, and timestamps.
- Current state: active PAL step, status, pause reason, retry count, and owner.
- Inputs: source task snapshot, attachments, comments, and referenced artifacts.
- Outputs: intent brief, evidence ledger, package artifacts, published links, and subtasks.
- Decisions: approvals, clarification answers, assumptions, risk decisions, and quality gates.
- Audit log: every mutation, retry, exception, reconciliation result, and rollback pointer.
- Metrics: latency, token/cost estimate, retrieval pass count, artifact count, and quality score.

## Idempotency rule

Every write must be keyed by source task GID, pipeline version, artifact type, and destination. If the target already contains the current artifact hash, skip the write and record a no-op audit event.
