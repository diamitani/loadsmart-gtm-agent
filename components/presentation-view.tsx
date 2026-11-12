"use client";

import { useState } from "react";
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
  Play
} from "lucide-react";

interface PresentationViewProps {
  onGoToDemo?: () => void;
}

export function PresentationView({ onGoToDemo }: PresentationViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: "slide-01",
      tag: "Executive Vision · 2026",
      title: "Loadsmart Sovereign GTM AI Center of Excellence",
      subtitle: "Autonomous AE/SDR Pod Intelligence, Deterministic Daily Pipeline Orchestration & 100% Truth-Guarded Outbound",
      content: (
        <div className="space-y-6">
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            A purpose-built go-to-market operating system designed specifically for Loadsmart's commercial model. Integrating the <strong>Enably GTM Architect</strong> and <strong>Prospect Automation Engine</strong> across all four sales pods to deliver automated account nomination, waterfall contact reveals, and 1-to-1 cold outbound copy with zero hallucination.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Pod 1
              </div>
              <div className="font-bold text-sm text-slate-900">Mid-Market FTL</div>
              <div className="text-[11px] text-slate-500">Multimodal spot capacity</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Pod 2
              </div>
              <div className="font-bold text-sm text-slate-900">ShipperGuide TMS</div>
              <div className="text-[11px] text-slate-500">$25K–$120K SaaS ARR</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                <Warehouse className="w-3.5 h-3.5" /> Pod 3
              </div>
              <div className="font-bold text-sm text-slate-900">Opendock Network</div>
              <div className="text-[11px] text-slate-500">4,500+ facility scheduling</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Pod 4
              </div>
              <div className="font-bold text-sm text-slate-900">Loadsmart AI</div>
              <div className="text-[11px] text-slate-500">11 autonomous quoting agents</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span className="font-semibold text-slate-700">Authored by Patrick Diamitani</span>
            <span>·</span>
            <span>Enably / SalesGency & Loadsmart GTM Architecture</span>
            <span>·</span>
            <span>November 2026</span>
          </div>
        </div>
      )
    },
    {
      id: "slide-02",
      tag: "The Market Problem",
      title: "Why Enterprise Logistics Outbound Breaks Down",
      subtitle: "Legacy sales methods cannot keep pace with modern freight volatility and ERP complexity.",
      content: (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-rose-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>01 · Legacy TMS Implementation Bloat</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900">12–18 Month Timelines & $500K Consulting</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enterprise suites (Oracle OTM, Manhattan) require massive multi-year deployments. Shippers with $10M–$200M freight spend need agile spot rate procurement in weeks, not years.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-rose-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>02 · Spot Quote Turnaround Latency</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900">4-Hour Quoting Bottlenecks</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Planners manually email brokers across disparate portals. By the time bids return, dispatch windows have passed and rates have fluctuated, bleeding operational margin.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-rose-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>03 · Facility & Yard Congestion</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900">$75/Hour Carrier Detention Penalties</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Warehouses relying on phone tag and clipboards suffer unannounced carrier logjams, dock door congestion, and heavy driver detention fines.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-rose-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>04 · Sales Rep Prospecting Burnout</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900">80% Time Lost to Manual Research</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              AEs and SDRs spend their best hours manually cross-referencing ZoomInfo, Salesforce, and Apollo. Inconsistent messaging leads to zero reply rates.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "slide-03",
      tag: "5-Pillar Solution Architecture",
      title: "The Prospect Automation Engine",
      subtitle: "An autonomous, closed-loop outbound machine that generates pipeline on behalf of your reps.",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-mono text-[10px] text-blue-600 font-semibold uppercase">Pillar 1</div>
              <div className="font-bold text-slate-900 text-sm">Signal Ingest</div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Nominates 20 high-fit accounts/pod/day based on DC expansions and spot procurement signals.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-mono text-[10px] text-indigo-600 font-semibold uppercase">Pillar 2</div>
              <div className="font-bold text-slate-900 text-sm">CRM Shield</div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Real-time Salesforce collision audit. Automatically parks active opportunities.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-mono text-[10px] text-emerald-600 font-semibold uppercase">Pillar 3</div>
              <div className="font-bold text-slate-900 text-sm">Clay Waterfall</div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Discovers verified freight leaders with W = 1.00 foundation wholeness.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-mono text-[10px] text-purple-600 font-semibold uppercase">Pillar 4</div>
              <div className="font-bold text-slate-900 text-sm">AI PAS Copy</div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Synthesizes 1-to-1 emails verified against Loadsmart's official Claims Library.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-mono text-[10px] text-amber-600 font-semibold uppercase">Pillar 5</div>
              <div className="font-bold text-slate-900 text-sm">Rep Signoff</div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Staged review drawer. Nothing is sent without human authorization.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span><strong>Invariant:</strong> Zero dry-run sends occur without human batch signature.</span>
            </div>
            <span className="font-mono text-[11px] text-blue-700 font-semibold">W = 1.00 Enforced</span>
          </div>
        </div>
      )
    },
    {
      id: "slide-04",
      tag: "Governance & Accuracy",
      title: "Calibrated Truth Guard (W = 1.00)",
      subtitle: "Zero hallucination guarantee backed by Loadsmart's official Claims Library.",
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            AI copywriters frequently hallucinate client logos and fake ROI numbers. The Loadsmart GTM OS implements a strict <strong>Calibrated Truth Guard</strong> that cross-checks every drafted sentence against official, verified metrics before reps ever see it.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 font-medium">Vetted Carrier Network</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">230,000+ Carriers</div>
              <div className="text-[11px] text-emerald-600 font-medium">Multimodal capacity verified</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 font-medium">Warehouse Network</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">4,500+ Facilities</div>
              <div className="text-[11px] text-emerald-600 font-medium">Active on Opendock</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 font-medium">Annual Appointments</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">14 Million+ Docks</div>
              <div className="text-[11px] text-emerald-600 font-medium">Scheduled via cloud calendar</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 font-medium">Enterprise Shippers</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">1,800+ Shippers</div>
              <div className="text-[11px] text-emerald-600 font-medium">Global customer base</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 font-medium">Autonomous Agents</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">11 AI Agents</div>
              <div className="text-[11px] text-emerald-600 font-medium">Backed by human freight experts</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-slate-500 font-medium">Enterprise Security</div>
              <div className="text-xl font-bold text-slate-900 mt-0.5">SOC 2 Type II</div>
              <div className="text-[11px] text-emerald-600 font-medium">Certified cloud compliance</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide-05",
      tag: "Deterministic Execution",
      title: "Daily Chronological Rhythm",
      subtitle: "From 06:00 Signal Scout to 17:00 Daily Leak Digest.",
      content: (
        <div className="space-y-4">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-mono text-blue-600 font-bold w-16">06:00 CT</span>
              <span className="font-semibold text-slate-900 w-36">[la-signal]</span>
              <span className="text-slate-600">Nominates 20 target accounts per pod from lane data & facility expansions.</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-mono text-indigo-600 font-bold w-16">06:30 CT</span>
              <span className="font-semibold text-slate-900 w-36">[la-crm-audit]</span>
              <span className="text-slate-600">CRM Shield evaluates 80 candidate domains. Filters active Salesforce deals.</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-mono text-emerald-600 font-bold w-16">07:15 CT</span>
              <span className="font-semibold text-slate-900 w-36">[la-persona-enrich]</span>
              <span className="text-slate-600">Clay waterfall identifies verified VP Logistics and Plant Managers.</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-mono text-purple-600 font-bold w-16">08:15 CT</span>
              <span className="font-semibold text-slate-900 w-36">[la-email]</span>
              <span className="text-slate-600">1-to-1 PAS copy synthesized with 100% claims library verification.</span>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="font-mono text-amber-600 font-bold w-16">08:30 CT</span>
              <span className="font-semibold text-slate-900 w-36">[la-sequence]</span>
              <span className="text-slate-600">Awaiting AE/SDR batch signature in review drawer before sequence sync.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide-06",
      tag: "Commercial ROI",
      title: "Performance Metrics & Pipeline Creation",
      subtitle: "Measurable commercial impact across all four Loadsmart AE & SDR pods.",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Daily Outbound Run</div>
              <div className="text-3xl font-black text-slate-900 mt-1">80</div>
              <div className="text-xs text-slate-500 mt-0.5">20 accounts / pod</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Funnel Progression</div>
              <div className="text-3xl font-black text-indigo-600 mt-1">71.2%</div>
              <div className="text-xs text-slate-500 mt-0.5">Scored to staged rate</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Mailbox Deliverability</div>
              <div className="text-3xl font-black text-emerald-600 mt-1">98.7%</div>
              <div className="text-xs text-emerald-700 mt-0.5">&lt; 0.85% bounce rate</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Pipeline Generated</div>
              <div className="text-3xl font-black text-blue-600 mt-1">$1.43M</div>
              <div className="text-xs text-slate-500 mt-0.5">14 qualified meetings</div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Ready to test the live copilot and review drawer?</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Interact with the AI copilot, inspect staged emails, and test the 6-step slot builder in the Demo tab.
              </p>
            </div>
            {onGoToDemo && (
              <button
                onClick={onGoToDemo}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap self-start sm:self-auto"
              >
                <span>Launch Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )
    }
  ];

  function handlePrev() {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  }

  function handleNext() {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Slide Navigation Header Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Executive Presentation
          </span>
          <span className="text-xs font-mono text-slate-400">
            Slide 0{currentSlide + 1} / 0{slides.length}
          </span>
        </div>

        {/* Step dots */}
        <div className="hidden sm:flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? "w-6 bg-blue-600" : "w-2 bg-slate-200 hover:bg-slate-300"
              }`}
              title={`Jump to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next / Prev Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            title="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            title="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6 min-h-[460px] flex flex-col justify-between">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            {slides[currentSlide].tag}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {slides[currentSlide].title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            {slides[currentSlide].subtitle}
          </p>

          <div className="pt-4">
            {slides[currentSlide].content}
          </div>
        </div>

        {/* Slide Footer */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px]">←</kbd> and <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px]">→</kbd> to navigate slides
          </div>
          <button
            onClick={handleNext}
            className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Next slide</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
