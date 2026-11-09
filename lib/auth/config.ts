/**
 * Auth configuration. Shared by the proxy (edge-safe: env reads only) and the server.
 *
 *   supabase     → Supabase Auth (Google OAuth + email/password) via @supabase/ssr
 *   dev          → no Supabase, local development/tests only: everyone is the dev user
 *   unconfigured → no Supabase in a deployed/production environment: the app stays closed
 */

export const USER_HEADER = "x-enably-user";
export const USER_EMAIL_HEADER = "x-enably-user-email";
/** Stable id for the local dev user (a valid UUID so it fits user_id columns). */
export const DEV_USER_ID = "00000000-0000-4000-8000-000000000001";
export const DEV_USER_EMAIL = "dev@localhost";

export type AuthMode = "supabase" | "dev" | "unconfigured";

export function supabasePublicConfig(): { url: string; anonKey: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "";
  return url && anonKey ? { url, anonKey } : null;
}

export function authMode(e: NodeJS.ProcessEnv = process.env): AuthMode {
  const url = e.NEXT_PUBLIC_SUPABASE_URL || e.SUPABASE_URL;
  const key = e.NEXT_PUBLIC_SUPABASE_ANON_KEY || e.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || e.SUPABASE_ANON_KEY;
  if (url && key) return "supabase";
  // Never fall back to a mock user on Vercel (production or preview).
  if (e.VERCEL || e.VERCEL_ENV) return "unconfigured";
  if (e.NODE_ENV !== "production" || e.ENABLY_DEV_AUTH === "1") return "dev";
  return "unconfigured";
}

/** Paths reachable without signing in. Everything else under the proxy matcher needs a user. */
export function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname.startsWith("/auth/") ||
    pathname === "/access" ||
    pathname.startsWith("/api/access") ||
    pathname.startsWith("/api/health") ||
    pathname === "/api/billing/webhook" || // Stripe signature
    pathname.startsWith("/api/mcp") || // Bearer ENABLY_MCP_TOKEN
    /^\/api\/runs\/[^/]+\/(continue|approved|reminder)$/.test(pathname) // Bearer CF_AGENT_SECRET
  );
}

/** Only allow same-site relative redirects after sign-in. */
export function safeNext(next: string | null | undefined, fallback = "/app"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
