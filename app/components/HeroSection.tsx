import type { ReactNode } from "react";
import { ArrowRight, CircleCheck, FileStack, Gauge, Layers, MailCheck, ShieldCheck, Sparkles, Workflow, Warehouse, Cpu, Truck, Clock } from "lucide-react";
import { PipelineTracker, Waves, WGauge } from "@/components/pipeline";
import { ButtonLink } from "@/components/ui";
import type { StageEvent } from "@/lib/pal/types";

/** Illustrative Loadsmart run shown in the hero. */
const DEMO_STAGES: StageEvent[] = [
  { stage: "intake", status: "done", summary: "06:00 [la-signal]: 20 candidate accounts nominated across 4 pods" },
  { stage: "intent", status: "done", summary: "06:30 [la-crm-audit]: Salesforce shield cleared 18 accounts; 2 parked as active AE deals" },
  { stage: "foundation", status: "done", summary: "07:00 [la-abm-tag]: RevOps allocation verified for Opendock & ShipperGuide" },
  { stage: "instruct", status: "done", summary: "07:15 [la-persona-enrich]: Clay waterfall verified 18 freight VP & Director contacts" },
  { stage: "plan", status: "done", summary: "07:45 [la-research]: Sourced briefs compiled; incumbent TMS identified" },
  { stage: "build", status: "running", summary: "08:15 [la-email]: 1-to-1 PAS copy synthesized with 100% claims compliance" },
];

export default function Hero() {
  return (
    <section className="relative isolate" aria-labelledby="hero-title">
      <div className="hero-glow pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div className="grain pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" aria-hidden />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-24">
        <div className="rise">
          <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-blue-700 dark:text-blue-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Loadsmart Live GTM Sovereign Agent OS
          </p>
          <h1 id="hero-title" className="display mt-6 text-[2.5rem] leading-[1.05] text-ink sm:text-6xl lg:text-[3.9rem]">
            The revenue engine Loadsmart pods run on, <em className="text-gradient">architected for sovereign AI.</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Internal Account-Based Selling (ABM) operating system for Loadsmart AE/SDR pods across <strong>Opendock</strong>, <strong>ShipperGuide</strong>, <strong>Loadsmart AI</strong>, and <strong>Freight Services</strong>. Executes a deterministic 06:00 to 17:00 signal-to-sequence pipeline, enforces CRM collision shields, verifies claims against the approved library, and requires human approvals before anything sends.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/app" variant="clay" className="h-12 px-6 text-base shadow-soft">
              Open Pod Copilot <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/app/pipeline" variant="outline" className="h-12 px-6 text-base">
              Daily Pipeline
            </ButtonLink>
            <ButtonLink href="/app/dashboard" variant="outline" className="h-12 px-6 text-base">
              Pod Dashboard & COE
            </ButtonLink>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted" aria-label="Highlights">
            {[
              "4 Dedicated Pods (Opendock, ShipperGuide, AI, Freight)",
              "11 Specialist ABM Skills (Signal to Sequence)",
              "Zero auto-sends without human approval",
              "100% Verified Claims Library",
            ].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <CircleCheck className="h-4 w-4 text-evergreen" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Product glimpse */}
        <div className="rise relative space-y-4 [animation-delay:120ms]" aria-label="Example of a Loadsmart GTM build in progress" role="img">
          <div className="card p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">
                    Pod 2 · Enterprise ShipperGuide TMS
                  </span>
                  <span className="text-[11px] text-muted">Run #8429</span>
                </div>
                <h3 className="mt-1 font-semibold text-ink text-base">Daily Signal-to-Sequence Batch (20 Accounts)</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5" /> CRM Shield Active
                </span>
              </div>
            </div>

            <div className="mt-5">
              <PipelineTracker stages={DEMO_STAGES} />
            </div>
          </div>
          <div className="card relative ml-auto w-full p-4 sm:w-80 lg:-ml-10 lg:mr-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="eyebrow mb-2">ABM Wave Plan · 4 Waves</div>
            <Waves waves={[["la-signal", "la-crm-audit"], ["la-abm-tag", "la-persona-enrich"], ["la-research", "la-email"], ["la-sequence", "la-daily-report"]]} />
          </div>
        </div>
      </div>
    </section>
  );
}

