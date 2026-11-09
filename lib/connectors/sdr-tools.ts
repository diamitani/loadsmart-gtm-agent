import "server-only";
import { tool } from "ai";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getStore } from "@/lib/db";
import { ACTIVITY_TYPES } from "@/lib/db/types";
import { trace } from "@/lib/observability/langsmith";
import { newId, nowIso } from "@/lib/utils";
import { scanText } from "@/lib/pal/truth-guard";
import { env } from "@/lib/env";
import {
  ConnectorError,
  apolloEnrich,
  apolloPeopleSearch,
  hubspotFind,
  hubspotLogNote,
  hubspotUpsert,
  hunterVerify,
  jinaRead,
  resendSend,
  serpSearch,
} from "./providers";

/**
 * SDR Assistant + Sales Enablement tools (agent/skills/sdr-assistant, sales-enablement).
 *
 * Approval policy (enforced by the AI SDK, not the prompt):
 *   free     — research, people search, CRM reads, activity log/summary, suppression adds, sequence drafts
 *   approval — paid enrichment, third-party email verification, every send, every CRM / table write
 */

const safe = <A, R>(name: string, fn: (a: A) => Promise<R>, runType: "tool" | "retriever" = "tool") =>
  trace(
    `tool.${name}`,
    async (a: A) => {
      try {
        return await fn(a);
      } catch (err) {
        if (err instanceof ConnectorError) return { error: err.message };
        throw err;
      }
    },
    { runType },
  );

const startOf = (period: "today" | "week" | "month") => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (period === "week") d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  if (period === "month") d.setDate(1);
  return d.toISOString();
};

async function sendsToday(): Promise<number> {
  const since = startOf("today");
  return (await getStore().listAudit(500)).filter((e) => e.action === "email.sent" && e.at >= since).length;
}

