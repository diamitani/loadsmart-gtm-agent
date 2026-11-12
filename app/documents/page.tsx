import type { Metadata } from "next";
import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";
import { DocumentsView } from "@/components/documents-view";

export const metadata: Metadata = {
  title: "Documents & Specifications · Loadsmart GTM Engineering",
  description:
    "Complete library of Loadsmart GTM specifications, Sales Playbook v2, agent skills, n8n workflows, setup prompts, configs, and audited claims ledger.",
};

export default function DocumentsPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 space-y-8">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-blue-600">
            Documentation Library
          </p>
          <h1 className="mt-2 text-[32px] sm:text-[44px] font-bold tracking-[-0.03em] text-slate-900 leading-[1.08] text-balance">
            Every specification, playbook, skill, and schema behind the system.
          </h1>
          <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-slate-600">
            Search across all architecture specs, AE/SDR playbooks, portable skills, n8n workflows, and verified claims in one reader.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/presentation"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <span>Open Deck</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <a
            href="/loadsmart-abm-os.zip"
            download
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <Download className="size-4" />
            <span>Download Full Kit (.zip)</span>
          </a>
        </div>
      </section>

      <DocumentsView />
    </div>
  );
}
