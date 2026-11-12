"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { ChatMarkdown } from "./markdown";

const starters = [
  "Plan an SDR's morning for a pod selling all three products. What comes first?",
  "Write a LinkedIn connection note for a DC operations manager at a shipper opening a new site.",
  "A transportation manager says \"we just implemented a TMS.\" How should the rep respond?",
  "Our pod's replies are up but meetings are flat. Where is the leak?",
  "Walk me through the la-crm-audit skill and why it runs first.",
  "How many meetings did pod 2 book this week?",
];

const toolLabels: Record<string, string> = {
  list_playbook_sections: "Listed playbook sections",
  read_playbook_section: "Read playbook",
  search_playbook: "Searched playbook",
  list_skills: "Listed skills",
  read_skill: "Read skill",
  read_config: "Read config",
};

type ToolPart = { type: string; state?: string; input?: Record<string, unknown> };

export function Chat({ initialPrompt }: { initialPrompt?: string }) {
  const { messages, sendMessage, status, error, stop } = useChat();
  const [input, setInput] = useState(initialPrompt ?? "");
  const endRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput("");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-5 py-8">
          {messages.length === 0 ? (
            <div>
              <p className="text-[13px] font-medium text-brand uppercase tracking-[0.08em]">Pod Copilot</p>
              <h1 className="mt-2 text-[30px] font-bold tracking-[-0.02em]">What does your pod need today?</h1>
              <p className="mt-3 text-ink-2 leading-relaxed">
                Grounded in the playbook, the 11 skills and their config. In this demo it is not connected to
                Salesforce, Gong or ZoomInfo, so it will tell you when an answer needs live data instead of guessing.
                It drafts; it never sends.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-2.5">
                {starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left rounded-xl border border-line bg-card p-4 text-[14px] text-ink-2 hover:border-brand/40 hover:text-ink transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6" aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
                  {m.role === "user" ? (
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-ink text-white px-4 py-2.5 text-[14.5px] whitespace-pre-wrap">
                      {m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text}</span> : null))}
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <span className="mt-1 grid place-items-center size-7 shrink-0 rounded-lg bg-brand text-white text-[11px] font-bold">PC</span>
                      <div className="min-w-0 flex-1 space-y-2">
                        {m.parts.map((p, i) => {
                          if (p.type === "text") return <ChatMarkdown key={i} source={p.text} />;
                          if (p.type.startsWith("tool-")) {
                            const tp = p as ToolPart;
                            const name = tp.type.slice(5);
                            const arg = tp.input ? Object.values(tp.input)[0] : undefined;
                            return (
                              <span key={i} className="inline-flex items-center gap-1.5 mr-2 px-2.5 py-1 rounded-full bg-paper border border-line text-[12px] text-muted">
                                <span className={`size-1.5 rounded-full ${tp.state === "output-available" ? "bg-good" : "bg-warn animate-pulse"}`} />
                                {toolLabels[name] ?? name}
                                {typeof arg === "string" && arg ? `: ${arg}` : ""}
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {status === "submitted" && <p className="text-[13px] text-muted pl-10">Thinking…</p>}
              {error && (
                <div className="rounded-xl border border-bad/30 bg-[#fbebeb] px-4 py-3 text-[14px] text-bad">
                  {error.message || "Something went wrong."}
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-line bg-card">
        <form
          className="mx-auto max-w-3xl px-5 py-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <label htmlFor="chat-input" className="sr-only">Message the Pod Copilot</label>
          <textarea
            id="chat-input"
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
            className="flex-1 resize-none rounded-xl border border-line bg-paper px-4 py-3 text-[14.5px] focus:outline-none focus:border-brand"
          />
          {busy ? (
            <button type="button" onClick={() => stop()} className="px-4 rounded-xl border border-line font-medium text-[14px]">Stop</button>
          ) : (
            <button type="submit" disabled={!input.trim()} className="px-5 rounded-xl bg-ink text-white font-medium text-[14px] disabled:opacity-40">Send</button>
          )}
        </form>
      </div>
    </div>
  );
}
