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
      <div className="bg-[#111827] border border-[#1f2937] p-5 rounded-xl shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300 text-xs font-semibold uppercase tracking-wider mb-1">
          <Settings className="w-3.5 h-3.5" />
          System Settings & Integrations
        </div>
        <h1 className="text-xl font-extrabold text-white">Loadsmart GTM OS Connectors & Governance</h1>
        <p className="text-xs text-gray-400">
          Environment configuration, AI model gateways, and secondary sending mailbox pools.
        </p>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI Model Providers */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
              <Bot className="w-4 h-4" />
              AI Model Gateway (Vercel AI SDK v7)
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              Ready
            </span>
          </div>
          <p className="text-xs text-gray-300">
            Multi-model router supporting Google Gemini 2.5/Flash, Claude 3.5 Sonnet, and OpenAI GPT-4o with zero-key simulation fallback.
          </p>
          <div className="text-[11px] font-mono text-gray-400 bg-black/20 p-2.5 rounded border border-white/5 space-y-1">
            <div>GOOGLE_GENERATIVE_AI_API_KEY: <span className="text-emerald-400">Supported</span></div>
            <div>ANTHROPIC_API_KEY: <span className="text-emerald-400">Supported</span></div>
            <div>Simulation Fallback: <span className="text-blue-400">Active (Zero-Key Demo)</span></div>
          </div>
        </div>

        {/* Database & Persistence */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Database className="w-4 h-4" />
              Dual-Tier Persistence Engine
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              Connected
            </span>
          </div>
          <p className="text-xs text-gray-300">
            Zero-config local file store (.data/loadsmart-gtm.json) for dev; Supabase Postgres with RLS for production.
          </p>
          <div className="text-[11px] font-mono text-gray-400 bg-black/20 p-2.5 rounded border border-white/5 space-y-1">
            <div>Local File Store: <span className="text-emerald-400">.data/loadsmart-gtm.json</span></div>
            <div>Supabase Postgres: <span className="text-gray-400">Configurable via .env</span></div>
            <div>Row Level Security: <span className="text-emerald-400">Enabled (gtm_pods)</span></div>
          </div>
        </div>

        {/* Mailbox Infrastructure */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Mail className="w-4 h-4" />
              Secondary Mailbox Sending Pool
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              8 Mailboxes Active
            </span>
          </div>
          <p className="text-xs text-gray-300">
            Dedicated secondary sending domains keeping Loadsmart primary domain safe from burn.
          </p>
          <div className="text-[11px] font-mono text-gray-400 bg-black/20 p-2.5 rounded border border-white/5 space-y-1">
            <div>Sending Domains: <span className="text-gray-200">shipperguide-tms.io, opendock-network.com</span></div>
            <div>Daily Send Cap: <span className="text-gray-200">40 sends / inbox / day</span></div>
            <div>Auto-Pause Threshold: <span className="text-amber-400">&gt; 2.0% bounce rate</span></div>
          </div>
        </div>

        {/* Workflow Webhooks */}
        <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Workflow className="w-4 h-4" />
              n8n & Sequencer Webhooks
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              Ready
            </span>
          </div>
          <p className="text-xs text-gray-300">
            Outbound dispatch to n8n, Gong Engage, Amplemarket, and Clay waterfall tables.
          </p>
          <div className="text-[11px] font-mono text-gray-400 bg-black/20 p-2.5 rounded border border-white/5 space-y-1">
            <div>n8n Orchestrator: <span className="text-emerald-400">Webhook Ready</span></div>
            <div>Gong Flow Staging: <span className="text-emerald-400">Batch Signed Only</span></div>
            <div>Clay Table Sync: <span className="text-emerald-400">Active</span></div>
          </div>
        </div>
      </div>

      {/* Safety & Governance Invariants */}
      <div className="rounded-xl bg-[#0f172a] border border-[#1e293b] p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          Safety & Site Empire OS Invariants
        </h3>
        <ul className="text-xs text-gray-300 space-y-2 list-disc pl-5">
          <li><strong>One Must Act ($W = 1.00$):</strong> No copy is drafted or sequenced unless contact, persona, and system-of-record are fully known.</li>
          <li><strong>Zero Hallucination:</strong> All ROI metrics and case studies must match the Loadsmart Claims Library.</li>
          <li><strong>Human-in-the-Loop Gate:</strong> Reps must manually authorize every batch before external API dispatch.</li>
          <li><strong>Secrets Isolation:</strong> API credentials are never written to disk, client bundles, or chat history.</li>
        </ul>
      </div>
    </div>
  );
}
