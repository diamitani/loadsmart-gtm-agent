import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";

export async function GET() {
  const supabase = getSupabase();
  return NextResponse.json({
    status: "ok",
    service: "loadsmart-gtm-agent-os",
    version: "v1.0.0",
    timestamp: new Date().toISOString(),
    persistence: supabase ? "supabase-rls" : "local-file-resilient",
    aiGateway: process.env.GOOGLE_GENERATIVE_AI_API_KEY
      ? "google-gemini"
      : process.env.ANTHROPIC_API_KEY
      ? "anthropic-claude"
      : "deterministic-simulation-ready"
  });
}
