"use client";

import { useState } from "react";
import { ShieldCheck, Mail, CheckCircle2 } from "lucide-react";
import { DemoChat } from "@/components/demo-chat";

export default function CopilotPage() {
  const [stagedApproved, setStagedApproved] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Main Streaming Copilot */}
      <div className="lg:col-span-8">
        <DemoChat />
      </div>

      {/* Right-Hand Staged Copy Review Drawer */}
      <div className="lg:col-span-4 flex flex-col bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h1 className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Staged Outbound Batch
            </h1>
            <p className="text-[12px] text-slate-500 mt-0.5">
              Human-in-the-loop review drawer before Gong/Apollo enrollment.
            </p>
          </div>
          <span className="text-[11px] font-mono font-semibold text-blue-700">1 Staged</span>
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-3 text-[12.5px]">
          <div>
            <p className="text-[11px] font-mono font-semibold text-blue-700">Pod 2 · ShipperGuide TMS</p>
            <div className="font-bold text-slate-900 text-[14px] mt-1">Sample Beverage Shipper</div>
            <div className="text-slate-500 text-[12px]">VP Logistics &amp; Transportation</div>
          </div>

          <div className="space-y-1.5 bg-white p-3.5 rounded-lg border border-slate-200 font-mono text-[11.5px] leading-relaxed text-slate-700">
            <div className="text-slate-500 border-b border-slate-100 pb-1.5">
              <strong className="text-slate-800">Subject:</strong> dallas dc carrier procurement
            </div>
            <div className="text-slate-700 pt-1 space-y-2">
              <p>Saw your team is bringing two regional facilities online in Dallas and Atlanta this quarter.</p>
              <p>When shippers scale multi-region freight, manual spot quoting usually slows dispatch cycles right as volume ramps.</p>
              <p>Worth a 10-minute look at how comparable beverage shippers benchmark their initial Dallas lanes in ShipperGuide?</p>
            </div>
          </div>

          <div className="text-[11.5px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-start gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Truth Guard:</strong> Strictly trigger-grounded; zero unapproved metrics used. Ready for batch review.
            </span>
          </div>

          <button
            onClick={() => setStagedApproved(true)}
            disabled={stagedApproved}
            className={`w-full py-2.5 px-3 rounded-lg text-[12.5px] font-semibold flex items-center justify-center gap-2 transition-colors ${
              stagedApproved
                ? "bg-emerald-600 text-white cursor-default"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {stagedApproved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Approved for Gong Enrollment (Dry Run)</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Approve Batch for Gong Flow</span>
              </>
            )}
          </button>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11.5px] text-slate-600 space-y-1">
          <div className="font-semibold text-slate-800">Governance Rule</div>
          <div>No message sends or writes to Salesforce without explicit rep confirmation.</div>
        </div>
      </div>
    </div>
  );
}
