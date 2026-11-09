"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Copy, Download, Pencil, X } from "lucide-react";
import { Markdown } from "./markdown";
import { Button } from "./ui";

export function ArtifactEditor({ artifact }: { artifact: { id: string; title: string; markdown: string; status: string; kind: string } }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(artifact.markdown);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const patch = async (body: Record<string, unknown>) => {
    setSaving(true);
    await fetch(`/api/artifacts/${artifact.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false);
    router.refresh();
  };
  const download = () => {
    const blob = new Blob([text], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${artifact.title.replace(/[^\w.-]+/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {editing ? (
          <>
            <Button size="sm" disabled={saving} onClick={async () => { await patch({ markdown: text }); setEditing(false); }}><Check className="h-3.5 w-3.5" /> Save new version</Button>
            <Button size="sm" variant="ghost" onClick={() => { setText(artifact.markdown); setEditing(false); }}><X className="h-3.5 w-3.5" /> Cancel</Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
            {artifact.status !== "approved" ? (
              <Button size="sm" variant="clay" disabled={saving} onClick={() => patch({ status: "approved" })}><Check className="h-3.5 w-3.5" /> Approve</Button>
            ) : (
              <Button size="sm" variant="ghost" disabled={saving} onClick={() => patch({ status: "draft" })}>Move back to draft</Button>
            )}
            <Button size="sm" variant="ghost" onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}><Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}</Button>
            <Button size="sm" variant="ghost" onClick={download}><Download className="h-3.5 w-3.5" /> .md</Button>
          </>
        )}
      </div>
      {editing ? (
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="card min-h-[60vh] w-full p-4 font-mono text-[13px] text-ink outline-none" aria-label="Edit markdown" />
      ) : (
        <article className="card p-5 sm:p-8">
          <Markdown>{artifact.markdown.replace(/^---[\s\S]*?---\n/, "")}</Markdown>
        </article>
      )}
    </div>
  );
}
