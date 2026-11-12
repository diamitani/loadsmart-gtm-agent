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
import { PIPELINE_STAGES } from "@/lib/loadsmart/data";
import type { PipelineStage } from "@/lib/loadsmart/types";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 sm:p-6 rounded-xl shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            10-Step Deterministic Pod Engine
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Daily Pipeline Orchestrator</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Strict chronological sequence from 06:00 Signal Scout to 17:00 Daily Leak Digest.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunFullPipeline}
            disabled={runningStage !== null}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
          >
            <Play className={`w-4 h-4 ${runningStage === "all" ? "animate-spin" : ""}`} />
            Run Full Daily Pipeline
          </button>
        </div>
      </div>

      {/* Pipeline Stage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage, idx) => (
          <div
            key={stage.id}
            className={`rounded-xl border p-4 space-y-3 transition-all flex flex-col justify-between bg-white ${
              stage.status === "COMPLETED"
                ? "border-slate-200 shadow-sm"
                : "border-blue-300 shadow-sm ring-1 ring-blue-100"
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                  Step 0{idx + 1}
                </span>
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-blue-600" />
                  {stage.time_slot}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{stage.name}</h3>
                <div className="text-[11px] font-mono text-blue-600 font-medium">{stage.code}</div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {stage.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px]">
                {stage.status === "COMPLETED" ? (
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Done
                  </span>
                ) : (
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" /> Ready
                  </span>
                )}
              </div>

              <button
                onClick={() => handleRunStage(stage.id, stage.name)}
                disabled={runningStage !== null}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 transition-colors flex items-center gap-1"
              >
                {runningStage === stage.id ? (
                  <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
                ) : (
                  <Play className="w-3 h-3 text-blue-600" />
                )}
                Run
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Execution Console Output */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 font-mono text-xs shadow-sm">
        <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900 font-sans">Live Pipeline Audit Stream</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-sans font-semibold">● 10-Step Deterministic Engine Active</span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
          {pipelineLogs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 text-[11px]">
              <span className="text-slate-400 select-none">&gt;</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}