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
  Workflow,
  Truck,
  Warehouse,
  Cpu,
  BarChart3,
  Lightbulb,
  FileText,
  AlertTriangle,
  Play,
  Download,
  HelpCircle,
  Plus,
  Minus,
  Target
} from "lucide-react";

export default function SaasbrightHomePage() {
  const [activePodTab, setActivePodTab] = useState<"ftl" | "tms" | "opendock" | "ai">("tms");
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // 6-Step Prospecting Slot State
  const [activeSlotIdx, setActiveSlotIdx] = useState(0);
  const [selectedPrompt, setSelectedPrompt] = useState("");

  const promptOptions = [
    "Target VP Logistics at MercuryGate / Oracle OTM beverage shippers",
    "Engage 50 regional distribution centers with >3 dock doors for Opendock",
    "Reach CIOs & Supply Chain VPs for Loadsmart AI autonomous quoting"
  ];

  const metrics = [
    { value: "1,800+", label: "Enterprise Shippers", sub: "Active freight customers" },
    { value: "4,500+", label: "Live Warehouses", sub: "On Opendock network" },
    { value: "230k+", label: "Vetted Carriers", sub: "Multimodal capacity" },
    { value: "14M+", label: "Dock Appointments", sub: "Scheduled annually" },
    { value: "W = 1.00", label: "Calibrated Truth Guard", sub: "Zero hallucination" }
  ];

  const pods = [
    {
      id: "ftl",
      name: "Mid-Market FTL",
      icon: Truck,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      tagline: "Multimodal spot capacity, dedicated lanes & dynamic freight matching",
      desc: "Empowers brokerage AEs to source shippers with volatile dry van and refrigerated freight lanes. Automates carrier procurement searches and delivers real-time spot market intelligence.",
      stat: "98.4% On-Time Delivery",
      features: [
        "Dynamic spot rate indexing across 230,000 vetted carriers",
        "Lane-level risk detection and volatility triggers",
        "Automated DAT & Truckstop freight index correlation",
        "Cold-chain refrigerated & flatbed specialist routing"
      ]
    },
    {
      id: "tms",
      name: "ShipperGuide TMS",
      icon: Layers,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      tagline: "Cloud Transportation Management ($25K–$120K SaaS ARR)",
      desc: "Target mid-market and enterprise shippers running legacy Oracle OTM, Manhattan, or MercuryGate systems. Pitches 4-6 week go-live versus 18 months of multi-million dollar consulting bloat.",
      stat: "4–6 Week Go-Live",
      features: [
        "Battlecard targeting MercuryGate & McLeod legacy pain points",
        "Automated ERP & TMS footprint detection via technology signals",
        "Direct procurement ROI calculations ($120k average annual savings)",
        "Automated demo bookings directly into Gong Engage sequences"
      ]
    },
    {
      id: "opendock",
      name: "Opendock Network",
      icon: Warehouse,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      tagline: "Facility & yard appointment self-scheduling across 4,500+ docks",
      desc: "Replaces manual phone calls, clipboard check-ins, and driver detention fees. Enables carriers to book appointments 24/7 directly into warehouse management systems.",
      stat: "14 Million+ Appointments",
      features: [
        "Targeting Plant Managers, DC Directors, and Warehouse Operations",
        "Detection of facility expansions, new DC leases, and dock door counts",
        "Eliminates driver dwell time and detention penalty disputes",
        "Turnkey integrations with Manhattan, SAP, and Blue Yonder WMS"
      ]
    },
    {
      id: "ai",
      name: "Loadsmart AI",
      icon: Cpu,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      tagline: "11 Autonomous quoting, booking & tracking agents embedded in ERPs",
      desc: "Next-generation autonomous freight intelligence. AI agents handle spot quoting, rate negotiations, tracking inquiries, and document OCR directly inside existing shipper systems.",
      stat: "80% Rep Time Saved",
      features: [
        "Autonomous spot rate quoting within 90 seconds of request",
        "Natural language tracking inquiry resolution across email and EDI",
        "SOC 2 Type II enterprise security and data privacy safeguards",
        "Zero-context hallucination via strict Calibrated Truth Guards"
      ]
    }
  ];

  const pillars = [
    {
      num: "01",
      title: "Diagnostic & Leak Detection",
      question: "Where is the program leaking and what is the root cause?",
      answer: "The program leaks in the assignment step because accounts are unranked and lack lead scoring. Red flags include 20 accounts (too small) and 1 generic list across product lines. Low open/reply rates are red flags; empty calendars are symptoms; wrong ICP and wrong buyer persona are root causes.",
      tag: "Diagnosis"
    },
    {
      num: "02",
      title: "Contact Quality & Closed-Loop Attribution",
      question: "How do we make lists good now and improve over time?",
      answer: "First, author formal Buyer Persona and ICP specs per product. Second, enrich and quantitatively score every lead. Third, feed data from booked discovery calls, completed demos, and closed-won deals back into the ranking algorithm to isolate winning subject lines, prospect titles, and revenue tiers.",
      tag: "Data Quality"
    },
    {
      num: "03",
      title: "Signal-Based Triggers & Web Intent",
      question: "What signal systems work best and how do you test them?",
      answer: "Deploy an autonomous signal skill scanning SEC 10-K risk factors (capex, warehouse expansion), executive podcasts, and freight press. Pair with website de-anonymization and category SEO keywords. Compile daily draft leads via SERP APIs and LinkedIn before waterfall enrichment.",
      tag: "Signals"
    },
    {
      num: "04",
      title: "Granular Measurement & Rep Leaderboards",
      question: "How do you measure performance and know when to pivot?",
      answer: "Eliminate generalities. Measure performance cut by ICP tier, buyer persona, size band, time-of-day, and channel. A daily reporting skill extracts telemetry to deliver personalized stats and a team leaderboard to reps each morning, while leadership tracks open-to-meeting conversion.",
      tag: "Analytics"
    },
    {
      num: "05",
      title: "Pod Enablement & AI Office Hours",
      question: "How do you collect rep feedback and report to leadership?",
      answer: "Conduct weekly 1-on-1s and AI office hours with AEs/SDRs to train them on AI prompting and shadow daily workflows. Build custom skills tailored to each rep's territory. Deliver three structured executive reports: Implementation Report, KPI Improvement Report, and Incentive Alignment Report.",
      tag: "Enablement"
    },
    {
      num: "06",
      title: "Tooling Evolution & n8n Orchestration",
      question: "What tools would you add or change for maximum ROI?",
      answer: "Keep Salesforce, Gong, ZoomInfo, Clay, and Claude intact. Add self-hosted n8n for lightweight middle-out DAG orchestration with zero per-task SaaS tax. Deploy Claude managed agents for deep account research. Achieves 80% rep time savings and zero duplicate CRM records.",
      tag: "Infrastructure"
    },
    {
      num: "07",
      title: "The Three Critical Blind Spots",
      question: "What are we not thinking about that represents upside?",
      answer: "1. Micro-segmentation: isolate high-margin freight verticals and legacy TMS footprints. 2. Mine the internal database: re-enrich dormant Salesforce closed-lost deals and past champions. 3. Expand from 20 to 50 emails per mailbox daily across healthy secondary domain pools.",
      tag: "Strategy"
    }
  ];

  const stepsData = [
    {
      name: "Signals",
      num: "01",
      hue: "#3b82f6",
      desc: "Scans SEC 10-Ks, press releases, freight rate volatility, and facility expansions to nominate high-intent shipper accounts.",
      guard: "Accounts without verifiable freight spend or active logistics indicators are automatically skipped."
    },
    {
      name: "Companies & CRM Shield",
      num: "02",
      hue: "#6366f1",
      desc: "Cross-references candidate accounts against active Salesforce opportunities to guarantee zero rep lead collisions.",
      guard: "Active customer accounts and open pipeline deals are locked and safely routed out."
    },
    {
      name: "Contacts & Waterfall Reveal",
      num: "03",
      hue: "#10b981",
      desc: "Discovers verified freight decision-makers (VP Logistics, Plant Managers, CIOs) via multi-provider Clay waterfall.",
      guard: "Strict email syntax and MX record validation ensures sub-2% bounce rates."
    },
    {
      name: "Account Dossier Research",
      num: "04",
      hue: "#8b5cf6",
      desc: "Finds concrete MercuryGate / OTM pain points and dock delays, keeping only verified facts.",
      guard: "Hooks without verifiable citations are discarded to eliminate hallucination."
    },
    {
      name: "AI Copy Synthesis",
      num: "05",
      hue: "#f59e0b",
      desc: "Drafts 1-to-1 Problem-Agitation-Solution (PAS) cold emails grounded in Loadsmart's verified claims library.",
      guard: "Calibrated Truth Guard W = 1.00 ensures all numbers and metrics are 100% verified."
    },
    {
      name: "Human Staged Approval",
      num: "06",
      hue: "#ec4899",
      desc: "Staged in the Review Drawer for rep one-click approval before enrollment into Gong Engage sequences.",
      guard: "Zero automated cold sends occur without explicit AE/SDR sign-off."
    }
  ];

  const faqs = [
    {
      q: "How does the Loadsmart GTM Agent prevent rep lead collisions?",
      a: "The CRM Shield (Step 02) executes a bidirectional query against Salesforce before any prospect account is touched. If an account has an open opportunity, an active customer contract, or an assigned AE with activity in the last 60 days, it is instantly parked as skipped_active_deal."
    },
    {
      q: "How do we protect Loadsmart's primary email domain reputation?",
      a: "Zero cold outbound is ever sent from the primary loadsmart.com domain. The engine orchestrates 8 isolated secondary sending domain pools (e.g. try-loadsmart.com, loadsmart-freight.com) with SPF/DKIM/DMARC alignment, gradual automated warm-up, and automated shutdown if bounce rates exceed 2%."
    },
    {
      q: "What makes the copy generation different from generic AI tools?",
      a: "Our Calibrated Truth Guard ($W = 1.00$) gates all LLM reasoning. The model can only cite figures from Loadsmart's audited Claims Library (1,800+ Shippers, 4,500+ Docks, 230,000+ Carriers, 14M Appointments, SOC 2 Type II). It is strictly forbidden from hallucinating customer logos or imaginary metrics."
    },
    {
      q: "How does the system integrate with our existing sales tech stack?",
      a: "It does not replace your stack. It uses lightweight n8n orchestration to connect Salesforce, Gong Engage, ZoomInfo, and Clay into a unified daily sequence. Data flows into Salesforce custom fields and enrolls approved contacts into Gong cadences."
    },
    {
      q: "How quickly can the 4 sales pods get onboarded?",
      a: "Through our weekly AI office hours and 1-on-1 rep sessions, reps begin using the Pod Copilot and Review Drawer in Week 1. Custom skills tailored to specific territories and battlecards are rolled out within 14 days."
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Saasbright Radiant Sky Hero Section */}
      <section className="relative pt-6 sm:pt-12 text-center space-y-6 max-w-4xl mx-auto px-4">
        {/* Soft Sky Atmospheric Lighting Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-[600px] sm:w-[900px] h-[350px] bg-sky-200/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-sky-200/80 text-sky-900 text-xs font-semibold shadow-xs backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span>Loadsmart Sovereign GTM AI Center of Excellence</span>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-sky-700">W = 1.00 Grounded</span>
        </div>

        {/* Big Editorial Display Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
          Autonomous Outbound Intelligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600">Enterprise Logistics</span>
        </h1>

        {/* Subtitle with High Legibility */}
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Empowering Loadsmart’s AE & SDR pods across Mid-Market FTL, ShipperGuide TMS, Opendock, and Loadsmart AI with high-intent signals, CRM shield, and verified 1-to-1 personalization.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/?tab=demo"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Live Copilot Demo</span>
          </Link>

          <Link
            href="/deck"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200/90 shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>View 7-Pillar Strategy Deck</span>
          </Link>
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Zero CRM Collisions
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
            Sub-2% Bounce Deliverability
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
            SOC 2 Type II Certified
          </span>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {metrics.map((m, i) => (
              <div key={i} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  {m.value}
                </div>
                <div className="text-xs font-bold text-slate-700">{m.label}</div>
                <div className="text-[11px] text-slate-400">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product Showcase Mockup (Framer Layer Window) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center space-y-2 mb-6">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Interactive Workspace</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Designed for AE & SDR Daily Execution
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            A unified interface that gives reps deep account intelligence and verified email copy before staging for one-click approval.
          </p>
        </div>

        {/* Elevated Browser / Product Window */}
        <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xl overflow-hidden">
          {/* Top Window Bar */}
          <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="ml-4 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-mono text-slate-600 shadow-2xs">
                <span>Loadsmart pod copilot</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                POD 2 · SHIPPERGUIDE TMS
              </span>
            </div>
          </div>

          {/* Product Window Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
            {/* Left Pod Sidebar */}
            <div className="lg:col-span-3 border-r border-slate-100 p-4 bg-slate-50/50 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-1">
                Active Sales Pods
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900 flex items-center justify-between">
                <span>ShipperGuide TMS</span>
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                Mid-Market FTL Spot
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                Opendock Facility Docks
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                Loadsmart AI Operations
              </div>
            </div>

            {/* Center Chat & Dossier Preview */}
            <div className="lg:col-span-6 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Loadsmart Pod Copilot</div>
                  <div className="text-[10px] text-slate-400">Grounded in claims library & MercuryGate battlecards</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-blue-600" />
                  <span>Account Dossier: Great Lakes Beverage Corp</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Identified <strong>VP Logistics</strong> managing 12 facilities running MercuryGate. Recent SEC 10-K risk factor cites <strong>$1.4M detention fee increase</strong> due to manual dock scheduling.
                </p>
                <div className="pt-2 border-t border-slate-200/80 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                    Fit Score: 94/100
                  </span>
                  <span className="text-[10px] text-slate-500">CRM Shield: No active deal</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/?tab=demo"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <span>Interact with Live Copilot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Review Drawer Mock */}
            <div className="lg:col-span-3 border-l border-slate-100 p-4 bg-slate-50/50 space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Staged Outreach Draft
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs">
                <div className="text-[11px] font-mono text-slate-500">To: VP Logistics</div>
                <div className="font-bold text-slate-900 text-xs">Subject: MercuryGate dock bottlenecks at Dallas facility</div>
                <p className="text-[11px] text-slate-600 line-clamp-3">
                  Saw your Dallas DC expansion. Most food & beverage shippers on MercuryGate take 18 months to automate dock appointments...
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button className="flex-1 py-1 rounded bg-emerald-600 text-white font-bold text-[10px] shadow-2xs">
                    Approve
                  </button>
                  <button className="flex-1 py-1 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The 4 Sales Pods Solutions (Bento Grid) */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Commercial Architecture</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tailored Solutions for Loadsmart's 4 Sales Pods
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Each pod operates with its own distinct buyer personas, pain point battlecards, and automation cadences.
          </p>
        </div>

        {/* Pod Tabs */}
        <div className="flex items-center justify-center">
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-slate-100 border border-slate-200">
            {pods.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePodTab(p.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                  activePodTab === p.id
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <p.icon className="w-3.5 h-3.5" />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Pod Highlight Card */}
        {(() => {
          const pod = pods.find((p) => p.id === activePodTab)!;
          return (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                    <pod.icon className="w-3.5 h-3.5" />
                    <span>Pod Focus</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900">{pod.name}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">{pod.tagline}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center shrink-0">
                  <div className="text-xs text-slate-400 font-medium">Benchmark Metric</div>
                  <div className="text-lg font-bold text-slate-900 font-mono">{pod.stat}</div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Strategic Mission</div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {pod.desc}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Capabilities</div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {pod.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* 5. The 7-Pillar Strategy & Pod Acceleration Engine (Interview Case Study) */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">Case Study Execution</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The 7-Pillar GTM Engineering Blueprint
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Directly answering the 7 core strategic and technical questions for Loadsmart commercial operations.
          </p>
        </div>

        {/* 7 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Pillar Selector List */}
          <div className="md:col-span-4 space-y-2">
            {pillars.map((p, idx) => (
              <div
                key={p.num}
                onClick={() => setActivePillarIndex(idx)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  activePillarIndex === idx
                    ? "bg-blue-50/80 border-blue-400 shadow-xs ring-1 ring-blue-300"
                    : "bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-blue-600 font-bold">Pillar {p.num}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    {p.tag}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">
                  {p.title}
                </div>
              </div>
            ))}
          </div>

          {/* Pillar Detail Pane */}
          <div className="md:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-mono text-xs font-bold">
                    Pillar {pillars[activePillarIndex].num}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {pillars[activePillarIndex].tag}
                  </span>
                </div>
                <Link
                  href="/deck"
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>Open Full Presentation Deck</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">The Challenge Question</div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  "{pillars[activePillarIndex].question}"
                </h3>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">The Engineering Solution</div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {pillars[activePillarIndex].answer}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Verified against Loadsmart operational architecture</span>
              <span className="font-mono text-emerald-700 font-bold">W = 1.00 Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Interactive 6-Step Prospecting Engine */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Deterministic Engine</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            The 6-Step Prospecting Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            From trigger ingest to CRM deduplication and human-staged approval.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {stepsData.map((s, idx) => (
            <div
              key={s.num}
              onClick={() => setActiveSlotIdx(idx)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                activeSlotIdx === idx
                  ? "bg-blue-50/80 border-blue-400 shadow-xs ring-1 ring-blue-300"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{s.num}</span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.hue }} />
              </div>
              <div className="font-bold text-xs text-slate-900 mt-2">{s.name}</div>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono font-bold text-blue-600">
              Step {stepsData[activeSlotIdx].num} · {stepsData[activeSlotIdx].name}
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Automated Guard Active
            </span>
          </div>
          <h4 className="text-base font-bold text-slate-900">
            {stepsData[activeSlotIdx].desc}
          </h4>
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <strong>Safety Constraint:</strong> {stepsData[activeSlotIdx].guard}
          </div>
        </div>
      </section>

      {/* 7. Commercial Tiers & Pricing */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Transparent Deployment</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Commercial Pod Tiers
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Choose the deployment tier that matches your active pod count and sending volume.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs">
            <span className={billingCycle === "monthly" ? "font-bold text-slate-900" : "text-slate-500"}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className="w-11 h-6 rounded-full bg-slate-200 p-0.5 transition-colors relative"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  billingCycle === "annual" ? "translate-x-5 bg-blue-600" : ""
                }`}
              />
            </button>
            <span className={billingCycle === "annual" ? "font-bold text-slate-900" : "text-slate-500"}>
              Annual <span className="text-emerald-600 font-bold">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {/* Tier 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter Pod</div>
              <h3 className="text-2xl font-bold text-slate-900">
                {billingCycle === "annual" ? "$1,200" : "$1,500"}
                <span className="text-xs font-normal text-slate-500"> / month</span>
              </h3>
              <p className="text-xs text-slate-600">Ideal for 1 dedicated pod establishing automated signal prospecting.</p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 1 Sales Pod (Mid-Market FTL or TMS)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Up to 50 accounts / day</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Salesforce CRM Shield integration</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 2 Secondary domain pools</li>
              </ul>
            </div>
            <Link
              href="/?tab=demo"
              className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-colors block"
            >
              Start with Pod 1
            </Link>
          </div>

          {/* Tier 2 (Featured) */}
          <div className="p-6 rounded-3xl bg-white border-2 border-blue-500 shadow-md space-y-6 flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Most Popular
            </div>
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Commercial Team</div>
              <h3 className="text-2xl font-bold text-slate-900">
                {billingCycle === "annual" ? "$3,500" : "$4,200"}
                <span className="text-xs font-normal text-slate-500"> / month</span>
              </h3>
              <p className="text-xs text-slate-600">Full operational acceleration across all 4 AE & SDR sales pods.</p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> All 4 Pods (FTL, TMS, Opendock, AI)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> 200 accounts / day (50/mailbox)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Full Clay waterfall + ZoomInfo data</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Weekly AI office hours & 1-on-1s</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Daily rep leaderboards & reports</li>
              </ul>
            </div>
            <Link
              href="/?tab=demo"
              className="w-full py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center transition-colors block shadow-xs"
            >
              Deploy Full Team
            </Link>
          </div>

          {/* Tier 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Scale Enterprise</div>
              <h3 className="text-2xl font-bold text-slate-900">
                {billingCycle === "annual" ? "$8,500" : "$9,800"}
                <span className="text-xs font-normal text-slate-500"> / month</span>
              </h3>
              <p className="text-xs text-slate-600">Custom autonomous multi-agent fleet with dedicated RevOps engineering.</p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Unlimited accounts & reps</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Dedicated self-hosted n8n cluster</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Custom enterprise battlecard agents</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Custom SLA & dedicated support</li>
              </ul>
            </div>
            <Link
              href="/?tab=demo"
              className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-colors block"
            >
              Contact Leadership
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Frequently Asked Questions</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:bg-slate-50/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <Minus className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. Final Closing Saasbright Sky CTA */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="relative rounded-3xl border border-sky-200/90 bg-gradient-to-b from-sky-50/80 via-white to-blue-50/50 p-8 sm:p-14 text-center space-y-6 shadow-md overflow-hidden">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-sky-300/20 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-sky-200 text-sky-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Ready for Day 1 Deployment</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-2xl mx-auto leading-tight">
            Scale Outbound Revenue Without Scaling Headcount
          </h2>

          <p className="text-xs sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Join Loadsmart's commercial leadership in evaluating the live Copilot, the 7-pillar presentation deck, and all 34 documentation files.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/?tab=demo"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Live Copilot</span>
            </Link>

            <a
              href="/loadsmart-abm-os.zip"
              download
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Download Complete Kit (.zip)</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
