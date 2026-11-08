import Link from "next/link";
import { Library } from "lucide-react";
import { getStore } from "@/lib/db";
import { Badge, Empty, PageHeader, statusTone } from "@/components/ui";
import { cn, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Library" };

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ group?: string }> }) {
  const { group } = await searchParams;
  const g = group === "pop" ? "pop" : group === "all" ? undefined : "asset";
  const items = await getStore().listArtifacts({ group: g, limit: 300 });
  const tabs = [
    { id: "asset", label: "GTM assets" },
    { id: "pop", label: "POP documents" },
    { id: "all", label: "Everything" },
  ];
  const current = group ?? "asset";
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <PageHeader eyebrow="GTM Library" title="Library" description="Every asset the Architect has built — versioned, editable, and approved by you before it goes anywhere." />
      <div className="mt-5 flex gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <Link key={t.id} href={`/app/library?group=${t.id}`} className={cn("rounded-full px-3 py-1.5 text-xs whitespace-nowrap", current === t.id ? "bg-ink text-paper" : "text-muted hover:bg-paper-2")}>{t.label}</Link>
        ))}
      </div>
      <div className="mt-5">
        {items.length === 0 ? (
          <Empty icon={<Library className="h-8 w-8" />} title="Nothing here yet">Assets appear after your first completed run.</Empty>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <Link key={a.id} href={`/app/library/${a.id}`} className="card flex flex-col p-4 transition-transform hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium text-ink">{a.title}</div>
                  <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                </div>
                <p className="mt-2 line-clamp-3 flex-1 text-xs text-muted">{a.markdown.replace(/^---[\s\S]*?---\n/, "").replace(/[#>*_`|-]/g, " ").replace(/\s+/g, " ").slice(0, 220)}</p>
                <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-faint">
                  <span>v{a.version} · {a.provenance.model}</span>
                  <span>{timeAgo(a.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
