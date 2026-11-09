import { describe, expect, it } from "vitest";
import { compileIntake } from "@/lib/pal/intake";
import { extractIntent, mergeIntent, STARTER_PACK } from "@/lib/pal/intent";
import { checkFoundation, clarificationMessage } from "@/lib/pal/foundation";
import { compressPlan, executeWaves, topoWaves } from "@/lib/pal/compressor";
import { scanText, truthCheck } from "@/lib/pal/truth-guard";
import { qualityGate } from "@/lib/pal/quality-gate";
import { buildPopDocs, nextActionFor, POP_ARTIFACTS } from "@/lib/pal/pop";
import { assetTemplate } from "@/lib/pal/templates";
import { ASSET_KINDS, type Artifact } from "@/lib/pal/types";
import { decideMode } from "@/lib/agent/router";
import { search } from "@/lib/agent/knowledge";

const FULL = "We're launching an AI bookkeeping assistant for 10-50 person marketing agencies in the US. Build me an ICP, personas and a cold email sequence. We compete with Pilot and Bench.";

const intakeOf = (...m: string[]) => compileIntake({ messages: m });

describe("intake", () => {
  it("compiles MASTER.md with verbatim turns, links and questionnaire", () => {
    const i = compileIntake({ messages: ["Hello see https://acme.io/pricing.", "second"], questionnaire: { target_customer: "CFOs" } });
    expect(i.masterMd).toContain("# MASTER.md");
    expect(i.masterMd).toContain("Target Customer: CFOs");
    expect(i.links).toEqual(["https://acme.io/pricing"]);
    expect(i.wordCount).toBeGreaterThan(3);
  });
});

describe("intent", () => {
  it("extracts offer, ICP, assets, geography and competitors", () => {
    const intent = extractIntent(intakeOf(FULL));
    expect(intent.offer).toMatch(/ai bookkeeping assistant/i);
    expect(intent.icp).toMatch(/marketing agencies/i);
    expect(intent.requestedAssets).toEqual(expect.arrayContaining(["icp", "personas", "email_sequence"]));
    expect(intent.usedDefaultAssets).toBe(false);
    expect(intent.competitors).toEqual(expect.arrayContaining(["Pilot", "Bench"]));
    expect(intent.stage).toBe("pre-launch");
  });

  it("handles 'for our X for Y' and 'selling X to Y' phrasings (found by the eval suite)", () => {
    const a = extractIntent(intakeOf("Build an ICP and cold emails for our HR compliance software for multi-location restaurants."));
    expect(a.offer).toMatch(/HR compliance software/);
    expect(a.icp).toMatch(/multi-location restaurants/);
    const b = extractIntent(intakeOf("Create a prospecting plan for selling cybersecurity audits to Series A fintech startups."));
    expect(b.offer).toMatch(/cybersecurity audits/);
    expect(b.icp).toMatch(/fintech startups/i);
  });

  it("falls back to the starter pack when no assets are named", () => {
    const intent = extractIntent(intakeOf("Help me with go to market for our payroll app for restaurants"));
    expect(intent.usedDefaultAssets).toBe(true);
    expect(intent.requestedAssets).toEqual(STARTER_PACK);
  });

  it("LLM refinement only adds information, never erases the deterministic floor", () => {
    const base = extractIntent(intakeOf(FULL));
    const merged = mergeIntent(base, { offer: "", icp: undefined, industry: "accounting", confidence: 0.9 });
    expect(merged.offer).toBe(base.offer);
    expect(merged.industry).toBe("accounting");
    expect(merged.confidence).toBe(0.9);
  });
});

describe("foundation (One Must Act)", () => {
  it("halts at W < 1 and asks only for missing critical criteria", () => {
    const f = checkFoundation(extractIntent(intakeOf("Write me some cold emails")));
    expect(f.ready).toBe(false);
    expect(f.W).toBeLessThan(1);
    expect(f.missing.map((m) => m.id)).toEqual(expect.arrayContaining(["offer", "icp"]));
    expect(f.missing.every((m) => m.critical)).toBe(true);
    expect(clarificationMessage(f)).toContain("W = ");
  });

  it("reaches W = 1.00 with offer + ICP + deliverable and labels non-critical gaps", () => {
    const f = checkFoundation(extractIntent(intakeOf(FULL)));
    expect(f.W).toBe(1);
    expect(f.ready).toBe(true);
    expect(f.assumptions.length).toBeGreaterThan(0);
    expect(f.outcome100).toMatch(/meetings|discovery calls/);
  });

  it("accumulates answers across turns", () => {
    const f = checkFoundation(extractIntent(intakeOf("Write me some cold emails", "We sell a scheduling app for dental clinics")));
    expect(f.ready).toBe(true);
  });
});

