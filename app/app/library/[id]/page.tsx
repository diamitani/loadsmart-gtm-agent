import Link from "next/link";
import { notFound } from "next/navigation";
import { getStore } from "@/lib/db";
import { ArtifactEditor } from "@/components/artifact-editor";
import { Badge, PageHeader, statusTone } from "@/components/ui";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ArtifactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await getStore().getArtifact(id);
  if (!a) notFound();
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <PageHeader
        eyebrow={a.group === "pop" ? "POP document" : "GTM asset"}
        title={a.title}
        description={
          <>
            v{a.version} · {a.provenance.agentId} · {a.provenance.model} · {timeAgo(a.createdAt)}
            {a.runId && (
              <>
                {" · "}
                <Link href={`/app/runs/${a.runId}`} className="text-clay underline underline-offset-2">run</Link>
              </>
            )}
          </>
        }
        actions={<Badge tone={statusTone(a.status)}>{a.status}</Badge>}
      />
      <ArtifactEditor artifact={{ id: a.id, title: a.title, markdown: a.markdown, status: a.status, kind: a.kind }} />
    </main>
  );
}
