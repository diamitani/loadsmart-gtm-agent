# PAL Agent and Subagent Contracts

Each PAL step is implemented as a focused agent with narrow authority, explicit inputs, bounded outputs, and handoff contracts. Agents may call subagents only for the sub-tasks listed in their contract.

## Universal contract

Every PAL agent must:

- Read its assigned skill contract before acting.
- Accept a `run_key`, `source_task_gid`, `pipeline_version`, and latest run manifest.
- Write only idempotent updates keyed by source task GID and artifact ID.
- Return structured JSON plus a human-readable summary.
- Cite source artifacts for every factual claim.
- Stop and emit `pause_required` when required inputs, approvals, or confidence thresholds are missing.
- Append decisions, errors, retries, and write-backs to the audit log.

## PAL-01 Event Intake Agent

**Mission:** convert a webhook event into a claimed, resume-safe PAL run.

**Inputs:** signed webhook payload, Asana task GID, pipeline version, allowlisted project and section IDs.

**Subagents:**

- **Signature Verifier:** validates signature, timestamp, replay window, and event shape.
- **Asana State Fetcher:** retrieves task fields, memberships, attachments, comments, and current URL.
- **Run Claim Manager:** creates or resumes the run key and dedupe record.

**Outputs:** task snapshot, run key, intake eligibility decision, initial run manifest.

**Exit gates:** task must be in the Requests section; otherwise exit without mutation beyond audit logging.

## PAL-02 Intent Compiler Agent

**Mission:** transform the source task into a normalized intent brief.

**Inputs:** task snapshot, request form fields, attachments, prior comments, run manifest.

**Subagents:**

- **Field Normalizer:** maps form fields to canonical PAL schema using stable GIDs.
- **Risk Scanner:** identifies dates, dependencies, approvals, customer impact, and unsafe assumptions.
- **Clarification Planner:** drafts one focused approval or clarification request when gaps are material.

**Outputs:** intent brief, unknowns list, research targets, gap decision.

**Exit gates:** material gaps must produce a single posted clarification and a paused run state.

## PAL-03 RAG-DAL Evidence Agent

**Mission:** retrieve and extract evidence into a decision-grade ledger.

**Inputs:** intent brief, research targets, approved source policy, pass limit.

**Subagents:**

- **Source Planner:** ranks official, primary, internal, and approved secondary sources.
- **Retriever:** collects sources within the maximum pass budget.
- **Extractor:** extracts claims, dates, owners, dependencies, confidence, and contradictions.
- **Coverage Auditor:** reports coverage by acceptance criterion and flags weak areas.

**Outputs:** evidence ledger, source index, coverage report, contradiction log.

**Exit gates:** stop after the configured pass limit and pause when confidence is insufficient.

## PAL-04/05 Build Package Agent

**Mission:** convert intent and evidence into useful delivery artifacts.

**Inputs:** intent brief, evidence ledger, coverage report, approved templates.

**Subagents:**

- **JTBD Designer:** creates jobs-to-be-done outcomes and acceptance criteria.
- **NPAO Planner:** identifies needs, problems, alternatives, and outcomes with dependencies and safe dates.
- **Artifact Composer:** creates brief, PRD, architecture, manifest, and source index.
- **Quality Reviewer:** validates traceability, completeness, tone, and publish readiness.

**Outputs:** build package, quality report, artifact manifest, publish recommendation.

**Exit gates:** all deliverables must trace back to accepted evidence or explicit assumptions.

## PAL-06 Publishing Agent

**Mission:** publish approved artifacts back to the workspace without duplicate or unsafe writes.

**Inputs:** build package, quality report, publish approval, target adapters, run manifest.

**Subagents:**

- **Approval Checker:** verifies explicit approval and approver identity.
- **Asana Publisher:** upserts parent task overview, status, subtasks, and backlinks.
- **Page Publisher:** publishes pages where supported by workspace policy.
- **SharePoint Publisher:** writes approved files and records durable links.
- **Manifest Finalizer:** closes the run with all artifacts, links, metrics, and rollback pointers.

**Outputs:** published artifacts, backlinks, final run manifest.

**Exit gates:** no final publish occurs without explicit approval.

## PAL-99 Shared Operations Agent

**Mission:** keep the system reliable, observable, and reversible.

**Subagents:**

- **Retry Controller:** bounded retry with dead-letter escalation.
- **Reconciler:** scheduled comparison of Asana state, run state, and artifact registry.
- **Metrics Collector:** cost, latency, pass count, quality score, and approval cycle metrics.
- **Audit Logger:** append-only record of decisions, errors, and mutations.
- **Rollback Manager:** restore previous published state when an approved rollback is requested.
