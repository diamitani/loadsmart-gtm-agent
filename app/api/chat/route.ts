import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import type { Artifact, RunRecord } from "@/lib/pal/types";
import type { ArtifactCard, EnablyUIMessage, RunCard } from "@/lib/agent/ui-types";
import { runPipeline } from "@/lib/agent/pipeline";
import { architectTools } from "@/lib/agent/tools";
import { getModel as getEnablyModel, modelLabel as enablyModelLabel } from "@/lib/agent/models";
import { systemInstructions } from "@/lib/agent/skills";
import { getStore } from "@/lib/db";
import { decideMode } from "@/lib/agent/router";
import { sdrTools } from "@/lib/connectors/sdr-tools";
import { loadMcpTools } from "@/lib/connectors/mcp";
import { connectorStatus } from "@/lib/connectors/registry";
import { quickAction } from "@/lib/agent/quick-actions";
import { skillText } from "@/lib/agent/skills";
import { nowIso } from "@/lib/utils";
import { friendlyModelError } from "@/lib/agent/errors";
import { presentationMarkdown } from "@/lib/agent/present";
import { requestAiContext, withAiContext, type AiContext } from "@/lib/agent/ai-context";
import { currentUser } from "@/lib/auth/user";
import { withUserScope } from "@/lib/auth/scope";
import {
  getModel as getCopilotModel,
  systemPrompt as copilotSystemPrompt,
  tools as copilotTools,
  hasLiveModelKey,
  buildKitGroundedReply,
} from "@/lib/copilot";

export const maxDuration = 300;

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // 1. If body has an `id` (or comes from PAL/Enably suite/tests), execute the Enably GTM Architect loop
  if (body && typeof body.id === "string" && body.id.length > 0) {
    const user = await currentUser();
    if (!user) return Response.json({ error: "sign in required" }, { status: 401 });
    return withUserScope(user.id, () => chatEnably(body, user.id));
  }

  // 2. Otherwise: Public Loadsmart Copilot Demo (Zero sign up required)
  const messages: UIMessage[] = Array.isArray(body?.messages) ? body.messages.slice(-20) : [];
  if (messages.length === 0) return Response.json({ error: "No messages." }, { status: 400 });

  for (const m of messages) {
    for (const p of m.parts ?? []) {
      if (p.type === "text" && p.text.length > 4000) {
        return Response.json({ error: "Message too long (max 4,000 characters)." }, { status: 413 });
      }
    }
  }

  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  const lastQuery = (lastUserMsg?.parts ?? [])
    .map((p) => (p.type === "text" ? p.text : ""))
    .join(" ")
    .trim() || String((lastUserMsg as { content?: unknown })?.content ?? "").trim();

  const writeKitReply = (writer: { write: (chunk: never) => void }, query: string) => {
    const w = writer.write as (chunk: unknown) => void;
    const reply = buildKitGroundedReply(query);
    for (let idx = 0; idx < reply.toolCalls.length; idx++) {
      const tc = reply.toolCalls[idx];
      const toolCallId = `kit_${Date.now().toString(36)}_${idx}`;
      w({
        type: "tool-input-available",
        toolCallId,
        toolName: tc.name,
        input: tc.input,
      });
      w({
        type: "tool-output-available",
        toolCallId,
        output: tc.output,
      });
    }
    const textId = `t_${Date.now().toString(36)}`;
    w({ type: "text-start", id: textId });
    const chunks = reply.text.match(/.{1,48}(\s|$)/g) ?? [reply.text];
    for (const chunk of chunks) {
      w({ type: "text-delta", id: textId, delta: chunk });
    }
    w({ type: "text-end", id: textId });
  };

  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      if (!hasLiveModelKey()) {
        writeKitReply(writer as unknown as { write: (chunk: never) => void }, lastQuery);
        return;
      }

      let emittedText = false;
      try {
        const result = streamText({
          model: getCopilotModel(),
          system: copilotSystemPrompt,
          messages: await convertToModelMessages(messages),
          tools: copilotTools,
          stopWhen: stepCountIs(6),
          maxOutputTokens: 1800,
        });

        const uiStream = result.toUIMessageStream({ sendStart: false });
        const reader = uiStream.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value.type === "error") {
            console.warn("copilot provider error, falling back to kit-grounded mode:", value.errorText);
            if (!emittedText) {
              writeKitReply(writer as unknown as { write: (chunk: never) => void }, lastQuery);
            }
            return;
          }
          if (value.type === "text-delta") emittedText = true;
          writer.write(value);
        }
        if (!emittedText) {
          writeKitReply(writer as unknown as { write: (chunk: never) => void }, lastQuery);
        }
      } catch (err) {
        console.warn("copilot stream exception, falling back to kit-grounded mode:", err);
        if (!emittedText) {
          writeKitReply(writer as unknown as { write: (chunk: never) => void }, lastQuery);
        }
      }
    },
    onError: (error) => {
      console.error("copilot error", error);
      const msg = error instanceof Error ? error.message : String(error ?? "");
      return `The copilot encountered an issue: ${msg}. Check /api/health for configuration.`;
    },
  });

  return createUIMessageStreamResponse({ stream });
}

