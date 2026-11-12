// A2A discovery card for the Pod Copilot (discovery only; JSON-RPC task endpoint is v1.1).
export function GET(req: Request, _ctx: { params: Promise<{ slug: string }> }) {
  const origin = new URL(req.url).origin;
  return Response.json({
    name: "Loadsmart Pod Copilot",
    description:
      "Plans the pod's day, preps accounts and drafts persona-specific outreach for Loadsmart's ABM pods, grounded in the ABM playbook and skill pack. Read-only in this deployment.",
    url: `${origin}/api/chat`,
    version: "0.1.0",
    provider: { organization: "Patrick Diamitani (independent proposal)" },
    capabilities: { streaming: true, pushNotifications: false },
    defaultInputModes: ["text"],
    defaultOutputModes: ["text"],
    skills: [
      { id: "pod-day", name: "Plan the pod's day", description: "Ordered call and LinkedIn plan." },
      { id: "draft", name: "Draft outreach", description: "Email body, LinkedIn note, call opener per product persona." },
      { id: "program-qa", name: "Program Q&A", description: "Answers from the playbook, skills and config." },
    ],
  });
}
