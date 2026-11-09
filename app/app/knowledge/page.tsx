import { getStore } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { KnowledgeManager } from "@/components/knowledge-manager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Knowledge" };

export default async function KnowledgePage() {
  const docs = (await getStore().listKnowledge()).map(({ text, ...d }) => ({ ...d, preview: text.slice(0, 220) }));
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <PageHeader eyebrow="RAG-DAL" title="Knowledge" description="Company docs, notes, call transcripts and web pages. The Architect retrieves from here before writing — and the truth guard treats anything here as grounded." />
      <KnowledgeManager initial={docs} />
    </main>
  );
}