/** What it does, as capabilities. */
export function Capabilities() {
  const items = [
    { k: "4 Dedicated Pods", v: "Opendock, ShipperGuide TMS, Loadsmart AI Agents, and Multimodal Freight Brokerage" },
    { k: "11 ABM Skills", v: "Signal ingest, CRM audit, account tagging, Clay waterfall enrichment, research, and PAS email" },
    { k: "0 Blind Sends", v: "Strict human approval gates: REQUIRE_APPROVAL=true before any email sends or CRM writes" },
    { k: "100% Verified Claims", v: "Zero hallucinated claims; bounded strictly to Loadsmart's approved claims library" },
  ];
  return (
    <section aria-label="Capabilities" className="border-y hairline bg-paper-2/70">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4">
        {items.map((i) => (
          <div key={i.k} className="px-2 py-8 sm:px-4">
            <dt className="text-2xl font-bold tracking-tight text-blue-600 sm:text-3xl">{i.k}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-muted">{i.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** Tools it connects to (integrations). */
export function TrustBadges() {
  const tools = ["Salesforce CRM", "Gong Engage", "Apollo.io", "Clay", "n8n", "MercuryGate", "Oracle OTM", "SAP Logistics", "Google Gemini", "Claude 3.7", "OpenAI o3"];
  return (
    <section aria-labelledby="stack-title" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 id="stack-title" className="eyebrow text-center">Connected with Loadsmart&apos;s GTM Enterprise Stack</h2>
      <ul className="mt-5 flex flex-wrap justify-center gap-2.5">
        {tools.map((t) => (
          <li key={t} className="rounded-full border hairline bg-surface px-4 py-1.5 text-sm font-medium text-ink-2">
            {t}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-center text-xs text-faint">Secure Salesforce fields, n8n orchestrator nodes, secondary domain mailboxes, and BYOK AI gateways.</p>
    </section>
  );
}

const FEATURES: { icon: ReactNode; tag: string; title: string; description: string; tone: string }[] = [
  {
    icon: <Warehouse className="h-5 w-5" aria-hidden />,
    tag: "Opendock",
    title: "Facility & Yard Network (4,500+ Warehouses)",
    description: "Eliminates dock congestion, gate queues, detention charges, and manual appointment scheduling for warehouse directors and 3PLs.",
    tone: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400",
  },
  {
    icon: <Layers className="h-5 w-5" aria-hidden />,
    tag: "ShipperGuide",
    title: "Enterprise Cloud TMS for Freight Shippers",
    description: "Unified freight planning, automated routing guides, spot market auctions, and real-time tracking for logistics leaders spending $10M–$150M+.",
    tone: "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400",
  },
  {
    icon: <Cpu className="h-5 w-5" aria-hidden />,
    tag: "Loadsmart AI",
    title: "11 Autonomous Logistics AI Agents",
    description: "Embedded agents quote spot loads, track shipments, and vet carriers inside existing TMS/ERP systems, backed by human Freight Experts.",
    tone: "bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400",
  },
  {
    icon: <Clock className="h-5 w-5" aria-hidden />,
    tag: "Daily Rhythm",
    title: "Deterministic 06:00 to 17:00 Pipeline",
    description: "Daily scheduled steps: 06:00 Signals → 07:00 Enrich → 07:30 Research → 08:00 Email → 08:30 Sequence → 17:00 Daily Report & Funnel Audit.",
    tone: "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" aria-hidden />,
    tag: "CRM Shield",
    title: "Salesforce Collision & Exclusion Filter",
    description: "Pre-outbound checks verify account status in Salesforce to prevent contacting active opportunities, existing customers, or parked accounts.",
    tone: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: <Truck className="h-5 w-5" aria-hidden />,
    tag: "Freight Brokerage",
    title: "230,000+ Vetted Carriers & Multimodal Capacity",
    description: "Dedicated contract capacity and spot coverage across Dry Van, Refrigerated, Flatbed, LTL, and Intermodal with 98%+ on-time performance.",
    tone: "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400",
  },
];

/** Feature cards */
export function FeatureCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((f) => (
        <Card key={f.title} {...f} />
      ))}
    </div>
  );
}

function Card({ icon, tag, title, description, tone }: { icon: ReactNode; tag: string; title: string; description: string; tone: string }) {
  return (
    <article className="card group p-6 transition-transform duration-200 hover:-translate-y-1 motion-reduce:transform-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>{icon}</div>
      <p className="mt-5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-faint">{tag}</p>
      <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </article>
  );
}
