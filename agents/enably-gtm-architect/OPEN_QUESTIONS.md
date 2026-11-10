# Open questions for enably-gtm-architect

(Unknowns are written here, never guessed.)

- Decision needed: AI Gateway is on the free tier — buy credits (keeps Claude Sonnet 5.5) or run on a free-tier model (meta/llama-4-scout verified live)?
- Decision needed: Composio for per-user Gmail/Drive/HubSpot, or keep the direct connectors + MCP servers this repo uses today?
- Fact: Supabase is not connected yet, so per-user storage and RLS are unverified live.
- Decision needed: who approves sends, and the daily send cap (default ENABLY_DAILY_SEND_CAP=25).
- Not built: A2A call endpoint (agent-card.json is discovery only).
