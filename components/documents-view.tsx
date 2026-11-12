"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { kit } from "@/lib/kit";
import { DocMarkdown } from "@/components/markdown";
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  BookOpen, 
  Cpu, 
  Workflow, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Layers,
  Code,
  Database,
  Search,
  FileCode,
  Terminal,
  Settings,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Eye,
  FileSpreadsheet
} from "lucide-react";

type AssetCategory = 
  | "empire" 
  | "guides" 
  | "playbook" 
  | "skills" 
  | "automations" 
  | "configs" 
  | "claims" 
  | "sessions";

export type AssetItem = {
  id: string;
  category: AssetCategory;
  badge: string;
  title: string;
  file: string;
  owner?: string;
  desc: string;
  content: string;
  format: "markdown" | "code" | "csv" | "json" | "yaml" | "sql";
};

export function DocumentsView() {
  const [activeCategory, setActiveCategory] = useState<AssetCategory>("empire");
  const [selectedId, setSelectedId] = useState<string>("01-intent-spec.md");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"rendered" | "raw">("rendered");

  // Compile all assets into a unified searchable index
  const allAssets: AssetItem[] = useMemo(() => {
    const list: AssetItem[] = [];

    // 1. Site Empire OS (25 docs)
    const empireDocs = (kit.documents || []).filter((d) => /^[0-2][0-9]-/.test(d.file));
    for (const d of empireDocs) {
      const matchNum = d.file.match(/^([0-9]{2})/);
      const num = matchNum ? matchNum[1] : "Doc";
      list.push({
        id: d.file,
        category: "empire",
        badge: `Doc ${num}`,
        title: d.title || d.file.replace(/\.md$/, ""),
        file: `docs/${d.file}`,
        owner: ["01", "02", "03", "08", "16", "19"].includes(num) ? "Product" : ["04", "05", "06", "07", "14"].includes(num) ? "Design" : ["09", "10", "11", "12", "13", "15", "20"].includes(num) ? "Eng" : ["17"].includes(num) ? "Security" : ["18", "22"].includes(num) ? "Ops" : ["21"].includes(num) ? "QA" : ["23"].includes(num) ? "Legal" : ["24"].includes(num) ? "Agent" : "Research",
        desc: `Site Empire OS Standard Specification Doc ${num} for Loadsmart GTM Agent`,
        content: d.content,
        format: "markdown",
      });
    }

    // 2. Core Architecture, PRD & Presentation Deck
    const guideDocs = (kit.documents || []).filter((d) => 
      ["LOADSMART_GTM_CASE_STUDY_DECK.md", "PRD.md", "ARCHITECTURE.md", "SETUP_GUIDE.md", "REVIEW.md", "BUILD_LOG.md"].includes(d.file)
    );
    for (const d of guideDocs) {
      list.push({
        id: d.file,
        category: "guides",
        badge: d.file.includes("DECK") ? "DECK" : "Guide",
        title: d.title || d.file.replace(/\.md$/, ""),
        file: `docs/${d.file}`,
        owner: d.file.includes("DECK") ? "Strategy" : d.file === "PRD.md" ? "Product" : d.file === "ARCHITECTURE.md" ? "Eng" : d.file === "SETUP_GUIDE.md" ? "DevOps" : "QA/Ops",
        desc: d.file.includes("DECK") ? "The 7-Pillar GTM Engineering Presentation Deck & Speaker Notes" : "Comprehensive system guide and production architecture specification",
        content: d.content,
        format: "markdown",
      });
    }

    // 3. Playbook v2 (12 sections)
    for (let i = 0; i < (kit.sections || []).length; i++) {
      const s = kit.sections[i];
      list.push({
        id: `playbook-${s.slug}`,
        category: "playbook",
        badge: `Section ${String(i + 1).padStart(2, "0")}`,
        title: s.title,
        file: `content/playbook.md#${s.slug}`,
        owner: "GTM Enablement",
        desc: `Official Loadsmart AE/SDR Sales Playbook & Battlecard Section`,
        content: `## ${s.title}\n\n${s.body}`,
        format: "markdown",
      });
    }

    // 4. Skills Pack (11 skills)
    for (const s of kit.skills || []) {
      list.push({
        id: `skill-${s.slug}`,
        category: "skills",
        badge: `Step ${s.order}`,
        title: s.name,
        file: `kit/skills/${s.slug}/SKILL.md`,
        owner: "Agent Harness",
        desc: s.description || "Autonomous pod execution skill",
        content: s.body,
        format: "markdown",
      });
    }

    // 5. Automations (6 n8n, clay, salesforce files)
    for (const a of kit.automations || []) {
      const isJson = a.file.endsWith(".json");
      const isSql = a.file.endsWith(".sql");
      list.push({
        id: `auto-${a.file}`,
        category: "automations",
        badge: a.type.toUpperCase(),
        title: a.file.split("/").pop() || a.file,
        file: `automations/${a.file}`,
        owner: "RevOps & Data",
        desc: `${a.type.toUpperCase()} execution workflow and data transformation schema`,
        content: a.content,
        format: isJson ? "json" : isSql ? "sql" : "code",
      });
    }

    // 6. Configs & Prompts (8 files)
    for (const c of kit.configFiles || []) {
      const isYaml = c.file.endsWith(".yaml") || c.file.endsWith(".yml");
      list.push({
        id: `config-${c.file}`,
        category: "configs",
        badge: isYaml ? "YAML" : "CONFIG",
        title: c.file,
        file: `kit/config/${c.file}`,
        owner: "RevOps Engine",
        desc: `Pod cadence, routing, ICP, and sending quota configuration`,
        content: c.content,
        format: isYaml ? "yaml" : "markdown",
      });
    }
    if (kit.agentPrompt) {
      list.push({
        id: "pod-copilot-system-prompt.md",
        category: "configs",
        badge: "SYSTEM",
        title: "Pod Copilot System Prompt",
        file: "kit/agent/pod-copilot-system-prompt.md",
        owner: "Agent Harness",
        desc: "Core system instructions and truth guard persona for Pod Copilot",
        content: kit.agentPrompt,
        format: "markdown",
      });
    }
    if (kit.claudeDoc) {
      list.push({
        id: "CLAUDE.md",
        category: "configs",
        badge: "AGENT",
        title: "CLAUDE.md Runtime Rules",
        file: "kit/agent/CLAUDE.md",
        owner: "Agent Harness",
        desc: "Agent operating guidelines, coding standards, and execution constraints",
        content: kit.claudeDoc,
        format: "markdown",
      });
    }

    // 7. Claims & Templates (3 assets)
    if (kit.claimsLibrary) {
      list.push({
        id: "claims-library.md",
        category: "claims",
        badge: "CLAIMS",
        title: "Verified Claims Library",
        file: "knowledge/claims-library.md",
        owner: "Truth Guard W=1.00",
        desc: "Audited customer metrics (1,800+ Shippers, 4,500+ Docks, 230k+ Carriers, 14M Appointments)",
        content: kit.claimsLibrary,
        format: "markdown",
      });
    }
    for (const t of kit.templates || []) {
      list.push({
        id: `template-${t.file}`,
        category: "claims",
        badge: "CSV",
        title: t.file,
        file: `kit/templates/${t.file}`,
        owner: "RevOps",
        desc: `CSV schema template for disqualification codes and bulk dashboard imports`,
        content: t.content,
        format: "csv",
      });
    }

    // 8. Sessions & Logs (3 docs)
    const sessionDocs = (kit.documents || []).filter((d) => d.file.startsWith("sessions/"));
    for (const s of sessionDocs) {
      list.push({
        id: s.file,
        category: "sessions",
        badge: "LOG",
        title: s.title || s.file.replace(/^sessions\//, "").replace(/\.md$/, ""),
        file: `docs/${s.file}`,
        owner: "Engineering",
        desc: `Session trajectory, troubleshooting runbook, and changelog history`,
        content: s.content,
        format: "markdown",
      });
    }

    return list;
  }, []);

  // Filter items by category and search query
  const filteredAssets = useMemo(() => {
    let result = allAssets;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.file.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          item.content.toLowerCase().includes(q)
      );
    } else {
      result = result.filter((item) => item.category === activeCategory);
    }
    return result;
  }, [allAssets, activeCategory, searchQuery]);

  // Selected item
  const selectedItem = useMemo(() => {
    const found = allAssets.find((item) => item.id === selectedId);
    if (found) return found;
    return filteredAssets[0] || allAssets[0];
  }, [allAssets, selectedId, filteredAssets]);

  // Next / Prev navigation
  const currentIndex = filteredAssets.findIndex((item) => item.id === selectedItem?.id);
  const prevItem = currentIndex > 0 ? filteredAssets[currentIndex - 1] : null;
  const nextItem = currentIndex < filteredAssets.length - 1 ? filteredAssets[currentIndex + 1] : null;

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<AssetCategory, number> = {
      empire: 0,
      guides: 0,
      playbook: 0,
      skills: 0,
      automations: 0,
      configs: 0,
      claims: 0,
      sessions: 0,
    };
    for (const item of allAssets) {
      counts[item.category]++;
    }
    return counts;
  }, [allAssets]);

  const wordCount = useMemo(() => {
    if (!selectedItem?.content) return 0;
    return selectedItem.content.trim().split(/\s+/).length;
  }, [selectedItem]);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Category Pills Navigation */}
      <div className="bg-white border border-slate-200 p-2 rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => { setActiveCategory("empire"); setSearchQuery(""); }}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeCategory === "empire" && !searchQuery
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Site Empire OS ({categoryCounts.empire})</span>
          </button>

          <button
            onClick={() => { setActiveCategory("guides"); setSearchQuery(""); }}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeCategory === "guides" && !searchQuery
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Core Guides & PRD ({categoryCounts.guides})</span>
          </button>

          <button
            onClick={() => { setActiveCategory("playbook"); setSearchQuery(""); }}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeCategory === "playbook" && !searchQuery
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Playbook v2 ({categoryCounts.playbook})</span>
          </button>

          <button
            onClick={() => { setActiveCategory("skills"); setSearchQuery(""); }}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeCategory === "skills" && !searchQuery
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Agent Skills ({categoryCounts.skills})</span>
          </button>

          <button
            onClick={() => { setActiveCategory("automations"); setSearchQuery(""); }}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeCategory === "automations" && !searchQuery
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Automations ({categoryCounts.automations})</span>
          </button>

          <button
            onClick={() => { setActiveCategory("configs"); setSearchQuery(""); }}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeCategory === "configs" && !searchQuery
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configs & Prompts ({categoryCounts.configs})</span>
          </button>

          <button
            onClick={() => { setActiveCategory("claims"); setSearchQuery(""); }}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeCategory === "claims" && !searchQuery
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Claims & Data ({categoryCounts.claims})</span>
          </button>

          <button
            onClick={() => { setActiveCategory("sessions"); setSearchQuery(""); }}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              activeCategory === "sessions" && !searchQuery
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Sessions ({categoryCounts.sessions})</span>
          </button>
        </div>
      </div>

      {/* Main Two-Pane Reader Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Asset Directory & Search */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search all 70+ files & documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-[11px] text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>
              {searchQuery ? `Search results (${filteredAssets.length})` : `${activeCategory.toUpperCase()} ASSETS (${filteredAssets.length})`}
            </span>
            <span className="font-mono text-slate-400">Total: {allAssets.length}</span>
          </div>

          {/* List of Document Cards */}
          <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredAssets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching documents found.
              </div>
            ) : (
              filteredAssets.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/70 border-blue-400 shadow-xs ring-1 ring-blue-300"
                        : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-mono font-bold ${isSelected ? "text-blue-700" : "text-slate-600"}`}>
                        {item.badge}
                      </span>
                      {item.owner && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-medium">
                          {item.owner}
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-slate-900 mt-1 line-clamp-1">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-mono">
                      {item.file}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Live Full-Text Document Reader */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          {selectedItem ? (
            <>
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-mono font-bold">
                      {selectedItem.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {selectedItem.file}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedItem.title}
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span>~{readingTime} min read</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      W = 1.00 Verified
                    </span>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* View Mode Toggle */}
                  {selectedItem.format === "markdown" && (
                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
                      <button
                        onClick={() => setViewMode("rendered")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                          viewMode === "rendered" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => setViewMode("raw")}
                        className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                          viewMode === "raw" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Raw
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleCopy(selectedItem.content)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
                    title="Copy full document text"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>

                  <a
                    href="/loadsmart-abm-os.zip"
                    download
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Kit</span>
                  </a>
                </div>
              </div>

              {/* Document Body */}
              <div className="max-h-[660px] overflow-y-auto pr-2">
                {selectedItem.format === "markdown" && viewMode === "rendered" ? (
                  <div className="bg-white rounded-xl p-2">
                    <DocMarkdown source={selectedItem.content} />
                  </div>
                ) : (
                  <div className="relative">
                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800 whitespace-pre-wrap">
                      {selectedItem.content}
                    </pre>
                  </div>
                )}
              </div>

              {/* Document Navigation Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                {prevItem ? (
                  <button
                    onClick={() => setSelectedId(prevItem.id)}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Prev: {prevItem.title}</span>
                  </button>
                ) : (
                  <div />
                )}

                {nextItem && (
                  <button
                    onClick={() => setSelectedId(nextItem.id)}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 font-medium ml-auto"
                  >
                    <span>Next: {nextItem.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select an asset from the left to read its full content.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
