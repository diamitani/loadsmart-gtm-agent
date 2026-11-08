/**
 * Connector registry — every external system the Architect can reach, how it
 * connects, and which env vars turn it on. Secrets are read server-side only;
 * the UI and the model only ever see `configured: true/false`.
 *
 * mode:
 *   native  — direct HTTPS adapter in lib/connectors/providers.ts
 *   mcp     — reached through an MCP server listed in ENABLY_MCP_SERVERS
 *   webhook — reached through your n8n / Make / Zapier workflow
 */
export type ConnectorCategory = "documents" | "research" | "prospecting" | "verification" | "email" | "crm" | "data" | "automation";

export interface ConnectorDef {
  id: string;
  name: string;
  category: ConnectorCategory;
  mode: "native" | "mcp" | "webhook";
  env: string[];
  /** Env vars where any one is enough (e.g. optional key). */
  optionalEnv?: string[];
  ops: string[];
  notes?: string;
  docs: string;
}

export const CONNECTORS: ConnectorDef[] = [
  { id: "builtin-parsers", name: "Built-in parsers + OCR", category: "documents", mode: "native", env: [], ops: ["PDF (unpdf)", "Word (mammoth)", "PowerPoint/Excel (fflate)", "image OCR (tesseract.js)"], notes: "Open source, runs inside the app, always on, $0.", docs: "https://github.com/naptha/tesseract.js" },
  { id: "docling", name: "Docling (self-hosted)", category: "documents", mode: "native", env: ["DOCLING_URL"], ops: ["scanned PDFs", "tables & layout", "Office docs"], notes: "IBM's open-source converter (MIT). Free when self-hosted with Docker.", docs: "https://github.com/docling-project/docling-serve" },
  { id: "whisper", name: "Whisper transcription", category: "documents", mode: "native", env: ["TRANSCRIBE_BASE_URL"], ops: ["audio & video → timestamped transcript"], notes: "Any OpenAI-compatible endpoint: self-hosted Speaches / faster-whisper ($0) or Groq free tier.", docs: "https://github.com/speaches-ai/speaches" },
  { id: "jina", name: "Jina Reader", category: "research", mode: "native", env: [], optionalEnv: ["JINA_API_KEY"], ops: ["research_web (read URL)"], notes: "Works without a key at low rate limits; key raises limits and enables search.", docs: "https://jina.ai/reader" },
  { id: "serpapi", name: "SerpAPI", category: "research", mode: "native", env: ["SERPAPI_API_KEY"], ops: ["research_web (search)"], docs: "https://serpapi.com/search-api" },
  { id: "apollo", name: "Apollo.io", category: "prospecting", mode: "native", env: ["APOLLO_API_KEY"], ops: ["prospect_leads", "enrich_contact"], notes: "People API Search returns profiles without emails; enrichment consumes credits.", docs: "https://docs.apollo.io/reference/people-api-search" },
  { id: "clay", name: "Clay", category: "prospecting", mode: "mcp", env: [], ops: ["prospect_leads", "enrich_contact"], notes: "Connect Clay's MCP server in ENABLY_MCP_SERVERS.", docs: "https://www.clay.com" },
  { id: "hunter", name: "Hunter", category: "verification", mode: "native", env: ["HUNTER_API_KEY"], ops: ["verify_email"], notes: "Each verification discloses an address to Hunter — approval-gated.", docs: "https://hunter.io/api-documentation" },
  { id: "resend", name: "Resend", category: "email", mode: "native", env: ["RESEND_API_KEY", "ENABLY_SENDER_EMAIL"], ops: ["send_email"], notes: "Use a verified sending domain separate from your primary domain.", docs: "https://resend.com/docs/api-reference/emails/send-email" },
  { id: "gmail", name: "Gmail", category: "email", mode: "mcp", env: [], ops: ["send_email (draft)"], notes: "OAuth-based — connect via an MCP server or an n8n Gmail node.", docs: "https://developers.google.com/gmail/api" },
  { id: "hubspot", name: "HubSpot", category: "crm", mode: "native", env: ["HUBSPOT_ACCESS_TOKEN"], ops: ["find_crm_records", "upsert_crm_record", "log_crm_activity"], notes: "Private-app token with crm.objects.contacts/companies/deals read+write scopes.", docs: "https://developers.hubspot.com/docs/api-reference/legacy/crm/objects/contacts/guide" },
  { id: "attio", name: "Attio", category: "crm", mode: "mcp", env: [], ops: ["find_crm_records", "upsert_crm_record"], notes: "Connect via MCP server or n8n.", docs: "https://developers.attio.com" },
  { id: "zoho", name: "Zoho CRM", category: "crm", mode: "mcp", env: [], ops: ["find_crm_records", "upsert_crm_record"], notes: "Zoho publishes an official MCP server.", docs: "https://www.zoho.com/crm/developer/" },
  { id: "salesforce", name: "Salesforce", category: "crm", mode: "mcp", env: [], ops: ["find_crm_records", "upsert_crm_record"], docs: "https://developer.salesforce.com" },
  { id: "supabase", name: "Supabase tables", category: "data", mode: "native", env: ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"], ops: ["write_supabase_table (allowlisted tables)"], docs: "https://supabase.com/docs" },
  { id: "workflow", name: "n8n / Make / Zapier", category: "automation", mode: "webhook", env: ["WORKFLOW_WEBHOOK_URL"], ops: ["send_to_workflow", "enroll_contacts_in_sequence (fallback)"], docs: "https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/" },
];

export function isConfigured(c: ConnectorDef): boolean {
  if (c.mode === "mcp") return mcpServerNames().some((n) => n.toLowerCase().includes(c.id));
  return c.env.every((k) => !!process.env[k]);
}

export function connectorStatus() {
  return CONNECTORS.map((c) => ({ ...c, configured: isConfigured(c) }));
}

export function mcpServerNames(): string[] {
  try {
    const list = JSON.parse(process.env.ENABLY_MCP_SERVERS || "[]") as { name: string }[];
    return list.map((s) => s.name);
  } catch {
    return [];
  }
}
