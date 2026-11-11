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
      <div className="bg-[#111827] border border-[#1f2937] p-5 rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Workflow className="w-3.5 h-3.5" />
            Automations & Connector Engineering
          </div>
          <h1 className="text-xl font-extrabold text-white">n8n Workflows, Clay Schemas & Salesforce DDL</h1>
          <p className="text-xs text-gray-400">
            Production-grade orchestrator blueprints powering Loadsmart's automated ABM pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={!selectedWorkflow}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 pl-1">
            Available Blueprints ({workflows.length})
          </h2>

          <div className="space-y-2">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                onClick={() => setSelectedWorkflow(wf)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedWorkflow?.id === wf.id
                    ? "bg-[#1e293b] border-blue-500/50 shadow-md shadow-blue-500/10"
                    : "bg-[#111827] border-[#1f2937] hover:border-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                      wf.type === "n8n"
                        ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : wf.type === "clay"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {wf.platform}
                  </span>
                  <FileCode className="w-3.5 h-3.5 text-gray-500" />
                </div>

                <div className="font-bold text-white text-xs mt-2">{wf.name}</div>
                <div className="text-[11px] text-gray-400 line-clamp-2 mt-1">{wf.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#1f2937] rounded-xl flex flex-col overflow-hidden shadow-2xl">
          {selectedWorkflow ? (
            <>
              {/* Code Viewer Header */}
              <div className="p-4 border-b border-[#1f2937] bg-[#0f172a] flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white">{selectedWorkflow.name}</div>
                  <div className="text-[11px] font-mono text-gray-400">{selectedWorkflow.filename}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium border border-gray-700 transition-colors flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied JSON" : "Copy JSON"}</span>
                  </button>
                </div>
              </div>

              {/* Code Block */}
              <div className="flex-1 p-4 bg-[#090d16] overflow-auto max-h-[600px] text-xs font-mono text-gray-300">
                <pre>{selectedWorkflow.content}</pre>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-gray-500">
              Select a blueprint on the left to inspect its code.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
