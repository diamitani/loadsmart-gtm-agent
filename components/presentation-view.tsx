"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Truck, 
  Warehouse, 
  Cpu, 
  Layers, 
  Clock, 
  Zap, 
  BarChart3, 
  Bot,
  Play,
  Maximize2,
  Minimize2,
  FileText,
  AlertTriangle,
  Target,
  Users,
  Wrench,
  Lightbulb,
  Calendar,
  Check,
  Copy,
  ExternalLink
} from "lucide-react";

interface PresentationViewProps {
  onGoToDemo?: () => void;
  fullscreenMode?: boolean;
}

export function PresentationView({ onGoToDemo, fullscreenMode = false }: PresentationViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [copiedNotes, setCopiedNotes] = useState(false);

  const totalSlides = 9;

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides]);

  function handleCopyNotes(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2000);
  }

  const slides = [
    // Slide 1: Executive Overview
    {
      id: "slide-01",
      number: "01",
      questionNumber: null,
      tag: "Executive Strategy & Case Study",
      title: "Loadsmart GTM Engineering & Pod Acceleration Plan",
      subtitle: "The 7-Pillar Strategy: Diagnosis, Signals, Pod Enablement & Scaled Outbound Architecture",
      speakerNotes: "Welcome leadership team. This presentation outlines the exact strategic, technical, and operational blueprint to scale Loadsmart's outbound revenue engine. We will systematically walk through the 7 core challenges: diagnosing program leaks, elevating contact quality, engineering high-intent signal workflows, measuring rep-level attribution, enabling pods via weekly AI office hours, evolving the modern tech stack with n8n and custom agents, and capitalizing on dormant blind spots.",
      content: (
        <div className="space-y-6">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl">
            A comprehensive, battle-tested operational plan designed specifically for Loadsmart commercial leadership. 
            Directly addressing the 7 core GTM challenges across all four dedicated AE/SDR sales pods to transition from manual, unmeasured prospecting to an autonomous, high-converting revenue engine.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Pod 1
              </div>
              <div className="font-bold text-sm text-slate-900">Mid-Market FTL</div>
              <div className="text-[11px] text-slate-500">Dedicated freight lanes & spot volume</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Pod 2
              </div>
              <div className="font-bold text-sm text-slate-900">ShipperGuide TMS</div>
              <div className="text-[11px] text-slate-500">$25K–$120K SaaS ARR contracts</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                <Warehouse className="w-3.5 h-3.5" /> Pod 3
              </div>
              <div className="font-bold text-sm text-slate-900">Opendock Network</div>
              <div className="text-[11px] text-slate-500">4,500+ facility & dock scheduling</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Pod 4
              </div>
              <div className="font-bold text-sm text-slate-900">Loadsmart AI</div>
              <div className="text-[11px] text-slate-500">11 autonomous quoting/dispatch agents</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>The Core Premise: Quality Precedes Volume</span>
              </div>
              <p className="text-blue-700">
                Fix the assignment step, rank leads rigorously by product ICP, and empower reps with bespoke AI skills.
              </p>
            </div>
            <div className="font-mono text-slate-500 text-[11px] shrink-0">
              Patrick Diamitani · GTM Engineer
            </div>
          </div>
        </div>
      )
    },

    // Slide 2: Question 1 - Diagnose & Leaks
    {
      id: "slide-02",
      number: "02",
      questionNumber: 1,
      tag: "Question 01 · Diagnostic & Root Cause",
      title: "Where the Program Leaks: Assignment & Scoring Breakdown",
      subtitle: "Differentiating red flags from symptoms and isolating upstream root causes",
      speakerNotes: "Most teams mistake empty calendars for a messaging problem or a lazy rep. That's a symptom. The red flag is email engagement dropping below baseline. The root cause is almost always upstream in the assignment step: sending Opendock warehouse pitches to corporate procurement leaders, or pitching FTL spot freight to shippers who run 100% private fleets. We fix this by deriving ICP from each product independently and injecting a rigorous scoring gate.",
      content: (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
              <div className="text-rose-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> The Primary Leak
              </div>
              <h4 className="font-bold text-sm text-slate-900">The Assignment Step</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We don’t know if assigned accounts are lookalikes scraped from third-party platforms or internal enriched records. Zero quantitative lead scoring is applied prior to dispatch.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="text-amber-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Red Flag Indicators
              </div>
              <h4 className="font-bold text-sm text-slate-900">20 Accounts & 1 Generic List</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>20 accounts is too small</strong> for statistical pipeline velocity. Pushing one generic account list across multiple product lines causes message mismatch and low reply rates.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="text-emerald-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> What to Audit First
              </div>
              <h4 className="font-bold text-sm text-slate-900">Code, Prompts & CRM Logs</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect the prompt or skill generating daily dispatch; audit Salesforce CRM for lead scoring attributes, qualification timestamps, and rep activity history.
              </p>
            </div>
          </div>

          {/* Symptom vs Root Cause Comparison Matrix */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              The Diagnostic Hierarchy
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-rose-600">Red Flag:</span>
                <p className="text-slate-600 mt-1">Low open (&lt;20%) and reply (&lt;2%) rates across outbound sequences.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-amber-600">Symptom:</span>
                <p className="text-slate-600 mt-1">AE calendars empty with zero discovery meetings booked.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-blue-600">Root Cause:</span>
                <p className="text-slate-600 mt-1"><strong>Wrong ICP & Persona:</strong> ICP and buyer personas must originate directly from the product, not generic firmographics.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3: Question 2 - List & Contact Quality
    {
      id: "slide-03",
      number: "03",
      questionNumber: 2,
      tag: "Question 02 · Contact Quality & Ranking",
      title: "Elevating Contact Quality: Closed-Deal Attribution Loops",
      subtitle: "Enriching the foundation and letting won deals train the targeting model",
      speakerNotes: "Contact quality is not static. If you buy a ZoomInfo list and dump it into Gong, it degrades monthly. We create a living system: first, formalize the ICP per product; second, rank and enrich records via waterfall data providers; third, close the feedback loop by feeding closed-deal metadata back into the scoring weights so the model gets smarter every week.",
      content: (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Step 1: Formalize Product Documentation
              </div>
              <h4 className="font-bold text-sm text-slate-900">Buyer Persona & ICP Specifications</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Before purchasing or pulling another lead, author authoritative Buyer Persona, ICP, and Product Use Case dossiers tailored to each of Loadsmart's 4 business units. Every record must clear this rubric.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" /> Step 2: ICP & Persona Match Scoring
              </div>
              <h4 className="font-bold text-sm text-slate-900">Ranked Lead Prioritization</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enrich the current database and calculate an objective fit score. Rank prospective accounts so reps always work the top decile rather than arbitrary alphabetical lists.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> The Closed-Loop Optimization Engine
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white border border-emerald-100 shadow-2xs">
                <div className="font-bold text-slate-900">1. Cross-Account Testing</div>
                <div className="text-slate-600 mt-1">Test leads systematically across account tiers and pod segments.</div>
              </div>
              <div className="p-3 rounded-lg bg-white border border-emerald-100 shadow-2xs">
                <div className="font-bold text-slate-900">2. Ingest Closed-Deal Data</div>
                <div className="text-slate-600 mt-1">Pull telemetry from booked calls, stage transitions, and won contracts back into the ranker.</div>
              </div>
              <div className="p-3 rounded-lg bg-white border border-emerald-100 shadow-2xs">
                <div className="font-bold text-slate-900">3. Isolate Winning Vectors</div>
                <div className="text-slate-600 mt-1">Identify which subject lines, company revenue bands, and buyer titles convert best.</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 4: Question 3 - Signals
    {
      id: "slide-04",
      number: "04",
      questionNumber: 3,
      tag: "Question 03 · Signal-Based Systems",
      title: "Signal-Based Architecture: High-Intent Trigger Scouting",
      subtitle: "Combining ZoomInfo, Factors.ai, 10-K SEC filings, and Claude Code skills",
      speakerNotes: "Signals transform cold outreach into timely advisory outreach. When an enterprise shipper files a 10-K citing warehouse bottleneck costs, or opens a new distribution center in Dallas, pitching Opendock or ShipperGuide is no longer cold outbound—it is solving an active line-item problem. We automate this signal scouting every morning at 06:00 CT.",
      content: (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Track Record & Systems Previously Built
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              Production workflows implemented across <strong>ZoomInfo</strong>, <strong>Factors.ai</strong> (website de-anonymization & intent), 
              and autonomous <strong>Claude Code skills</strong> running scheduled web intelligence jobs.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
              <div className="text-blue-700 font-bold text-xs uppercase tracking-wider">
                01 · External Triggers
              </div>
              <h4 className="font-bold text-sm text-slate-900">Press, Podcasts & SEC 10-Ks</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scan executive interviews, freight earnings calls, and 10-K risk factors mentioning warehouse delays or transportation spend.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2">
              <div className="text-indigo-700 font-bold text-xs uppercase tracking-wider">
                02 · First-Party Intent
              </div>
              <h4 className="font-bold text-sm text-slate-900">De-Anonymization & SEO</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Capture accounts actively visiting Loadsmart web properties or searching category keywords (TMS, dock scheduling, freight quotes).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="text-emerald-700 font-bold text-xs uppercase tracking-wider">
                03 · Daily Execution
              </div>
              <h4 className="font-bold text-sm text-slate-900">SERP APIs & LinkedIn Scrapes</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Autonomous daily draft lead lists compiled via SERP search, cross-checked against LinkedIn signals, and enriched via waterfall.
              </p>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: Question 4 - Measurement
    {
      id: "slide-05",
      number: "05",
      questionNumber: 4,
      tag: "Question 04 · Measurement & Strategy",
      title: "Granular Attribution, Daily Rep Leaderboards & Strategy Pivots",
      subtitle: "Moving beyond generic vanity metrics to channel, timing, and rep-level precision",
      speakerNotes: "If you only measure total emails sent and total meetings booked, you are flying blind. We measure the exact matrix: does VP Logistics at $50M revenue convert better at 08:30 CT on Tuesday or 14:00 CT on Thursday? Reps receive their personal stats every morning, fostering healthy leaderboard competition, while leadership gets automated pipeline visibility.",
      content: (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-600">
                The Diagnosis
              </div>
              <h4 className="font-bold text-sm text-slate-900">"The Whole Thing is General"</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Currently, we don’t know if time of day works, which channels yield meetings, or how individual reps perform per product line. Aggregate metrics hide underperforming segments.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                The Engineering Solution
              </div>
              <h4 className="font-bold text-sm text-slate-900">Automated Daily Rep Reports</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deploy a custom skill that extracts outbound telemetry and Salesforce pipeline daily. Sends personalized stat scorecards and a team leaderboard to reps and leadership every morning.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              4 Multi-Dimensional Pillars to Track
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                <div className="font-bold text-slate-900">ICP Fit Tier</div>
                <div className="text-[11px] text-slate-500">Tier A vs B vs C</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                <div className="font-bold text-slate-900">Buyer Persona</div>
                <div className="text-[11px] text-slate-500">VP vs Director vs Plant Mgr</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                <div className="font-bold text-slate-900">Size Band</div>
                <div className="text-[11px] text-slate-500">Mid-Market vs Enterprise</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                <div className="font-bold text-slate-900">Channel / Time</div>
                <div className="text-[11px] text-slate-500">Email vs Phone vs LinkedIn</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 6: Question 5 - Working with Pods
    {
      id: "slide-06",
      number: "06",
      questionNumber: 5,
      tag: "Question 05 · Pod Enablement & Feedback",
      title: "AE & SDR Pod Collaboration: 1-on-1s, AI Office Hours & Custom Skills",
      subtitle: "Closing the loop between frontline sales, marketing messaging, and RevOps tooling",
      speakerNotes: "Technology failed by adoption is wasted capital. The GTM Engineer's primary job is partnering with reps. By sitting with AEs, observing where they waste 2 hours a day manually copy-pasting tracking numbers or researching facility managers, we turn those pain points into automated skills. Reps get their time back, RevOps gets clean data, and leadership gets predictable pipeline.",
      content: (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
              <div className="text-blue-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Direct Rep Enablement
              </div>
              <h4 className="font-bold text-sm text-slate-900">Weekly 1-on-1s & AI Office Hours</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sit with AEs and SDRs weekly. Train them on AI prompting, analyze their daily manual workflows, and record individual SOPs to build custom skills that solve their immediate pain points.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2">
              <div className="text-indigo-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> Tailored Skill Development
              </div>
              <h4 className="font-bold text-sm text-slate-900">Custom Skills for Each Rep</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rather than forcing a rigid system, build individualized agent skills (e.g. facility lookup, custom call script openers, freight objection handlers) tailored to each rep’s territory.
              </p>
            </div>
          </div>

          {/* The 3 Core Reports to Sales, Marketing & RevOps */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              The 3 Executive Reports Delivered to Leadership
            </div>
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">1. Implementation Report</div>
                <div className="text-slate-600 mt-1">Exact record of skills, tools, and automated workflows implemented per rep.</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">2. Improvement Report</div>
                <div className="text-slate-600 mt-1">Objective before/after measurement of key KPIs (meetings booked, response rates).</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">3. Incentive Alignment</div>
                <div className="text-slate-600 mt-1">Audit of what reps want vs what is incentivized to ensure tool adoption.</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 7: Question 6 - Tools
    {
      id: "slide-07",
      number: "07",
      questionNumber: 6,
      tag: "Question 06 · Tooling Architecture & ROI",
      title: "Tooling Evolution: Orchestrating the Stack with n8n & Claude Agents",
      subtitle: "Maximizing Salesforce, Gong, ZoomInfo, and Clay with middle-out orchestration",
      speakerNotes: "Loadsmart doesn't need to replace Salesforce or Gong, and you certainly don't need to buy another $100k enterprise platform. The missing connective tissue is an orchestration engine like n8n and purpose-built agent skills. We orchestrate what you already pay for, drastically multiplying the ROI of your existing ZoomInfo, Clay, and Gong investments.",
      content: (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
            <div className="text-emerald-800 font-bold text-xs uppercase tracking-wider">
              The Strategic Verdict
            </div>
            <h4 className="font-bold text-sm text-slate-900">"I’d add n8n, that’s about it. And create skills/custom agents."</h4>
            <p className="text-xs text-slate-600">
              Keep the core stack intact. Add lightweight, self-hosted orchestration and autonomous Claude managed agents rather than expensive SaaS bloat.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 text-sm">Existing Enterprise Foundation</div>
              <ul className="space-y-1.5 text-slate-600">
                <li>• <strong>Salesforce:</strong> Source of truth CRM & pipeline ledger</li>
                <li>• <strong>Gong / Salesloft:</strong> Multi-channel sequence execution</li>
                <li>• <strong>ZoomInfo / Apollo / Sales Nav:</strong> Raw contact databases</li>
                <li>• <strong>Clay:</strong> Multi-provider data waterfall & verification</li>
                <li>• <strong>Claude:</strong> Deep reasoning & copy synthesis</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2">
              <div className="font-bold text-blue-900 text-sm">What n8n & Custom Agents Unlock</div>
              <ul className="space-y-1.5 text-blue-800">
                <li>• <strong>Zero Per-Task Tax:</strong> Middle-out DAG execution connecting webhooks</li>
                <li>• <strong>Deterministic Daily Cadence:</strong> Orchestrates 06:00 to 17:00 CT workflows</li>
                <li>• <strong>Custom Agent Skills:</strong> Reusable, version-controlled execution packs</li>
                <li>• <strong>Claude Managed Agents:</strong> Autonomous deep dossier compilation</li>
                <li>• <strong>Measurable ROI:</strong> 80% rep time savings; 3.4x pipeline expansion</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // Slide 8: Question 7 - Blind Spots
    {
      id: "slide-08",
      number: "08",
      questionNumber: 7,
      tag: "Question 07 · Strategic Blind Spots",
      title: "The Three Blind Spots: Segmentation, Database Mining & 50/Mailbox Scale",
      subtitle: "Unlocking dormant value already inside Loadsmart's walls and scaling volume safely",
      speakerNotes: "These three blind spots represent immediate, uncaptured enterprise value. Mining your existing Salesforce database costs zero dollars in data procurement. Segmenting by legacy TMS vendor gives reps high-converting battlecard angles. And expanding from 20 to 50 targeted accounts per mailbox unlocks the volume required to hit aggressive quarterly ARR targets.",
      content: (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 space-y-2">
              <div className="text-purple-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Blind Spot 01
              </div>
              <h4 className="font-bold text-sm text-slate-900">Granular Segmentation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                What’s working across company size? Industry? Freight category? Uncover high-margin clusters (e.g. Food & Bev temperature-controlled vs Industrial).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
              <div className="text-blue-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Blind Spot 02
              </div>
              <h4 className="font-bold text-sm text-slate-900">Mine the Internal Database</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stop solely buying cold external lists. Re-enrich and reactivate historical closed-lost deals, cold contacts, and champions who moved companies.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="text-emerald-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" /> Blind Spot 03
              </div>
              <h4 className="font-bold text-sm text-slate-900">Scale to 50 / Mailbox</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Maintain tight targeting criteria, but expand account capacity from 20 to <strong>50 emails per mailbox daily</strong> across healthy secondary domain pools.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">
              <strong>The Impact:</strong> Unlocks 2.5× outbound capacity at zero incremental list acquisition cost.
            </span>
            <span className="font-bold text-emerald-700">Sub-2% Bounce Rate Target</span>
          </div>
        </div>
      )
    },

    // Slide 9: 90-Day Execution Roadmap
    {
      id: "slide-09",
      number: "09",
      questionNumber: null,
      tag: "Execution Plan · First 90 Days",
      title: "90-Day Execution Roadmap & Revenue Impact",
      subtitle: "Phased operational delivery across all four sales pods",
      speakerNotes: "In the first 30 days we build the foundations and start AI office hours with reps. In days 31-60 we deploy signal workflows and leaderboard reporting. In days 61-90 we scale to 50 per mailbox and close the loop with revenue attribution. This is a practical, low-risk roadmap that starts generating qualified meetings in month one.",
      content: (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-blue-600 font-mono text-xs font-bold">DAYS 01–30</div>
              <h4 className="font-bold text-sm text-slate-900">Foundations & CRM Shield</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Author ICP/Persona docs per product</li>
                <li>• Deploy n8n orchestration engine</li>
                <li>• Audit internal Salesforce records</li>
                <li>• Launch weekly AE/SDR AI office hours</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-indigo-600 font-mono text-xs font-bold">DAYS 31–60</div>
              <h4 className="font-bold text-sm text-slate-900">Signals & Custom Skills</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Launch automated 10-K & web signal scout</li>
                <li>• Build personalized agent skills for reps</li>
                <li>• Deploy daily rep leaderboard reports</li>
                <li>• Reactivate closed-lost CRM accounts</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-emerald-600 font-mono text-xs font-bold">DAYS 61–90</div>
              <h4 className="font-bold text-sm text-slate-900">Scale to 50 & Attribution</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Expand sending to 50/mailbox daily</li>
                <li>• Connect closed-deal attribution loop</li>
                <li>• Publish executive implementation & ROI report</li>
                <li>• Transition system to self-sustaining COE</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-sm">Ready to Test the System Live?</div>
              <div className="text-xs text-blue-100">
                Interact with the Pod Copilot, test the 6-step slot builder, and review staged emails.
              </div>
            </div>
            {onGoToDemo ? (
              <button
                onClick={onGoToDemo}
                className="px-4 py-2 rounded-lg bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <Link
                href="/?tab=demo"
                className="px-4 py-2 rounded-lg bg-white text-blue-600 hover:bg-blue-50 font-bold text-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className={`space-y-4 max-w-5xl mx-auto ${fullscreenMode ? "p-4 sm:p-8" : ""}`}>
      {/* Deck Controls Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-mono font-bold">
            Slide {currentSlide + 1} of {totalSlides}
          </span>
          <span className="text-xs font-bold text-slate-900 hidden sm:inline">
            Loadsmart GTM Engineering Deck
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Speaker Notes Toggle */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              showNotes
                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{showNotes ? "Hide Notes" : "Speaker Notes"}</span>
          </button>

          {/* Fullscreen Route Toggle */}
          {!fullscreenMode ? (
            <Link
              href="/deck"
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
              title="Open standalone fullscreen deck"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fullscreen</span>
            </Link>
          ) : (
            <Link
              href="/?tab=presentation"
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit Fullscreen</span>
            </Link>
          )}

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous slide (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))}
              disabled={currentSlide === totalSlides - 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next slide (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xs space-y-6 min-h-[480px] flex flex-col justify-between">
        <div className="space-y-4">
          {/* Slide Header */}
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-bold">
                {current.tag}
              </span>
              <span className="text-xs font-mono text-slate-400">
                0{currentSlide + 1} / 0{totalSlides}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {current.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {current.subtitle}
            </p>
          </div>

          {/* Slide Body */}
          <div className="pt-2">
            {current.content}
          </div>
        </div>

        {/* Slide Footer Navigation */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? "w-8 bg-blue-600" : "w-2 bg-slate-200 hover:bg-slate-300"
                }`}
                title={`Go to Slide ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="hidden sm:inline">Use keyboard arrows ← → to navigate</span>
            <span>•</span>
            <button
              onClick={() => setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))}
              disabled={currentSlide === totalSlides - 1}
              className="text-blue-600 hover:underline font-bold disabled:opacity-30 disabled:no-underline flex items-center gap-1"
            >
              <span>{currentSlide === totalSlides - 1 ? "End of Deck" : "Next Slide"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Speaker Notes Drawer */}
      {showNotes && (
        <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 shadow-md space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Speaker Notes & Talking Points · Slide {currentSlide + 1}
              </span>
            </div>
            <button
              onClick={() => handleCopyNotes(current.speakerNotes)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-medium transition-colors flex items-center gap-1.5"
            >
              {copiedNotes ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedNotes ? "Copied" : "Copy Notes"}</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            {current.speakerNotes}
          </p>
        </div>
      )}
    </div>
  );
}
