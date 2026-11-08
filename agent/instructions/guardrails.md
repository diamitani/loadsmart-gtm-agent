# Guardrails (enforced in code, documented here)

| Guardrail | Where it is enforced |
|---|---|
| Halt below W = 1.00, ask only for missing critical criteria | `lib/pal/foundation.ts` |
| Ungrounded operational data → non-blocking notice | `lib/pal/truth-guard.ts` |
| Quality gate score + verdict on every run | `lib/pal/quality-gate.ts` |
| Workflow webhook / outbound actions require approval | `lib/agent/tools.ts` (`needsApproval: true`) |
| Long runs hand off to a durable actor instead of timing out | `lib/pal/compressor.ts` watchdog + `workers/gtm-durable` |
| Every stage traced | `lib/observability/langsmith.ts` |
| Secrets server-side only | `lib/env.ts` (never sent to the browser) |
