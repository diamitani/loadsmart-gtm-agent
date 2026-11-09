import { Architect } from "@/components/chat/architect";
import { requestAiContext } from "@/lib/agent/ai-context";
import { newId } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Architect" };

export default async function NewConversationPage() {
  const ai = await requestAiContext();
  return <Architect key="new" id={newId("c")} initialMessages={[]} demo={ai.mode === "none"} noCredits={ai.reason === "no_credits"} />;
}