async function chatEnably(body: { id: string; messages: EnablyUIMessage[] }, userId: string) {
  const conversationId = body.id;
  const messages = body.messages ?? [];
  const store = getStore();
  const ai = await requestAiContext();

  const existing = await store.getConversation(conversationId);
  const lastRun = existing?.lastRunId ? await store.getRun(existing.lastRunId) : null;
  const latest = textOf(messages.filter((m) => m.role === "user").at(-1));
  const mode = decideMode(latest, lastRun, messages);

  let runId = lastRun?.id;
  let closeMcp: (() => Promise<void>) | undefined;
  let pending = existing?.pending ?? [];

  const stream = createUIMessageStream<EnablyUIMessage>({
    originalMessages: messages,
    execute: ({ writer }) =>
      withUserScope(userId, () =>
        withAiContext(ai, async () => {
          if (mode === "build") {
            const turns = lastRun?.status === "needs_input" && pending.length ? [...pending, latest] : [latest];
            const card = (r: RunRecord): RunCard => ({
              id: r.id,
              status: r.status,
              title: r.title,
              W: r.foundation?.W,
              waves: r.plan?.waves,
              compression: r.plan?.compression,
              quality: r.quality ? { score: r.quality.score, verdict: r.quality.verdict } : undefined,
              truthNotice: r.truth?.notice,
              nextAction: r.nextAction,
              assumptions: r.foundation?.assumptions,
              durationMs: r.durationMs,
              model: r.model,
            });

            const { run, artifacts, clarification } = await runPipeline(
              { messages: turns, source: "chat" },
              {
                conversationId,
                hooks: {
                  onStage: (e) => writer.write({ type: "data-stage", id: e.stage, data: e }),
                  onArtifact: (a) => writer.write({ type: "data-artifact", id: a.id, data: toCard(a) }),
                  onRun: (r) => writer.write({ type: "data-run", id: "run", data: card(r) }),
                },
              },
            );
            runId = run.id;

            if (clarification) {
              pending = turns;
              writeText(writer, clarification);
              return;
            }
            pending = [];
            for (const a of artifacts.filter((x) => x.group === "pop"))
              writer.write({ type: "data-artifact", id: a.id, data: toCard(a) });

            const model = getEnablyModel("main");
            const fallback = presentationMarkdown(run, artifacts);
            if (!model || run.status !== "completed") {
              writeText(
                writer,
                ai.reason === "no_credits" && run.status === "completed"
                  ? `${fallback}\n\n${OUT_OF_CREDITS_BUILD}`
                  : fallback,
              );
              return;
            }
            const result = streamText({
              model,
              system: systemInstructions(),
              prompt: `You just completed a GTM build. Present it to the user in under 180 words. Highlight the primary persona, the hook of the outbound sequence, and the single next action. Be direct, authoritative and warm.\n\nSummary:\n${fallback}`,
            });
            writer.merge(result.toUIMessageStream({ sendStart: false }));
            return;
          }

          // chat mode
          const model = getEnablyModel("main");
          if (!model) {
            const quick = await quickAction(latest);
            if (quick) {
              writeText(writer, quick);
              return;
            }
            if (ai.reason === "no_credits") {
              writeText(writer, outOfCredits(ai));
              return;
            }
            writeText(
              writer,
              "I'm running in **demo mode** (no model key), so I can build full packages but can't hold a free-form conversation yet.\n\n- Start a new request — e.g. *“Build an ICP and email sequence for our AI bookkeeping tool for 10–50 person agencies.”*\n- Or open the **Library** to edit assets directly.\n\nAdd `AI_GATEWAY_API_KEY` (or `ANTHROPIC_API_KEY`) to unlock revisions, knowledge search, and approval-gated workflow delivery.",
            );
            return;
          }
          const run = runId ? await store.getRun(runId) : null;
          const mcp = await loadMcpTools();
          closeMcp = mcp.close;
          const connected = connectorStatus()
            .filter((c) => c.configured)
            .map((c) => `${c.name} (${c.ops.join(", ")})`);
          const result = streamText({
            model,
            system: [
              systemInstructions(),
              `## Current package\n${run ? `Run ${run.id}: ${run.title}. Quality ${run.quality?.score ?? "—"}/100. Use list_artifacts / get_artifact to read assets before revising them. Save improvements with revise_artifact.` : "No package yet."}`,
              `## Connected systems\n${connected.length ? connected.map((c) => `- ${c}`).join("\n") : "- None. If a tool returns 'not connected', tell the user which env var enables it (Settings → Connectors). Never pretend a call happened."}${mcp.servers.length ? `\n- MCP servers: ${mcp.servers.map((s) => `${s.name} (${s.ok ? `${s.tools} tools` : `unavailable: ${s.error}`})`).join(", ")}` : ""}`,
              `## Skill: SDR Assistant\n${skillText("sdr-assistant", 3000)}`,
              `## Skill: Sales Enablement\n${skillText("sales-enablement", 2500)}`,
              `## Skill: Loadsmart ABM Orchestrator\n${skillText("loadsmart-abm-orchestrator", 3000)}`,
              `## Skill: Loadsmart Signal Ingest\n${skillText("la-signal", 2000)}`,
              `## Skill: Loadsmart Email Copywriter\n${skillText("la-email", 2000)}`,
            ].join("\n\n"),
            messages: await convertToModelMessages(messages, { ignoreIncompleteToolCalls: true }),
            tools: { ...architectTools({ runId }), ...sdrTools(), ...mcp.tools },
            stopWhen: stepCountIs(10),
            telemetry: { functionId: "enably.chat" },
          });
          writer.merge(result.toUIMessageStream({ sendStart: false }));
        }),
      ),
    onError: (err) => {
      console.error("[enably] chat error", err);
      return friendlyModelError(err);
    },
    onEnd: async ({ messages: finalMessages }) =>
      withUserScope(userId, async () => {
        await closeMcp?.();
        const firstUser = textOf(finalMessages.find((m) => m.role === "user"));
        await store.saveConversation({
          id: conversationId,
          workspaceId: existing?.workspaceId ?? "default",
          userId,
          title: existing?.title ?? (firstUser.slice(0, 70) || "New conversation"),
          messages: finalMessages,
          lastRunId: runId,
          pending,
          createdAt: existing?.createdAt ?? nowIso(),
          updatedAt: nowIso(),
        });
      }),
  });

  return createUIMessageStreamResponse({
    stream,
    headers: {
      "x-enably-mode": mode,
      "x-enably-model": enablyModelLabel(ai),
      "x-enably-billing": ai.mode,
    },
  });
}

