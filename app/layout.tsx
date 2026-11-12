import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Loadsmart GTM Engineering · Patrick Diamitani",
  description:
    "Answers to Loadsmart's seven GTM Engineer questions, the presentation, and a live demo of the pod agent with the full skill pack.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200/70">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px] text-slate-500">
            <span>Prepared for Loadsmart by Patrick Diamitani</span>
            <span>November 2026</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
