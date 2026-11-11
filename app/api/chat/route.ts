import { streamText } from "ai";
import { getLanguageModel } from "@/lib/agent/models";
import { LOADSMART_GTM_SYSTEM_PROMPT } from "@/lib/agent/prompt";
import { gtmTools } from "@/lib/agent/tools";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const model = getLanguageModel();

    // 1. Live AI Execution if any API key is configured
    if (model) {
      const result = streamText({
        model,
        system: LOADSMART_GTM_SYSTEM_PROMPT,
        messages,
        tools: gtmTools
      });
      return result.toTextStreamResponse();
    }

    // 2. High-Fidelity Simulation Fallback (Runs without keys)
    const latestMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    let simulatedResponse = "";

    if (latestMessage.includes("nominate") || latestMessage.includes("accounts")) {
      simulatedResponse = `⚡ **[Tool: nominateAccounts Executed]**
Target: **Pod 2 - Enterprise ShipperGuide TMS**
Nominated 5 enterprise shipper candidates from daily buying signals:

1. **Apex Beverage Logistics** (apexbeverage.com) — ICP Score: 94 | Est. Spend: $35M | Trigger: Opening 2 new regional DCs in Dallas & Atlanta
2. **Horizon Consumer Brands** (horizonbrands.com) — ICP Score: 92 | Est. Spend: $28M | Trigger: Consolidating freight procurement onto single TMS
3. **Midwest Distribution Corp** (midwestdist.net) — ICP Score: 89 | Est. Spend: $24M | Trigger: Carrier on-time delivery dropped below 91%
4. **Pinnacle Cold Logistics** (pinnaclecold.com) — ICP Score: 87 | Est. Spend: $19M | Trigger: Searching for automated spot quoting
5. **Continental Freightlines** (continentalfl.com) — ICP Score: 85 | Est. Spend: $22M | Trigger: Expanding Midwest dedicated fleet

All 5 accounts passed the **CRM Shield** check with 0 Salesforce territory collisions. Proceed with waterfall contact reveal?`;
    } else if (latestMessage.includes("copy") || latestMessage.includes("email") || latestMessage.includes("generate")) {
      simulatedResponse = `⚡ **[Tool: generatePASCopy Executed]**
Synthesized 1-to-1 PAS cold email for **Greg Sutherland** (VP Logistics, Apex Beverage Logistics):

---
**Subject:** Dallas carrier procurement for Apex Beverage
**From:** david.c@shipperguide-platform.com (Rep: David Chen)

Greg - noticed Apex is bringing two new regional distribution facilities online in Dallas and Atlanta this winter. 

When scaling multi-region freight on top of MercuryGate, manual spot procurement and rate benchmarking typically slow dispatch cycles and drive up lane costs. 

ShipperGuide connects your procurement directly with 230,000 vetted carriers, reducing quote turnaround from hours to seconds inside your existing workflow. 

Worth a brief 10-minute glance at how comparable beverage shippers benchmarked their initial Dallas lanes?

Best,  
David Chen | ShipperGuide Enterprise Team  
Loadsmart · 175 W Jackson Blvd, Chicago, IL 60604  
*(Reply 'remove' to opt out)*
---

**Calibrated Truth Guard Status:** ✅ Passed (100% match to approved claims library: 230,000 vetted carriers cited). Staged in review drawer for batch signature.`;
    } else if (latestMessage.includes("mailbox") || latestMessage.includes("health") || latestMessage.includes("deliverability")) {
      simulatedResponse = `⚡ **[Tool: checkMailboxHealth Executed]**
**Mailbox Deliverability Matrix (8 Secondary Inboxes Active):**

• \`s.jenkins@loadsmart-freight.co\` (Pod 1): 18/40 sent | Bounce: 0.8% | Status: **HEALTHY**
• \`sarah.j@loadsmart-logistics.net\` (Pod 1): 22/40 sent | Bounce: 1.1% | Status: **HEALTHY**
• \`d.chen@shipperguide-tms.io\` (Pod 2): 14/40 sent | Bounce: 0.5% | Status: **HEALTHY**
• \`david.c@shipperguide-platform.com\` (Pod 2): 19/40 sent | Bounce: 0.6% | Status: **HEALTHY**
• \`m.lin@opendock-network.com\` (Pod 3): 24/40 sent | Bounce: 1.2% | Status: **HEALTHY**
• \`maya.l@opendock-scheduler.net\` (Pod 3): 16/40 sent | Bounce: 0.9% | Status: **HEALTHY**
• \`r.cole@loadsmart-ai.cloud\` (Pod 4): 12/35 sent | Bounce: 0.7% | Status: **WARMING_UP**
• \`rachel.c@loadsmart-agents.io\` (Pod 4): 15/35 sent | Bounce: 0.8% | Status: **WARMING_UP**

**Network Average Bounce Rate:** 0.85% (Safe margin well below the 2.0% threshold). All domains passing SPF, DKIM, and DMARC.`;
    } else if (latestMessage.includes("leak") || latestMessage.includes("stuck") || latestMessage.includes("report")) {
      simulatedResponse = `⚡ **[Tool: runLeakReport Executed]**
**Daily Pod Diagnostic & Leak Report:**

• **Total Target Accounts:** 20 per pod (80 total)
• **Active in Sequence:** 57 accounts (71.25% progression rate)
• **Meetings Booked:** 14 qualified meetings
• **Stuck / Parked Accounts Flagged:** 2
  - *Summit Agro Chemicals*: Parked due to active enterprise opportunity in Salesforce (AE: J. Miller).
  - *Beacon Packaging Co*: Disqualified due to estimated spend < $10M threshold.

**Recommended Action:** RevOps should review Summit Agro Chemicals with J. Miller for cross-sell assistance, and backfill Beacon Packaging from the secondary signal queue.`;
    } else {
      simulatedResponse = `Hello! I am your **Loadsmart GTM Copilot**. 

I operate across all four Loadsmart AE/SDR pods:
1. **Pod 1:** Mid-Market FTL & Logistics (Freight Brokerage)
2. **Pod 2:** Enterprise ShipperGuide TMS
3. **Pod 3:** Opendock Facility & Yard Network
4. **Pod 4:** Loadsmart AI Autonomous Operations

You can ask me to:
- *"Nominate 20 enterprise accounts for ShipperGuide"*
- *"Draft 1-to-1 PAS copy for Greg Sutherland at Apex Beverage"*
- *"Inspect secondary domain mailbox deliverability"*
- *"Run the daily pod leak report"*
- *"Audit nominated domains for Salesforce collisions"*

How would you like to direct the pod today?`;
    }

    // Stream simulated response smoothly
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const words = simulatedResponse.split(" ");
        for (const word of words) {
          controller.enqueue(encoder.encode(word + " "));
          await new Promise((r) => setTimeout(r, 12));
        }
        controller.close();
      }
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked"
      }
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate chat response" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
