"use client";

import { useState } from "react";
import { 
  Truck, 
  Warehouse, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  DollarSign, 
  ShieldCheck, 
  Users, 
  FileText,
  Clock,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface ProductDetail {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  icon: typeof Truck;
  tagline: string;
  overview: string;
  marketSize: string;
  targetBuyer: string;
  typicalTitles: string[];
  displaces: string[];
  keyBenefits: string[];
  qualificationCriteria: string[];
  samplePitch: string;
}

const PRODUCTS: ProductDetail[] = [
  {
    id: "opendock",
    name: "Opendock",
    badge: "Facility & Yard Management",
    badgeColor: "bg-cyan-50 border-cyan-200 text-cyan-700",
    icon: Warehouse,
    tagline: "Centralized dock scheduling and yard management for multi-facility shippers & 3PLs",
    overview: "Eliminates dock congestion, gate queues, detention charges, and phone/email appointment scheduling across warehouses. 4,500+ facilities and 14M+ appointments scheduled annually.",
    marketSize: "Facilities with 5+ dock doors scheduling 20+ truck appointments daily",
    targetBuyer: "Warehouse Operations, DC General Managers, Logistics Directors",
    typicalTitles: ["Director of Warehousing", "VP of Supply Chain", "General Manager - Distribution", "Yard Operations Manager"],
    displaces: ["Manual spreadsheets", "Phone calls & shared Outlook calendars", "Legacy WMS appointment modules"],
    keyBenefits: [
      "Zero phone calls or emails for dock appointments — carriers self-schedule 24/7",
      "Live yard visibility and driver check-in via mobile kiosk",
      "Detention elimination: benchmark dwell time across carriers and facilities",
      "SOC 2 Type II certified enterprise cloud architecture"
    ],
    qualificationCriteria: [
      "Operating 2 or more distribution centers or plants",
      "Experiencing driver detention fees (> $75/hr per trailer)",
      "Peak season congestion or manual appointment backlogs"
    ],
    samplePitch: "We noticed [Company] is managing high freight throughput across [Facility Location]. Opendock automates carrier appointment scheduling for over 4,500 facilities — eliminating detention fees and phone tag with carriers entirely."
  },
  {
    id: "shipperguide",
    name: "ShipperGuide",
    badge: "Enterprise Cloud TMS",
    badgeColor: "bg-purple-50 border-purple-200 text-purple-700",
    icon: Layers,
    tagline: "End-to-end freight procurement, tender automation, and tracking in one intuitive TMS",
    overview: "Built for shippers who have outgrown spreadsheets or are frustrated by bloated legacy TMS platforms. Unifies contract rates, spot market bidding, tendering, visibility, and invoice auditing.",
    marketSize: "Shippers with $10M–$150M+ annual freight spend",
    targetBuyer: "VP of Transportation, Logistics Directors, Supply Chain Leaders",
    typicalTitles: ["VP of Transportation", "Director of Logistics", "Head of Freight Procurement", "Supply Chain Director"],
    displaces: ["MercuryGate", "Oracle OTM", "BluJay / E2open", "Fragmented rate sheets"],
    keyBenefits: [
      "Instant spot bidding across 230,000+ vetted carriers and contracted fleets",
      "Automated primary waterfall and routing guide execution",
      "Real-time GPS track & trace with automated exception alerts",
      "Freight audit and payment reconciliation built natively into workflows"
    ],
    qualificationCriteria: [
      "Spending $10M+ on FTL, LTL, and multimodal logistics annually",
      "Currently managing tenders manually or unhappy with rigid legacy TMS contracts",
      "Requires fast implementation (< 30 days vs 9 months with legacy software)"
    ],
    samplePitch: "Most transportation teams we speak with spend 3+ hours daily re-quoting spot freight and chasing tracking updates. ShipperGuide brings automated routing guides, spot auctions, and live tracking into one workspace without the 9-month implementation cycle."
  },
  {
    id: "loadsmart-ai",
    name: "Loadsmart AI",
    badge: "Autonomous Freight Agents",
    badgeColor: "bg-orange-50 border-orange-200 text-orange-700",
    icon: Cpu,
    tagline: "11 autonomous AI agents executing spot quoting, tracking, and carrier vetting inside existing systems",
    overview: "The industry's first hybrid agentic platform: autonomous AI agents handle repetitive logistics tasks, backed by human Freight Experts to resolve high-touch exceptions.",
    marketSize: "Enterprise shippers and brokers seeking 50%+ labor efficiency in back-office freight ops",
    targetBuyer: "Chief Supply Chain Officers, VP of Logistics Operations, Freight Transformation Directors",
    typicalTitles: ["Chief Supply Chain Officer", "VP of Logistics", "Director of Digital Transformation", "Head of Freight Operations"],
    displaces: ["Offshore BPO teams", "Manual email parsing", "Repetitive carrier tracking calls"],
    keyBenefits: [
      "11 specialist AI agents trained on freight workflows (Spot Quote, Tracking, Vetting, Invoicing)",
      "Works inside your existing TMS (SAP, Oracle, MercuryGate, McLeod) — no rip-and-replace",
      "Backed by Loadsmart's Freight Experts to resolve exceptions when automation hits confidence boundaries",
      "99.4% rate quote accuracy with under 30-second response latency"
    ],
    qualificationCriteria: [
      "High email volume (500+ daily quote requests or check calls)",
      "High employee turnover in operational tracking and coordination roles",
      "Desire for AI transformation without replacing core enterprise ERP/TMS"
    ],
    samplePitch: "Loadsmart AI deploys 11 autonomous freight agents directly into your existing inbox and TMS to quote spot freight, track loads, and vet carriers in seconds — backed by human freight experts so you never drop an exception."
  },
  {
    id: "freight-brokerage",
    name: "Freight Services",
    badge: "Multimodal Brokerage",
    badgeColor: "bg-blue-50 border-blue-200 text-blue-700",
    icon: Truck,
    tagline: "Contract and spot capacity backed by 230,000+ vetted carriers and dedicated account management",
    overview: "Digital freight brokerage delivering 98%+ on-time performance across Full Truckload (Dry Van, Reefer, Flatbed), LTL, Drayage, and Managed Transportation.",
    marketSize: "Any enterprise or mid-market shipper moving 20+ loads/week",
    targetBuyer: "Transportation Managers, Freight Planners, Logistics Coordinators",
    typicalTitles: ["Transportation Manager", "Logistics Planner", "Director of Supply Chain Operations"],
    displaces: ["Traditional manual brokerages", "Unvetted spot board carriers"],
    keyBenefits: [
      "230,000+ rigorously vetted carriers with automated safety monitoring",
      "Guaranteed tender acceptance on committed contract lanes",
      "24/7 dedicated freight operational pod support",
      "Real-time digital tracking and carbon footprint tracking"
    ],
    qualificationCriteria: [
      "Experiencing tender rejections during regional surges or seasonal volume spikes",
      "Refrigerated, temperature-controlled, or high-value freight requirements",
      "Looking for managed transportation or dedicated lane contracts"
    ],
    samplePitch: "We provide reliable contract and surge capacity backed by our network of 230,000 vetted carriers. If your primary routing guide is seeing tender rejections on critical lanes, we can lock in committed capacity with 98%+ on-time delivery."
  }
];

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>("opendock");
  const product = PRODUCTS.find((p) => p.id === selectedProduct) || PRODUCTS[0];
  const Icon = product.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            Loadsmart Product Portfolio
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Products, Personas & Displacements</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep product messaging strictly bounded to authorized buyer personas. Never cross-contaminate TMS pitches with dock appointments.
          </p>
        </div>

        <Link
          href="/app"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Sparkles className="w-4 h-4" /> Launch Pod Copilot
        </Link>
      </div>

      {/* Product Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PRODUCTS.map((p) => {
          const PIcon = p.icon;
          const isSelected = p.id === selectedProduct;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProduct(p.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-white border-blue-600 ring-2 ring-blue-500/20 shadow-sm"
                  : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${p.badgeColor}`}>
                  <PIcon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                  {p.name}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 mt-3 text-base">{p.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.tagline}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Product Detail Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-start gap-3">
            <div className={`p-3 rounded-xl ${product.badgeColor}`}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900">{product.name}</h2>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${product.badgeColor}`}>
                  {product.badge}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{product.tagline}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium">Target Sweet Spot</span>
            <p className="text-sm font-semibold text-slate-800">{product.marketSize}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">
          {product.overview}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Buyer & Personas */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" /> Target Buyer Personas
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-2">
              <span className="text-xs font-semibold text-slate-500">Primary Authority:</span>
              <p className="text-sm font-semibold text-slate-900">{product.targetBuyer}</p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-500">Typical Job Titles:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {product.typicalTitles.map((t) => (
                    <span key={t} className="text-xs bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pt-2">
              <ShieldCheck className="w-4 h-4 text-rose-600" /> Displaces Legacy Alternatives
            </h3>
            <ul className="space-y-1.5">
              {product.displaces.map((d) => (
                <li key={d} className="text-xs text-slate-600 flex items-center gap-2 bg-rose-50/50 border border-rose-100 p-2 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits & Qualification */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Differentiating Benefits
            </h3>
            <ul className="space-y-2">
              {product.keyBenefits.map((b) => (
                <li key={b} className="text-xs text-slate-700 flex items-start gap-2 bg-emerald-50/50 border border-emerald-100 p-2.5 rounded">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pt-2">
              <Clock className="w-4 h-4 text-amber-600" /> Qualification Triggers
            </h3>
            <ul className="space-y-1.5">
              {product.qualificationCriteria.map((q) => (
                <li key={q} className="text-xs text-slate-600 flex items-center gap-2 bg-amber-50/50 border border-amber-100 p-2 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sample Pitch Script */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" /> Approved Outbound Pitch Snippet
            </span>
            <span className="text-[10px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-mono font-semibold">
              Verified Claims Library
            </span>
          </div>
          <p className="text-xs sm:text-sm text-blue-950 font-serif italic leading-relaxed">
            &ldquo;{product.samplePitch}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

