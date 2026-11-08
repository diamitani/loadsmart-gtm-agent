import { Sidebar } from "@/components/sidebar";
import { getStore } from "@/lib/db";
import { modelLabel } from "@/lib/agent/models";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const conversations = (await getStore().listConversations(30)).map((c) => ({ id: c.id, title: c.title }));
  return (
    <div className="min-h-dvh">
      <Sidebar conversations={conversations} mode={env().provider === "demo" ? "demo" : modelLabel()} />
      <div className="lg:pl-64">{children}</div>
    </div>
  );
}
