"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { DocMarkdown } from "./markdown";

export type LibraryDoc = { id: string; group: string; title: string; path: string; content: string };

export function DocLibrary({ docs }: { docs: LibraryDoc[] }) {
  const [id, setId] = useState(docs[0]?.id);
  const [copied, setCopied] = useState(false);
  const doc = docs.find((d) => d.id === id) ?? docs[0];
  const groups = Array.from(new Set(docs.map((d) => d.group)));

  function copy() {
    navigator.clipboard.writeText(doc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-24 space-y-6 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto pr-1">
          {groups.map((g) => (
            <div key={g}>
              <p className="px-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-400">{g}</p>
              <ul className="mt-2 space-y-0.5">
                {docs
                  .filter((d) => d.group === g)
                  .map((d) => (
                    <li key={d.id}>
                      <button
                        onClick={() => setId(d.id)}
                        aria-current={d.id === doc.id ? "true" : undefined}
                        className={`w-full text-left rounded-xl px-3 py-2 text-[14px] transition-colors ${
                          d.id === doc.id ? "bg-slate-900 text-white font-medium" : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {d.title}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      <article className="lg:col-span-8 rounded-3xl border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 sm:px-8 py-4">
          <div>
            <p className="text-[16px] font-semibold text-slate-900">{doc.title}</p>
            <p className="font-mono text-[12px] text-slate-400">{doc.path}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copy} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50">
              {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <a
              href={`data:text/markdown;charset=utf-8,${encodeURIComponent(doc.content)}`}
              download={doc.path.split("/").pop()}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
            >
              <Download className="size-3.5" /> .md
            </a>
          </div>
        </div>
        <div className="px-6 sm:px-10 py-8">
          <DocMarkdown source={doc.content} />
        </div>
      </article>
    </div>
  );
}

