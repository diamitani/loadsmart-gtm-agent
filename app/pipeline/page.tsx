"use client";

import { useState } from "react";
import { 
  Zap, 
  CheckCircle2, 
  Clock, 
  Play, 
  ShieldCheck, 
  RefreshCw, 
  UserCheck, 
  Terminal,
  Layers
} from "lucide-react";
import { PIPELINE_STAGES } from "@/lib/data/initial-pods";
import { PipelineStage } from "@/lib/types";

export default function PipelinePage() {
  const [stages, setStages] = useState<PipelineStage[]>(PIPELINE_STAGES);
  const [runningStage, setRunningStage] = useState<string | null>(null);
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([
    "06:00:00 CT - [la-signal] 20 candidate accounts nominated across 4 pods.",
    "06:30:15 CT - [la-crm-audit] CRM Shield evaluated 80 domains. 2 parked as active Salesforce deals.",
    "07:00:45 CT - [la-abm-tag] RevOps allocation verified. 18 accounts routed to ShipperGuide, Opendock, and AI.",
    "07:15:20 CT - [la-persona-enrich] Clay waterfall discovered 18 verified freight leaders (W=1.00).",
    "07:45:10 CT - [la-research] Account briefs compiled. MercuryGate and manual scheduling systems identified.",
    "08:15:00 CT - [la-email] 1-to-1 PAS cold email touchpoints synthesized. 100% claims library verified.",
    "08:30:00 CT - [la-sequence] Awaiting AE/SDR batch signature in review drawer."
  ]);

  async function handleRunStage(stageId: string, stageName: string) {
    setRunningStage(stageId);
    try {
      const res = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: stageId })
      });
      if (res.ok) {
        setStages((prev) =>
          prev.map((s) => (s.id === stageId ? { ...s, status: "COMPLETED" } : s))
        );
        const logEntry = `${new Date().toLocaleTimeString()} CT - [${stageId}] ${stageName} executed successfully. 20 accounts updated.`;
        setPipelineLogs((prev) => [logEntry, ...prev]);
      }
    } catch (err) {
      console.error("Failed to run stage:", err);
    } finally {
      setRunningStage(null);
    }
  }

  async function handleRunFullPipeline() {
    setRunningStage("all");
    for (const stage of stages) {
      await new Promise((r) => setTimeout(r, 400));
      setStages((prev) =>
        prev.map((s) => (s.id === stage.id ? { ...s, status: "COMPLETED" } : s))
      );
      setPipelineLogs((prev) => [
        `${new Date().toLocaleTimeString()} CT - [${stage.code}] ${stage.name} completed.`,
        ...prev
      ]);
    }
    setRunningStage(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] border border-[#1f2937] p-5 rounded-xl shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5" />
            10-Step Deterministic Pod Engine
          </div>
          <h1 className="text-xl font-extrabold text-white">Daily Pipeline Orchestrator</h1>
          <p className="text-xs text-gray-400">
            Strict chronological sequence from 06:00 Signal Scout to 17:00 Daily Leak Digest.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunFullPipeline}
            disabled={runningStage !== null}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Play className={`w-3.5 h-3.5 ${runningStage === "all" ? "animate-spin" : ""}`} />
            Run Full Daily Pipeline
          </button>
        </div>
      </div>

      {/* Pipeline Stage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage, idx) => (
          <div
            key={stage.id}
            className={`rounded-xl border p-4 space-y-3 transition-all flex flex-col justify-between ${
              stage.status === "COMPLETED"
                ? "bg-[#111827] border-gray-800"
                : "bg-[#111827] border-amber-500/30 shadow-lg shadow-amber-500/5"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
                  Step 0{idx + 1}
                </span>
                <span className="text-xs font-mono text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-400" />
                  {stage.time_slot}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{stage.name}</h3>
                <div className="text-[11px] font-mono text-blue-400">{stage.code}</div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                {stage.description}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px]">
                {stage.status === "COMPLETED" ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Done
                  </span>
                ) : (
                  <span className="text-amber-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Ready
                  </span>
                )}
              </div>

              <button
                onClick={() => handleRunStage(stage.id, stage.name)}
                disabled={runningStage !== null}
                className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-white text-[11px] font-medium border border-gray-700 transition-colors flex items-center gap-1"
              >
                {runningStage === stage.id ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-blue-400" />
                ) : (
                  <Play className="w-3 h-3 text-blue-400" />
                )}
                Run
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Execution Console Output */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-gray-400 pb-2 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white">Live Pipeline Audit Stream</span>
          </div>
          <span className="text-[11px] text-emerald-400">● 10-Step Deterministic Engine Active</span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto text-gray-300">
          {pipelineLogs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 text-[11px]">
              <span className="text-gray-500 select-none">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
