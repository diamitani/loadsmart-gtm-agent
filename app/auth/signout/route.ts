import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/auth/supabase-server";

export async function POST(req: Request) {
  const supabase = await supabaseServer();
  await supabase?.auth.signOut();
  return NextResponse.redirect(new URL("/signin", req.url), { status: 303 });
}
