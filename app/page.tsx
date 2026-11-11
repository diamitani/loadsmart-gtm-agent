import Link from "next/link";
import { 
  BarChart3, 
  Bot, 
  Zap, 
  Workflow, 
  BookOpen, 
  CheckCircle2, 
  Truck, 
  Warehouse, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  MailCheck
} from "lucide-react";
import { INITIAL_PODS } from "@/lib/data/initial-pods";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Mission Statement */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#131b2e] to-[#0c1220] border border-[#1e293b] p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            Live Sovereign GTM Operating System
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Autonomous Prospecting & Pod Intelligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500">Loadsmart</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            One connected pipeline from dated freight trigger signals to sequenced multi-channel outreach. Segregating <strong>ShipperGuide</strong>, <strong>Opendock</strong>, and <strong>Loadsmart AI</strong> buyers with human-in-the-loop signoff and real-time leak detection.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/copilot"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/20"
            >
              <Bot className="w-4 h-4" />
              Launch GTM Copilot
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium text-sm border border-gray-700 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-blue-400" />
              Open Pod Dashboard
            </Link>
            <Link
              href="/pipeline"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium text-sm border border-gray-700 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              Run 10-Step Engine
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-[#111827] border border-[#1f2937] p-5">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Target Accounts</span>
            <span className="w-2 h-2 rounded-full bg-blue-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-white">80</div>
          <div className="mt-1 text-xs text-gray-500">20 accounts / pod / day</div>
        </div>

        <div className="rounded-xl bg-[#111827] border border-[#1f2937] p-5">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Active in Sequence</span>
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-indigo-400">57</div>
          <div className="mt-1 text-xs text-gray-500">71.2% progression rate</div>
        </div>

        <div className="rounded-xl bg-[#111827] border border-[#1f2937] p-5">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Mailbox Deliverability</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-400">98.7%</div>
          <div className="mt-1 text-xs text-emerald-500/80">Avg. bounce rate 0.85% (&lt;2%)</div>
        </div>

        <div className="rounded-xl bg-[#111827] border border-[#1f2937] p-5">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span>Meetings Booked</span>
            <CheckCircle2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-purple-400">14</div>
          <div className="mt-1 text-xs text-gray-500">$1.43M pipeline value</div>
        </div>
      </div>

      {/* 4 Pod Operating Strategy Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Active Account-Based Selling Pods</span>
            <span className="text-xs font-normal text-gray-400">(4 Live Pods)</span>
          </h2>
          <Link href="/dashboard" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
            View detailed metrics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_PODS.map((pod) => (
            <div key={pod.id} className="rounded-xl bg-[#111827] border border-[#1f2937] p-5 space-y-3 hover:border-gray-700 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    {pod.product_focus}
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{pod.name}</h3>
                </div>
                <div className="px-2 py-1 rounded bg-gray-800 text-xs font-mono text-gray-300 border border-gray-700">
                  {pod.id}
                </div>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                {pod.description}
              </p>

              <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs">
                <div className="text-gray-400">
                  AE: <span className="text-gray-200 font-medium">{pod.lead_ae}</span> · SDR: <span className="text-gray-200 font-medium">{pod.lead_sdr}</span>
                </div>
                <div className="text-emerald-400 font-medium flex items-center gap-1">
                  <MailCheck className="w-3.5 h-3.5" />
                  {pod.health_score}% Health
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Grid to Sub-Systems */}
      <div className="rounded-xl bg-[#0f172a] border border-[#1e293b] p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Loadsmart GTM Sub-Systems & Governance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/pipeline" className="p-4 rounded-lg bg-[#1e293b]/60 hover:bg-[#1e293b] border border-gray-800 transition-all group">
            <div className="text-amber-400 font-bold text-sm flex items-center justify-between">
              <span>10-Step Daily Engine</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Deterministic daily automation from 06:00 Signal Scout to 17:00 Daily Leak Digest.</p>
          </Link>

          <Link href="/playbook" className="p-4 rounded-lg bg-[#1e293b]/60 hover:bg-[#1e293b] border border-gray-800 transition-all group">
            <div className="text-emerald-400 font-bold text-sm flex items-center justify-between">
              <span>Sales Playbook v2</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Full ICPs, personas, battlecards vs Oracle/Manhattan, cold call openers, objection handling.</p>
          </Link>

          <Link href="/automations" className="p-4 rounded-lg bg-[#1e293b]/60 hover:bg-[#1e293b] border border-gray-800 transition-all group">
            <div className="text-purple-400 font-bold text-sm flex items-center justify-between">
              <span>n8n & Clay Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-gray-400 mt-1">Production n8n workflow JSONs, Clay waterfall enrichment schema, Salesforce field definitions.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
