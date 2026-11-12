import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import { getModel, systemPrompt, tools } from "@/lib/copilot";

export const maxDuration = 60;

// Best-effort rate limit per IP (per server instance). Protects the public demo's model budget.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = Number(process.env.CHAT_RATE_LIMIT_PER_HOUR ?? 40);
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) {
    return Response.json({ error: "Rate limit reached for this demo. Try again in an hour." }, { status: 429 });
  }

  let body: { messages?: UIMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
  if (messages.length === 0) return Response.json({ error: "No messages." }, { status: 400 });

  // Cap user input size
  for (const m of messages) {
    for (const p of m.parts ?? []) {
      if (p.type === "text" && p.text.length > 4000) {
        return Response.json({ error: "Message too long (max 4,000 characters)." }, { status: 413 });
      }
    }
  }

  const result = streamText({
    model: getModel(),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(6),
    maxOutputTokens: 1800,
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      console.error("chat error", error);
      return "The copilot couldn't reach its model. If you run this site, check the AI Gateway or ANTHROPIC_API_KEY setting (see /api/health).";
    },
  });
}
