"use client";

import { useState, useEffect } from "react";
import { 
  Workflow, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  ExternalLink, 
  Layers, 
  Database,
  Terminal
} from "lucide-react";
import { AutomationBlueprint } from "@/lib/types";

export default function AutomationsPage() {
  const [workflows, setWorkflows] = useState<AutomationBlueprint[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationBlueprint | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/automations")
      .then((res) => res.json())
      .then((data) => {
        if (data.workflows) {
          setWorkflows(data.workflows);
          if (data.workflows.length > 0) {
            setSelectedWorkflow(data.workflows[0]);
          }
        }
      })
      .catch((err) => console.error("Failed to load automations:", err));
  }, []);

  function handleCopy() {
    if (!selectedWorkflow) return;
    navigator.clipboard.writeText(selectedWorkflow.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!selectedWorkflow) return;
    const blob = new Blob([selectedWorkflow.content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selectedWorkflow.filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Workflow className="w-3.5 h-3.5 text-purple-600" />
            Automations & Connector Engineering
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">n8n Workflows, Clay Schemas & Salesforce DDL</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Production-grade orchestrator blueprints powering Loadsmart's automated ABM pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={!selectedWorkflow}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download Blueprint
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Workflows */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">
            Available Blueprints ({workflows.length})
          </h2>

          <div className="space-y-2">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                onClick={() => setSelectedWorkflow(wf)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedWorkflow?.id === wf.id
                    ? "bg-blue-50/60 border-blue-400 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                      wf.type === "n8n"
                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                        : wf.type === "clay"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    }`}
                  >
                    {wf.platform}
                  </span>
                  <FileCode className="w-3.5 h-3.5 text-slate-400" />
                </div>

                <div className="font-bold text-slate-900 text-xs mt-2">{wf.name}</div>
                <div className="text-[11px] text-slate-500 line-clamp-2 mt-1">{wf.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
          {selectedWorkflow ? (
            <>
              {/* Code Viewer Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-slate-900">{selectedWorkflow.name}</div>
                  <div className="text-[11px] font-mono text-slate-500">{selectedWorkflow.filename}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied JSON" : "Copy JSON"}</span>
                  </button>
                </div>
              </div>

              {/* Code Block */}
              <div className="flex-1 p-4 bg-slate-900 overflow-auto max-h-[600px] text-xs font-mono text-slate-200 leading-relaxed">
                <pre>{selectedWorkflow.content}</pre>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Select a blueprint on the left to inspect its code.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}