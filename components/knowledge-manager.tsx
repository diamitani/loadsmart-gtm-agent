"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FileText, Globe, Trash2, Upload } from "lucide-react";
import { Badge, Button, Card } from "./ui";
import { timeAgo } from "@/lib/utils";

type Doc = { id: string; name: string; kind: string; chars: number; createdAt: string; preview: string; source?: string };

export function KnowledgeManager({ initial }: { initial: Doc[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"text" | "url" | "file">("text");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = async (init: RequestInit) => {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/knowledge", init);
    const json = await res.json();
    setBusy(false);
    setMsg(res.ok ? { ok: true, text: `Added ${json.created.map((c: { name: string }) => c.name).join(", ")}` } : { ok: false, text: json.error ?? "Failed" });
    if (res.ok) {
      setText(""); setName(""); setUrl("");
      router.refresh();
    }
  };
  const json = (body: object): RequestInit => ({ method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Card className="h-fit p-5">
        <div className="flex gap-1">
          {(["text", "url", "file"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-full px-3 py-1.5 text-xs ${tab === t ? "bg-ink text-paper" : "text-muted hover:bg-paper-2"}`}>
              {t === "text" ? "Paste text" : t === "url" ? "Web page" : "Upload files"}
            </button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {tab === "text" && (
            <>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Title (e.g. Pricing & packaging)" className="w-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-clay" />
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Paste company facts, customer quotes, case studies, a call transcript…" className="w-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-clay" />
              <Button disabled={busy || !text.trim()} onClick={() => submit(json({ name, text }))}>Add to knowledge</Button>
            </>
          )}
          {tab === "url" && (
            <>
              <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://yourcompany.com/about" className="w-full rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-clay" />
              <Button disabled={busy || !/^https?:\/\//.test(url)} onClick={() => submit(json({ url }))}>Fetch & add</Button>
            </>
          )}
          {tab === "file" && (
            <>
              <input ref={fileRef} type="file" multiple accept=".md,.markdown,.txt,.csv,.json,.html,.yaml,.yml" className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-paper-2 file:px-3 file:py-1.5 file:text-xs" />
              <Button disabled={busy} onClick={() => { const fd = new FormData(); [...(fileRef.current?.files ?? [])].forEach((f) => fd.append("files", f)); submit({ method: "POST", body: fd }); }}><Upload className="h-4 w-4" /> Upload</Button>
              <p className="text-[11px] text-faint">Text formats only for now (.md, .txt, .csv, .json, .html). For PDFs or Word docs, paste the text.</p>
            </>
          )}
          {msg && <p className={`text-xs ${msg.ok ? "text-evergreen" : "text-rose"}`}>{msg.text}</p>}
        </div>
      </Card>

      <div className="space-y-2">
        {initial.length === 0 && <p className="text-sm text-muted">No knowledge yet. Start with your website&apos;s About page and one customer story.</p>}
        {initial.map((d) => (
          <Card key={d.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-medium text-ink">
                  {d.kind === "url" ? <Globe className="h-3.5 w-3.5 text-sky" /> : <FileText className="h-3.5 w-3.5 text-clay" />}
                  <span className="truncate">{d.name}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{d.preview}</p>
                <div className="mt-2 flex gap-2"><Badge>{d.kind}</Badge><Badge>{(d.chars / 1000).toFixed(1)}k chars</Badge><span className="text-[10px] text-faint" suppressHydrationWarning>{timeAgo(d.createdAt)}</span></div>
              </div>
              <button onClick={async () => { await fetch(`/api/knowledge?id=${d.id}`, { method: "DELETE" }); router.refresh(); }} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-faint hover:bg-rose-soft hover:text-rose" aria-label={`Delete ${d.name}`}>
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
