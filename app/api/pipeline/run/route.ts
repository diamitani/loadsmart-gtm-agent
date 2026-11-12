import { kit } from "@/lib/kit";

/**
 * Called by the Cloudflare worker (apps/edge) on the schedule in kit/config/schedule.yaml.
 * v0.1 is DRY-RUN ONLY: it validates the request and returns the plan for the step.
 * Live steps (Salesforce reads/writes, ZoomInfo, Gong) are wired in n8n/Make in v1.1, behind the approval gates.
 */
const STEPS = new Set(kit.skills.map((s) => s.slug));

export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const step = new URL(req.url).searchParams.get("step") ?? "";
  if (!STEPS.has(step)) {
    return Response.json({ error: `Unknown step '${step}'`, steps: [...STEPS] }, { status: 400 });
  }
  const skill = kit.skills.find((s) => s.slug === step)!;
  return Response.json(
    {
      mode: "dry-run",
      step,
      at: new Date().toISOString(),
      would: skill.description,
      note: "No external reads or writes happen in v0.1. Connect n8n/Make + Salesforce to go live.",
    },
    { status: 202 },
  );
}
