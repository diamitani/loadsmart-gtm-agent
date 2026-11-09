import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { authMode, DEV_USER_ID, isPublicPath, safeNext, USER_HEADER } from "@/lib/auth/config";
import { ownerFor, OwnershipError, visible, withSystemScope, withUserScope } from "@/lib/auth/scope";
import { createLocalStore } from "@/lib/db/local";
import type { Artifact } from "@/lib/pal/types";
import { proxy } from "@/proxy";

const ENV_KEYS = ["NODE_ENV", "VERCEL", "VERCEL_ENV", "ENABLY_DEV_AUTH", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "SUPABASE_URL", "SUPABASE_ANON_KEY", "ENABLY_ACCESS_CODE", "ENABLY_MCP_TOKEN"];
let saved: Record<string, string | undefined> = {};
const env = process.env as Record<string, string | undefined>;
beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map((k) => [k, env[k]]));
  for (const k of ENV_KEYS) if (k !== "NODE_ENV") delete env[k];
});
afterEach(() => {
  for (const k of ENV_KEYS) (saved[k] === undefined ? delete env[k] : (env[k] = saved[k]));
});

const A = "11111111-1111-4111-8111-111111111111";
const B = "22222222-2222-4222-8222-222222222222";

describe("auth mode", () => {
  it("uses Supabase when the public URL and anon key are set", () => {
    expect(authMode({ NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: "k", NODE_ENV: "production" })).toBe("supabase");
    expect(authMode({ SUPABASE_URL: "https://x.supabase.co", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "k", NODE_ENV: "production" })).toBe("supabase");
  });
  it("falls back to a dev user only off Vercel", () => {
    expect(authMode({ NODE_ENV: "development" })).toBe("dev");
    expect(authMode({ NODE_ENV: "test" })).toBe("dev");
    expect(authMode({ NODE_ENV: "production", ENABLY_DEV_AUTH: "1" })).toBe("dev");
  });
  it("never opens a deployed or production app without Supabase", () => {
    expect(authMode({ NODE_ENV: "production" })).toBe("unconfigured");
    expect(authMode({ NODE_ENV: "production", VERCEL: "1" })).toBe("unconfigured");
    expect(authMode({ NODE_ENV: "development", VERCEL: "1" })).toBe("unconfigured");
    expect(authMode({ NODE_ENV: "production", VERCEL_ENV: "preview", ENABLY_DEV_AUTH: "1" })).toBe("unconfigured");
  });
});

describe("public paths and redirects", () => {
  it("keeps self-authenticating endpoints public and the app private", () => {
    for (const p of ["/signin", "/signup", "/auth/callback", "/api/health", "/api/billing/webhook", "/api/mcp", "/api/runs/run_1/continue", "/api/runs/run_1/approved"]) expect(isPublicPath(p), p).toBe(true);
    for (const p of ["/app", "/app/library", "/api/chat", "/api/runs", "/api/runs/run_1", "/api/knowledge", "/api/byok", "/api/billing", "/api/billing/checkout"]) expect(isPublicPath(p), p).toBe(false);
  });
  it("only follows same-site relative redirects", () => {
    expect(safeNext("/app/library?x=1")).toBe("/app/library?x=1");
    expect(safeNext("https://evil.test")).toBe("/app");
    expect(safeNext("//evil.test")).toBe("/app");
    expect(safeNext("/\\evil.test")).toBe("/app");
    expect(safeNext(null)).toBe("/app");
  });
});

const req = (path: string, init?: { headers?: Record<string, string>; method?: string }) => new NextRequest(new URL(path, "https://enably.test"), init);
const forwarded = (res: Response, name: string) => res.headers.get(`x-middleware-request-${name}`);

describe("proxy gate", () => {
  it("closes the app when deployed without Supabase", async () => {
    env.VERCEL = "1";
    const page = await proxy(req("/app"));
    expect(page.status).toBe(307);
    expect(page.headers.get("location")).toBe("https://enably.test/auth/not-configured");
    expect((await proxy(req("/api/chat", { method: "POST" }))).status).toBe(503);
    expect((await proxy(req("/signin"))).headers.get("location")).toBe("https://enably.test/auth/not-configured");
    // Self-authenticating endpoints still reach their handlers.
    expect((await proxy(req("/api/billing/webhook", { method: "POST" }))).headers.get("x-middleware-next")).toBe("1");
  });

  it("sends signed-out visitors to /signin and APIs to 401", async () => {
    env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    const page = await proxy(req("/app/library?tab=pop"));
    expect(page.status).toBe(307);
    const loc = new URL(page.headers.get("location")!);
    expect(loc.pathname).toBe("/signin");
    expect(loc.searchParams.get("next")).toBe("/app/library?tab=pop");
    expect((await proxy(req("/api/chat", { method: "POST" }))).status).toBe(401);
    expect((await proxy(req("/api/knowledge"))).status).toBe(401);
    expect((await proxy(req("/signin"))).headers.get("x-middleware-next")).toBe("1");
  });

  it("never trusts a client-supplied user header", async () => {
    env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    expect((await proxy(req("/api/chat", { method: "POST", headers: { [USER_HEADER]: A } }))).status).toBe(401);
    const pub = await proxy(req("/api/mcp", { method: "POST", headers: { [USER_HEADER]: A } }));
    expect(forwarded(pub, USER_HEADER)).toBeNull();
  });

  it("forwards the dev user locally and applies the optional access code", async () => {
    const ok = await proxy(req("/app"));
    expect(ok.headers.get("x-middleware-next")).toBe("1");
    expect(forwarded(ok, USER_HEADER)).toBe(DEV_USER_ID);
    env.ENABLY_ACCESS_CODE = "letmein";
    const gated = await proxy(req("/app"));
    expect(new URL(gated.headers.get("location")!).pathname).toBe("/access");
    expect((await proxy(req("/api/chat", { method: "POST" }))).status).toBe(401);
    expect((await proxy(req("/app", { headers: { cookie: "enably_access=letmein" } }))).headers.get("x-middleware-next")).toBe("1");
  });

  it("lets the MCP-token operator start runs", async () => {
    env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon";
    env.ENABLY_MCP_TOKEN = "tok";
    expect((await proxy(req("/api/runs", { method: "POST", headers: { authorization: "Bearer tok" } }))).headers.get("x-middleware-next")).toBe("1");
    expect((await proxy(req("/api/runs", { method: "POST", headers: { authorization: "Bearer nope" } }))).status).toBe(401);
  });
});

