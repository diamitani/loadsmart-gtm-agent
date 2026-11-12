import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { HeaderNav } from "@/components/header-nav";

export const metadata: Metadata = {
  title: "Loadsmart GTM AI Center of Excellence",
  description: "Autonomous GTM AI Operating System for Loadsmart AE & SDR pods. Presentation, Interactive Demo, and Complete Documentation Suite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-sky-100 selection:text-sky-900 bg-saasbright-sky">
        {/* Saasbright Frosted Header with Loadsmart Logo & Navigation */}
        <Suspense fallback={
          <header className="h-14 border-b border-slate-200/60 bg-white/80" />
        }>
          <HeaderNav />
        </Suspense>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Minimal Clean Footer */}
        <footer className="border-t border-slate-200 py-6 px-4 sm:px-6 text-center text-xs text-slate-500 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="font-medium text-slate-600">
              LOADSMART GTM AI Center of Excellence · Built by Patrick Diamitani (Enably / SalesGency)
            </div>
            <div className="flex items-center gap-3 text-slate-500">
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