export function sdrTools() {
  const store = getStore();
  const cap = Number(process.env.ENABLY_DAILY_SEND_CAP || 25);

  return {
    /* ------------------------------------------------------------ research */
    research_web: tool({
      description: "Research a company or person on the public web. provider 'jina' reads a URL/domain; 'serpapi' runs a search query.",
      inputSchema: z.object({
        provider: z.enum(["jina", "serpapi"]),
        query: z.string().describe("Domain/URL for jina; search query (company, person + company) for serpapi"),
        recency_days: z.number().int().positive().optional(),
      }),
      execute: safe("research_web", async ({ provider, query, recency_days }: { provider: "jina" | "serpapi"; query: string; recency_days?: number }) =>
        provider === "jina" ? jinaRead(query) : { results: await serpSearch(query, recency_days) }, "retriever"),
    }),

    prospect_leads: tool({
      description: "Build a lead list from ICP filters via Apollo People Search (no emails returned; enrichment is a separate, approved step). For Clay, use the Clay MCP tools if connected.",
      inputSchema: z.object({
        provider: z.enum(["apollo"]),
        filters: z.object({
          titles: z.array(z.string()).min(1),
          geographies: z.array(z.string()).optional(),
          employee_range: z.string().optional().describe("e.g. 50-500"),
          industries: z.array(z.string()).optional(),
          keywords: z.array(z.string()).optional(),
          limit: z.number().int().min(1).max(25).optional(),
        }),
      }),
      execute: safe("prospect_leads", async ({ filters }: { filters: Parameters<typeof apolloPeopleSearch>[0] }) => {
        const people = await apolloPeopleSearch(filters);
        const out = [];
        for (const p of people) out.push({ ...p, suppressed: p.domain ? await store.isSuppressed(p.domain) : false });
        return { count: out.length, leads: out };
      }),
    }),

    enrich_contact: tool({
      description: "Enrich a person (by email) or company (by domain) via Apollo. Consumes provider credits — requires approval.",
      inputSchema: z.object({ provider: z.enum(["apollo"]), email: z.string().email().optional(), domain: z.string().optional() }),
      needsApproval: true,
      execute: safe("enrich_contact", async ({ email, domain }: { email?: string; domain?: string }) => apolloEnrich({ email, domain })),
    }),

    verify_email: tool({
      description: "Verify deliverability via Hunter. Discloses the address to a third party — requires approval.",
      inputSchema: z.object({ provider: z.enum(["hunter"]), email: z.string().email() }),
      needsApproval: true,
      execute: safe("verify_email", async ({ email }: { email: string }) => hunterVerify(email)),
    }),

    /* ------------------------------------------------------------ outreach */
    send_email: tool({
      description: `Send ONE personalised email via Resend. Requires approval. Blocked if the recipient is suppressed or the daily cap (${cap}) is reached.`,
      inputSchema: z.object({
        provider: z.enum(["resend"]),
        to: z.string().email(),
        subject: z.string().min(1),
        body_text: z.string().min(1),
        body_html: z.string().optional(),
        scheduled_at_iso: z.string().optional(),
        account: z.string().optional().describe("Account name to log the activity against"),
      }),
      needsApproval: true,
      execute: safe("send_email", async (m: { to: string; subject: string; body_text: string; body_html?: string; scheduled_at_iso?: string; account?: string }) => {
        if (await store.isSuppressed(m.to)) return { sent: false, reason: `${m.to} is on the suppression list.` };
        if ((await sendsToday()) >= cap) return { sent: false, reason: `Daily send cap of ${cap} reached (ENABLY_DAILY_SEND_CAP).` };
        const flags = scanText(`${m.subject}\n${m.body_text}`).filter((f) => f.type !== "email");
        const res = await resendSend({ to: m.to, subject: m.subject, text: m.body_text, html: m.body_html, scheduledAt: m.scheduled_at_iso });
        await store.audit({ actor: "human-approved", action: "email.sent", target: m.to, detail: { subject: m.subject, id: res.id } });
        await store.logActivity({ id: newId("act"), workspaceId: env().workspaceId, type: "email", account: m.account ?? m.to.split("@")[1], contact: m.to, count: 1, stage: "cold", notes: m.subject, occurredAt: nowIso(), createdAt: nowIso() });
        return { ...res, unverifiedClaims: flags.map((f) => `${f.type}: ${f.value}`) };
      }),
    }),

    create_email_sequence: tool({
      description: "Save a multi-step email sequence (3/5/7/12 steps) to the Library as a draft asset.",
      inputSchema: z.object({
        sequence_name: z.string(),
        steps: z.array(z.object({ day_offset: z.number().int().min(0), subject: z.string(), body_text: z.string() })).min(1).max(12),
      }),
      execute: safe("create_email_sequence", async ({ sequence_name, steps }: { sequence_name: string; steps: { day_offset: number; subject: string; body_text: string }[] }) => {
        let day = 0;
        const md = [`# ${sequence_name}`, "", ...steps.flatMap((s, i) => ((day += s.day_offset), [`### Step ${i + 1} — Day ${day}`, `**Subject:** ${s.subject}`, "", s.body_text, ""]))].join("\n");
        const id = newId("art");
        await store.saveArtifacts([{ id, kind: "email_sequence", group: "asset", title: sequence_name, markdown: md, status: "draft", version: 1, createdAt: nowIso(), provenance: { agentId: "sdr-assistant", model: "tool", promptVersion: "sdr@1", inputRefs: [] } }]);
        return { saved: true, artifactId: id, steps: steps.length, url: `/app/library/${id}` };
      }),
    }),

    enroll_contacts_in_sequence: tool({
      description: "Enroll contacts into a sequence through your automation workflow (n8n/Make/Zapier sequencer). Suppressed contacts are removed. Requires approval.",
      inputSchema: z.object({
        sequence_id_or_name: z.string(),
        contacts: z.array(z.object({ email: z.string().email(), first_name: z.string().optional(), last_name: z.string().optional(), company: z.string().optional() })).min(1).max(200),
      }),
      needsApproval: true,
      execute: safe("enroll_contacts_in_sequence", async ({ sequence_id_or_name, contacts }: { sequence_id_or_name: string; contacts: { email: string; first_name?: string; last_name?: string; company?: string }[] }) => {
        const url = env().workflowWebhookUrl;
        if (!url) return { enrolled: 0, reason: "No WORKFLOW_WEBHOOK_URL configured for your sequencer workflow." };
        const allowed = [];
        for (const c of contacts) if (!(await store.isSuppressed(c.email))) allowed.push(c);
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json", ...(env().workflowWebhookSecret ? { "x-enably-signature": env().workflowWebhookSecret } : {}) },
          body: JSON.stringify({ event: "enably.sequence.enroll", sequence: sequence_id_or_name, contacts: allowed }),
        });
        await store.audit({ actor: "human-approved", action: "sequence.enroll", target: sequence_id_or_name, detail: { requested: contacts.length, enrolled: allowed.length, status: res.status } });
        return { enrolled: res.ok ? allowed.length : 0, removedAsSuppressed: contacts.length - allowed.length, status: res.status };
      }),
    }),

    /* ----------------------------------------------------------------- CRM */
    find_crm_records: tool({
      description: "Search HubSpot contacts/companies/deals with simple equality filters (e.g. {email: 'x@y.com'} or {domain: 'acme.com'}).",
      inputSchema: z.object({ provider: z.enum(["hubspot"]), object_type: z.enum(["contact", "company", "deal"]), filters: z.record(z.string(), z.string()).default({}), limit: z.number().int().min(1).max(50).optional() }),
      execute: safe("find_crm_records", async ({ object_type, filters, limit }: { object_type: "contact" | "company" | "deal"; filters: Record<string, string>; limit?: number }) => hubspotFind(object_type, filters, limit), "retriever"),
    }),

    upsert_crm_record: tool({
      description: "Create or update a CRM record. HubSpot: contact (by email), company (by domain), deal (by dealname). Show the field mapping first. Requires approval.",
      inputSchema: z.object({
        provider: z.enum(["hubspot"]),
        object_type: z.enum(["contact", "company", "deal"]),
        unique_key: z.string().optional(),
        fields: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
      }),
      needsApproval: true,
      execute: safe("upsert_crm_record", async ({ object_type, unique_key, fields }: { object_type: "contact" | "company" | "deal"; unique_key?: string; fields: Record<string, string | number | boolean> }) => {
        const res = await hubspotUpsert(object_type, unique_key, fields);
        await store.audit({ actor: "human-approved", action: "crm.upsert", target: `hubspot:${object_type}:${res.id}`, detail: { fields: Object.keys(fields) } });
        return res;
      }),
    }),

    log_crm_activity: tool({
      description: "Attach an activity (email/call/note/task) to a HubSpot record as a note, and mirror it into the Enably activity tracker. Requires approval.",
      inputSchema: z.object({
        provider: z.enum(["hubspot"]),
        object_type: z.enum(["contact", "company", "deal"]),
        object_id: z.string(),
        activity_type: z.enum(["email", "call", "note", "task"]),
        activity_body: z.string(),
        account: z.string().describe("Account name for the Enably tracker"),
        timestamp_iso: z.string().optional(),
      }),
      needsApproval: true,
      execute: safe("log_crm_activity", async (a: { object_type: "contact" | "company" | "deal"; object_id: string; activity_type: string; activity_body: string; account: string; timestamp_iso?: string }) => {
        const res = await hubspotLogNote(a.object_type, a.object_id, `[${a.activity_type}] ${a.activity_body}`, a.timestamp_iso);
        await store.logActivity({ id: newId("act"), workspaceId: env().workspaceId, type: a.activity_type === "call" ? "call" : a.activity_type === "email" ? "email" : "note", account: a.account, count: 1, notes: a.activity_body, occurredAt: a.timestamp_iso ?? nowIso(), createdAt: nowIso(), crmRef: `hubspot:note:${res.noteId}` });
        await store.audit({ actor: "human-approved", action: "crm.activity", target: `hubspot:${a.object_type}:${a.object_id}` });
        return res;
      }),
    }),

    dedupe_crm_records: tool({
      description: "Report duplicate records in a list (e.g. from find_crm_records or a lead list) by normalised unique fields. Report only — merging is done in the CRM.",
      inputSchema: z.object({ records: z.array(z.record(z.string(), z.unknown())).min(1), unique_fields: z.array(z.string()).min(1) }),
      execute: async ({ records, unique_fields }) => {
        const groups = new Map<string, unknown[]>();
        for (const r of records) {
          const k = unique_fields.map((f) => String(r[f] ?? "").toLowerCase().trim().replace(/^www\./, "")).join("|");
          if (k.replace(/\|/g, "")) groups.set(k, [...(groups.get(k) ?? []), r]);
        }
        const dupes = [...groups.entries()].filter(([, v]) => v.length > 1).map(([key, v]) => ({ key, count: v.length, records: v }));
        return { checked: records.length, duplicateGroups: dupes.length, dupes };
      },
    }),

    write_supabase_table: tool({
      description: "Insert/upsert rows into an allowlisted Supabase table (ENABLY_SUPABASE_WRITABLE_TABLES, default 'lead_snapshots') for analytics. Requires approval.",
      inputSchema: z.object({ table: z.string(), rows: z.array(z.record(z.string(), z.unknown())).min(1).max(500), upsert_key: z.string().optional() }),
      needsApproval: true,
      execute: safe("write_supabase_table", async ({ table, rows, upsert_key }: { table: string; rows: Record<string, unknown>[]; upsert_key?: string }) => writeTable(table, rows, upsert_key)),
    }),

    /* ------------------------------------------------ sales enablement */
    log_activity: tool({
      description: "Log sales activity to the Enably tracker (calls, emails, LinkedIn, DMs, meetings, posts, SMS). Ask for type and account if missing.",
      inputSchema: z.object({
        type: z.enum(ACTIVITY_TYPES),
        account: z.string().min(1),
        contact: z.string().optional(),
        count: z.number().int().min(1).max(500).default(1),
        stage: z.enum(["cold", "follow_up", "closing", "other"]).optional(),
        notes: z.string().optional(),
        occurred_at_iso: z.string().optional(),
      }),
      execute: safe("log_activity", async (a: { type: (typeof ACTIVITY_TYPES)[number]; account: string; contact?: string; count: number; stage?: "cold" | "follow_up" | "closing" | "other"; notes?: string; occurred_at_iso?: string }) => {
        const act = { id: newId("act"), workspaceId: env().workspaceId, type: a.type, account: a.account, contact: a.contact, count: a.count, stage: a.stage, notes: a.notes, occurredAt: a.occurred_at_iso ?? nowIso(), createdAt: nowIso() };
        await store.logActivity(act);
        return { logged: true, ...act };
      }),
    }),

    activity_summary: tool({
      description: "Summarise logged activity for today, this week or this month — totals by channel and top accounts.",
      inputSchema: z.object({ period: z.enum(["today", "week", "month"]).default("today") }),
      execute: async ({ period }) => summarizeActivities(await store.listActivities({ since: startOf(period), limit: 5000 }), period),
    }),

    add_suppression: tool({
      description: "Add an email or domain to the do-not-contact list (opt-outs, bounces, competitors, customers).",
      inputSchema: z.object({ value: z.string().min(3), reason: z.string().default("opt-out") }),
      execute: async ({ value, reason }) => {
        await store.addSuppression({ value, reason, createdAt: nowIso() });
        await store.audit({ actor: "gtm-architect", action: "suppression.added", target: value.toLowerCase() });
        return { suppressed: value.toLowerCase() };
      },
    }),
  };
}

