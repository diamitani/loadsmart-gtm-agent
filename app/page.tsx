import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Check, KeyRound, Lock, PackageCheck, Sparkles, Upload, Truck, Warehouse, Cpu, Layers, Workflow, ShieldCheck, Download, Activity, BookOpen } from "lucide-react";
import { Logo } from "@/components/brand";
import { ButtonLink } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import Hero, { Capabilities, FeatureCards, TrustBadges } from "@/app/components/HeroSection";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Loadsmart Live GTM Sovereign Agent OS" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: "Loadsmart Live GTM Sovereign Agent OS",
    url: SITE_URL,
    title: "Loadsmart Live GTM Sovereign Agent OS",
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
};

const STEPS = [
  {
    icon: Upload,
    title: "1. Daily Signal Ingest (06:00 CT)",
    body: "Detects dated, sourced why-now triggers (freight tender rejections, warehouse expansions, incumbent TMS dissatisfaction) and nominates 20 target accounts per AE/SDR pod.",
  },
  {
    icon: PackageCheck,
    title: "2. Waterfall Persona Enrichment & Research (07:00–08:00 CT)",
    body: "Enriches verified logistics, warehousing, and transportation decision-makers via Clay waterfall. Sourced briefs separate verified facts from AI inference (W = 1.00).",
  },
  {
    icon: BadgeCheck,
    title: "3. Pod Batch Approval & Sequencer Hand-off (08:30 CT)",
    body: "AEs and SDRs inspect generated PAS touchpoints in the review drawer. Strict human approval gates ensure nothing sends or writes to Salesforce without explicit confirmation.",
  },
];

const FAQ = [
  {
    q: "What is the Loadsmart Live GTM Sovereign Agent OS?",
    a: "It is Loadsmart's internal Account-Based Selling (ABM) operating system and pod copilot, developed to standardize outbound prospecting across Opendock, ShipperGuide, Loadsmart AI, and Freight Brokerage. It connects deterministic daily workflows with Claude and Gemini agent reasoning.",
  },
  {
    q: "Which Loadsmart products are supported?",
    a: "The system is strictly partitioned across four core offerings: Opendock (dock scheduling and yard management for warehouse VPs), ShipperGuide (enterprise cloud TMS for transportation directors spending $10M–$150M+), Loadsmart AI (11 autonomous freight agents), and Freight Brokerage (FTL, LTL, multimodal capacity).",
  },
  {
    q: "How does the daily 06:00 to 17:00 schedule work?",
    a: "The daily schedule runs automatically: 06:00 Signal Ingest → 06:30 CRM Collision Audit → 07:00 RevOps Account Tagging → 07:15 Persona Enrichment → 07:45 Account Brief Research → 08:15 1-to-1 PAS Email Synthesis → 08:30 Pod Review & Sequence Enrollment → 17:00 Daily Funnel & Leak Report.",
  },
  {
    q: "How does the CRM Shield prevent collision with active deals?",
    a: "Before any account is enriched or contacted, the `la-crm-audit` skill checks Salesforce for active opportunities, customer contracts, or conflicting AE ownership. Colliding domains are automatically parked in the dashboard with a documented collision tag.",
  },
  {
    q: "Can team members bring their own AI keys (BYOK)?",
    a: "Yes. In Model Keys & BYOK, reps and operators can add their own Google Gemini, Anthropic Claude, OpenAI, or Vercel AI Gateway keys. Keys are encrypted at rest with AES-256-GCM and run unmetered.",
  },
  {
    q: "Are cold emails sent automatically?",
    a: "Never. All outbound emails, sequence enrollments, and Salesforce record updates are gated behind REQUIRE_APPROVAL=true. Every batch must receive a manual confirmation click from the pod SDR or AE in the review drawer.",
  },
  {
    q: "Where can I view the live pod dashboard and leak detection?",
    a: "The Pod Dashboard & COE view (/app/dashboard) provides real-time tracking of target accounts, stage conversion funnels, active mailboxes, domain health scores, and automated leak detection across all four pods.",
  },
];

