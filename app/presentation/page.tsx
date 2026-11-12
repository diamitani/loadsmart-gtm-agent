import { kit } from "@/lib/kit";
import { Deck } from "@/components/deck";
import { DocLibrary, type LibraryDoc } from "@/components/doc-library";
import { Download } from "lucide-react";

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
      <section className="pt-16 sm:pt-20 pb-10">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">Presentation</p>
        <h1 className="mt-4 max-w-3xl text-[36px] sm:text-[52px] font-bold leading-[1.05] tracking-[-0.035em] text-slate-900">
          The answers, as a deck.
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-slate-600">
          Use the arrow keys to move through it, or press Present for full screen.
        </p>
      </section>

      <Deck />

      <section id="documents" className="scroll-mt-20 pt-24 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">Documents</p>
            <h2 className="mt-3 text-[30px] sm:text-[38px] font-bold tracking-[-0.03em] text-slate-900">Everything behind it.</h2>
            <p className="mt-2 text-[16px] text-slate-600">Read any document here, or take the whole kit with you.</p>
          </div>
          <a
            href="/loadsmart-abm-os.zip"
            download
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-slate-800"
          >
            <Download className="size-4" /> Download the kit (.zip)
          </a>
        </div>
        <DocLibrary docs={docs} />
      </section>
    </div>
  );
}
