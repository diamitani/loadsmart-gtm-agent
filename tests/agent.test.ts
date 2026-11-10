/**
 * End-to-end wiring of the Enably agent backend, with a scripted mock model
 * (no provider key needed): soul + skills injection, the PAL build pipeline and its
 * skill-specialist subagents, the chat tool loop, the approval gate, and the
 * manifest that ties agent/*.yaml to the implemented tools.
 */
import fs from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MockLanguageModelV4 } from "ai/test";
import { simulateReadableStream } from "ai";

const h = vi.hoisted(() => ({
  model: null as unknown,
  streamScript: [] as ((prompt: unknown) => unknown[])[],
  generateCalls: [] as { system: string; prompt: string; json: boolean }[],
  streamCalls: [] as { system: string }[],
}));

vi.mock("@/lib/auth/user", () => ({ currentUser: async () => ({ id: "00000000-0000-4000-8000-0000000000aa", email: "t@example.com" }) }));
vi.mock("@/lib/agent/models", async (orig) => ({
  ...(await orig<typeof import("@/lib/agent/models")>()),
  getModel: () => h.model,
  modelLabel: () => "mock-model",
}));

import { POST } from "@/app/api/chat/route";
import { agentManifest, parseSubagents } from "@/lib/agent/manifest";
import { SKILL_FOR, skillText, systemInstructions } from "@/lib/agent/skills";
import { ASSET_KINDS } from "@/lib/pal/types";

const usage = { inputTokens: { total: 10, noCache: 10, cacheRead: 0, cacheWrite: 0 }, outputTokens: { total: 5, text: 5, reasoning: 0 } };
const finish = (unified: "stop" | "tool-calls") => ({ type: "finish", finishReason: { unified, raw: unified }, usage });
const text = (t: string) => [{ type: "text-start", id: "1" }, { type: "text-delta", id: "1", delta: t }, { type: "text-end", id: "1" }, finish("stop")];
const call = (id: string, toolName: string, input: unknown) => [{ type: "tool-call", toolCallId: id, toolName, input: JSON.stringify(input) }, finish("tool-calls")];

type Prompt = { role: string; content: string | { type: string; text?: string }[] }[];
const sysOf = (prompt: Prompt) => prompt.filter((m) => m.role === "system").map((m) => (typeof m.content === "string" ? m.content : "")).join("\n");
const userOf = (prompt: Prompt) => prompt.filter((m) => m.role === "user").map((m) => (typeof m.content === "string" ? m.content : m.content.map((c) => c.text ?? "").join(""))).join("\n");

function mockModel() {
  return new MockLanguageModelV4({
    doGenerate: async (opts) => {
      const prompt = opts.prompt as Prompt;
      const system = sysOf(prompt);
      const json = opts.responseFormat?.type === "json";
      h.generateCalls.push({ system, prompt: userOf(prompt), json });
      let out: string;
      if (json && /go-to-market intent/.test(system)) {
        out = JSON.stringify({ statedGoal: "ICP + email sequence", latentGoal: "pipeline", company: null, offer: "HR compliance software", icp: "multi-location restaurants", industry: "restaurants", geography: null, motion: "outbound", stage: null, audience: null, competitors: ["Gusto"], requestedAssets: ["icp", "email_sequence"], confidence: 0.9 });
      } else if (json && /templates/.test(system)) {
        out = JSON.stringify({ subject: "[First name], quick idea", body: "Hi [First name], …", placeholders: ["First name"] });
      } else {
        out = `# MOCK ASSET\n\n${"Grounded content with [ASSUMPTION: placeholder]. ".repeat(12)}`;
      }
      return { content: [{ type: "text", text: out }], finishReason: { unified: "stop", raw: "stop" }, usage, warnings: [] } as never;
    },
    doStream: async (opts) => {
      h.streamCalls.push({ system: sysOf(opts.prompt as Prompt) });
      const step = h.streamScript.shift() ?? (() => text("done"));
      return { stream: simulateReadableStream({ chunks: step(opts.prompt) as never[], initialDelayInMs: null, chunkDelayInMs: null }) } as never;
    },
  });
}

async function chat(id: string, messages: unknown[]) {
  const res = await POST(new Request("http://localhost/api/chat", { method: "POST", body: JSON.stringify({ id, messages }) }));
  const raw = await res.text();
  const parts = raw.split("\n").filter((l) => l.startsWith("data: ") && !l.includes("[DONE]")).map((l) => JSON.parse(l.slice(6)));
  await new Promise((r) => setTimeout(r, 50)); // let onEnd persist the conversation
  return { res, parts };
}
const user = (id: string, t: string) => ({ id, role: "user", parts: [{ type: "text", text: t }] });

beforeEach(() => {
  h.model = mockModel();
  h.streamScript = [];
  h.generateCalls = [];
  h.streamCalls = [];
  delete process.env.ENABLY_MCP_SERVERS;
  delete process.env.WORKFLOW_WEBHOOK_URL;
});

