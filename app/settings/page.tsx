"use client";

import { useState } from "react";
import { 
  Settings, 
  ShieldCheck, 
  Database, 
  Bot, 
  Workflow, 
  Mail, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-xl shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-1.5">
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          System Settings & Integrations
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Loadsmart GTM OS Connectors & Governance</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Environment configuration, AI model gateways, and secondary sending mailbox pools.
        </p>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI Model Providers */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
              <Bot className="w-4 h-4" />
              AI Model Gateway (Vercel AI SDK v7)
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
              Ready
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Multi-model router supporting Google Gemini 2.5/Flash, Claude 3.5 Sonnet, and OpenAI GPT-4o with zero-key simulation fallback.
          </p>
          <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
            <div>GOOGLE_GENERATIVE_AI_API_KEY: <span className="text-emerald-700 font-semibold">Supported</span></div>
            <div>ANTHROPIC_API_KEY: <span className="text-emerald-700 font-semibold">Supported</span></div>
            <div>Simulation Fallback: <span className="text-blue-700 font-semibold">Active (Zero-Key Demo)</span></div>
          </div>
        </div>

        {/* Database & Persistence */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <Database className="w-4 h-4" />
              Dual-Tier Persistence Engine
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
              Connected
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Zero-config local file store (.data/loadsmart-gtm.json) for dev; Supabase Postgres with RLS for production.
          </p>
          <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
            <div>Local File Store: <span className="text-emerald-700 font-semibold">.data/loadsmart-gtm.json</span></div>
            <div>Supabase Postgres: <span className="text-slate-500">Configurable via .env</span></div>
            <div>Row Level Security: <span className="text-emerald-700 font-semibold">Enabled (gtm_pods)</span></div>
          </div>
        </div>

        {/* Mailbox Infrastructure */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
              <Mail className="w-4 h-4" />
              Secondary Mailbox Sending Pool
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
              8 Mailboxes Active
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Dedicated secondary sending domains keeping Loadsmart primary domain safe from burn.
          </p>
          <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
            <div>Sending Domains: <span className="text-slate-800 font-semibold">shipperguide-tms.io, opendock-network.com</span></div>
            <div>Daily Send Cap: <span className="text-slate-800 font-semibold">40 sends / inbox / day</span></div>
            <div>Auto-Pause Threshold: <span className="text-amber-700 font-semibold">&gt; 2.0% bounce rate</span></div>
          </div>
        </div>

        {/* Workflow Webhooks */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <Workflow className="w-4 h-4" />
              n8n & Sequencer Webhooks
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
              Ready
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Outbound dispatch to n8n, Gong Engage, Amplemarket, and Clay waterfall tables.
          </p>
          <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
            <div>n8n Orchestrator: <span className="text-emerald-700 font-semibold">Webhook Ready</span></div>
            <div>Gong Flow Staging: <span className="text-emerald-700 font-semibold">Batch Signed Only</span></div>
            <div>Clay Table Sync: <span className="text-emerald-700 font-semibold">Active</span></div>
          </div>
        </div>
      </div>

      {/* Safety & Governance Invariants */}
      <div className="rounded-xl bg-white border border-slate-200 p-5 sm:p-6 space-y-3 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          Safety & Site Empire OS Invariants
        </h3>
        <ul className="text-xs sm:text-sm text-slate-600 space-y-2 list-disc pl-5 leading-relaxed">
          <li><strong className="text-slate-800">One Must Act ($W = 1.00$):</strong> No copy is drafted or sequenced unless contact, persona, and system-of-record are fully known.</li>
          <li><strong className="text-slate-800">Zero Hallucination:</strong> All ROI metrics and case studies must match the Loadsmart Claims Library.</li>
          <li><strong className="text-slate-800">Human-in-the-Loop Gate:</strong> Reps must manually authorize every batch before external API dispatch.</li>
          <li><strong className="text-slate-800">Secrets Isolation:</strong> API credentials are never written to disk, client bundles, or chat history.</li>
        </ul>
      </div>
    </div>
  );
}