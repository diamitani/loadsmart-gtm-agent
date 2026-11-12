"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  ShieldCheck, 
  Mail, 
  CheckCircle2, 
  User, 
  Terminal, 
  RefreshCw, 
  Workflow, 
  Zap, 
  Check, 
  Layers,
  ArrowRight
} from "lucide-react";

export function DemoView() {
  const [demoSubTab, setDemoSubTab] = useState<"copilot" | "slots" | "funnel">("copilot");

  // Chat State
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; content: string; timestamp: string }>>([
    {
      id: "msg-init",
      role: "assistant",
      content: `Hello! I am your **Loadsmart GTM Copilot & Prospect Automation Agent**.

I operate across all four Loadsmart AE/SDR pods:
- **Pod 1:** Mid-Market FTL & Multimodal Logistics
- **Pod 2:** Enterprise ShipperGuide TMS
- **Pod 3:** Opendock Facility & Yard Network
- **Pod 4:** Loadsmart AI Autonomous Operations

All copy generation is strictly gated by the **Calibrated Truth Guard** and verified against Loadsmart's official claims library (230,000 vetted carriers, 4,500 warehouses, 14M dock appointments).

What would you like to execute today?`,
      timestamp: "Just now"
    }
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [stagedApproved, setStagedApproved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 6-Step Slot State
  const [activeSlotIdx, setActiveSlotIdx] = useState(0);
  const [selectedEvidenceMode, setSelectedEvidenceMode] = useState<"notes" | "search" | "both">("both");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  async function handleSend(textToSend?: string) {
    const text = textToSend || input;
    if (!text.trim() || isStreaming) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      role: "user" as const,
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    const assistantMessageId = `asst-${Date.now()}`;
    const initialAssistantMessage = {
      id: assistantMessageId,
      role: "assistant" as const,
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, initialAssistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok || !response.body) {
        throw new Error("Chat response failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: accumulated } : msg
          )
        );
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: "⚡ [Verified Simulation] Nominated 20 target shippers for ShipperGuide TMS. 0 CRM collisions found in Salesforce. 18 contacts enriched via Clay waterfall. Copy staged in review drawer." }
            : msg
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }

  const promptChips = [
    "Nominate 20 enterprise accounts for ShipperGuide",
    "Draft 1-to-1 PAS copy for Greg Sutherland at Apex Beverage",
    "Inspect secondary domain mailbox deliverability",
    "Run daily pod leak report & stuck accounts triage",
    "Check CRM Shield for Salesforce territory collisions"
  ];

  const slotSteps = [
    { num: "01", name: "Signals", kind: "code", desc: "Turns your ideal-customer description and buying signals into a short brief every later step scores against.", opt: "signals_source: icp_only", guard: "A run stops if required settings are unfilled." },
    { num: "02", name: "Companies", kind: "code + ai", desc: "Loads companies, runs CRM Shield dedupe, then scores logistics fit against your ICP.", opt: "companies_source: salesforce_http", guard: "Parked active deals are skipped, never dropped silently." },
    { num: "03", name: "Contacts", kind: "code", desc: "Discovers verified freight leaders via Clay waterfall (W = 1.00).", opt: "contacts_source: clay_waterfall", guard: "Guessed addresses never send without permission." },
    { num: "04", name: "Research", kind: "ai + verify", desc: "Finds concrete procurement bottlenecks that trace back to verifiable evidence.", opt: "research_source: http_search", guard: "Hooks without evidence are discarded." },
    { num: "05", name: "Email", kind: "ai + checks", desc: "Drafts 1-to-1 PAS copy, verified 100% against Loadsmart's official Claims Library.", opt: "email_mode: full_email", guard: "Truth Guard blocks unverified numbers and fake stats." },
    { num: "06", name: "Outreach", kind: "code", desc: "Logs drafts to staged review drawer. Dispatches to Gong Engage only upon rep signature.", opt: "outreach_mode: log_only", guard: "Live sends strictly require human approval." }
  ];

  const funnelMetrics = [
    { num: "01", name: "Signals", count: 120, note: "matched shippers" },
    { num: "02", name: "Companies", count: 84, note: "fit above 0.85" },
    { num: "03", name: "Contacts", count: 61, note: "verified W=1.00" },
    { num: "04", name: "Research", count: 48, note: "evidence found" },
    { num: "05", name: "Email", count: 44, note: "claims verified" },
    { num: "06", name: "Outreach", count: 31, note: "staged in drawer" }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Demo View Sub-Tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-2.5 rounded-xl shadow-xs">
        <div className="flex items-center gap-1.5 pl-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            Live Product Demo
          </span>
          <span className="text-[11px] font-mono text-slate-400">· Vercel AI SDK v7 Live</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setDemoSubTab("copilot")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              demoSubTab === "copilot" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Copilot & Staged Review
          </button>
          <button
            onClick={() => setDemoSubTab("slots")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              demoSubTab === "slots" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            6-Step Slot Engine
          </button>
          <button
            onClick={() => setDemoSubTab("funnel")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              demoSubTab === "funnel" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Funnel & Lead Triage
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Copilot & Staged Review */}
      {demoSubTab === "copilot" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)] min-h-[580px]">
          {/* Main Chat Interface */}
          <div className="lg:col-span-2 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            {/* Chat Header */}
            <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                    Loadsmart GTM Copilot
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-mono font-medium">
                      Live
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Truth Guard W = 1.00 Enforced</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Claims Library Protected
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 text-xs sm:text-sm leading-relaxed ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-md bg-white border border-slate-200 shadow-xs flex-shrink-0 flex items-center justify-center text-blue-600 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 space-y-2 whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white border border-slate-200 text-slate-800 shadow-xs"
                    }`}
                  >
                    {msg.content.includes("⚡") ? (
                      <div className="space-y-1.5">
                        <div className="font-mono text-[10.5px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-flex items-center gap-1">
                          <Terminal className="w-3 h-3 text-blue-600" />
                          Tool Execution Verified
                        </div>
                        <div>{msg.content}</div>
                      </div>
                    ) : (
                      <div>{msg.content}</div>
                    )}
                    <div className={`text-[10px] ${msg.role === "user" ? "text-blue-100" : "text-slate-400"} text-right font-medium`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-md bg-slate-800 flex-shrink-0 flex items-center justify-center text-white mt-1 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isStreaming && (
                <div className="flex items-center gap-2 text-xs text-slate-500 pl-9">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                  <span>GTM Agent thinking and verifying claims against Claims Library...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Prompt Chips */}
            <div className="p-2.5 border-t border-slate-200 bg-white flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-slate-400 font-semibold uppercase text-[10px] whitespace-nowrap pl-1">Suggested:</span>
              {promptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 whitespace-nowrap transition-colors font-medium text-[11px]"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Instruct the pod copilot (e.g. 'Nominate accounts for Pod 2', 'Draft copy for Apex Beverage')..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>

          {/* Staged Copy Review Drawer */}
          <div className="flex flex-col bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Staged Outbound Touchpoints
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Human-in-the-loop review drawer before sequence enrollment.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-semibold">
                1 Staged
              </span>
            </div>

            <div className="space-y-3 text-xs flex-1">
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-semibold">
                    Pod 2 · ShipperGuide TMS
                  </span>
                  <div className="font-bold text-slate-900 text-sm mt-1.5">Apex Beverage Logistics</div>
                  <div className="text-slate-500 text-[11px]">
                    Greg Sutherland · VP Logistics & Transportation
                  </div>
                </div>

                <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed text-slate-700 shadow-xs">
                  <div className="text-slate-500 border-b border-slate-100 pb-1.5">
                    <strong className="text-slate-800">Subject:</strong> Quick question on Dallas DC carrier procurement
                  </div>
                  <div className="text-slate-700 pt-1">
                    Greg - saw Apex is bringing two new regional facilities online in Dallas and Atlanta this winter. 
                    <br /><br />
                    When shippers scale multi-region distribution on top of MercuryGate, procurement friction and manual rate lookups typically slow dispatch cycles. 
                    <br /><br />
                    ShipperGuide connects your procurement directly with 230,000 vetted carriers, cutting spot quote turnaround from 4 hours to seconds inside your existing workflow. 
                    <br /><br />
                    Worth a brief 10-minute glance at how comparable beverage shippers benchmarked their initial Dallas lanes?
                  </div>
                </div>

                <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-200 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span><strong>Truth Guard:</strong> 230,000 vetted carriers verified in claims library.</span>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => setStagedApproved(true)}
                    disabled={stagedApproved}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      stagedApproved
                        ? "bg-emerald-600 text-white cursor-default shadow-xs"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                    }`}
                  >
                    {stagedApproved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Batch Approved & Sequenced to Gong
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Approve Batch & Stage to Gong Flow
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700">Governance Invariant:</div>
              <div>No message is sent or enrolled without explicit human rep signature.</div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: 6-Step Slot Engine */}
      {demoSubTab === "slots" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {slotSteps.map((step, idx) => (
              <button
                key={step.num}
                onClick={() => setActiveSlotIdx(idx)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  activeSlotIdx === idx
                    ? "bg-white border-blue-600 shadow-xs ring-1 ring-blue-600"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">{step.num}</span>
                  <span className="text-[9.5px] uppercase font-semibold text-slate-500">{step.kind}</span>
                </div>
                <div className="font-bold text-sm text-slate-900 mt-2">{step.name}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">
                  Step {slotSteps[activeSlotIdx].num} · {slotSteps[activeSlotIdx].name} ({slotSteps[activeSlotIdx].kind})
                </h3>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-semibold">
                  Slot Configured
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {slotSteps[activeSlotIdx].desc}
              </p>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="text-xs font-semibold text-slate-700">Bound Configuration:</div>
                <div className="font-mono text-xs text-blue-600">{slotSteps[activeSlotIdx].opt}</div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span><strong>Guard Rule:</strong> {slotSteps[activeSlotIdx].guard}</span>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="font-bold text-sm text-slate-900">Compiled YAML Build Spec</h4>
                <span className="text-[10px] font-mono text-emerald-600 font-semibold">W = 1.00</span>
              </div>

              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-1 overflow-x-auto">
                <div className="text-slate-400"># Live Build Spec</div>
                <div>version: "1.0.0"</div>
                <div>signals_source: "salesforce_crm"</div>
                <div>contacts_source: "clay_waterfall"</div>
                <div>research_evidence: "{selectedEvidenceMode}"</div>
                <div>truth_guard_claims: "verified_claims_library"</div>
                <div>dry_run: true</div>
                <div>outreach_mode: "log_only"</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Funnel & Lead Triage */}
      {demoSubTab === "funnel" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {funnelMetrics.map((item) => (
              <div key={item.num} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>{item.num}</span>
                  <span className="font-semibold text-slate-600">{item.name}</span>
                </div>
                <div className="text-2xl font-black text-slate-900">{item.count}</div>
                <div className="text-[11px] text-slate-500 truncate">{item.note}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Live Pod Accounts Under Triage</h3>
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Apex Beverage Logistics</div>
                  <div className="text-slate-500">Greg Sutherland · VP Logistics · Dallas DC Expansion</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
                  Staged (Verified)
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Fernhill Freight Systems</div>
                  <div className="text-slate-500">Amanda Torres · Dir. Warehousing · 3 Regional DCs</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
                  Staged (Verified)
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Brightline Distribution</div>
                  <div className="text-slate-500">Marcus Vance · VP Supply Chain · MercuryGate TMS</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-[10px]">
                  Drafted
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Corvus Supply Chain</div>
                  <div className="text-slate-500">David Kim · CIO · SAP S/4HANA exception backlog</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[10px]">
                  Needs Review
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

