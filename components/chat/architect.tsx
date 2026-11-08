"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithApprovalResponses } from "ai";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, BookOpen, ChevronDown, FileText, Paperclip, ShieldCheck, Square, Wrench } from "lucide-react";
import type { ArtifactCard, EnablyUIMessage, RunCard } from "@/lib/agent/ui-types";
import type { StageEvent } from "@/lib/pal/types";
import { Mark } from "@/components/brand";
import { Markdown } from "@/components/markdown";
import { PipelineTracker, Waves, WGauge } from "@/components/pipeline";
import { Badge, Button, Meter, verdictTone } from "@/components/ui";
import { cn, fmtMs } from "@/lib/utils";

const ACCEPT = ".pdf,.docx,.pptx,.xlsx,.png,.jpg,.jpeg,.webp,.gif,.mp3,.m4a,.wav,.ogg,.flac,.mp4,.mov,.webm,.md,.markdown,.txt,.csv,.json,.html,.yaml,.yml";

const STARTERS = [
  {
    label: "Full GTM starter pack",
    prompt: "We're launching an AI bookkeeping assistant for 10–50 person marketing agencies in the US. Build the full GTM starter pack.",
  },
  {
    label: "ICP + personas + cold emails",
    prompt: "Build an ICP, personas and a 4-step cold email sequence for our HR compliance software for multi-location restaurants. We compete with Gusto and Rippling.",
  },
  {
    label: "Signals + automation",
    prompt: "Create a signal-based prospecting plan and an n8n automation blueprint for selling cybersecurity audits to Series A fintech startups.",
  },
  {
    label: "See the foundation check",
    prompt: "Write me some cold emails.",
  },
];

