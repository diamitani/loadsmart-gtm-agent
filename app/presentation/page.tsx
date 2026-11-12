import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { kit } from "@/lib/kit";
import { Deck } from "@/components/deck";
import { DocLibrary, type LibraryDoc } from "@/components/doc-library";
import { icpRows, personas } from "@/lib/playbook-data";

export const metadata = { title: "Presentation · Loadsmart GTM Engineering" };

function buildDocs(): LibraryDoc[] {
  const byFile = (f: string) => kit.documents.find((d) => d.file === f);
  const out: LibraryDoc[] = [];

  const deck = byFile("LOADSMART_GTM_CASE_STUDY_DECK.md");
  if (deck) out.push({ id: deck.file, group: "The answers", title: "Case answers (deck text)", path: `docs/${deck.file}`, content: deck.content });

  out.push({ id: "playbook", group: "Playbook", title: "ABM Sales Playbook", path: "content/playbook.md", content: kit.playbook });

  const build: [string, string][] = [
    ["PRD.md", "Product requirements"],
    ["ARCHITECTURE.md", "Architecture"],
    ["SETUP_GUIDE.md", "Setup guide"],
    ["REVIEW.md", "Review"],
  ];
  for (const [f, title] of build) {
    const d = byFile(f);
    if (d) out.push({ id: f, group: "Build", title, path: `docs/${f}`, content: d.content });
  }

  for (const d of kit.documents.filter((x) => /^\d{2}-/.test(x.file))) {
    out.push({ id: d.file, group: "Full specification", title: `${d.file.slice(0, 2)} · ${d.title}`, path: `docs/${d.file}`, content: d.content });
  }
  return out;
}

export default function PresentationPage() {
  const docs = buildDocs();
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      <section className="pt-14 sm:pt-16 pb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">Presentation</p>
          <h1 className="mt-3 max-w-3xl text-[36px] sm:text-[52px] font-bold leading-[1.05] tracking-[-0.035em] text-slate-900 text-balance">
            Case answers &amp; ABM playbook, as a deck.
          </h1>
          <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-slate-600">
            Use arrow keys to advance slides, press Present for fullscreen, or open the dedicated Playbook view for full ICP and persona tables.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/playbook"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <span>Open Full ABM Playbook</span>
            <ArrowRight className="size-4" />
          </Link>
          <a
            href="/loadsmart-abm-os.zip"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[13.5px] font-semibold text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Download className="size-4" />
            <span>Kit (.zip)</span>
          </a>
        </div>
      </section>

      <Deck />

      {/* ABM Playbook Core Reference Tables Inline */}
      <section className="pt-20 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">
              ABM Playbook Core Tables
            </p>
            <h2 className="mt-2 text-[28px] sm:text-[36px] font-bold tracking-[-0.03em] text-slate-900">
              Target ICP &amp; 3-Product Buyer Persona Matrix
            </h2>
            <p className="mt-2 max-w-2xl text-[15.5px] text-slate-600">
              One shared account ICP paired with isolated buyer personas for Opendock, ShipperGuide TMS, and Loadsmart AI.
            </p>
          </div>
          <Link
            href="/playbook"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <span>Open 10-Slide Playbook Deck &amp; Scripts</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4 w-44">Persona Attribute</th>
                {personas.map((p) => (
                  <th key={p.personaId} className="py-3 px-4 min-w-[220px]">
                    <span className="text-[14px] font-bold text-slate-950">{p.product}</span>
                    <span className="block font-normal text-[11.5px] text-slate-500">{p.scope}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {[
                { label: "Target Titles", key: "titles" as const },
                { label: "Decision Role", key: "decisionRole" as const },
                { label: "Goals & KPIs", key: "goals" as const },
                { label: "Assumed Pains", key: "painAssumed" as const },
                { label: "Buying Triggers", key: "triggers" as const },
                { label: "Likely Objections", key: "objections" as const },
                { label: "Primary Channels", key: "channels" as const },
              ].map((row) => (
                <tr key={row.key} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap align-top">
                    {row.label}
                  </td>
                  {personas.map((p) => (
                    <td key={p.personaId} className="py-3 px-4 align-top leading-relaxed">
                      {p[row.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-3 px-4 w-36">Account ICP Field</th>
                <th className="py-3 px-4">Target Definition (Draft v0)</th>
                <th className="py-3 px-4">Validation Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {icpRows.map((row) => (
                <tr key={row.field} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-4 font-semibold text-slate-900 whitespace-nowrap">{row.field}</td>
                  <td className="py-2.5 px-4">{row.definition}</td>
                  <td className="py-2.5 px-4 text-slate-500">{row.validationSource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="documents" className="scroll-mt-20 pt-20 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">Documents</p>
            <h2 className="mt-3 text-[30px] sm:text-[38px] font-bold tracking-[-0.03em] text-slate-900">Everything behind it.</h2>
            <p className="mt-2 text-[16px] text-slate-600">Read any specification here, or download the entire kit.</p>
          </div>
          <a
            href="/loadsmart-abm-os.zip"
            download
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-slate-800 whitespace-nowrap"
          >
            <Download className="size-4" /> Download the kit (.zip)
          </a>
        </div>
        <DocLibrary docs={docs} />
      </section>
    </div>
  );
}
