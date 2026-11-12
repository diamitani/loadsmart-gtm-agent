import { NextResponse } from "next/server";
import { getAccounts, updateAccountStage } from "@/lib/loadsmart/store";

export async function POST(req: Request) {
  try {
    const { stage, podId, accountId } = await req.json();

    if (accountId) {
      if (stage === "approve_copy") {
        const updated = await updateAccountStage(accountId, "APPROVED");
        return NextResponse.json({ success: true, account: updated });
      }
      if (stage === "enroll_sequence") {
        const updated = await updateAccountStage(accountId, "SEQUENCED");
        return NextResponse.json({ success: true, account: updated });
      }
    }

    const accounts = await getAccounts(podId);

    // Simulate batch execution of a specific pipeline stage
    return NextResponse.json({
      success: true,
      stage,
      podId: podId || "all",
      processedCount: accounts.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Pipeline execution error:", error);
    return NextResponse.json({ error: "Failed to execute pipeline stage" }, { status: 500 });
  }
}

