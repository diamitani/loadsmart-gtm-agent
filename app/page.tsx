"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PresentationView } from "@/components/presentation-view";
import { DemoView } from "@/components/demo-view";
import { DocumentsView } from "@/components/documents-view";
import { Layers, Play, BookOpen, Download } from "lucide-react";

function TabContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"presentation" | "demo" | "documents">(
    tabParam === "demo" ? "demo" : tabParam === "documents" ? "documents" : "presentation"
  );

  useEffect(() => {
    if (tabParam === "demo" || tabParam === "documents" || tabParam === "presentation") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  function switchTab(newTab: "presentation" | "demo" | "documents") {
    setActiveTab(newTab);
    router.push(`/?tab=${newTab}`, { scroll: false });
  }

  return (
    <div className="space-y-6">
      {/* Centered Saasbright Rounded Segmented Control */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80 shadow-2xs text-xs font-semibold backdrop-blur-md">
          <button
            onClick={() => switchTab("presentation")}
            className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
              activeTab === "presentation"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Presentation</span>
          </button>

          <button
            onClick={() => switchTab("demo")}
            className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
              activeTab === "demo"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            <span>Demo</span>
          </button>

          <button
            onClick={() => switchTab("documents")}
            className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
              activeTab === "documents"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Documents</span>
          </button>
        </div>
      </div>

      {/* Tab Render */}
      <div>
        {activeTab === "presentation" && (
          <PresentationView onGoToDemo={() => switchTab("demo")} />
        )}
        {activeTab === "demo" && <DemoView />}
        {activeTab === "documents" && <DocumentsView />}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center text-xs text-slate-400">Loading Loadsmart GTM Center of Excellence...</div>
    }>
      <TabContent />
    </Suspense>
  );
}
