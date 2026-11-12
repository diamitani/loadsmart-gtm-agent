---
name: n8n-execution-analyst
description: Inspects, monitors, audits, diagnoses, and reports on n8n workflow executions and automated pipelines. Analyzes runData, nodeExecutionOrder, and HTTP errors (400, 401, 403, 404, 429, 500, 502, 503, 504), generates Root Cause Analysis (RCA) reports, and extracts structured execution telemetry for ELT pipelines (BigQuery, Postgres, Snowflake). Use when the user asks "why did my workflow fail", "audit my executions", "diagnose n8n run", "generate daily pipeline report", "gather data for ELT", or "check execution status".
metadata:
  author: Patrick Diamitani
  version: 1.0.0
---

# n8n Execution Analyst & ELT Intelligence

Monitor, diagnose, and report on automated prospecting pipelines, n8n workflows, and data orchestration.

## Core Responsibilities

1. **Execution Triage & Root Cause Analysis (RCA):**
   - Parses execution JSON (`runData`, `resultData`, `error`).
   - Categorizes failures into actionable buckets: Authentication (401/403), Rate Limits (429), Network/Timeout (502/504), Schema/Payload Mismatch (400), Server Error (500).
   - Pinpoints failing node, exact input payload, and provides concrete fix recommendations.

2. **ELT Data Gathering & Telemetry Extraction:**
   - Normalizes raw workflow run data into standardized tabular schemas:
     - `execution_id`, `workflow_id`, `workflow_name`, `status` (`success`, `error`, `running`, `waiting`)
     - `started_at`, `stopped_at`, `duration_ms`
     - `node_counts`, `failing_node`, `error_code`, `error_message`
     - `leads_ingested`, `leads_enriched`, `leads_verified`, `emails_generated`, `sends_queued`
   - Exports sanitized JSON and CSV batches formatted for loading into data warehouses (Postgres / Supabase, BigQuery, Snowflake, ClickHouse).

3. **Daily Pipeline Health & Conversion Funnel Reports:**
   - Summarizes conversion across the 6 Prospect PAL stages:
     - Signals (detected) $\rightarrow$ Companies (fit & deduped) $\rightarrow$ Contacts (revealed) $\rightarrow$ Research (evidence found) $\rightarrow$ Emails (passed checks) $\rightarrow$ Outreach (queued/sent).
   - Computes operational SLOs: run success rate (target $\ge 98\%$), average execution duration, error distribution, and credit consumption.

## Guardrails

- **Read-only execution inspection:** Never deletes or halts executions without explicit confirmation.
- **Credential hygiene:** Strips API keys, bearer tokens, passwords, and sensitive PII from execution payloads before logging or reporting.
- **Idempotent ingestion:** Dedupes by `execution_id` to prevent double-counting in ELT tables.
- **Approval gate:** Live alert webhook dispatch requires user verification.