const OUT_OF_CREDITS_BUILD =
  "> **You're out of credits**, so this package was built from structured templates. [Buy credits or add your own AI key](/app/billing) for fully written, personalised assets.";

function outOfCredits(ai: AiContext): string {
  return `**You're out of credits** (balance: ${ai.balance}; each AI call uses ${ai.creditsPerCall}).\n\n- [Buy a credit pack](/app/billing), or\n- [Add your own Anthropic, OpenAI or AI Gateway key](/app/billing) — your key, your bill, no credits used.\n\nYou can still start a new build: packages are produced from templates without credits.`;
}

function textOf(m?: EnablyUIMessage): string {
  if (!m) return "";
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("\n")
    .trim();
}

function toCard(a: Artifact): ArtifactCard {
  return {
    id: a.id,
    title: a.title,
    kind: a.kind,
    group: a.group,
    preview: a.markdown
      .replace(/^---[\s\S]*?---\n/, "")
      .split("\n")
      .filter((l) => !/^\s*(#\s|>)/.test(l))
      .join("\n")
      .replace(/[#>*_`|]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180),
  };
}

function writeText(writer: { write: (c: never) => void }, text: string) {
  const id = `t_${Date.now().toString(36)}`;
  const w = writer.write as (c: unknown) => void;
  w({ type: "text-start", id });
  w({ type: "text-delta", id, delta: text });
  w({ type: "text-end", id });
}