describe("middle-out compressor", () => {
  it("adds prerequisites, groups into dependency-respecting waves, and compresses", () => {
    const p = compressPlan(["email_sequence", "battlecard", "kpi_scorecard"]);
    const ids = p.nodes.map((n) => n.id);
    expect(ids).toEqual(expect.arrayContaining(["icp", "personas", "positioning", "research"]));
    const waveOf = (id: string) => p.waves.findIndex((w) => w.includes(id));
    for (const n of p.nodes) for (const d of n.deps) expect(waveOf(d)).toBeLessThan(waveOf(n.id));
    expect(p.compression).toBeGreaterThan(1);
  });

  it("prunes nodes whose precondition is false", () => {
    const p = compressPlan(["icp"], { preconditions: { research: () => false } });
    expect(p.nodes.map((n) => n.id)).toEqual(["icp"]);
    expect(p.pruned[0].id).toBe("research");
  });

  it("detects cycles", () => {
    expect(() => topoWaves([{ id: "a", deps: ["b"] }, { id: "b", deps: ["a"] }])).toThrow(/cycle/);
  });

  it("runs waves concurrently and hands off remaining waves when over budget", async () => {
    const p = compressPlan(["email_sequence"]);
    const order: string[] = [];
    const full = await executeWaves(p, async (n) => (order.push(n.id), n.id));
    expect(full.remaining).toEqual([]);
    expect(full.results.size).toBe(p.nodes.length);
    const cut = await executeWaves(p, async (n) => (await new Promise((r) => setTimeout(r, 15)), n.id), { budgetMs: 10 });
    expect(cut.remaining.length).toBeGreaterThan(0);
  });
});

describe("calibrated truth guard", () => {
  it("flags operational data but ignores placeholders", () => {
    const f = scanText("Email jane@realco.com or {{email}}. Call 415-555-0134. We increased replies by 43%. Trusted by Stripe and Notion.");
    const types = f.map((x) => x.type);
    expect(types).toEqual(expect.arrayContaining(["email", "phone", "statistic", "customer_claim"]));
    expect(f.find((x) => x.value.includes("{{"))).toBeUndefined();
  });

  it("treats entities present in the user's inputs as grounded", () => {
    const r = truthCheck([{ id: "a", kind: "icp", markdown: "Contact ops@agency.com" }], "my email is ops@agency.com", "operational");
    expect(r.ungrounded).toBe(0);
    expect(r.notice).toBeNull();
    const r2 = truthCheck([{ id: "a", kind: "icp", markdown: "Contact ceo@invented.com" }], "nothing", "operational");
    expect(r2.ungrounded).toBe(1);
    expect(r2.notice).toMatch(/verify/);
  });
});

describe("templates + POP + quality gate", () => {
  const intent = extractIntent(intakeOf(FULL));
  const foundation = checkFoundation(intent);
  const plan = compressPlan(intent.requestedAssets);
  const nextAction = nextActionFor(intent, foundation);

  it("every asset template is non-trivial and template output contains no invented operational data", () => {
    for (const kind of ASSET_KINDS) {
      const md = assetTemplate(kind, { intent, foundation });
      expect(md.length).toBeGreaterThan(300);
      expect(scanText(md)).toEqual([]);
    }
  });

  it("emits exactly the 11 POP artifacts", () => {
    const docs = buildPopDocs({ runId: "run_test", intake: intakeOf(FULL), intent, foundation, plan, nextAction });
    expect(docs).toHaveLength(11);
    expect(docs.map((d) => d.code)).toEqual(POP_ARTIFACTS.map((a) => a.code));
    expect(docs.find((d) => d.code === "D")!.markdown).toContain("```mermaid");
  });

  it("scores a complete template package as at least 'Ready with assumptions'", () => {
    const mk = (kind: string, group: Artifact["group"], markdown: string): Artifact => ({
      id: kind, kind, group, title: kind, markdown, status: "draft", version: 1, createdAt: "", provenance: { agentId: "t", model: "t", promptVersion: "t", inputRefs: [] },
    });
    const assets = plan.nodes.filter((n) => n.id !== "research").map((n) => mk(n.id, "asset", assetTemplate(n.id as never, { intent, foundation })));
    const pop = buildPopDocs({ runId: "r", intake: intakeOf(FULL), intent, foundation, plan, nextAction }).map((d) => mk(d.kind, "pop", d.markdown));
    const truth = truthCheck(assets, FULL, intent.domain);
    const q = qualityGate({ intent, foundation, plan, artifacts: [...assets, ...pop], truth });
    expect(q.checks.find((c) => c.id === "structure")!.pass).toBe(true);
    expect(q.checks.find((c) => c.id === "pop")!.pass).toBe(true);
    expect(q.score).toBeGreaterThanOrEqual(75);
    expect(["Ready", "Ready with assumptions"]).toContain(q.verdict);
  });
});

describe("chat router", () => {
  const done = { status: "completed" } as never;
  const two = [{ role: "user" }, { role: "assistant" }, { role: "user" }];
  it("builds on the first turn and while waiting for clarification", () => {
    expect(decideMode("hi", null, [{ role: "user" }])).toBe("build");
    expect(decideMode("dental clinics", { status: "needs_input" } as never, two)).toBe("build");
  });
  it("edits in chat mode, rebuilds on an explicit new request", () => {
    expect(decideMode("make email 2 shorter", done, two)).toBe("chat");
    expect(decideMode("now build a battlecard against Gusto", done, two)).toBe("build");
  });
});

describe("knowledge search (BM25)", () => {
  it("ranks the relevant chunk first", () => {
    const hits = search(
      [
        { name: "pricing.md", text: "Our pricing starts at $99 per seat.\n\nAnnual plans get two months free." },
        { name: "icp.md", text: "Best customers are marketing agencies with 10-50 employees and messy bookkeeping." },
      ],
      "marketing agencies bookkeeping",
    );
    expect(hits[0].source).toBe("icp.md");
  });
});
