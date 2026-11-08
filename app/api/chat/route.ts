import { createUIMessageStream, createUIMessageStreamResponse, convertToModelMessages, stepCountIs, streamText } from "ai";
import type { Artifact, RunRecord } from "@/lib/pal/types";
import type { ArtifactCard, EnablyUIMessage, RunCard } from "@/lib/agent/ui-types";
import { runPipeline } from "@/lib/agent/pipeline";
import { architectTools } from "@/lib/agent/tools";
import { getModel, modelLabel } from "@/lib/agent/models";
import { systemInstructions } from "@/lib/agent/skills";
import { getStore } from "@/lib/db";
import { decideMode } from "@/lib/agent/router";
import { nowIso } from "@/lib/utils";
import { presentationMarkdown } from "@/lib/agent/present";

export const maxDuration = 300;

/**
 * The GTM Architect chat endpoint (Vercel AI SDK v7 UI message stream).
 *
 *  build mode → PAL pipeline: stages stream as `data-stage` parts, assets as
 *               `data-artifact`, the run summary as `data-run`, then the
 *               presentation streams as text.
 *  chat mode  → tool-using agent over the existing package (revise, search,
 *               truth-check, approval-gated workflow delivery).
 */
export async function POST(req: Request) {
  const body = (await req.json()) as { id: string; messages: EnablyUIMessage[] };
  const conversationId = body.id;
  const messages = body.messages ?? [];
  const store = getStore();

  const existing = await store.getConversation(conversationId);
  const lastRun = existing?.lastRunId ? await store.getRun(existing.lastRunId) : null;
  const latest = textOf(messages.filter((m) => m.role === "user").at(-1));
  const mode = decideMode(latest, lastRun, messages);

  let runId = lastRun?.id;
  let pending = existing?.pending ?? [];

  const stream = createUIMessageStream<EnablyUIMessage>({
    originalMessages: messages,
    execute: async ({ writer }) => {
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
        for (const a of artifacts.filter((x) => x.group === "pop")) writer.write({ type: "data-artifact", id: a.id, data: toCard(a) });

        const model = getModel("main");
        const fallback = presentationMarkdown(run, artifacts);
        if (!model || run.status !== "completed") {
          writeText(writer, fallback);
          return;
        }
        const result = streamText({
          model,
          system: systemInstructions(),
          prompt: `You just completed a GTM build. Present it to the user in under 180 words: a one-line headline, what was built (bullets), the labelled assumptions, any verification notice, and the ONE next action with owner/due/proof. Do not repeat the assets' content — they are shown as cards. Facts:\n\n${fallback}`,
          telemetry: { functionId: "enably.present" },
        });
        writer.merge(result.toUIMessageStream({ sendStart: false }));
        return;
      }

      // chat mode
      const model = getModel("main");
      if (!model) {
        writeText(
          writer,
          "I'm running in **demo mode** (no model key), so I can build full packages but can't hold a free-form conversation yet.\n\n- Start a new request — e.g. *“Build an ICP and email sequence for our AI bookkeeping tool for 10–50 person agencies.”*\n- Or open the **Library** to edit assets directly.\n\nAdd `AI_GATEWAY_API_KEY` (or `ANTHROPIC_API_KEY`) to unlock revisions, knowledge search, and approval-gated workflow delivery.",
        );
        return;
      }
      const run = runId ? await store.getRun(runId) : null;
      const result = streamText({
        model,
        system: `${systemInstructions()}\n\n## Current package\n${run ? `Run ${run.id}: ${run.title}. Quality ${run.quality?.score ?? "—"}/100. Use list_artifacts / get_artifact to read assets before revising them. Save improvements with revise_artifact.` : "No package yet."}`,
        messages: await convertToModelMessages(messages, { ignoreIncompleteToolCalls: true }),
        tools: architectTools({ runId }),
        stopWhen: stepCountIs(8),
        telemetry: { functionId: "enably.chat" },
      });
      writer.merge(result.toUIMessageStream({ sendStart: false }));
    },
    onError: (err) => {
      console.error("[enably] chat error", err);
      return err instanceof Error ? err.message : "Something went wrong";
    },
    onEnd: async ({ messages: finalMessages }) => {
      const firstUser = textOf(finalMessages.find((m) => m.role === "user"));
      await store.saveConversation({
        id: conversationId,
        workspaceId: existing?.workspaceId ?? "default",
        title: existing?.title ?? (firstUser.slice(0, 70) || "New conversation"),
        messages: finalMessages,
        lastRunId: runId,
        pending,
        createdAt: existing?.createdAt ?? nowIso(),
        updatedAt: nowIso(),
      });
    },
  });

  return createUIMessageStreamResponse({ stream, headers: { "x-enably-mode": mode, "x-enably-model": modelLabel() } });
}

function textOf(m?: EnablyUIMessage): string {
  if (!m) return "";
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("\n")
    .trim();
}

function toCard(a: Artifact): ArtifactCard {
  return { id: a.id, title: a.title, kind: a.kind, group: a.group, preview: a.markdown.replace(/^---[\s\S]*?---\n/, "").split("\n").filter((l) => !/^\s*(#\s|>)/.test(l)).join("\n").replace(/[#>*_`|]/g, "").replace(/\s+/g, " ").trim().slice(0, 180) };
}

function writeText(writer: { write: (c: never) => void }, text: string) {
  const id = `t_${Date.now().toString(36)}`;
  const w = writer.write as (c: unknown) => void;
  w({ type: "text-start", id });
  w({ type: "text-delta", id, delta: text });
  w({ type: "text-end", id });
}