export default function Landing() {
  return (
    <div className="overflow-x-hidden bg-paper text-ink">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b hairline bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted">
            <Link href="/app" className="hover:text-blue-600 transition-colors">Pod Copilot</Link>
            <Link href="/app/pipeline" className="hover:text-blue-600 transition-colors">Daily Pipeline</Link>
            <Link href="/app/dashboard" className="hover:text-blue-600 transition-colors">Pod Dashboard</Link>
            <Link href="/app/products" className="hover:text-blue-600 transition-colors">Products & Personas</Link>
            <Link href="/app/playbook" className="hover:text-blue-600 transition-colors">Playbook v2</Link>
            <Link href="/app/agents" className="hover:text-blue-600 transition-colors">11 Skills</Link>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ButtonLink href="/app" variant="clay" className="h-9 px-4 text-xs font-semibold shadow-xs">
              Launch Copilot <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </ButtonLink>
          </div>
        </div>
      </header>

      <main id="main">
        <Hero />
        <Capabilities />

        {/* 4 Loadsmart Pods Overview Section */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200">
              Account-Based Selling Motion
            </span>
            <h2 className="display mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              4 Dedicated Pods. 3 Core Products. Zero Buyer Cross-Contamination.
            </h2>
            <p className="mt-3 text-muted text-base">
              Each AE/SDR pod holds 20 nominated accounts daily. Outreach messaging is bounded strictly to authorized personas and verified freight claims.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 rounded-2xl border border-cyan-200 bg-white dark:bg-slate-900 shadow-xs">
              <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 w-fit">
                <Warehouse className="w-6 h-6" />
              </div>
              <span className="mt-4 block font-mono text-xs font-bold uppercase tracking-wider text-cyan-600">Pod 3</span>
              <h3 className="mt-1 text-lg font-bold text-ink">Opendock</h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Dock appointment scheduling & yard visibility for warehouse directors and 3PL distribution centers. 4,500+ network facilities.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <strong>Buyer:</strong> Director of Warehousing
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-purple-200 bg-white dark:bg-slate-900 shadow-xs">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 w-fit">
                <Layers className="w-6 h-6" />
              </div>
              <span className="mt-4 block font-mono text-xs font-bold uppercase tracking-wider text-purple-600">Pod 2</span>
              <h3 className="mt-1 text-lg font-bold text-ink">ShipperGuide TMS</h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Enterprise cloud TMS for freight procurement, waterfall tendering, and track &amp; trace. Displaces legacy MercuryGate and spreadsheets.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <strong>Buyer:</strong> VP of Transportation
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-orange-200 bg-white dark:bg-slate-900 shadow-xs">
              <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-700 w-fit">
                <Cpu className="w-6 h-6" />
              </div>
              <span className="mt-4 block font-mono text-xs font-bold uppercase tracking-wider text-orange-600">Pod 4</span>
              <h3 className="mt-1 text-lg font-bold text-ink">Loadsmart AI</h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                11 autonomous freight agents embedded in shipper systems to eliminate repetitive quoting, tracking, and carrier vetting workflows.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <strong>Buyer:</strong> Chief Supply Chain Officer
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-blue-200 bg-white dark:bg-slate-900 shadow-xs">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 w-fit">
                <Truck className="w-6 h-6" />
              </div>
              <span className="mt-4 block font-mono text-xs font-bold uppercase tracking-wider text-blue-600">Pod 1</span>
              <h3 className="mt-1 text-lg font-bold text-ink">Freight Brokerage</h3>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Contract and spot capacity across FTL, LTL, and drayage backed by 230,000+ vetted carriers and 98%+ on-time performance.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                <strong>Buyer:</strong> Logistics Operations Manager
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="border-t hairline bg-paper-2/40 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <div className="eyebrow text-blue-600 font-bold">Architecture & Operations</div>
              <h2 className="display mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Engineering precision for enterprise freight enablement.
              </h2>
              <p className="mt-3 text-muted">
                Every outbound message is validated against Loadsmart&apos;s verified claims library. Missing facts remain as explicit placeholders rather than AI hallucinations.
              </p>
            </div>
            <div className="mt-10">
              <FeatureCards />
            </div>
          </div>
        </section>

        {/* 3 Step Process */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <div className="eyebrow text-blue-600 font-bold">Daily Rhythm</div>
            <h2 className="display mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              From signal to sequenced outreach in 3 steps.
            </h2>
            <p className="mt-3 text-muted">
              Deterministic n8n orchestration automates the heavy lifting between 06:00 and 08:30 CT so pods focus on phone calls, discovery, and closing.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="card p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Live COE Dashboard Callout */}
        <section className="border-y hairline bg-slate-900 text-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                Real-Time Pod Analytics
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Inspect where the outbound program leaks with the Pod Dashboard
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Track target accounts, conversion funnels from Nominated to Meeting Booked, mailbox bounce health (&lt; 2% cap), and stuck accounts with one-click unblock actions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <ButtonLink href="/app/dashboard" variant="clay" className="h-11 px-6 text-sm font-semibold shadow-md">
                <Activity className="h-4 w-4 mr-1.5" /> Open Pod Dashboard
              </ButtonLink>
              <ButtonLink href="/app/playbook" variant="outline" className="h-11 px-6 text-sm font-semibold bg-white/10 text-white border-white/20 hover:bg-white/20">
                <BookOpen className="h-4 w-4 mr-1.5" /> Read Playbook v2
              </ButtonLink>
            </div>
          </div>
        </section>

        <TrustBadges />

        {/* FAQ Section */}
        <section className="border-t hairline bg-paper-2/50 py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="display text-center text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-center text-muted">
              Operational details for Loadsmart AE/SDR pods, RevOps, and sales leadership.
            </p>
            <div className="mt-10 divide-y hairline rounded-2xl border hairline bg-surface shadow-xs">
              {FAQ.map((f) => (
                <details key={f.q} className="group p-6 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-semibold text-ink">
                    <span>{f.q}</span>
                    <span className="text-xl text-faint transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t hairline bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-4 py-8 sm:px-6 text-xs text-muted">
          <div className="flex items-center gap-3">
            <Logo />
            <span>· Internal GTM Operating System</span>
          </div>
          <div>
            © {new Date().getFullYear()} Loadsmart Inc. All rights reserved. Built with Enably by Patrick Diamitani.
          </div>
        </div>
      </footer>
    </div>
  );
}
