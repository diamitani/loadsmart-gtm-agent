import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { safeNext } from "@/lib/auth/config";
import { supabaseServer } from "@/lib/auth/supabase-server";

/**
 * Optional, cross-device email confirmation: point the Supabase "Confirm signup" email template at
 *   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/app
 * (works even when the link is opened in a different browser than the one that signed up).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const supabase = await supabaseServer();
  if (!supabase) return NextResponse.redirect(new URL("/auth/not-configured", url.origin));
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) return NextResponse.redirect(new URL(safeNext(url.searchParams.get("next")), url.origin));
  }
  return NextResponse.redirect(new URL("/signin?error=Confirmation%20link%20was%20invalid%20or%20expired.", url.origin));
}
