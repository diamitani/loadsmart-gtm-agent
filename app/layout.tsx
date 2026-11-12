import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { 
  BarChart3, 
  Bot, 
  Workflow, 
  BookOpen, 
  Zap, 
  Settings, 
  ShieldCheck, 
  Layers,
  Cpu,
  Compass,
  Download,
  Globe,
  Sparkles
} from "lucide-react";

export const metadata: Metadata = {
  title: "Loadsmart GTM AI Center of Excellence & Prospect Pal",
  description: "Internal GTM AI Center of Excellence for Loadsmart AE & SDR pods. Powered by Salesgency Enably, Prospect Automation Engine, Vercel AI SDK, and n8n.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[var(--paper-50)] text-[var(--ink-900)]">
        {/* Top Header */}
        <header className="sticky top-0 z-50 border-b border-[var(--paper-200)] bg-[rgba(251,250,248,0.92)] backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <Link href="/home" className="flex items-center gap-2.5 group">
                {/* Signature Salesgency Prospect Pal SVG Mark */}
                <svg width="30" height="30" viewBox="0 0 48 48" className="flex-shrink-0 group-hover:scale-105 transition-transform">
                  <rect width="48" height="48" rx="13" fill="var(--ink-800)" />
                  <path d="M14 32.5 L24 24 L34 15.5" stroke="var(--champagne-300)" strokeWidth="2.5" strokeLinecap="square" fill="none" />
                  <circle cx="14" cy="32.5" r="3.4" fill="var(--paper-50)" />
                  <circle cx="24" cy="24" r="3.4" fill="var(--paper-50)" />
                  <circle cx="34" cy="15.5" r="4.6" fill="var(--champagne-300)" />
                </svg>
                <div>
                  <div className="font-bold text-sm tracking-tight text-[var(--ink-900)] flex items-center gap-1.5">
                    LOADSMART <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[var(--cobalt-50)] text-[var(--cobalt-700)] border border-[var(--cobalt-200)] font-semibold">GTM AI COE</span>
                  </div>
                  <div className="text-[11px] text-[var(--ink-400)] font-medium">Pod Intelligence & Prospecting Center</div>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/home"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-[var(--cobalt-700)] bg-[var(--cobalt-50)] border border-[var(--cobalt-200)] hover:bg-[var(--cobalt-100)] transition-colors flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-[var(--cobalt-600)]" />
                Marketing Site
              </Link>
              <Link
                href="/"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-[var(--ink-600)] hover:text-[var(--ink-900)] hover:bg-[var(--paper-100)] transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-[var(--ink-400)]" />
                Overview
              </Link>
              <Link
                href="/dashboard"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-[var(--ink-600)] hover:text-[var(--ink-900)] hover:bg-[var(--paper-100)] transition-colors flex items-center gap-1.5"
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                Pod Dashboard
              </Link>
              <Link
                href="/copilot"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-[var(--ink-600)] hover:text-[var(--ink-900)] hover:bg-[var(--paper-100)] transition-colors flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                GTM Copilot
              </Link>
              <Link
                href="/pipeline"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-[var(--ink-600)] hover:text-[var(--ink-900)] hover:bg-[var(--paper-100)] transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                10-Step Engine
              </Link>
              <Link
                href="/skills"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-[var(--ink-600)] hover:text-[var(--ink-900)] hover:bg-[var(--paper-100)] transition-colors flex items-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-600" />
                Skills Library
              </Link>
              <Link
                href="/playbook"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-[var(--ink-600)] hover:text-[var(--ink-900)] hover:bg-[var(--paper-100)] transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                Playbook v2
              </Link>
              <Link
                href="/automations"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-[var(--ink-600)] hover:text-[var(--ink-900)] hover:bg-[var(--paper-100)] transition-colors flex items-center gap-1.5"
              >
                <Workflow className="w-3.5 h-3.5 text-purple-600" />
                n8n Hub
              </Link>
              <Link
                href="/settings"
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-[var(--ink-600)] hover:text-[var(--ink-900)] hover:bg-[var(--paper-100)] transition-colors flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-[var(--ink-400)]" />
                Settings
              </Link>
            </nav>

            {/* Status & Quick Download */}
            <div className="flex items-center gap-2">
              <a
                href="/loadsmart-abm-os.zip"
                download
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--cobalt-50)] hover:bg-[var(--cobalt-100)] text-[var(--cobalt-700)] border border-[var(--cobalt-200)] text-xs font-semibold transition-colors"
                title="Download complete Loadsmart ABM skill pack for Claude.ai"
              >
                <Download className="w-3.5 h-3.5" />
                Download Skills (.zip)
              </a>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                4 Pods Active
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-[var(--paper-200)] py-6 px-4 sm:px-6 text-center text-xs text-[var(--ink-500)] bg-[var(--paper-0)]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              Loadsmart GTM AI Center of Excellence · Built by Patrick Diamitani (Enably / SalesGency)
            </div>
            <div className="flex items-center gap-4 text-[var(--ink-600)] font-medium">
              <Link href="/home" className="text-[var(--cobalt-600)] hover:underline font-semibold">Marketing Site (/home)</Link>
              <span>•</span>
              <span>ShipperGuide TMS</span>
              <span>•</span>
              <span>Opendock</span>
              <span>•</span>
              <span>Loadsmart AI</span>
              <span>•</span>
              <span>Freight Brokerage</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}