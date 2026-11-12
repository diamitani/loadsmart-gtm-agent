"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Square } from "lucide-react";
import { ChatMarkdown } from "./markdown";

const starters = [
  "Plan an SDR's morning for a pod selling all three products. What comes first?",
  "Our pod's replies are up but meetings are flat. Where is the leak?",
  "Write a LinkedIn note for a DC operations manager at a shipper opening a new site.",
  "Walk me through the la-crm-audit skill and why it runs first.",
];

const toolLabels: Record<string, string> = {
  list_playbook_sections: "Listed playbook",
  read_playbook_section: "Read playbook",
  search_playbook: "Searched the kit",
  list_skills: "Listed skills",
  read_skill: "Read skill",
  read_config: "Read config",
  list_documents: "Listed docs",
  read_document: "Read doc",
  read_claims_library: "Read claims",
  list_automations: "Listed automations",
  read_automation: "Read automation",
};

type ToolPart = { type: string; state?: string; input?: Record<string, unknown> };

export function DemoChat() {
  const { messages, sendMessage, status, error, stop } = useChat();
  const [input, setInput] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput("");
  }

  return (
    <div className="flex h-[640px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.25)]">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-[12px] font-bold text-white">PC</span>
          <div>
            <p className="text-[15px] font-semibold text-slate-900">Pod Copilot</p>
            <p className="text-[12px] text-slate-500">Grounded in the playbook and 11 skills. Drafts only, never sends.</p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700">
          <span className="size-1.5 rounded-full bg-emerald-500" /> Live
        </span>
      </div>

      <div ref={scroller} className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="mx-auto max-w-2xl">
            <p className="text-[22px] font-semibold tracking-[-0.02em] text-slate-900">What does your pod need today?</p>
            <p className="mt-2 text-[14px] leading-relaxed text-slate-500">
              This demo isn&apos;t connected to Salesforce, Gong or ZoomInfo, so it tells you when an answer needs live data
              instead of guessing.
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {starters.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-2xl border border-slate-200 p-4 text-left text-[14px] leading-snug text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-6" aria-live="polite">
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-slate-900 px-4 py-2.5 text-[14.5px] text-white">
                    {m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text}</span> : null))}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex gap-3">
                  <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-lg bg-blue-600 text-[11px] font-bold text-white">PC</span>
                  <div className="min-w-0 flex-1 space-y-2">
                    {m.parts.map((p, i) => {
                      if (p.type === "text") return <ChatMarkdown key={i} source={p.text} />;
                      if (p.type.startsWith("tool-")) {
                        const tp = p as ToolPart;
                        const name = tp.type.slice(5);
                        const arg = tp.input ? Object.values(tp.input)[0] : undefined;
                        return (
                          <span key={i} className="mr-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[12px] text-slate-600">
                            <span className={`size-1.5 rounded-full ${tp.state === "output-available" ? "bg-emerald-500" : "animate-pulse bg-amber-500"}`} />
                            {toolLabels[name] ?? name}
                            {typeof arg === "string" && arg ? `: ${arg}` : ""}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ),
            )}
            {status === "submitted" && <p className="pl-10 text-[13px] text-slate-400">Thinking…</p>}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
                {"The copilot is temporarily unavailable. Please try again in a moment."}
              </div>
            )}
          </div>
        )}
      </div>

      <form
        className="border-t border-slate-200 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <div className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-500 focus-within:bg-white transition-colors">
          <label htmlFor="demo-chat-input" className="sr-only">
            Message the Pod Copilot
          </label>
          <textarea
            id="demo-chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            maxLength={4000}
            placeholder="Ask for a plan, a draft, or how a skill works…"
            className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-[14.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {busy ? (
            <button type="button" onClick={() => stop()} aria-label="Stop" className="grid size-9 place-items-center rounded-xl bg-slate-200 text-slate-700">
              <Square className="size-3.5" />
            </button>
          ) : (
            <button type="submit" disabled={!input.trim()} aria-label="Send" className="grid size-9 place-items-center rounded-xl bg-slate-900 text-white disabled:opacity-30">
              <ArrowUp className="size-4" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

