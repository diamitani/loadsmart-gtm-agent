import "server-only";
import { billingConfig } from "@/lib/billing/config";
import { authMode } from "@/lib/auth/config";

/**
 * Every setting the app reads, in one place. Nothing here is required:
 * with zero keys the app runs in demo mode (deterministic PAL engine +
 * template assets + local file store). Add keys to unlock each multiplier.
 */
export function env() {
  const e = process.env;
  // On Vercel the OIDC token arrives per request (not always in process.env), so opt in explicitly:
  // ENABLY_AI_GATEWAY_OIDC=1 uses AI Gateway via the project's OIDC token — no pasted key needed.
  const gatewayOidc = !!e.VERCEL && e.ENABLY_AI_GATEWAY_OIDC === "1";
  const gatewayKey = e.AI_GATEWAY_API_KEY || e.VERCEL_OIDC_TOKEN || (gatewayOidc ? "oidc" : "");
  const anthropicKey = e.ANTHROPIC_API_KEY;
  const provider: "gateway" | "anthropic" | "demo" = gatewayKey ? "gateway" : anthropicKey ? "anthropic" : "demo";
  return {
    provider,
    // Gateway defaults are free-tier models verified for text + tool calling + structured output
    // (GET /api/health?probe=agent). Set ENABLY_MODEL=anthropic/claude-sonnet-5.5 once Gateway credits are added.
    model: e.ENABLY_MODEL || (provider === "anthropic" ? "claude-sonnet-5-5" : "nvidia/nemotron-3-ultra-550b-a55b"),
    fastModel: e.ENABLY_FAST_MODEL || (provider === "anthropic" ? "claude-haiku-5-5" : "meta/llama-4-scout"),
    workspaceId: e.ENABLY_WORKSPACE_ID || "default",
    accessCode: e.ENABLY_ACCESS_CODE || "",
    supabaseUrl: e.SUPABASE_URL || e.NEXT_PUBLIC_SUPABASE_URL || "",
    supabaseServiceKey: e.SUPABASE_SERVICE_ROLE_KEY || "",
    langsmithEnabled: !!e.LANGSMITH_API_KEY && e.LANGSMITH_TRACING !== "false",
    langsmithProject: e.LANGSMITH_PROJECT || "enablygtm",
    durableUrl: e.CF_AGENT_URL || "",
    durableSecret: e.CF_AGENT_SECRET || "",
    workflowWebhookUrl: e.WORKFLOW_WEBHOOK_URL || e.N8N_WEBHOOK_URL || "",
    workflowWebhookSecret: e.WORKFLOW_WEBHOOK_SECRET || "",
    /** Serverless latency watchdog: hand off remaining waves to the durable agent after this. */
    watchdogMs: Number(e.ENABLY_WATCHDOG_MS || 45000),
  };
}

export type Env = ReturnType<typeof env>;

/** Safe, secret-free summary for the Settings page. */
export function integrationStatus() {
  const e = env();
  return [
    { id: "model", label: "AI model", ok: e.provider !== "demo", detail: e.provider === "demo" ? "Demo mode — template assets, no model calls" : `${e.provider === "gateway" ? "Vercel AI Gateway" : "Anthropic"} · ${e.model}`, env: "AI_GATEWAY_API_KEY or ANTHROPIC_API_KEY" },
    { id: "db", label: "Database", ok: !!(e.supabaseUrl && e.supabaseServiceKey), detail: e.supabaseUrl ? "Supabase Postgres" : "Local file store (.data/enably.json)", env: "SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY" },
    { id: "langsmith", label: "LangSmith tracing & evals", ok: e.langsmithEnabled, detail: e.langsmithEnabled ? `Project: ${e.langsmithProject}` : "Off — traces print nowhere", env: "LANGSMITH_API_KEY (+ LANGSMITH_PROJECT)" },
    { id: "durable", label: "Cloudflare durable agent", ok: !!e.durableUrl, detail: e.durableUrl ? "Long runs + approvals hand off to Durable Objects" : "Off — runs execute inline", env: "CF_AGENT_URL + CF_AGENT_SECRET" },
    { id: "webhook", label: "Workflow delivery (n8n / Make / Zapier)", ok: !!e.workflowWebhookUrl, detail: e.workflowWebhookUrl ? "Approval-gated webhook configured" : "Off — packages stay in the Library", env: "WORKFLOW_WEBHOOK_URL" },
    { id: "ingest", label: "Docs, OCR & vision", ok: true, detail: `PDF/Word/PowerPoint/Excel + OCR built in${e.provider !== "demo" ? " · model vision for images & scans" : ""}${process.env.DOCLING_URL ? " · Docling" : ""}`, env: "DOCLING_URL (optional)" },
    { id: "transcribe", label: "Audio & video transcription", ok: !!process.env.TRANSCRIBE_BASE_URL, detail: process.env.TRANSCRIBE_BASE_URL ? `Whisper · ${process.env.TRANSCRIBE_MODEL || "whisper-large-v3-turbo"}` : "Off — add a free Whisper endpoint", env: "TRANSCRIBE_BASE_URL (+ TRANSCRIBE_API_KEY)" },
    ...billingStatusItems(),
    authStatusItem(),
    { id: "access", label: "Extra access code (optional)", ok: true, detail: e.accessCode ? "On — signed-in users must also enter the access code" : "Off — sign-in alone protects the app", env: "ENABLY_ACCESS_CODE" },
  ];
}

function billingStatusItems() {
  const b = billingConfig();
  return [
    { id: "byok", label: "Bring your own key", ok: b.byok, detail: b.byok ? "Users can add their own Anthropic, OpenAI or AI Gateway key (AES-256-GCM at rest)" : "Off — set a 32-byte BYOK_ENCRYPTION_KEY", env: "BYOK_ENCRYPTION_KEY" },
    { id: "credits", label: "Credits metering", ok: b.metered, detail: b.metered ? `On · ${b.creditsPerCall} credit(s) per AI call${b.freeCredits ? ` · ${b.freeCredits} free on signup` : ""}` : b.accounts ? "Off (ENABLY_BILLING=off) — house key is free for everyone with access" : "Off — needs sign-in (Supabase Auth) for user accounts", env: "ENABLY_BILLING, ENABLY_CREDITS_PER_CALL, ENABLY_FREE_CREDITS" },
    { id: "stripe", label: "Credit purchases (Stripe)", ok: b.stripe, detail: b.stripe ? "Checkout + verified webhook at /api/billing/webhook" : b.stripeKeysPresent ? "Keys set, but paused until Supabase is connected (credits must be durable)" : "Off — add Stripe keys", env: "STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET" },
  ];
}

function authStatusItem() {
  const m = authMode();
  return {
    id: "auth",
    label: "Sign-in (Supabase Auth)",
    ok: m === "supabase",
    detail: m === "supabase" ? "Google OAuth + email/password · each user's data is private" : m === "dev" ? "Dev mode — everyone is the local dev user (never on Vercel)" : "Not configured — the app is closed until Supabase is connected",
    env: "NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY",
  };
}
