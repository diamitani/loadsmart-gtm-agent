"use client";

import { useState } from "react";
import { 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  Warehouse, 
  Cpu, 
  Layers, 
  FileText,
  PhoneCall,
  AlertCircle
} from "lucide-react";

export default function PlaybookPage() {
  const [activeTab, setActiveTab] = useState<"products" | "personas" | "battlecards" | "objections" | "claims">("products");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            Loadsmart Sales Playbook v2
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Hybrid AE/SDR Pod Playbook & Battlecards</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Authored by Patrick Diamitani · As of November 2026.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "products" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("personas")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "personas" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Personas
          </button>
          <button
            onClick={() => setActiveTab("battlecards")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "battlecards" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Battlecards
          </button>
          <button
            onClick={() => setActiveTab("objections")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "objections" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Objections & Scripts
          </button>
          <button
            onClick={() => setActiveTab("claims")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === "claims" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Claims Library
          </button>
        </div>
      </div>

      {/* Tab 1: Products */}
      {activeTab === "products" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <Truck className="w-4 h-4" />
              ShipperGuide (TMS)
            </div>
            <h3 className="text-base font-bold text-slate-900">Enterprise Transportation Management</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Unified software platform covering the freight lifecycle: automated spot procurement, contract rate execution, multi-modal tracking, and invoice audit. Built to replace spreadsheets or bloated legacy systems.
            </p>
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div><strong className="text-slate-800">Target Buyer:</strong> VP Logistics, VP Supply Chain, Transportation Director.</div>
              <div><strong className="text-slate-800">Freight Profile:</strong> $10M–$500M annual transportation spend.</div>
              <div><strong className="text-slate-800">Commercial Model:</strong> Annual SaaS subscription ($25K–$120K ARR).</div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
              <Warehouse className="w-4 h-4" />
              Opendock (Dock & Yard Management)
            </div>
            <h3 className="text-base font-bold text-slate-900">Online Dock Appointment Scheduling</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Cloud dock scheduling connecting shippers, distribution centers, and carriers. Eliminates phone tag, gate bottlenecks, and carrier detention penalties across 4,500+ facilities.
            </p>
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div><strong className="text-slate-800">Target Buyer:</strong> VP Warehousing, Plant Manager, DC Operations Director.</div>
              <div><strong className="text-slate-800">Facility Profile:</strong> 3+ dock doors, high inbound/outbound trailer velocity.</div>
              <div><strong className="text-slate-800">Commercial Model:</strong> Tiered facility subscription ($6K–$48K ARR).</div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              Loadsmart AI (Logistics Agents)
            </div>
            <h3 className="text-base font-bold text-slate-900">Autonomous Agents + Human Freight Experts</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Eleven autonomous AI agents handling repetitive logistics tasks (spot quoting, dispatch, tracking, carrier vetting) inside existing TMS/ERP systems, backed by Freight Experts to resolve exceptions.
            </p>
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div><strong className="text-slate-800">Target Buyer:</strong> Chief Information Officer (CIO), Chief Supply Chain Officer.</div>
              <div><strong className="text-slate-800">Systems in Place:</strong> SAP S/4HANA, Oracle OTM, Blue Yonder, Manhattan.</div>
              <div><strong className="text-slate-800">Commercial Model:</strong> Usage-based per transaction ($0.75–$2.50) or enterprise license.</div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              Freight Brokerage & Managed Logistics
            </div>
            <h3 className="text-base font-bold text-slate-900">Digital & Multimodal Brokerage</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Dedicated truckload (FTL), LTL, drayage, expedited, and private fleet optimization backed by 230,000 vetted carriers with 98%+ on-time delivery performance.
            </p>
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div><strong className="text-slate-800">Target Buyer:</strong> Transportation Manager, Logistics Procurement Specialist.</div>
              <div><strong className="text-slate-800">Freight Profile:</strong> Surging lane volume, seasonal capacity crunches.</div>
              <div><strong className="text-slate-800">Commercial Model:</strong> Take-rate margin on freight spend.</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Personas */}
      {activeTab === "personas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
            <div className="text-xs font-mono uppercase text-blue-600 font-bold">Persona 01</div>
            <h3 className="text-base font-bold text-slate-900">VP Logistics & Supply Chain</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              <strong className="text-slate-800">Primary Objective:</strong> Eliminate carrier procurement delays, control freight budget variance, and maintain carrier SLA compliance.
            </p>
            <div className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div><strong className="text-slate-800">Acute Pains:</strong> Uncompetitive spot rates, manual email rate requests, poor tracking data.</div>
              <div><strong className="text-slate-800">Lead Product:</strong> ShipperGuide TMS.</div>
              <div><strong className="text-slate-800">Discovery Hook:</strong> "How much time is your team spending securing spot rates across regional lanes?"</div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
            <div className="text-xs font-mono uppercase text-indigo-600 font-bold">Persona 02</div>
            <h3 className="text-base font-bold text-slate-900">Director of Warehouse Operations</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              <strong className="text-slate-800">Primary Objective:</strong> Reduce truck dwell time, eliminate dock congestion, and avoid carrier detention penalties.
            </p>
            <div className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div><strong className="text-slate-800">Acute Pains:</strong> Unannounced carrier arrivals, driver detention fines, gate check-in lines.</div>
              <div><strong className="text-slate-800">Lead Product:</strong> Opendock.</div>
              <div><strong className="text-slate-800">Discovery Hook:</strong> "What does carrier detention currently cost your distribution network each month?"</div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
            <div className="text-xs font-mono uppercase text-purple-600 font-bold">Persona 03</div>
            <h3 className="text-base font-bold text-slate-900">Chief Supply Chain Officer / CIO</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              <strong className="text-slate-800">Primary Objective:</strong> Automate repetitive logistics tasks without risky, multi-year core ERP migrations.
            </p>
            <div className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div><strong className="text-slate-800">Acute Pains:</strong> Operations team bogged down in exception handling, rigid legacy systems.</div>
              <div><strong className="text-slate-800">Lead Product:</strong> Loadsmart AI.</div>
              <div><strong className="text-slate-800">Discovery Hook:</strong> "How are you automating spot quotes and tracking updates inside SAP/Oracle today?"</div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
            <div className="text-xs font-mono uppercase text-emerald-600 font-bold">Persona 04</div>
            <h3 className="text-base font-bold text-slate-900">Plant / DC Facility Manager</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              <strong className="text-slate-800">Primary Objective:</strong> Keep dock doors operating smoothly without manual phone tag or paper clipboards.
            </p>
            <div className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div><strong className="text-slate-800">Acute Pains:</strong> Yard log jams, double-booked dock bays, stressed warehouse labor.</div>
              <div><strong className="text-slate-800">Lead Product:</strong> Opendock.</div>
              <div><strong className="text-slate-800">Discovery Hook:</strong> "Can carriers self-schedule appointments online directly with your facility today?"</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Battlecards */}
      {activeTab === "battlecards" && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Battlecard: ShipperGuide TMS vs. Legacy Enterprise TMS (Oracle OTM / Manhattan)</span>
              <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-mono font-semibold">ShipperGuide Wins</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 pt-2">
              <div className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-200 space-y-1.5">
                <div className="text-rose-800 font-bold">Legacy Enterprise TMS Weaknesses</div>
                <div className="text-rose-900">• 12–18 month implementation timelines costing $500K+ in consulting.</div>
                <div className="text-rose-900">• Rigid interfaces requiring heavy training and dedicated administrators.</div>
                <div className="text-rose-900">• Disconnected from live digital carrier networks.</div>
              </div>
              <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <div className="text-emerald-800 font-bold">Loadsmart ShipperGuide Strengths</div>
                <div className="text-emerald-900">• Go-live in 4–6 weeks with zero IT overhead.</div>
                <div className="text-emerald-900">• Instant connectivity to 230,000 vetted carriers.</div>
                <div className="text-emerald-900">• Modern, intuitive consumer-grade UI for dispatchers and planners.</div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Battlecard: Opendock vs. Manual Phone/Email Dock Scheduling</span>
              <span className="text-xs text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 font-mono font-semibold">Opendock Wins</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 pt-2">
              <div className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-200 space-y-1.5">
                <div className="text-rose-800 font-bold">Manual Scheduling Vulnerabilities</div>
                <div className="text-rose-900">• Gate guards constantly on phone calls scheduling appointments.</div>
                <div className="text-rose-900">• Double bookings leading to $75/hr carrier detention charges.</div>
                <div className="text-rose-900">• Zero historical data on carrier on-time arrival performance.</div>
              </div>
              <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                <div className="text-emerald-800 font-bold">Loadsmart Opendock Advantages</div>
                <div className="text-emerald-900">• 24/7 carrier self-scheduling portal over the web.</div>
                <div className="text-emerald-900">• Real-time dock door capacity management and detention avoidance.</div>
                <div className="text-emerald-900">• Proven network: 14M+ appointments scheduled across 4,500 warehouses.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Objections */}
      {activeTab === "objections" && (
        <div className="space-y-4">
          <div className="rounded-xl bg-white border border-slate-200 p-4 sm:p-5 space-y-2 shadow-sm">
            <div className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-bold text-xs inline-flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Objection 1: "We already use Oracle / MercuryGate and we're not replacing it."
            </div>
            <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200 leading-relaxed">
              <strong className="text-slate-900">Rep Response:</strong> "Completely understood, Greg. We don't ask enterprise shippers to rip out their system of record. In fact, our Loadsmart AI agents integrate directly into Oracle and MercuryGate to automate the spot rate lookups and tracking updates that your reps are currently doing manually in outside portals. What's the biggest manual bottleneck inside your current setup?"
            </p>
          </div>

          <div className="rounded-xl bg-white border border-slate-200 p-4 sm:p-5 space-y-2 shadow-sm">
            <div className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-bold text-xs inline-flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Objection 2: "Our facilities handle dock scheduling fine with our own calendar."
            </div>
            <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200 leading-relaxed">
              <strong className="text-slate-900">Rep Response:</strong> "That makes sense, Danielle. Where we see facility directors run into friction is carrier detention fines—when drivers arrive unannounced or late, yard queues backup fast. Over 4,500 warehouses use Opendock so carriers self-schedule 24/7, giving your team a clean dashboard of every incoming truck. How many carrier detention claims did you process last quarter?"
            </p>
          </div>
        </div>
      )}

      {/* Tab 5: Claims Library */}
      {activeTab === "claims" && (
        <div className="rounded-xl bg-white border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Approved Loadsmart Claims Library (Nov 2026)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Only these verified metrics are permitted in outbound copy. Hallucinations are strictly blocked by Truth Guard.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-semibold">
              W = 1.00 Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-slate-500 font-medium">Shipper Customer Base</div>
              <div className="text-xl font-bold text-slate-900">1,800+ Shippers</div>
              <div className="text-[11px] text-slate-500">Global enterprise customers</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-slate-500 font-medium">Warehouse Network</div>
              <div className="text-xl font-bold text-slate-900">4,500+ Facilities</div>
              <div className="text-[11px] text-slate-500">Live warehouses on Opendock</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-slate-500 font-medium">Carrier Capacity Network</div>
              <div className="text-xl font-bold text-slate-900">230,000+ Carriers</div>
              <div className="text-[11px] text-slate-500">Vetted multimodal carrier network</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-slate-500 font-medium">Annual Appointments</div>
              <div className="text-xl font-bold text-slate-900">14 Million+ Docks</div>
              <div className="text-[11px] text-slate-500">Scheduled annually on Opendock</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-slate-500 font-medium">Autonomous AI Agents</div>
              <div className="text-xl font-bold text-slate-900">11 Specialized Agents</div>
              <div className="text-[11px] text-slate-500">Backed by human Freight Experts</div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-slate-500 font-medium">Enterprise Security</div>
              <div className="text-xl font-bold text-slate-900">SOC 2 Type II</div>
              <div className="text-[11px] text-slate-500">Enterprise-grade cloud compliance</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}