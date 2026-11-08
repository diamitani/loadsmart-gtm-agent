import { Architect } from "@/components/chat/architect";
import { env } from "@/lib/env";
import { newId } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Architect" };

export default function NewConversationPage() {
  return <Architect key="new" id={newId("c")} initialMessages={[]} demo={env().provider === "demo"} />;
}
