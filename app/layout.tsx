import type { Metadata, Viewport } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SALESGENCY_URL, SITE_DESCRIPTION as DESCRIPTION, SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader", display: "swap", style: ["normal", "italic"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-jb", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Enably — the AI GTM Architect by Salesgency", template: "%s · Enably" },
  description: DESCRIPTION,
  applicationName: "Enably",
  authors: [{ name: "Salesgency", url: SALESGENCY_URL }],
  publisher: "Salesgency",
  keywords: ["GTM", "go-to-market", "AI sales", "ICP", "outbound", "sales playbook", "Salesgency", "Enably"],
  openGraph: {
    type: "website",
    siteName: "Enably by Salesgency",
    url: SITE_URL,
    title: "Enably — the AI GTM Architect",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: "Enably — the AI GTM Architect", description: DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1017" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply a saved theme before paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('enably-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-dvh bg-paper text-ink">{children}</body>
    </html>
  );
}
