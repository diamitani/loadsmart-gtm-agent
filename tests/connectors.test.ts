import { beforeEach, describe, expect, it } from "vitest";
import { parseLogCommand } from "@/lib/agent/quick-actions";
import { decideMode } from "@/lib/agent/router";
import { fillEnv, parseMcpConfig, READ_TOOL } from "@/lib/connectors/mcp";
import { sdrTools, summarizeActivities } from "@/lib/connectors/sdr-tools";
import { CONNECTORS, connectorStatus } from "@/lib/connectors/registry";

describe("enablement quick commands", () => {
  it("parses activity log commands", () => {
    expect(parseLogCommand("Log 3 cold calls to Acme Corp today")).toEqual({ type: "call", count: 3, account: "Acme Corp", stage: "cold" });
    expect(parseLogCommand("log a meeting with Zenix Solutions")).toMatchObject({ type: "meeting", count: 1, account: "Zenix Solutions" });
    expect(parseLogCommand("record 12 linkedin touches for Globex")).toMatchObject({ type: "linkedin", count: 12 });
    expect(parseLogCommand("Build me an ICP")).toBeNull();
  });
  it("summarises by channel and account", () => {
    const s = summarizeActivities([{ type: "call", account: "A", count: 3 }, { type: "email", account: "B", count: 5 }, { type: "call", account: "B", count: 1 }], "week");
    expect(s.total).toBe(9);
    expect(s.byType).toEqual({ call: 4, email: 5 });
    expect(s.topAccounts[0]).toEqual({ account: "B", count: 6 });
  });
});

describe("router sends operational SDR work to the tool agent", () => {
  it("routes log/research/push to chat even on the first message", () => {
    expect(decideMode("Log 3 cold calls to Acme", null, [{ role: "user" }])).toBe("chat");
    expect(decideMode("research acme.com before my call", null, [{ role: "user" }])).toBe("chat");
    expect(decideMode("Build an ICP for our payroll app for restaurants", null, [{ role: "user" }])).toBe("build");
  });
  it("still treats answers to a clarification as build input", () => {
    expect(decideMode("find dental clinics", { status: "needs_input" } as never, [{ role: "user" }, { role: "assistant" }, { role: "user" }])).toBe("build");
  });
});

describe("MCP client config", () => {
  it("parses servers, rejects non-https and bad names", () => {
    const cfg = parseMcpConfig(JSON.stringify([{ name: "clay", url: "https://x/mcp" }, { name: "bad", url: "http://insecure" }, { name: "no spaces!", url: "https://y" }]));
    expect(cfg.map((c) => c.name)).toEqual(["clay"]);
    expect(parseMcpConfig("not json")).toEqual([]);
  });
  it("fills ${VAR} header secrets from env without exposing them in config", () => {
    process.env.TEST_MCP_TOKEN = "s3cret";
    expect(fillEnv({ Authorization: "Bearer ${TEST_MCP_TOKEN}" })).toEqual({ Authorization: "Bearer s3cret" });
  });
  it("classifies read vs write tools for approval gating", () => {
    for (const n of ["search_companies", "get-record", "list_tasks", "query_crm_data"]) expect(READ_TOOL.test(n)).toBe(true);
    for (const n of ["create_records", "update_deal", "send_message", "delete_task"]) expect(READ_TOOL.test(n)).toBe(false);
  });
});

describe("SDR tools", () => {
  beforeEach(() => {
    delete process.env.HUBSPOT_ACCESS_TOKEN;
    delete process.env.SERPAPI_API_KEY;
  });
  const tools = sdrTools();
  it("gates every external mutation, paid enrichment and third-party verification behind approval", () => {
    const gated = Object.entries(tools).filter(([, t]) => (t as { needsApproval?: unknown }).needsApproval === true).map(([n]) => n).sort();
    expect(gated).toEqual(["enrich_contact", "enroll_contacts_in_sequence", "log_crm_activity", "send_email", "upsert_crm_record", "verify_email", "write_supabase_table"]);
  });
  it("returns a readable 'not connected' message instead of throwing", async () => {
    const out = await (tools.find_crm_records.execute as (a: unknown, o: unknown) => Promise<unknown>)({ provider: "hubspot", object_type: "contact", filters: {} }, {});
    expect(out).toEqual({ error: expect.stringContaining("HUBSPOT_ACCESS_TOKEN") });
  });
  it("reports duplicates by normalised keys", async () => {
    const out = (await (tools.dedupe_crm_records.execute as unknown as (a: unknown, o: unknown) => Promise<{ duplicateGroups: number }>)(
      { records: [{ domain: "www.Acme.com" }, { domain: "acme.com" }, { domain: "globex.com" }], unique_fields: ["domain"] },
      {},
    ));
    expect(out.duplicateGroups).toBe(1);
  });
  it("blocks sends to suppressed recipients before any provider call", async () => {
    await (tools.add_suppression.execute as (a: unknown, o: unknown) => Promise<unknown>)({ value: "optout.com", reason: "opt-out" }, {});
    const out = await (tools.send_email.execute as (a: unknown, o: unknown) => Promise<unknown>)({ provider: "resend", to: "ceo@optout.com", subject: "hi", body_text: "hello" }, {});
    expect(out).toEqual({ sent: false, reason: expect.stringContaining("suppression") });
  });
});

describe("connector registry", () => {
  it("covers every provider named in the SDR Assistant spec", () => {
    const ids = CONNECTORS.map((c) => c.id);
    for (const p of ["jina", "serpapi", "clay", "apollo", "hunter", "gmail", "resend", "hubspot", "attio", "zoho", "supabase"]) expect(ids).toContain(p);
    expect(connectorStatus().every((c) => typeof c.configured === "boolean")).toBe(true);
  });
});
