# Enably PRD — implementation status

Tracks the original *Enably Product Requirements Document* against this repo.

| PRD requirement | Status | Where |
|---|---|---|
| ICP Builder agent | ✅ ICP Architect skill (one segment per ICP, JSON export) | `agent/skills/icp`, `lib/pal/templates.ts` |
| Persona Generator agent | ✅ | `agent/skills/personas` |
| Use Case Creator agent | ✅ new `use_cases` asset | `agent/skills/use-cases` |
| Value Proposition agent | ✅ positioning & messaging | `agent/skills/messaging` |
| Lead Generation agent (Clay, Apollo) | ✅ Apollo native, Clay via MCP | `lib/connectors` |
| Prospecting / SDR Assistant + CRM sync | ✅ 15 tools, approval-gated | `lib/connectors/sdr-tools.ts` |
| Chat with history + memory, streaming | ✅ conversations persisted; knowledge RAG | `app/api/chat`, `lib/agent/knowledge.ts` |
| Document generation + auto-save to dashboard | ✅ Library, versioned, `.md` download | `/app/library` |
| Manual uploads + knowledge base | ✅ text files, pasted text, URLs | `/app/knowledge` |
| Integrations via API keys | ✅ env-based, status in Settings | `docs/CONNECTORS.md` |
| Supabase Postgres + RLS (multi-tenant) | ✅ tested on Postgres 16 | `supabase/migrations` |
| Sales activity tracker (Enablement Assistant) | ✅ | `/app/activity` |
| Dashboard (projects, agents, docs, uploads) | ✅ Runs, Library, Knowledge, Agents | `/app/*` |
| Auth (OAuth + Supabase Auth) | ⏳ access-code gate today; RLS policies ready | `proxy.ts` |
| PDF / DOCX / PPT upload parsing | ⏳ text formats only | next step |
| pgvector semantic search | ⏳ BM25 today, same interface | `lib/agent/knowledge.ts` |
| PDF / DOCX export | ⏳ Markdown export today | next step |
| Bi-directional CRM sync | ⏳ HubSpot write + read; scheduled sync not yet | — |
| Team roles, collaboration, Chrome extension | ⏳ post-MVP | — |

Success metrics from the PRD are measurable from stored data: time to first draft (`runs.duration_ms`), documents generated (`artifacts`), connectors connected (Settings), agent engagement (`conversations`, `activities`).
