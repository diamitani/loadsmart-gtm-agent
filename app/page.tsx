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
  MailCheck, 
  Download, 
  Compass, 
  FileCheck2,
  Globe,
  Sparkles
} from "lucide-react";
import { INITIAL_PODS } from "@/lib/data/initial-pods";

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Top Banner to Public Marketing Site */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-blue-50/80 border border-blue-200 rounded-xl text-xs shadow-xs">
        <div className="flex items-center gap-2.5 text-blue-950 font-medium">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900">Prospect Pal Outbound Marketing Engine</div>
            <div className="text-slate-600">The 1 ICP to Full Outbound Workflow public marketing experience (modeled on saw-ecru & Enably).</div>
          </div>
        </div>
        <Link
          href="/home"
          className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-900 bg-white px-3.5 py-1.5 rounded-lg border border-blue-200 shadow-xs transition-colors self-start sm:self-auto"
        >
          <span>Explore Marketing Site (/home)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Hero Mission Statement */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white via-slate-50/70 to-blue-50/40 border border-slate-200 p-6 sm:p-10 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            Internal GTM AI Center of Excellence
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Autonomous Prospecting & Pod Intelligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Loadsmart Sales</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            The single operating system for Loadsmart AE & SDR pods. Delivering automated daily signal ingestion, waterfall contact reveals, and 1-to-1 cold outbound copy for <strong>ShipperGuide</strong>, <strong>Opendock</strong>, and <strong>Loadsmart AI</strong> with zero hallucination and human signoff.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/copilot"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/10"
            >
              <Bot className="w-4 h-4" />
              Launch GTM Copilot
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs transition-all"
            >
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Open Pod Dashboard
            </Link>
            <a
              href="/loadsmart-abm-os.zip"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-sm border border-blue-200 transition-all"
            >
              <Download className="w-4 h-4 text-blue-600" />
              Download Skill Pack (.zip)
            </a>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Target Accounts</span>
            <span className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">80</div>
          <div className="mt-1 text-xs text-slate-500 font-medium">20 accounts / pod / day</div>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Active in Sequence</span>
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-indigo-600">57</div>
          <div className="mt-1 text-xs text-slate-500 font-medium">71.2% progression rate</div>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Mailbox Deliverability</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-600">98.7%</div>
          <div className="mt-1 text-xs text-emerald-700 font-medium">Avg. bounce 0.85% (&lt;2.0%)</div>
        </div>

        <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Meetings Booked</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-purple-600">14</div>
          <div className="mt-1 text-xs text-slate-500 font-medium">$1.43M weighted ARR</div>
        </div>
      </div>

      {/* 4 Pod Operating Strategy Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Active Account-Based Selling Pods</span>
            <span className="text-xs font-medium text-slate-500">(4 Production Pods)</span>
          </h2>
          <Link href="/dashboard" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View detailed metrics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_PODS.map((pod) => (
            <div key={pod.id} className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 hover:border-slate-300 shadow-xs transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    {pod.product_focus}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{pod.name}</h3>
                </div>
                <div className="px-2 py-0.5 rounded bg-slate-100 text-xs font-mono font-semibold text-slate-700 border border-slate-200">
                  {pod.id}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {pod.description}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-slate-500">
                  AE: <span className="text-slate-800 font-semibold">{pod.lead_ae}</span> · SDR: <span className="text-slate-800 font-semibold">{pod.lead_sdr}</span>
                </div>
                <div className="text-emerald-700 font-semibold flex items-center gap-1">
                  <MailCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {pod.health_score}% Deliverability
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Grid to Sub-Systems */}
      <div className="rounded-xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Loadsmart GTM Center of Excellence Capabilities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Link href="/pipeline" className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all group">
            <div className="text-amber-700 font-bold text-sm flex items-center justify-between">
              <span>10-Step Engine</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Daily automated rhythm from 06:00 Signal Scout to 17:00 Daily Leak Digest.</p>
          </Link>

          <Link href="/skills" className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all group">
            <div className="text-blue-700 font-bold text-sm flex items-center justify-between">
              <span>11 Skills Pack</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Downloadable individual skills for Claude.ai with step instructions and inputs.</p>
          </Link>

          <Link href="/playbook" className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all group">
            <div className="text-emerald-700 font-bold text-sm flex items-center justify-between">
              <span>Playbook v2</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Full ICPs, personas, battlecards vs Oracle/Manhattan, cold call openers, objection handling.</p>
          </Link>

          <Link href="/automations" className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all group">
            <div className="text-purple-700 font-bold text-sm flex items-center justify-between">
              <span>n8n & Clay Hub</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Production n8n workflow JSONs, Clay waterfall enrichment schema, Salesforce field definitions.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}