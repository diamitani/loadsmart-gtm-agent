# `agent/` — the GTM Architect's brain (harness-agnostic)

Plain Markdown/YAML so the same agent can run in this app (Vercel AI SDK), Claude Code, Cursor, n8n, or any harness.

| Folder | What lives here | Used by |
|---|---|---|
| `instructions/` | System prompt (`system.md`) + guardrail map | `lib/agent/instruct.ts` |
| `agents/` | Orchestrator + subagent definitions, PAL agent contracts | docs + routing |
| `skills/` | One `SKILL.md` per capability (ICP, personas, messaging, outbound, competitive, KPI, playbook, prospector, n8n engineer, One Must Act, POP, calibrated truth, PAL process) | loaded into the build prompt for each asset |
| `references/` | PAL intake schema, evidence ledger, run manifest | PAL process |
| `workflows/` | n8n starter workflows (import into n8n) | delivery / automation |

To change how an asset is written, edit its `SKILL.md` — no code change needed.