export function Architect({ id, initialMessages, demo }: { id: string; initialMessages: EnablyUIMessage[]; demo: boolean }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const transport = useMemo(() => new DefaultChatTransport<EnablyUIMessage>({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, stop, error, addToolApprovalResponse } = useChat<EnablyUIMessage>({
    id,
    messages: initialMessages,
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
    onFinish: () => router.refresh(),
  });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    if (!location.pathname.startsWith("/app/c/")) window.history.replaceState(null, "", `/app/c/${id}`);
    sendMessage({ text: t });
    setInput("");
  };

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    const fd = new FormData();
    [...files].forEach((f) => fd.append("files", f));
    const res = await fetch("/api/knowledge", { method: "POST", body: fd });
    const json = await res.json();
    setNotice(res.ok ? `Read ${json.created.map((c: { name: string; method: string }) => `${c.name} (${c.method})`).join(", ")} into Knowledge — the Architect will cite it.${json.errors?.length ? ` ${json.errors.join(" ")}` : ""}` : json.error);
    setTimeout(() => setNotice(null), 8000);
  };

  const latestRun = [...messages].reverse().flatMap((m) => m.parts).find((p) => p.type === "data-run")?.data as RunCard | undefined;

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] lg:min-h-dvh">
      <div className="flex min-w-0 flex-1 flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 pb-8 pt-8 sm:px-6">
            {messages.length === 0 ? (
              <Welcome demo={demo} onPick={send} />
            ) : (
              <div className="space-y-8">
                {messages.map((m) => (m.role === "user" ? <UserTurn key={m.id} m={m} /> : <AssistantTurn key={m.id} m={m} busy={busy && m.id === messages.at(-1)?.id} onApprove={addToolApprovalResponse} />))}
                {status === "submitted" && (
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <Mark className="h-6 w-6" /> <span className="pulse-dot">Compiling your request…</span>
                  </div>
                )}
                {error && <div className="rounded-xl border border-rose/30 bg-rose-soft px-4 py-3 text-sm text-rose">{error.message || "Something went wrong."}</div>}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 border-t hairline bg-paper/95 backdrop-blur">
          <form
            className="mx-auto w-full max-w-3xl px-4 py-3 sm:px-6"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            {notice && <div className="mb-2 rounded-lg bg-evergreen-soft px-3 py-1.5 text-xs text-evergreen">{notice}</div>}
            <div className="card flex items-end gap-2 p-2">
              <input ref={fileRef} type="file" multiple accept={ACCEPT} className="hidden" onChange={(e) => upload(e.target.files)} />
              <button type="button" onClick={() => fileRef.current?.click()} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted hover:bg-paper-2 hover:text-ink" aria-label="Attach files to knowledge">
                <Paperclip className="h-4 w-4" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Describe what you sell, who buys it, and what you need…"
                className="max-h-48 min-h-9 flex-1 resize-none bg-transparent py-2 text-[15px] text-ink outline-none placeholder:text-faint"
                style={{ fieldSizing: "content" } as React.CSSProperties}
                aria-label="Message the GTM Architect"
              />
              {busy ? (
                <button type="button" onClick={() => stop()} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-paper" aria-label="Stop">
                  <Square className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button type="submit" disabled={!input.trim()} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-clay text-clay-ink disabled:opacity-40" aria-label="Send">
                  <ArrowUp className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="mt-1.5 text-center text-[11px] text-faint">Nothing is sent, published or written to a CRM without your approval.</p>
          </form>
        </div>
      </div>

      <aside className="sticky top-0 hidden h-dvh w-[340px] shrink-0 overflow-y-auto border-l hairline bg-paper-2/50 p-5 xl:block">
        <Inspector run={latestRun} stages={latestStages(messages)} />
      </aside>
    </div>
  );
}

function latestStages(messages: EnablyUIMessage[]): StageEvent[] {
  const last = [...messages].reverse().find((m) => m.role === "assistant" && m.parts.some((p) => p.type === "data-stage"));
  return last ? (last.parts.filter((p) => p.type === "data-stage").map((p) => p.data) as StageEvent[]) : [];
}

function Welcome({ demo, onPick }: { demo: boolean; onPick: (t: string) => void }) {
  return (
    <div className="rise pt-6 sm:pt-12">
      <div className="eyebrow">GTM Architect</div>
      <h1 className="display mt-3 text-4xl leading-[1.05] sm:text-5xl">
        What are we taking <em className="text-clay">to market</em>?
      </h1>
      <p className="mt-4 max-w-xl text-[15px] text-muted">
        Tell me what you sell and who buys it. I compile your request, check the foundation, plan the work in parallel waves, build the assets, test them for truth and quality — then hand you one next action.
      </p>
      {demo && (
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-amber/30 bg-amber-soft px-4 py-3 text-[13px] text-amber">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <b>Demo mode.</b> The full pipeline runs, and assets come from structured templates. Add an AI key in <Link href="/app/settings" className="underline">Settings</Link> for fully written, personalised assets.
          </span>
        </div>
      )}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {STARTERS.map((s) => (
          <button key={s.label} onClick={() => onPick(s.prompt)} className="card group p-4 text-left transition-transform hover:-translate-y-0.5">
            <div className="text-[13px] font-medium text-ink">{s.label}</div>
            <div className="mt-1 line-clamp-2 text-xs text-muted">{s.prompt}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function UserTurn({ m }: { m: EnablyUIMessage }) {
  const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("\n");
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-surface px-4 py-2.5 text-[15px] text-ink shadow-soft">{text}</div>
    </div>
  );
}

type ApproveFn = (r: { id: string; approved: boolean; reason?: string }) => void | PromiseLike<void>;

function AssistantTurn({ m, busy, onApprove }: { m: EnablyUIMessage; busy: boolean; onApprove: ApproveFn }) {
  const stages = m.parts.filter((p) => p.type === "data-stage").map((p) => p.data as StageEvent);
  const run = m.parts.find((p) => p.type === "data-run")?.data as RunCard | undefined;
  const artifacts = m.parts.filter((p) => p.type === "data-artifact").map((p) => p.data as ArtifactCard);
  const assets = artifacts.filter((a) => a.group === "asset");
  const pop = artifacts.filter((a) => a.group === "pop");
  const [showPipe, setShowPipe] = useState(true);

  return (
    <div className="rise flex gap-3">
      <Mark className="mt-0.5 h-7 w-7 shrink-0" />
      <div className="min-w-0 flex-1 space-y-4">
        {stages.length > 0 && (
          <div className="card overflow-hidden">
            <button onClick={() => setShowPipe((s) => !s)} className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="eyebrow">PAL pipeline</span>
                {run?.W !== undefined && <Badge tone={run.W >= 1 ? "green" : "amber"}>W {run.W.toFixed(2)}</Badge>}
                {run?.quality && <Badge tone={verdictTone(run.quality.verdict)}>{run.quality.score}/100 · {run.quality.verdict}</Badge>}
                {busy && <span className="pulse-dot text-xs text-clay">running</span>}
              </div>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-faint transition-transform", showPipe && "rotate-180")} />
            </button>
            {showPipe && (
              <div className="border-t hairline px-4 py-4">
                <PipelineTracker stages={stages} />
              </div>
            )}
          </div>
        )}

        {assets.length > 0 && (
          <div>
            <div className="eyebrow mb-2">Assets · {assets.length}</div>
            <div className="grid gap-2 sm:grid-cols-2">
              {assets.map((a) => (
                <Link key={a.id} href={`/app/library/${a.id}`} className="card group block p-3.5 transition-transform hover:-translate-y-0.5">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-ink">
                    <FileText className="h-3.5 w-3.5 text-clay" /> {a.title}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{a.preview}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {pop.length > 0 && (
          <details className="card group px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[13px]">
              <span>
                <span className="font-medium text-ink">POP documentation package</span> <span className="text-muted">· {pop.length} documents</span>
              </span>
              <ChevronDown className="h-4 w-4 text-faint transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-3 grid gap-1 sm:grid-cols-2">
              {pop.map((a) => (
                <Link key={a.id} href={`/app/library/${a.id}`} className="truncate rounded-md px-2 py-1 font-mono text-[11px] text-ink-2 hover:bg-paper-2">
                  {a.title}
                </Link>
              ))}
            </div>
          </details>
        )}

        {m.parts.map((p, i) => {
          if (p.type === "text") return <Markdown key={i}>{p.text}</Markdown>;
          if (p.type.startsWith("tool-")) return <ToolPart key={i} part={p as unknown as ToolPartShape} onApprove={onApprove} />;
          return null;
        })}

        {run?.status === "completed" && (
          <div className="flex flex-wrap gap-2">
            <Link href={`/app/runs/${run.id}`} className="text-xs text-clay underline underline-offset-2">Open run manifest</Link>
            <span className="text-xs text-faint">· {fmtMs(run.durationMs)} · {run.model}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface ToolPartShape {
  type: string;
  state: string;
  input?: Record<string, unknown>;
  output?: unknown;
  errorText?: string;
  approval?: { id: string; approved?: boolean };
}

function ToolPart({ part, onApprove }: { part: ToolPartShape; onApprove: ApproveFn }) {
  const name = part.type.replace(/^tool-/, "").replace(/_/g, " ");
  if (part.state === "approval-requested" && part.approval) {
    return (
      <div className="card border-clay/40 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-ink">
          <ShieldCheck className="h-4 w-4 text-clay" /> Approval needed: {name}
        </div>
        <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-paper-2 p-2 font-mono text-[11px] text-ink-2">{JSON.stringify(part.input, null, 2)}</pre>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="clay" onClick={() => onApprove({ id: part.approval!.id, approved: true })}>Approve & send</Button>
          <Button size="sm" variant="outline" onClick={() => onApprove({ id: part.approval!.id, approved: false, reason: "User denied" })}>Deny</Button>
        </div>
      </div>
    );
  }
  const done = part.state === "output-available";
  const denied = part.state === "output-denied" || part.approval?.approved === false;
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border hairline bg-surface px-3 py-1 text-[11px] text-muted">
      {name === "search knowledge" ? <BookOpen className="h-3 w-3" /> : <Wrench className="h-3 w-3" />}
      <span className="truncate">{name}</span>
      <Badge tone={denied ? "rose" : done ? "green" : part.state === "output-error" ? "rose" : "neutral"}>{denied ? "denied" : done ? "done" : part.state === "output-error" ? "error" : "running"}</Badge>
    </div>
  );
}

function Inspector({ run, stages }: { run?: RunCard; stages: StageEvent[] }) {
  if (!run && !stages.length) {
    return (
      <div className="space-y-5">
        <div className="eyebrow">Run inspector</div>
        <p className="text-sm text-muted">Live state of the current run appears here: foundation wholeness, the parallel build plan, quality score and your next action.</p>
        <PipelineTracker stages={[]} compact />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div>
        <div className="eyebrow">Run inspector</div>
        <div className="mt-1 truncate text-sm font-medium text-ink">{run?.title ?? "Current run"}</div>
      </div>
      {run?.W !== undefined && (
        <div className="flex items-center gap-4">
          <WGauge W={run.W} />
          <div className="text-xs text-muted">
            <div className="font-medium text-ink">{run.W >= 1 ? "Foundation complete" : "Foundation incomplete"}</div>
            {run.W >= 1 ? "Multipliers unlocked." : "Answer the questions in chat to reach W = 1.00."}
          </div>
        </div>
      )}
      <PipelineTracker stages={stages} compact />
      {run?.waves && run.waves.length > 0 && (
        <div>
          <div className="eyebrow mb-2">Build plan · est. {run.compression}×</div>
          <Waves waves={run.waves} />
        </div>
      )}
      {run?.quality && (
        <div>
          <div className="eyebrow mb-2">Quality gate</div>
          <div className="flex items-baseline justify-between">
            <span className="display text-3xl">{run.quality.score}</span>
            <Badge tone={verdictTone(run.quality.verdict)}>{run.quality.verdict}</Badge>
          </div>
          <Meter value={run.quality.score} max={100} tone={run.quality.score >= 90 ? "green" : run.quality.score >= 75 ? "clay" : "amber"} className="mt-2" />
        </div>
      )}
      {run?.truthNotice && <div className="rounded-xl bg-amber-soft px-3 py-2 text-xs text-amber">{run.truthNotice}</div>}
      {run?.nextAction && (
        <div className="rounded-xl border border-clay/30 bg-clay-soft/60 p-3">
          <div className="eyebrow !text-clay">One must act</div>
          <div className="mt-1 text-[13px] font-medium text-ink">{run.nextAction.action}</div>
          <div className="mt-1 text-[11px] text-muted">{run.nextAction.owner} · {run.nextAction.due}</div>
        </div>
      )}
    </div>
  );
}