describe("ownership rules", () => {
  it("stamps and enforces owners", () => {
    expect(ownerFor({ kind: "user", userId: A }, undefined)).toBe(A);
    expect(ownerFor({ kind: "user", userId: A }, A, A)).toBe(A);
    expect(() => ownerFor({ kind: "user", userId: A }, B)).toThrow(OwnershipError);
    expect(() => ownerFor({ kind: "user", userId: A }, undefined, B)).toThrow(OwnershipError);
    expect(() => ownerFor({ kind: "user", userId: A }, undefined, null)).toThrow(OwnershipError); // can't claim legacy rows
    expect(() => ownerFor({ kind: "none" }, undefined)).toThrow(OwnershipError);
    expect(ownerFor({ kind: "system" }, undefined, B)).toBe(B);
    expect(ownerFor({ kind: "system" }, undefined)).toBeNull();
  });
  it("hides rows from other users and signed-out requests", () => {
    expect(visible({ kind: "user", userId: A }, A)).toBe(true);
    expect(visible({ kind: "user", userId: A }, B)).toBe(false);
    expect(visible({ kind: "user", userId: A }, null)).toBe(false);
    expect(visible({ kind: "none" }, A)).toBe(false);
    expect(visible({ kind: "system" }, B)).toBe(true);
  });
});

describe("per-user data (local store)", () => {
  const store = createLocalStore("default");
  const now = new Date().toISOString();
  const conv = (id: string) => ({ id, workspaceId: "default", title: id, messages: [], createdAt: now, updatedAt: now });
  const art = (id: string, runId?: string): Artifact => ({ id, runId, kind: "email", group: "asset", title: id, markdown: "# hi", status: "draft", version: 1, createdAt: now, provenance: { agentId: "t", model: "t", promptVersion: "1", inputRefs: [] } });
  const uid = () => crypto.randomUUID().slice(0, 8);

  it("keeps conversations private and un-hijackable", async () => {
    const id = `c_${uid()}`;
    await withUserScope(A, () => store.saveConversation(conv(id)));
    expect((await withUserScope(A, () => store.getConversation(id)))?.userId).toBe(A);
    expect(await withUserScope(B, () => store.getConversation(id))).toBeNull();
    expect((await withUserScope(B, () => store.listConversations())).some((c) => c.id === id)).toBe(false);
    await expect(withUserScope(B, () => store.saveConversation({ ...conv(id), title: "pwned" }))).rejects.toThrow(OwnershipError);
    await withUserScope(B, () => store.deleteConversation(id));
    expect((await withUserScope(A, () => store.getConversation(id)))?.title).toBe(id);
    expect(await withSystemScope(() => store.getConversation(id))).not.toBeNull();
  });

  it("scopes the Library, and callbacks inherit the run's owner", async () => {
    const runId = `run_${uid()}`;
    const a1 = `a_${uid()}`;
    await withUserScope(A, async () => {
      await store.saveRun({ id: runId, title: "r", status: "completed", createdAt: now, updatedAt: now } as never);
      await store.saveArtifacts([art(a1, runId)]);
    });
    expect((await withUserScope(A, () => store.listArtifacts({ runId }))).map((a) => a.id)).toEqual([a1]);
    expect(await withUserScope(B, () => store.listArtifacts({ runId }))).toEqual([]);
    expect(await withUserScope(B, () => store.getRun(runId))).toBeNull();
    expect(await withUserScope(B, () => store.updateArtifact(a1, { markdown: "pwned" }))).toBeNull();
    // A durable callback (system scope) adds an artifact to A's run → owned by A.
    const a2 = `a_${uid()}`;
    await withSystemScope(() => store.saveArtifacts([art(a2, runId)]));
    expect((await withUserScope(A, () => store.getArtifact(a2)))?.userId).toBe(A);
    expect(await withUserScope(B, () => store.getArtifact(a2))).toBeNull();
  });

  it("scopes Knowledge", async () => {
    const k = `k_${uid()}`;
    await withUserScope(A, () => store.addKnowledge({ id: k, workspaceId: "default", name: "n", kind: "text", text: "secret", chars: 6, createdAt: now }));
    expect((await withUserScope(A, () => store.listKnowledge())).some((d) => d.id === k)).toBe(true);
    expect((await withUserScope(B, () => store.listKnowledge())).some((d) => d.id === k)).toBe(false);
    await withUserScope(B, () => store.deleteKnowledge(k));
    expect((await withUserScope(A, () => store.listKnowledge())).some((d) => d.id === k)).toBe(true);
  });
});
