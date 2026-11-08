import "server-only";

/**
 * Native HTTPS adapters. Each returns plain JSON the model can read, never
 * echoes credentials, and fails with a readable message instead of throwing.
 * API shapes verified against provider docs (see registry `docs` links).
 */

export class ConnectorError extends Error {}

const TIMEOUT = 15000;

async function call(url: string, init: RequestInit & { provider: string }): Promise<unknown> {
  const { provider, ...rest } = init;
  let res: Response;
  try {
    res = await fetch(url, { ...rest, signal: AbortSignal.timeout(TIMEOUT) });
  } catch (err) {
    throw new ConnectorError(`${provider}: network error (${(err as Error).message})`);
  }
  const text = await res.text();
  if (!res.ok) throw new ConnectorError(`${provider}: HTTP ${res.status} — ${text.slice(0, 300)}`);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function key(name: string, provider: string): string {
  const v = process.env[name];
  if (!v) throw new ConnectorError(`${provider} is not connected. Add ${name} to your environment (see Settings → Connectors).`);
  return v;
}

/* ---------------------------------------------------------------- research */

export async function jinaRead(url: string): Promise<{ url: string; text: string }> {
  if (!/^https?:\/\//.test(url)) url = `https://${url}`;
  const headers: Record<string, string> = { accept: "text/plain" };
  if (process.env.JINA_API_KEY) headers.authorization = `Bearer ${process.env.JINA_API_KEY}`;
  const text = (await call(`https://r.jina.ai/${url}`, { provider: "Jina", headers })) as string;
  return { url, text: String(text).slice(0, 8000) };
}

export async function serpSearch(query: string, recencyDays?: number) {
  const params = new URLSearchParams({ engine: "google", q: query, api_key: key("SERPAPI_API_KEY", "SerpAPI"), num: "8" });
  if (recencyDays) params.set("tbs", `qdr:d${recencyDays}`);
  const data = (await call(`https://serpapi.com/search.json?${params}`, { provider: "SerpAPI" })) as {
    organic_results?: { title: string; link: string; snippet?: string; date?: string }[];
  };
  return (data.organic_results ?? []).slice(0, 8).map((r) => ({ title: r.title, url: r.link, snippet: r.snippet, date: r.date }));
}

/* ------------------------------------------------------------- prospecting */

export interface LeadFilters {
  titles: string[];
  geographies?: string[];
  employee_range?: string;
  industries?: string[];
  keywords?: string[];
  limit?: number;
}

export async function apolloPeopleSearch(f: LeadFilters) {
  const p = new URLSearchParams();
  f.titles.forEach((t) => p.append("person_titles[]", t));
  f.geographies?.forEach((g) => p.append("person_locations[]", g));
  if (f.employee_range) p.append("organization_num_employees_ranges[]", f.employee_range.replace("-", ","));
  const kw = [...(f.industries ?? []), ...(f.keywords ?? [])].join(" ");
  if (kw) p.set("q_keywords", kw);
  p.set("per_page", String(Math.min(f.limit ?? 10, 25)));
  const data = (await call(`https://api.apollo.io/api/v1/mixed_people/api_search?${p}`, {
    provider: "Apollo",
    method: "POST",
    headers: { "content-type": "application/json", "cache-control": "no-cache", "x-api-key": key("APOLLO_API_KEY", "Apollo") },
  })) as { people?: { id: string; first_name?: string; last_name_obfuscated?: string; last_name?: string; title?: string; organization?: { name?: string; primary_domain?: string } }[] };
  return (data.people ?? []).map((x) => ({
    apollo_id: x.id,
    name: [x.first_name, x.last_name ?? x.last_name_obfuscated].filter(Boolean).join(" "),
    title: x.title,
    company: x.organization?.name,
    domain: x.organization?.primary_domain,
    email: null, // search does not return emails — use enrich_contact (credits) when approved
  }));
}

export async function apolloEnrich(input: { email?: string; domain?: string }) {
  const headers = { "content-type": "application/json", "cache-control": "no-cache", "x-api-key": key("APOLLO_API_KEY", "Apollo") };
  if (input.email) {
    return call(`https://api.apollo.io/api/v1/people/match?email=${encodeURIComponent(input.email)}`, { provider: "Apollo", method: "POST", headers });
  }
  if (input.domain) {
    return call(`https://api.apollo.io/api/v1/organizations/enrich?domain=${encodeURIComponent(input.domain)}`, { provider: "Apollo", headers });
  }
  throw new ConnectorError("Provide an email or a domain to enrich.");
}

/* ------------------------------------------------------------ verification */

export async function hunterVerify(email: string) {
  const p = new URLSearchParams({ email, api_key: key("HUNTER_API_KEY", "Hunter") });
  const data = (await call(`https://api.hunter.io/v2/email-verifier?${p}`, { provider: "Hunter" })) as { data?: { status?: string; result?: string; score?: number } };
  return { email, status: data.data?.status ?? "unknown", result: data.data?.result, score: data.data?.score };
}

/* ------------------------------------------------------------------- email */

export async function resendSend(m: { to: string; subject: string; text?: string; html?: string; scheduledAt?: string; from?: string }) {
  const from = m.from || key("ENABLY_SENDER_EMAIL", "Resend");
  const footer = process.env.ENABLY_SENDER_FOOTER ? `\n\n${process.env.ENABLY_SENDER_FOOTER}` : "";
  const body: Record<string, unknown> = { from, to: [m.to], subject: m.subject, text: (m.text ?? "") + footer };
  if (m.html) body.html = m.html;
  if (m.scheduledAt) body.scheduled_at = m.scheduledAt;
  const data = (await call("https://api.resend.com/emails", {
    provider: "Resend",
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key("RESEND_API_KEY", "Resend")}` },
    body: JSON.stringify(body),
  })) as { id?: string };
  return { sent: true, id: data.id };
}

/* --------------------------------------------------------------------- CRM */

const HS = "https://api.hubapi.com";
const hsHeaders = () => ({ "content-type": "application/json", authorization: `Bearer ${key("HUBSPOT_ACCESS_TOKEN", "HubSpot")}` });
const HS_TYPES = { contact: "contacts", company: "companies", deal: "deals" } as const;
type HsType = keyof typeof HS_TYPES;

export async function hubspotFind(objectType: HsType, filters: Record<string, string>, limit = 10) {
  const data = (await call(`${HS}/crm/v3/objects/${HS_TYPES[objectType]}/search`, {
    provider: "HubSpot",
    method: "POST",
    headers: hsHeaders(),
    body: JSON.stringify({
      filterGroups: Object.keys(filters).length ? [{ filters: Object.entries(filters).map(([propertyName, value]) => ({ propertyName, operator: "EQ", value })) }] : [],
      limit: Math.min(limit, 50),
    }),
  })) as { total?: number; results?: { id: string; properties: Record<string, string> }[] };
  return { total: data.total ?? 0, results: (data.results ?? []).map((r) => ({ id: r.id, ...r.properties })) };
}

export async function hubspotUpsert(objectType: HsType, uniqueKey: string | undefined, fields: Record<string, unknown>) {
  if (objectType === "contact") {
    const email = String(uniqueKey ?? fields.email ?? "");
    if (!email) throw new ConnectorError("HubSpot contact upsert needs an email.");
    const data = (await call(`${HS}/crm/v3/objects/contacts/batch/upsert`, {
      provider: "HubSpot",
      method: "POST",
      headers: hsHeaders(),
      body: JSON.stringify({ inputs: [{ id: email, idProperty: "email", properties: { ...fields, email } }] }),
    })) as { results?: { id: string; new?: boolean }[] };
    return { id: data.results?.[0]?.id, created: data.results?.[0]?.new ?? null };
  }
  // companies/deals: search by the unique key (domain / dealname), then update or create
  const prop = objectType === "company" ? "domain" : "dealname";
  const value = String(uniqueKey ?? fields[prop] ?? "");
  const found = value ? await hubspotFind(objectType, { [prop]: value }, 1) : { results: [] as { id: string }[] };
  const existing = found.results[0]?.id;
  const data = (await call(`${HS}/crm/v3/objects/${HS_TYPES[objectType]}${existing ? `/${existing}` : ""}`, {
    provider: "HubSpot",
    method: existing ? "PATCH" : "POST",
    headers: hsHeaders(),
    body: JSON.stringify({ properties: value ? { ...fields, [prop]: value } : fields }),
  })) as { id?: string };
  return { id: data.id, created: !existing };
}

/** Logs an activity as a HubSpot note associated with the record (default association type ids). */
export async function hubspotLogNote(objectType: HsType, objectId: string, body: string, timestamp?: string) {
  const assoc = { contact: 202, company: 190, deal: 214 }[objectType];
  const data = (await call(`${HS}/crm/v3/objects/notes`, {
    provider: "HubSpot",
    method: "POST",
    headers: hsHeaders(),
    body: JSON.stringify({
      properties: { hs_timestamp: timestamp ?? new Date().toISOString(), hs_note_body: body },
      associations: [{ to: { id: objectId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: assoc }] }],
    }),
  })) as { id?: string };
  return { noteId: data.id };
}
