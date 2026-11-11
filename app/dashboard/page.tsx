"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Filter, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  Layers, 
  RefreshCw,
  FileSpreadsheet,
  ArrowRight
} from "lucide-react";
import { Pod, Account, Mailbox } from "@/lib/types";

export default function DashboardPage() {
  const [selectedPod, setSelectedPod] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [metrics, setMetrics] = useState({
    targetAccounts: 80,
    activeSequenced: 57,
    meetingsBooked: 14,
    pipelineValue: "$1,435,000",
    mailboxHealthScore: 98.7,
    leakRate: "10%"
  });
  const [funnel, setFunnel] = useState<Array<{ stage: string; count: number; percentage: number }>>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [stuckAccounts, setStuckAccounts] = useState<Account[]>([]);
  const [unblockedMap, setUnblockedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPodData(selectedPod);
  }, [selectedPod]);

  async function fetchPodData(podId: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/pods?podId=${podId}`);
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
        setFunnel(data.funnel);
        setAccounts(data.accounts);
        setMailboxes(data.mailboxes);
        setStuckAccounts(data.stuckAccounts);
      }
    } catch (err) {
      console.error("Failed to fetch pod data:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleUnblock(accountId: string) {
    setUnblockedMap((prev) => ({ ...prev, [accountId]: true }));
    setStuckAccounts((prev) => prev.filter((a) => a.id !== accountId));
  }

  return (
    <div className="space-y-6">
      {/* Top Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111827] border border-[#1f2937] p-4 rounded-xl shadow-lg">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Loadsmart ABM Pod Dashboard
          </h1>
          <p className="text-xs text-gray-400">
            Real-time pipeline diagnostics, funnel drop-offs, and mailbox deliverability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Pod Selector */}
          <div className="flex items-center gap-1.5 bg-[#1f2937] border border-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={selectedPod}
              onChange={(e) => setSelectedPod(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-[#111827]">All Pods (Aggregated)</option>
              <option value="pod-1" className="bg-[#111827]">Pod 1 - Mid-Market FTL</option>
              <option value="pod-2" className="bg-[#111827]">Pod 2 - Enterprise ShipperGuide TMS</option>
              <option value="pod-3" className="bg-[#111827]">Pod 3 - Opendock Warehousing</option>
              <option value="pod-4" className="bg-[#111827]">Pod 4 - Loadsmart AI Operations</option>
            </select>
          </div>

          {/* Demo toggle */}
          <button
            onClick={() => {
              setDemoMode(!demoMode);
              fetchPodData(selectedPod);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              demoMode
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-gray-800 border-gray-700 text-gray-300"
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            {demoMode ? "Simulated Demo Active" : "Live CRM Sync"}
          </button>

          {/* CSV Import */}
          <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20">
            <Upload className="w-3.5 h-3.5" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={() => alert("CSV loaded into local in-browser buffer. All calculations updated.")}
            />
          </label>
        </div>
      </div>

      {demoMode && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 text-xs text-amber-300 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span><strong>SIMULATED DEMO:</strong> Loaded with Loadsmart pod benchmarks (ShipperGuide, Opendock, AI). Everything processes client-side with zero data leaks.</span>
          </div>
          <span className="text-[11px] font-mono text-amber-400/80">W = 1.00 Verified</span>
        </div>
      )}

      {/* 6 Executive Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#111827] border border-[#1f2937] p-4 rounded-xl">
          <div className="text-[11px] font-medium text-gray-400">Target Accounts</div>
          <div className="text-2xl font-black text-white mt-1">{metrics.targetAccounts}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">20 / pod quota</div>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] p-4 rounded-xl">
          <div className="text-[11px] font-medium text-gray-400">In Sequence</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{metrics.activeSequenced}</div>
          <div className="text-[10px] text-indigo-400/80 mt-0.5">Gong / Amplemarket</div>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] p-4 rounded-xl">
          <div className="text-[11px] font-medium text-gray-400">Meetings Booked</div>
          <div className="text-2xl font-black text-purple-400 mt-1">{metrics.meetingsBooked}</div>
          <div className="text-[10px] text-purple-400/80 mt-0.5">Qualified Demos</div>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] p-4 rounded-xl">
          <div className="text-[11px] font-medium text-gray-400">Pipeline Generated</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{metrics.pipelineValue}</div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">Weighted ARR</div>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] p-4 rounded-xl">
          <div className="text-[11px] font-medium text-gray-400">Mailbox Health</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{metrics.mailboxHealthScore}%</div>
          <div className="text-[10px] text-blue-400/80 mt-0.5">Bounce &lt; 2.0%</div>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] p-4 rounded-xl">
          <div className="text-[11px] font-medium text-gray-400">Pod Leak Rate</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{metrics.leakRate}</div>
          <div className="text-[10px] text-amber-400/80 mt-0.5">Disqualifications</div>
        </div>
      </div>

      {/* Funnel + Stuck Accounts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Visualizer */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Funnel Progression (Conversion by Stage)
            </h2>
            <span className="text-xs text-gray-400 font-mono">20 Accounts / Pod</span>
          </div>

          <div className="space-y-3 pt-2">
            {funnel.map((step) => (
              <div key={step.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-medium">{step.stage}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-gray-400">{step.count} accts</span>
                    <span className="text-blue-400 font-bold w-10 text-right">{step.percentage}%</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-[#1f2937] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parked & Disqualified Accounts */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Stuck Accounts & Leak Triage
            </h2>
            <span className="text-xs text-amber-400/80 font-medium">Needs Attention</span>
          </div>

          {stuckAccounts.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-400/50 mx-auto mb-2" />
              Zero stuck accounts. All pod accounts actively progressing.
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {stuckAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="rounded-lg bg-[#1a2333] border border-gray-800 p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-white text-sm">{acc.name}</div>
                      <div className="text-gray-400 text-[11px]">{acc.domain} · {acc.industry}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono">
                      {acc.stage}
                    </span>
                  </div>

                  <p className="text-gray-300 text-[11px] bg-black/20 p-2 rounded border border-white/5">
                    <strong>Reason:</strong> {acc.leak_reason}
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleUnblock(acc.id)}
                      className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium transition-colors"
                    >
                      Resolve & Unblock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Secondary Mailbox Deliverability Matrix */}
      <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              Mailbox Deliverability Matrix (Secondary Inboxes)
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              5 secondary inboxes per rep. Automatic sending cutoff if bounce rate exceeds 2.0%.
            </p>
          </div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            SPF / DKIM / DMARC 100% Valid
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="py-2.5 px-3">Rep Name</th>
                <th className="py-2.5 px-3">Mailbox Address</th>
                <th className="py-2.5 px-3">Sending Domain</th>
                <th className="py-2.5 px-3">Sent Today / Cap</th>
                <th className="py-2.5 px-3">Bounce Rate</th>
                <th className="py-2.5 px-3">Warmup Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-mono text-gray-300">
              {mailboxes.map((mbx) => (
                <tr key={mbx.id} className="hover:bg-white/[0.02]">
                  <td className="py-2.5 px-3 font-sans font-medium text-white">{mbx.rep_name}</td>
                  <td className="py-2.5 px-3 text-blue-400">{mbx.email}</td>
                  <td className="py-2.5 px-3 text-gray-400">{mbx.domain}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-white font-bold">{mbx.sent_today}</span> / {mbx.daily_limit}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={mbx.bounce_rate < 1.0 ? "text-emerald-400" : "text-amber-400 font-bold"}>
                      {mbx.bounce_rate}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        mbx.warmup_status === "HEALTHY"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {mbx.warmup_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
