import { notFound } from "next/navigation";
import { Architect } from "@/components/chat/architect";
import type { EnablyUIMessage } from "@/lib/agent/ui-types";
import { getStore } from "@/lib/db";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const convo = await getStore().getConversation(id);
  if (!convo) notFound();
  return <Architect key={id} id={id} initialMessages={convo.messages as EnablyUIMessage[]} demo={env().provider === "demo"} />;
}
