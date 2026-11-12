"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Radio, 
  Building2, 
  Users, 
  Search, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Terminal, 
  Layers, 
  FileCode, 
  Database, 
  Mail, 
  ExternalLink,
  ChevronRight,
  Zap,
  Check,
  Workflow
} from "lucide-react";

export default function HomePage() {
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedEvidenceOption, setSelectedEvidenceOption] = useState<"notes" | "search" | "both">("both");
  const [selectedContactSource, setSelectedContactSource] = useState<"clay" | "provided" | "guess">("clay");

  const promptOptions = [
    "Target VP Logistics at MercuryGate / Oracle OTM beverage shippers",
    "Engage 50 regional distribution centers with >3 dock doors for Opendock",
    "Reach CIOs & Supply Chain VPs for Loadsmart AI autonomous quoting"
  ];

  const stepsData = [
    {
      name: "Signals",
      num: "01",
      kind: "code",
      hue: "#3b82f6",
      desc: "Turns your ideal-customer description, lane volatility, and facility expansion signals into a short brief every later step scores against.",
      optLabel: "Connect to",
      opts: [
        { name: "ICP only, or a general prompt", cfg: "signals_source: icp_only" },
        { name: "MercuryGate & ERP footprint web search", cfg: "signals_source: http_search" }
      ],
      guard: "A run stops with a clear message if a required shipper profile setting is still unfilled."
    },
    {
      name: "Companies",
      num: "02",
      kind: "code + ai",
      hue: "#6366f1",
      desc: "Loads target shipper companies, runs CRM Shield dedupe against Salesforce, then scores logistics fit against your ICP.",
      optLabel: "Source",
      opts: [
        { name: "Pasted domain list or CSV", cfg: "companies_source: inline" },
        { name: "Salesforce CRM webhook", cfg: "companies_source: salesforce_http" },
        { name: "Fit threshold", cfg: "min_confidence: 0.85" }
      ],
      guard: "A company below the threshold or parked as an active deal is reported as skipped_low_fit, never dropped silently."
    },
    {
      name: "Contacts",
      num: "03",
      kind: "code",
      hue: "#10b981",
      desc: "Discovers verified freight decision-makers (VP Logistics, Plant Manager, CIO) via Clay waterfall with strict W = 1.00 foundation wholeness.",
      optLabel: "Find via",
      opts: [
        { name: "Clay waterfall (Apollo + ZoomInfo + Hunter)", cfg: "contacts_source: clay_waterfall" },
        { name: "Already have contacts in CRM", cfg: "contacts_source: salesforce" },
        { name: "Email syntax guess + MX validation", cfg: "contacts_source: guess_syntax" }
      ],
      guard: "Guessed addresses never send unless allow_guessed_sends is explicitly toggled true."
    },
    {
      name: "Research",
      num: "04",
      kind: "ai + verify",
      hue: "#8b5cf6",
      desc: "Finds concrete carrier procurement pain points, then keeps only those that trace back to verifiable evidence in your briefing.",
      optLabel: "Evidence",
      opts: [
        { name: "MercuryGate & ERP account notes", cfg: "research_source: erp_notes" },
        { name: "Live lane spot rate and facility news search", cfg: "research_source: http_search" }
      ],
      guard: "A hook with no evidence is discarded. Missing evidence flags the account as needs_review."
    },
    {
      name: "Email",
      num: "05",
      kind: "ai + checks",
      hue: "#8b5cf6",
      desc: "Drafts 1-to-1 Problem-Agitation-Solution (PAS) copy, verified 100% against Loadsmart's official Claims Library.",
      optLabel: "Choose one",
      opts: [
        { name: "Full 1-to-1 email, greeting to signature", cfg: "email_mode: full_email" },
        { name: "Body only, set as Gong Engage token", cfg: "email_mode: body_only" },
        { name: "Length cap (under 95 words)", cfg: "max_words: 95" }
      ],
      guard: "Truth Guard blocks unverified numbers, fake Re: subjects, exclamation marks, and hallucinated stats."
    },
    {
      name: "Outreach",
      num: "06",
      kind: "code",
      hue: "#c5a059",
      desc: "Logs drafts to the staged review drawer by default. Dispatches to Gong Engage or Amplemarket only upon human rep signature.",
      optLabel: "Send via",
      opts: [
        { name: "Staged review drawer only", cfg: "outreach_mode: log_only" },
        { name: "Direct secondary mailbox pool", cfg: "outreach_mode: secondary_mailbox" },
        { name: "Gong Engage flow webhook", cfg: "outreach_mode: gong_flow" }
      ],
      guard: "A live send requires an opt-out line and explicit AE/SDR batch authorization."
    }
  ];

  const funnelStats = [
    { num: "01", name: "Signals", count: 120, note: "matched shippers", hue: "#3b82f6" },
    { num: "02", name: "Companies", count: 84, note: "fit above 0.85", hue: "#6366f1" },
    { num: "03", name: "Contacts", count: 61, note: "verified W=1.00", hue: "#10b981" },
    { num: "04", name: "Research", count: 48, note: "evidence found", hue: "#8b5cf6" },
    { num: "05", name: "Email", count: 44, note: "claims verified", hue: "#8b5cf6" },
    { num: "06", name: "Outreach", count: 31, note: "staged in drawer", hue: "#c5a059" }
  ];

  const liveLeads = [
    {
      company: "Apex Beverage Logistics",
      contact: "Greg Sutherland · VP Logistics",
      hook: "Opening 2 Dallas facilities; MercuryGate rate lookup bottleneck",
      status: "staged",
      tone: "verified"
    },
    {
      company: "Fernhill Freight Systems",
      contact: "Amanda Torres · Dir. Warehousing",
      hook: "Expanding 3 regional DCs; $75/hr carrier detention penalties",
      status: "staged",
      tone: "verified"
    },
    {
      company: "Brightline Distribution",
      contact: "Marcus Vance · VP Supply Chain",
      hook: "MercuryGate legacy integration; manual spot quotes",
      status: "drafted",
      tone: "neutral"
    },
    {
      company: "Corvus Supply Chain",
      contact: "David Kim · CIO",
      hook: "SAP S/4HANA exception handling backlog",
      status: "needs_review",
      tone: "attention"
    }
  ];

  const connectors = [
    { name: "Salesforce", cat: "CRM", icon: "Database" },
    { name: "HubSpot", cat: "CRM", icon: "Database" },
    { name: "Gong Engage", cat: "Outreach", icon: "Send" },
    { name: "Amplemarket", cat: "Outreach", icon: "Send" },
    { name: "Smartlead", cat: "Outreach", icon: "Send" },
    { name: "Instantly", cat: "Outreach", icon: "Send" },
    { name: "Clay", cat: "Data", icon: "Layers" },
    { name: "Apollo", cat: "Data", icon: "Users" },
    { name: "MercuryGate TMS", cat: "Logistics TMS", icon: "Workflow" },
    { name: "Oracle OTM", cat: "Logistics TMS", icon: "Workflow" },
    { name: "SAP S/4HANA", cat: "Logistics TMS", icon: "Workflow" },
    { name: "n8n Orchestrator", cat: "Engine", icon: "Terminal" }
  ];

  return (
    <div className="min-h-screen bg-[var(--paper-50)] text-[var(--ink-900)] selection:bg-[var(--cobalt-100)] selection:text-[var(--cobalt-900)]">
      {/* Sticky Glass Header */}
      <header className="sticky top-0 z-40 bg-[rgba(251,250,248,0.92)] backdrop-blur-md border-b border-[var(--paper-200)]">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/home" className="inline-flex items-center gap-2.5 group">
            {/* Signature Salesgency Prospect Pal Icon */}
            <svg width="30" height="30" viewBox="0 0 48 48" className="flex-shrink-0">
              <rect width="48" height="48" rx="13" fill="var(--ink-800)" />
              <path d="M14 32.5 L24 24 L34 15.5" stroke="var(--champagne-300)" strokeWidth="2.5" strokeLinecap="square" fill="none" />
              <circle cx="14" cy="32.5" r="3.4" fill="var(--paper-50)" />
              <circle cx="24" cy="24" r="3.4" fill="var(--paper-50)" />
              <circle cx="34" cy="15.5" r="4.6" fill="var(--champagne-300)" />
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-[15px] sm:text-[16px] tracking-tight text-[var(--ink-800)] flex items-center gap-1.5">
                Loadsmart <span className="text-[var(--cobalt-600)]">Pal</span>
                <span className="text-[10px] font-normal text-[var(--ink-400)] ml-1">by Salesgency</span>
              </span>
              <span className="text-[9px] text-[var(--ink-400)] font-medium">Internal GTM</span>
            </div>
          </Link>

          {/* Navigation Anchors */}
          <nav className="hidden md:flex items-center gap-6 text-[13.5px] font-medium text-[var(--ink-600)]">
            <a href="#steps" className="hover:text-[var(--ink-900)] transition-colors">How it works</a>
            <a href="#agent" className="hover:text-[var(--ink-900)] transition-colors">Agent</a>
            <a href="#outputs" className="hover:text-[var(--ink-900)] transition-colors">Skills & campaigns</a>
            <a href="#connectors" className="hover:text-[var(--ink-900)] transition-colors">Connectors</a>
            <a href="#pricing" className="hover:text-[var(--ink-900)] transition-colors">Pricing</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-lg border border-[var(--paper-200)] bg-[var(--paper-0)] text-xs font-semibold text-[var(--ink-700)] hover:bg-[var(--paper-100)] transition-colors shadow-sm"
            >
              GTM App
            </Link>
            <Link
              href="/copilot"
              className="px-3.5 py-1.5 rounded-lg bg-[var(--cobalt-600)] hover:bg-[var(--cobalt-700)] text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Build my engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-14 pb-16 px-4 sm:px-6 max-w-[1180px] mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--cobalt-50)] border border-[var(--cobalt-200)] text-[var(--cobalt-700)] text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-[var(--cobalt-600)]" />
          Loadsmart Autonomous GTM Engine · 1 ICP to Full Logistics Outbound
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--ink-900)] max-w-4xl mx-auto leading-[1.12]">
          Describe who you want to reach. <br />
          <span className="text-[var(--cobalt-600)]">Get an outbound engine you own.</span>
        </h1>

        <p className="text-base sm:text-lg text-[var(--ink-600)] max-w-2xl mx-auto leading-relaxed">
          The agent turns one conversation into a six-step prospecting workflow, portable skills for every step, and a campaign that runs on a schedule.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/copilot"
            className="px-6 py-3 rounded-xl bg-[var(--cobalt-600)] hover:bg-[var(--cobalt-700)] text-white font-semibold text-sm sm:text-base flex items-center gap-2 shadow-sm transition-all"
          >
            <span>Build my engine</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-3 rounded-xl border border-[var(--paper-200)] bg-[var(--paper-0)] hover:bg-[var(--paper-100)] text-[var(--ink-800)] font-semibold text-sm sm:text-base transition-all shadow-sm"
          >
            View live pod dashboard
          </Link>
        </div>

        {/* Starter Chips */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-[var(--ink-400)] font-medium">Starter prompts:</span>
          {promptOptions.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPrompt(chip)}
              className="px-3 py-1.5 rounded-full bg-[var(--paper-0)] hover:bg-[var(--paper-100)] border border-[var(--paper-200)] text-[var(--ink-700)] transition-colors font-medium shadow-sm"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Funnel Matrix Card */}
        <div className="mt-12 rounded-2xl border border-[var(--paper-200)] bg-[var(--paper-0)] p-5 sm:p-6 shadow-[var(--shadow-overlay)] text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--paper-200)] pb-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--ink-400)]">Deterministic Pipeline Run</div>
              <div className="text-base sm:text-lg font-bold text-[var(--ink-900)]">
                {selectedPrompt ? selectedPrompt : "Mid-Market & Enterprise Shipper Pods"}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Claims Verified · W = 1.00
            </div>
          </div>

          {/* 6 Step Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
            {funnelStats.map((item) => (
              <div key={item.num} className="p-3 rounded-xl bg-[var(--paper-50)] border border-[var(--paper-200)] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[var(--ink-400)] font-mono">
                  <span>{item.num}</span>
                  <span className="font-semibold text-[var(--ink-600)]">{item.name}</span>
                </div>
                <div className="text-xl font-extrabold text-[var(--ink-900)]">{item.count}</div>
                <div className="text-[10.5px] text-[var(--ink-400)] truncate">{item.note}</div>
              </div>
            ))}
          </div>

          {/* Sample Verified Leads */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--ink-400)]">
              Live Staged Accounts in Drawer
            </div>
            <div className="divide-y divide-[var(--paper-200)] rounded-xl border border-[var(--paper-200)] bg-[var(--paper-0)] overflow-hidden text-xs">
              {liveLeads.map((lead, idx) => (
                <div key={idx} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--paper-50)] transition-colors">
                  <div className="space-y-0.5">
                    <div className="font-bold text-[var(--ink-900)] text-sm">{lead.company}</div>
                    <div className="text-[var(--ink-600)] text-xs font-medium">{lead.contact}</div>
                    <div className="text-[11.5px] text-[var(--ink-400)]">{lead.hook}</div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase ${
                        lead.tone === "verified"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : lead.tone === "attention"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Each step is a slot (#steps) */}
      <section id="steps" className="py-16 px-4 sm:px-6 max-w-[1180px] mx-auto border-t border-[var(--paper-200)] space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink-900)]">
            Each step is a slot. You choose what fills it.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] leading-relaxed">
            Three steps use AI. Everything else is plain code, so counts, checks and sending rules are repeatable.
          </p>
        </div>

        {/* 6 Step Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {stepsData.map((step, idx) => (
            <button
              key={step.num}
              onClick={() => setActiveStepIndex(idx)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                activeStepIndex === idx
                  ? "bg-[var(--paper-0)] border-[var(--cobalt-600)] shadow-sm ring-1 ring-[var(--cobalt-600)]"
                  : "bg-[var(--paper-0)] border-[var(--paper-200)] hover:border-[var(--paper-300)]"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[var(--ink-400)]">{step.num}</span>
                <span className="text-[9.5px] uppercase font-semibold text-[var(--ink-400)]">{step.kind}</span>
              </div>
              <div className="font-bold text-sm text-[var(--ink-900)] mt-2">{step.name}</div>
            </button>
          ))}
        </div>

        {/* Active Step Slot Inspector */}
        <div className="rounded-2xl border border-[var(--paper-200)] bg-[var(--paper-0)] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--paper-200)] pb-4">
            <div>
              <div className="text-xs font-mono uppercase text-[var(--cobalt-600)] font-bold">
                Step {stepsData[activeStepIndex].num} · {stepsData[activeStepIndex].kind}
              </div>
              <h3 className="text-xl font-bold text-[var(--ink-900)] mt-1">
                {stepsData[activeStepIndex].name}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[var(--cobalt-50)] text-[var(--cobalt-700)] border border-[var(--cobalt-200)] text-xs font-mono font-semibold">
              Slot Configurable
            </span>
          </div>

          <p className="text-sm text-[var(--ink-700)] leading-relaxed max-w-3xl">
            {stepsData[activeStepIndex].desc}
          </p>

          {/* Configurable Slot Options */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[var(--ink-500)] uppercase tracking-wider">
              {stepsData[activeStepIndex].optLabel}:
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stepsData[activeStepIndex].opts.map((opt, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-[var(--paper-200)] bg-[var(--paper-50)] space-y-1">
                  <div className="font-bold text-xs text-[var(--ink-900)]">{opt.name}</div>
                  <div className="font-mono text-[10.5px] text-[var(--cobalt-600)]">{opt.cfg}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Guard Rail Banner */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span><strong>Guard Rule:</strong> {stepsData[activeStepIndex].guard}</span>
          </div>
        </div>
      </section>

      {/* Section 2: One question at a time (#agent) */}
      <section id="agent" className="py-16 px-4 sm:px-6 max-w-[1180px] mx-auto border-t border-[var(--paper-200)] space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink-900)]">
            One question at a time. One step bound per answer.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] leading-relaxed">
            The agent breaks your goal into the six steps, asks which tool fills each slot, and shows the build spec filling in beside the chat. When every slot is bound, it compiles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Value Props & Launch */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4 text-xs sm:text-sm text-[var(--ink-700)]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[var(--cobalt-600)] mt-0.5 flex-shrink-0" />
                <span>Compiles to n8n production JSON or a Make.com scenario blueprint.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[var(--cobalt-600)] mt-0.5 flex-shrink-0" />
                <span>Ships with <code className="text-xs bg-[var(--paper-200)] px-1.5 py-0.5 rounded">dry_run: true</code> and <code className="text-xs bg-[var(--paper-200)] px-1.5 py-0.5 rounded">outreach_mode: log_only</code>.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[var(--cobalt-600)] mt-0.5 flex-shrink-0" />
                <span>Every answer is versioned, so campaigns carry their full audit history.</span>
              </div>
            </div>

            <Link
              href="/copilot"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--cobalt-600)] hover:bg-[var(--cobalt-700)] text-white font-semibold text-sm transition-all shadow-sm"
            >
              <span>Launch build agent in Copilot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right Interactive Chat + Build Spec Simulation */}
          <div className="lg:col-span-7 rounded-2xl border border-[var(--paper-200)] bg-[var(--paper-0)] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--paper-200)]">
              <span className="font-bold text-sm text-[var(--ink-900)]">Loadsmart GTM Campaign Builder</span>
              <span className="text-[11px] font-mono text-[var(--ink-400)]">step 03 / 06</span>
            </div>

            {/* Simulated Chat Dialogue */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="bg-[var(--paper-50)] border border-[var(--paper-200)] rounded-xl rounded-tl-sm p-3 max-w-[85%] text-[var(--ink-900)]">
                Target shipper accounts identified from Salesforce CRM. How should decision-maker contacts be enriched?
              </div>

              <div className="bg-[var(--cobalt-600)] text-white rounded-xl rounded-tr-sm p-3 max-w-[85%] ml-auto">
                Clay waterfall first (Apollo + ZoomInfo). Validate syntax and MX before sequencing.
              </div>

              <div className="bg-[var(--paper-50)] border border-[var(--paper-200)] rounded-xl rounded-tl-sm p-3 max-w-[90%] text-[var(--ink-900)] space-y-2">
                <div>Bound step 03 to <strong>Clay waterfall</strong> with syntax fallback. Next: what evidence should research look for?</div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => setSelectedEvidenceOption("notes")}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                      selectedEvidenceOption === "notes"
                        ? "bg-[var(--cobalt-600)] text-white border-[var(--cobalt-600)]"
                        : "bg-[var(--paper-0)] border-[var(--paper-200)] text-[var(--ink-700)]"
                    }`}
                  >
                    MercuryGate notes only
                  </button>
                  <button
                    onClick={() => setSelectedEvidenceOption("search")}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                      selectedEvidenceOption === "search"
                        ? "bg-[var(--cobalt-600)] text-white border-[var(--cobalt-600)]"
                        : "bg-[var(--paper-0)] border-[var(--paper-200)] text-[var(--ink-700)]"
                    }`}
                  >
                    Live lane spot rate search
                  </button>
                  <button
                    onClick={() => setSelectedEvidenceOption("both")}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                      selectedEvidenceOption === "both"
                        ? "bg-[var(--cobalt-600)] text-white border-[var(--cobalt-600)]"
                        : "bg-[var(--paper-0)] border-[var(--paper-200)] text-[var(--ink-700)]"
                    }`}
                  >
                    Both (Recommended)
                  </button>
                </div>
              </div>
            </div>

            {/* Live Build Spec Output */}
            <div className="p-3 bg-[var(--ink-900)] text-slate-200 rounded-xl font-mono text-[11px] space-y-1">
              <div className="text-[var(--ink-400)] pb-1 border-b border-slate-800"># Live Compiled Build Spec (YAML)</div>
              <div>version: "1.0.0"</div>
              <div>signals_source: "salesforce_crm"</div>
              <div>contacts_source: "clay_waterfall"</div>
              <div>evidence_mode: "{selectedEvidenceOption === 'both' ? 'notes_and_search' : selectedEvidenceOption}"</div>
              <div>truth_guard_threshold: 1.00</div>
              <div>dry_run: true</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Three ways to run it (#outputs) */}
      <section id="outputs" className="py-16 px-4 sm:px-6 max-w-[1180px] mx-auto border-t border-[var(--paper-200)] space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink-900)]">
            Three ways to run it. None of them lock you in.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] leading-relaxed">
            Choose how you deploy your outbound pipeline. Export to self-hosted orchestrators, load into your AI tools, or let the agent schedule runs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-[var(--paper-200)] bg-[var(--paper-0)] p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <Workflow className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--ink-900)]">A workflow on your instance</h3>
              <p className="text-xs sm:text-sm text-[var(--ink-600)] leading-relaxed">
                Deploy straight to your n8n or Make.com account, or download the JSON. The workflow lives entirely on your instance with zero data lock-in.
              </p>
            </div>
            <Link href="/automations" className="text-xs font-semibold text-[var(--cobalt-600)] hover:underline inline-flex items-center gap-1 pt-2">
              <span>Inspect n8n blueprints</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-[var(--paper-200)] bg-[var(--paper-0)] p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[var(--cobalt-600)]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--ink-900)]">Skills you can upload anywhere</h3>
              <p className="text-xs sm:text-sm text-[var(--ink-600)] leading-relaxed">
                One master skill plus one per step, tuned to your answers. Upload them directly to Claude, ChatGPT, Cursor, or an n8n AI agent.
              </p>
            </div>
            <Link href="/skills" className="text-xs font-semibold text-[var(--cobalt-600)] hover:underline inline-flex items-center gap-1 pt-2">
              <span>Download skill pack (.zip)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-[var(--paper-200)] bg-[var(--paper-0)] p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--ink-900)]">A campaign on a schedule</h3>
              <p className="text-xs sm:text-sm text-[var(--ink-600)] leading-relaxed">
                Keep the campaign inside the agent and run it as a cron job. Each run posts a report with one row per lead and an honest nothing_was_sent flag.
              </p>
            </div>
            <Link href="/pipeline" className="text-xs font-semibold text-[var(--cobalt-600)] hover:underline inline-flex items-center gap-1 pt-2">
              <span>View daily pipeline engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Connectors (#connectors) */}
      <section id="connectors" className="py-16 px-4 sm:px-6 max-w-[1180px] mx-auto border-t border-[var(--paper-200)] space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink-900)]">
            Every logistics & GTM connector. Your own model keys.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] leading-relaxed">
            Connect CRMs, data tools, mailboxes and sequencers once through Composio or native webhooks. Bring your own Anthropic, Gemini or OpenAI key; you pay the model provider directly.
          </p>
        </div>

        {/* 12 Connector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {connectors.map((c, i) => (
            <div key={i} className="p-4 rounded-xl border border-[var(--paper-200)] bg-[var(--paper-0)] flex items-center justify-between shadow-sm">
              <div className="space-y-0.5">
                <div className="font-bold text-xs sm:text-sm text-[var(--ink-900)]">{c.name}</div>
                <div className="text-[10.5px] text-[var(--ink-400)] font-medium">{c.cat}</div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
            </div>
          ))}
        </div>

        {/* Governance Guardrails */}
        <div className="rounded-2xl border border-[var(--paper-200)] bg-[var(--paper-0)] p-5 sm:p-6 space-y-3 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-400)]">
            Outbound Governance Invariants
          </div>
          <div className="grid sm:grid-cols-3 gap-4 text-xs text-[var(--ink-700)]">
            <div className="space-y-1">
              <div className="font-bold text-[var(--ink-900)]">1. Dry-Run Default</div>
              <div>Nothing sends until <code className="bg-[var(--paper-200)] px-1 rounded">dry_run</code> and <code className="bg-[var(--paper-200)] px-1 rounded">outreach_mode</code> are changed on purpose.</div>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-[var(--ink-900)]">2. Compliance & Opt-Out</div>
              <div>A live send strictly requires an opt-out line and CAN-SPAM physical address in your signature.</div>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-[var(--ink-900)]">3. Isolated Secret Storage</div>
              <div>Model keys live in encrypted server vaults, never in client-side bundles or chat histories.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Pricing (#pricing) */}
      <section id="pricing" className="py-16 px-4 sm:px-6 max-w-[1180px] mx-auto border-t border-[var(--paper-200)] space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink-900)]">
            Pay for the builder, not per lead.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink-600)] leading-relaxed">
            There is no lead tax. Pay for the builder software, export workflows to your stack, or run on our managed engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1 */}
          <div className="rounded-2xl border border-[var(--paper-200)] bg-[var(--paper-0)] p-6 space-y-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="font-bold text-sm text-[var(--ink-900)]">Starter</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[var(--ink-900)]">$0 <span className="text-xs font-normal text-[var(--ink-400)]">/ month</span></div>
                <p className="text-xs text-[var(--ink-600)]">Design and download. Run it yourself.</p>
              </div>

              <ul className="space-y-2 text-xs text-[var(--ink-700)]">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> 1 active campaign</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> n8n + Make.com export</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> All 11 skills pack</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Dry run only in-app</li>
              </ul>
            </div>

            <Link
              href="/copilot"
              className="w-full py-2.5 rounded-xl border border-[var(--paper-200)] bg-[var(--paper-50)] hover:bg-[var(--paper-100)] text-[var(--ink-800)] font-semibold text-xs text-center transition-colors shadow-sm"
            >
              Start building
            </Link>
          </div>

          {/* Tier 2 (Featured) */}
          <div className="rounded-2xl border-2 border-[var(--cobalt-600)] bg-[var(--paper-0)] p-6 space-y-5 shadow-md flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--cobalt-600)] text-white text-[10px] font-bold uppercase tracking-wider">
              Most teams start here
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="font-bold text-sm text-[var(--cobalt-600)]">Pro</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[var(--ink-900)]">$49 <span className="text-xs font-normal text-[var(--ink-400)]">/ month</span></div>
                <p className="text-xs text-[var(--ink-600)]">Keep campaigns in the agent and schedule them.</p>
              </div>

              <ul className="space-y-2 text-xs text-[var(--ink-700)]">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[var(--cobalt-600)]" /> Unlimited campaigns</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[var(--cobalt-600)]" /> Cron scheduling + leak reports</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[var(--cobalt-600)]" /> Every Composio & logistics toolkit</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[var(--cobalt-600)]" /> One-click deploy to your instance</li>
              </ul>
            </div>

            <Link
              href="/copilot"
              className="w-full py-2.5 rounded-xl bg-[var(--cobalt-600)] hover:bg-[var(--cobalt-700)] text-white font-semibold text-xs text-center transition-colors shadow-sm"
            >
              Start Pro
            </Link>
          </div>

          {/* Tier 3 */}
          <div className="rounded-2xl border border-[var(--paper-200)] bg-[var(--paper-0)] p-6 space-y-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="font-bold text-sm text-[var(--ink-900)]">Team / Enterprise</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[var(--ink-900)]">$199 <span className="text-xs font-normal text-[var(--ink-400)]">/ month</span></div>
                <p className="text-xs text-[var(--ink-600)]">Shared keys vault and a review queue.</p>
              </div>

              <ul className="space-y-2 text-xs text-[var(--ink-700)]">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> 5 seats across AE/SDR pods</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Shared BYOK key vault</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Staged review queue for needs_review</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Versioned answer history & audit logs</li>
              </ul>
            </div>

            <Link
              href="/copilot"
              className="w-full py-2.5 rounded-xl border border-[var(--paper-200)] bg-[var(--paper-50)] hover:bg-[var(--paper-100)] text-[var(--ink-800)] font-semibold text-xs text-center transition-colors shadow-sm"
            >
              Start Team
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 bg-[var(--ink-900)] text-white text-center">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Answer the agent. Get a workflow you own.
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Turn your logistics ideal customer profile into an automated prospecting engine in under five minutes.
          </p>
          <div className="pt-2">
            <Link
              href="/copilot"
              className="px-6 py-3 rounded-xl bg-[var(--cobalt-600)] hover:bg-[var(--cobalt-500)] text-white font-semibold text-sm sm:text-base inline-flex items-center gap-2 shadow-lg transition-all"
            >
              <span>Build my engine</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--paper-200)] bg-[var(--paper-0)] py-12 px-4 sm:px-6">
        <div className="max-w-[1180px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-[var(--ink-600)]">
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--ink-900)]">
              <svg width="24" height="24" viewBox="0 0 48 48">
                <rect width="48" height="48" rx="13" fill="var(--ink-800)" />
                <path d="M14 32.5 L24 24 L34 15.5" stroke="var(--champagne-300)" strokeWidth="2.5" strokeLinecap="square" fill="none" />
                <circle cx="14" cy="32.5" r="3.4" fill="var(--paper-50)" />
                <circle cx="24" cy="24" r="3.4" fill="var(--paper-50)" />
                <circle cx="34" cy="15.5" r="4.6" fill="var(--champagne-300)" />
              </svg>
              <span>Loadsmart Pal</span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-[var(--ink-400)]">
              Autonomous Prospect Automation Engine & GTM Architect by Salesgency.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-[var(--ink-900)] uppercase tracking-wider text-[11px]">Product</div>
            <ul className="space-y-1.5">
              <li><a href="#steps" className="hover:text-[var(--ink-900)]">How it works</a></li>
              <li><a href="#agent" className="hover:text-[var(--ink-900)]">Agent</a></li>
              <li><a href="#outputs" className="hover:text-[var(--ink-900)]">Skills & outputs</a></li>
              <li><a href="#connectors" className="hover:text-[var(--ink-900)]">Connectors</a></li>
              <li><a href="#pricing" className="hover:text-[var(--ink-900)]">Pricing</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-[var(--ink-900)] uppercase tracking-wider text-[11px]">GTM Platform</div>
            <ul className="space-y-1.5">
              <li><Link href="/copilot" className="hover:text-[var(--ink-900)]">GTM Copilot</Link></li>
              <li><Link href="/dashboard" className="hover:text-[var(--ink-900)]">Pod Dashboard</Link></li>
              <li><Link href="/pipeline" className="hover:text-[var(--ink-900)]">Pipeline Engine</Link></li>
              <li><Link href="/playbook" className="hover:text-[var(--ink-900)]">Sales Playbook</Link></li>
              <li><Link href="/skills" className="hover:text-[var(--ink-900)]">Skills Pack (.zip)</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-[var(--ink-900)] uppercase tracking-wider text-[11px]">Governance</div>
            <ul className="space-y-1.5">
              <li><Link href="/settings" className="hover:text-[var(--ink-900)]">Truth Guard W=1.00</Link></li>
              <li><Link href="/automations" className="hover:text-[var(--ink-900)]">n8n Blueprints</Link></li>
              <li><Link href="/architecture" className="hover:text-[var(--ink-900)]">C4 Architecture</Link></li>
              <li className="pt-2 text-[10.5px] text-[var(--ink-400)]">© 2026 Salesgency.</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}