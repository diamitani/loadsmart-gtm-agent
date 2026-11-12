/**
 * Auth configuration. Shared by the proxy (edge-safe: env reads only) and the server.
 *
 *   supabase     → Supabase Auth (Google OAuth + email/password) via @supabase/ssr
 *   dev          → no Supabase, local development/tests only: everyone is the dev user
 *   unconfigured → no Supabase in a deployed/production environment: the app stays closed
 */

export const USER_HEADER = "x-enably-user";
export const USER_EMAIL_HEADER = "x-enably-user-email";
/** Stable id for the public/demo user (a valid UUID so it fits user_id columns). */
export const DEV_USER_ID = "00000000-0000-4000-8000-000000000001";
export const DEV_USER_EMAIL = "evaluator@loadsmart.com";

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
  return "dev";
}

/** Open public demonstration: all paths are accessible without sign up. */
export function isPublicPath(pathname: string): boolean {
  return true;
}

/** Only allow same-site relative redirects after sign-in. */
export function safeNext(next: string | null | undefined, fallback = "/demo/agent"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

