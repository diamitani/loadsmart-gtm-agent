import { NextResponse } from "next/server";
import { safeNext } from "@/lib/auth/config";
import { supabaseServer } from "@/lib/auth/supabase-server";

/** OAuth (Google) and email-confirmation redirect target: exchanges the PKCE code for a session. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));
  const supabase = await supabaseServer();
  if (!supabase) return NextResponse.redirect(new URL("/auth/not-configured", url.origin));
  const providerError = url.searchParams.get("error_description") || url.searchParams.get("error");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
    return NextResponse.redirect(new URL(`/signin?error=${encodeURIComponent(error.message)}`, url.origin));
  }
  return NextResponse.redirect(new URL(`/signin?error=${encodeURIComponent(providerError || "Sign-in link was invalid or expired.")}`, url.origin));
}
