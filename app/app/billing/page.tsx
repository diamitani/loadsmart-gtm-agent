import { PageHeader } from "@/components/ui";
import { BillingPanel } from "@/components/billing-panel";
import { currentAccountId } from "@/lib/billing/account";
import { currentUser } from "@/lib/auth/user";
import { billingStatus } from "@/lib/billing/status";

export const dynamic = "force-dynamic";
export const metadata = { title: "Credits & keys" };

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const [{ checkout }, status] = await Promise.all([searchParams, Promise.all([currentAccountId(), currentUser()]).then(([id, u]) => billingStatus(id, u?.email ?? null))]);
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <PageHeader
        eyebrow="Account"
        title="Credits & keys"
        description="Use the Architect with your own AI provider key (you pay your provider directly, no credits used), or buy credits to use ours. Each AI model call uses credits; template builds are always free."
      />
      <BillingPanel initial={status} checkout={checkout === "success" || checkout === "cancelled" ? checkout : undefined} />
    </main>
  );
}
