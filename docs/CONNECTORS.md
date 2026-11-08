# Connectors & MCP

The Architect has two kinds of tools:

1. **Build pipeline** — writes GTM assets (no external calls).
2. **SDR + enablement tools** — research, prospecting, email, CRM. These run in chat and talk to outside systems.

## Approval policy (enforced in code — `lib/connectors/sdr-tools.ts`)

| Runs freely | Needs your click on **Approve** |
|---|---|
| `research_web`, `prospect_leads`, `find_crm_records`, `dedupe_crm_records` (report only), `log_activity`, `activity_summary`, `add_suppression`, `create_email_sequence` (saves a draft) | `send_email`, `enroll_contacts_in_sequence`, `upsert_crm_record`, `log_crm_activity`, `write_supabase_table`, `enrich_contact` (costs credits), `verify_email` (shares an address with Hunter) |

Before any send: the recipient and their domain are checked against the **do-not-contact list** (Activity page), and the **daily cap** (`ENABLY_DAILY_SEND_CAP`, default 25) is enforced. Every external change is written to the audit log (Settings).

## Native connectors

| Connector | Env var(s) | Tools |
|---|---|---|
| Jina Reader | `JINA_API_KEY` (optional) | `research_web` (read a URL) |
| SerpAPI | `SERPAPI_API_KEY` | `research_web` (search) |
| Apollo.io | `APOLLO_API_KEY` | `prospect_leads` (People API Search — no emails), `enrich_contact` |
| Hunter | `HUNTER_API_KEY` | `verify_email` |
| Resend | `RESEND_API_KEY`, `ENABLY_SENDER_EMAIL`, `ENABLY_SENDER_FOOTER` | `send_email` |
| HubSpot | `HUBSPOT_ACCESS_TOKEN` (private app) | `find_crm_records`, `upsert_crm_record`, `log_crm_activity` |
| Supabase | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ENABLY_SUPABASE_WRITABLE_TABLES` | `write_supabase_table` |
| n8n / Make / Zapier | `WORKFLOW_WEBHOOK_URL` | `send_to_workflow`, `enroll_contacts_in_sequence` |

Deliverability tip (from the Sales Ops Setup Guide): send from a **separate domain or subdomain** with SPF, DKIM and DMARC configured, and warm it up before volume.

## MCP — connect other tools to the Architect

Clay, Zoho CRM, HubSpot, Attio, Salesforce, Gmail and your own n8n instance can all be reached through MCP servers. Add them as JSON:

```bash
ENABLY_MCP_SERVERS='[{"name":"clay","url":"https://<clay-mcp-url>","headers":{"Authorization":"Bearer ${CLAY_MCP_TOKEN}"}},{"name":"n8n","url":"https://<your-n8n>/mcp-server/http","headers":{"Authorization":"Bearer ${N8N_MCP_TOKEN}"},"allow":["create_tasks","search_workflows"]}]'
```

- `${VAR}` is filled from your environment, so tokens never live in the JSON.
- Tools appear as `<server>__<tool>`. Tools whose names start with get/list/search/find/read/query run freely; **everything else asks for approval**.
- `readOnly: true` hides write tools; `allow: [...]` exposes only the listed tools.
- Only `https://` servers are accepted.

## MCP — use Enably from Claude, Cursor or n8n

Set `ENABLY_MCP_TOKEN` and point any MCP client at `https://<your-app>/api/mcp` with header `Authorization: Bearer <token>`.

Tools: `run_gtm_pipeline`, `list_runs`, `list_artifacts`, `get_artifact`, `search_knowledge`, `add_knowledge`, `log_activity`, `activity_summary`.

In **n8n**: add an AI Agent → *MCP Client Tool* → Streamable HTTP → the URL above → Header Auth. Now your n8n agents can build GTM packages.

In **Claude Code**:

```bash
claude mcp add --transport http enably https://<your-app>/api/mcp --header "Authorization: Bearer <token>"
```

## Adding a provider

1. Add an entry to `lib/connectors/registry.ts`.
2. Add an adapter in `lib/connectors/providers.ts` (use `call()` and `key()` — they handle timeouts and readable errors).
3. Add or extend a tool in `lib/connectors/sdr-tools.ts`; set `needsApproval: true` for anything that writes, sends or spends.
4. Regenerate the portable schema: `npx tsx --conditions=react-server scripts/export-tool-schemas.ts`.