export function summarizeActivities(list: { type: string; account: string; count: number }[], period: string) {
  const byType: Record<string, number> = {};
  const byAccount: Record<string, number> = {};
  for (const a of list) {
    byType[a.type] = (byType[a.type] ?? 0) + a.count;
    byAccount[a.account] = (byAccount[a.account] ?? 0) + a.count;
  }
  const topAccounts = Object.entries(byAccount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([account, count]) => ({ account, count }));
  return { period, total: list.reduce((s, a) => s + a.count, 0), byType, topAccounts };
}

async function writeTable(table: string, rows: Record<string, unknown>[], upsertKey?: string) {
  const allowed = (process.env.ENABLY_SUPABASE_WRITABLE_TABLES || "lead_snapshots").split(",").map((t) => t.trim());
  if (!allowed.includes(table)) return { error: `Table '${table}' is not in ENABLY_SUPABASE_WRITABLE_TABLES (${allowed.join(", ")}).` };
  const e = env();
  if (!e.supabaseUrl || !e.supabaseServiceKey) return { error: "Supabase is not connected (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)." };
  const db = createClient(e.supabaseUrl, e.supabaseServiceKey, { auth: { persistSession: false } });
  // lead_snapshots stores each row as JSON; custom tables must have matching columns.
  const stamped = rows.map((r) => (table === "lead_snapshots" ? { workspace_id: e.workspaceId, payload: r } : { ...r, workspace_id: e.workspaceId }));
  const res = upsertKey ? await db.from(table).upsert(stamped, { onConflict: upsertKey }) : await db.from(table).insert(stamped);
  if (res.error) return { error: res.error.message };
  await getStore().audit({ actor: "human-approved", action: "table.write", target: table, detail: { rows: rows.length } });
  return { written: rows.length, table };
}
