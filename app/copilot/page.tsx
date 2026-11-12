import type { Metadata } from "next";
import { Chat } from "@/components/chat";

export const metadata: Metadata = { title: "Pod Copilot · Loadsmart ABM OS" };

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  async function handleSend(textToSend?: string) {
    const text = textToSend || input;
    if (!text.trim() || isStreaming) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    const assistantMessageId = `asst-${Date.now()}`;
    const initialAssistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
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
      console.error("Chat streaming error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: "⚠️ Error generating response. Check server connection." }
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Main Chat Interface */}
      <div className="lg:col-span-2 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                Loadsmart GTM Copilot
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-mono font-medium">
                  v1.0 Live
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Vercel AI SDK v7 · Multi-Model Swarm · Truth Guard W=1.00
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Claims Library Protected
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs sm:text-sm leading-relaxed ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-md bg-white border border-slate-200 shadow-sm flex-shrink-0 flex items-center justify-center text-blue-600 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 space-y-2 whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-800 shadow-sm"
                }`}
              >
                {msg.content.includes("⚡") ? (
                  <div className="space-y-2">
                    <div className="font-mono text-[11px] text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200 inline-flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-blue-600" />
                      Tool Execution Verified
                    </div>
                    <div>{msg.content}</div>
                  </div>
                ) : (
                  <div>{msg.content}</div>
                )}
                <div
                  className={`text-[10px] ${
                    msg.role === "user" ? "text-blue-100" : "text-slate-400"
                  } text-right font-medium`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-md bg-slate-800 flex-shrink-0 flex items-center justify-center text-white mt-1 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isStreaming && (
            <div className="flex items-center gap-2 text-xs text-slate-500 pl-10">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>GTM Agent thinking and verifying claims...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Chips */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] whitespace-nowrap pl-1">Suggested:</span>
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 whitespace-nowrap transition-colors font-medium"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
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
            placeholder="Instruct the pod copilot (e.g. 'Nominate accounts for Pod 2', 'Audit CRM for collisions')..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>

      {/* Right-Hand Staged Copy Review Drawer */}
      <div className="flex flex-col bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Staged Outbound Touchpoints
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Human-in-the-loop review drawer before sequence enrollment.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-semibold">
            1 Staged
          </span>
        </div>

        <div className="space-y-3 text-xs flex-1">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-semibold">
                  Pod 2 · ShipperGuide TMS
                </span>
                <div className="font-bold text-slate-900 text-sm mt-1.5">Apex Beverage Logistics</div>
                <div className="text-slate-500 text-[11px]">
                  Greg Sutherland · VP Logistics & Transportation
                </div>
              </div>
            </div>

            <div className="space-y-1.5 bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed text-slate-700 shadow-sm">
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

            <div className="pt-2">
              <button
                onClick={() => setStagedApproved(true)}
                disabled={stagedApproved}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  stagedApproved
                    ? "bg-emerald-600 text-white cursor-default shadow-sm"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
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
          <div>No message is sent or enrolled in Gong Engage without explicit rep signature.</div>
        </div>
      </div>
    </div>
  );
}
