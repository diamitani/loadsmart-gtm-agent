---
artifact_type: observability
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: eng
reviewers: [architect, operator]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.98
---

# 18. Observability, Telemetry & Diagnostics

## 1. Tracing & LangSmith Integration
- Every run of the multi-agent pipeline is traced with metadata:
  - `session_id`, `pod_id`, `run_stage`, `model_used`, `tokens_consumed`, `latency_ms`.
  - When `LANGSMITH_API_KEY` is present, traces are exported to project `loadsmart-gtm-agent`.

## 2. Pod Health & Leak Detection Diagnostics
The system tracks 5 critical leak indicators:
- `LEAK_01`: Accounts dropped due to missing freight spend verification.
- `LEAK_02`: Accounts dropped due to lack of verified decision-maker emails.
- `LEAK_03`: Accounts halted by Salesforce territory collisions.
- `LEAK_04`: Accounts stalled in approval queue > 24 hours.
- `LEAK_05`: Mailboxes paused due to warm-up limits or bounce spikes.

## 3. Synthetic Health Check (`/api/health`)
- Automated probe verifying:
  - HTTP 200 response.
  - Active persistence mode (`local` or `supabase`).
  - Model gateway status.
