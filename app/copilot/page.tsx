import type { Metadata } from "next";
import { Chat } from "@/components/chat";

export const metadata: Metadata = { title: "Pod Copilot · Loadsmart ABM OS" };

export default async function CopilotPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return <Chat initialPrompt={typeof q === "string" ? q.slice(0, 500) : undefined} />;
}