describe("agent manifest (soul, skills, subagents, tools)", () => {
  it("has no wiring problems", () => {
    const m = agentManifest();
    expect(m.problems).toEqual([]);
    expect(m.soulChars).toBeGreaterThan(1000);
    expect(m.subagents.length).toBeGreaterThanOrEqual(13);
    expect(m.tools).toEqual(expect.arrayContaining(["generate_personalization_snippets", "generate_template", "send_to_workflow", "read_document"]));
  });
  it("every asset kind is owned by a subagent whose skill matches the code", () => {
    const subs = parseSubagents(fs.readFileSync("agent/agents/subagents.yaml", "utf8"));
    for (const k of ASSET_KINDS) {
      const owner = subs.find((s) => s.assets.includes(k));
      expect(owner, k).toBeTruthy();
      expect(owner!.skill).toBe(SKILL_FOR[k]);
      expect(skillText(SKILL_FOR[k]).length, SKILL_FOR[k]).toBeGreaterThan(100);
    }
  });
  it("tools.schema.json matches the implemented SDR tools", async () => {
    const { sdrTools } = await import("@/lib/connectors/sdr-tools");
    const names = JSON.parse(fs.readFileSync("agent/skills/sdr-assistant/tools.schema.json", "utf8")).map((t: { name: string }) => t.name);
    expect(names.sort()).toEqual(Object.keys(sdrTools()).sort());
  });
});

describe("chat endpoint end to end (mock model)", () => {
  it("build mode: runs PAL with the soul + one skill-specialist per asset, then chat mode runs the tool loop with an approval gate", async () => {
    const conv = `conv_${Date.now()}`;
    const first = user("u1", "Build an ICP and a 4-step cold email sequence for our HR compliance software for multi-location restaurants. We compete with Gusto.");
    h.streamScript = [() => text("Here is your package.")];
    const b = await chat(conv, [first]);
    expect(b.res.status).toBe(200);
    expect(b.res.headers.get("x-enably-mode")).toBe("build");

    const stages = b.parts.filter((p) => p.type === "data-stage" && p.data.status === "done").map((p) => p.data.stage);
    expect(stages).toEqual(expect.arrayContaining(["intake", "intent", "foundation", "instruct", "plan", "build", "test", "present"]));
    const run = b.parts.filter((p) => p.type === "data-run").at(-1)!.data;
    expect(run.status).toBe("completed");
    const assets = b.parts.filter((p) => p.type === "data-artifact" && p.data.group === "asset").map((p) => p.data.kind);
    expect(assets).toEqual(expect.arrayContaining(["icp", "email_sequence"]));

    // intent refinement used structured output
    expect(h.generateCalls.some((c) => c.json && /go-to-market intent/.test(c.system))).toBe(true);
    // each asset was written by its specialist: soul + compiled brief + that skill's SKILL.md
    const soulHead = systemInstructions().slice(0, 120);
    for (const kind of ["icp", "email_sequence"] as const) {
      const c = h.generateCalls.find((x) => x.system.includes(`## Skill: ${SKILL_FOR[kind]}\n`));
      expect(c, kind).toBeTruthy();
      expect(c!.system).toContain(soulHead);
      expect(c!.system).toContain("## Compiled brief");
      expect(c!.system).toContain(skillText(SKILL_FOR[kind]).slice(0, 200));
    }
    // presentation streamed from the model with the soul as system prompt
    expect(h.streamCalls[0].system).toContain(soulHead);
    expect(b.parts.filter((p) => p.type === "text-delta").map((p) => p.delta).join("")).toContain("Here is your package.");

    // --- chat mode: tool loop over the package
    h.streamScript = [
      () => call("c1", "list_artifacts", { scope: "current_run" }),
      () => call("c2", "truth_check", { text: "Call 555-123-4567 — customers grew 300%." }),
      () => call("c3", "generate_template", { channel: "email", persona: "Ops director", goal: "book a call" }),
      () => call("c4", "send_to_workflow", { purpose: "load the sequence into the sequencer" }),
    ];
    const c = await chat(conv, [first, { id: "a1", role: "assistant", parts: [{ type: "text", text: "Here is your package." }] }, user("u2", "Make the emails shorter and check them")]);
    expect(c.res.headers.get("x-enably-mode")).toBe("chat");
    const out = (id: string) => c.parts.find((p) => p.type === "tool-output-available" && p.toolCallId === id)?.output;

    expect((out("c1") as { kind: string }[]).map((a) => a.kind)).toEqual(expect.arrayContaining(["icp", "email_sequence"]));
    expect((out("c2") as { findings: unknown[] }).findings.length).toBeGreaterThan(0);
    expect(out("c3")).toMatchObject({ channel: "email", generatedBy: "model", subject: "[First name], quick idea" });
    // approval gate: the send is requested, never executed
    expect(c.parts.some((p) => p.type === "tool-approval-request" && p.toolCallId === "c4")).toBe(true);
    expect(out("c4")).toBeUndefined();

    const sys = h.streamCalls.at(-1)!.system;
    expect(sys).toContain(soulHead);
    expect(sys).toContain("## Skill: SDR Assistant");
    expect(sys).toContain("## Skill: Sales Enablement");
    expect(sys).toContain("## Current package");
  });

  it("demo mode (no model): build still produces a full package; chat explains how to unlock", async () => {
    h.model = null;
    const conv = `conv_demo_${Date.now()}`;
    const first = user("u1", "Build an ICP and a 4-step cold email sequence for our HR compliance software for multi-location restaurants.");
    const b = await chat(conv, [first]);
    expect(b.parts.filter((p) => p.type === "data-run").at(-1)!.data.status).toBe("completed");
    const c = await chat(conv, [first, { id: "a1", role: "assistant", parts: [{ type: "text", text: "ok" }] }, user("u2", "Make the emails shorter")]);
    expect(c.parts.filter((p) => p.type === "text-delta").map((p) => p.delta).join("")).toMatch(/demo mode/i);
  });
});
