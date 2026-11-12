import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db/supabase";
import { modelLabel } from "@/lib/copilot";
import { kit } from "@/lib/kit";

export const dynamic = "force-dynamic";

// Reports configuration without exposing any secret values.
export async function GET() {
  const supabase = getSupabase();
  return NextResponse.json({
    status: "ok",
    service: "loadsmart-gtm-agent-os",
    version: "v1.2.0",
    timestamp: new Date().toISOString(),
    persistence: supabase ? "supabase-rls" : "local-file-resilient",
    copilotModel: modelLabel(),
    provider: "openrouter",
    openrouterKeySet: Boolean(process.env.OPENROUTER_API_KEY),
    anthropicKeySet: Boolean(process.env.ANTHROPIC_API_KEY),
    gatewayKeySet: Boolean(process.env.AI_GATEWAY_API_KEY),
    onVercel: Boolean(process.env.VERCEL),
    playbookSections: kit.sections.length,
    skills: kit.skills.length,
  });
}
