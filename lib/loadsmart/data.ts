import { Pod, Account, Mailbox, PipelineStage } from "./types";

export const INITIAL_PODS: Pod[] = [
  {
    id: "pod-1",
    name: "Pod 1 - Mid-Market FTL & Multimodal",
    product_focus: "Freight Brokerage & Managed Logistics",
    lead_ae: "Marcus Vance",
    lead_sdr: "Sarah Jenkins",
    daily_target_accounts: 20,
    active_sequenced: 15,
    meetings_booked: 4,
    pipeline_value: "$240,000",
    health_score: 98.7,
    leak_rate: "5%",
    description: "Targets mid-market shippers ($15M-$50M transportation spend) with dedicated FTL, drayage, and refrigerated freight requirements."
  },
  {
    id: "pod-2",
    name: "Pod 2 - Enterprise ShipperGuide TMS",
    product_focus: "ShipperGuide TMS",
    lead_ae: "Elena Rostova",
    lead_sdr: "David Chen",
    daily_target_accounts: 20,
    active_sequenced: 14,
    meetings_booked: 3,
    pipeline_value: "$420,000",
    health_score: 99.2,
    leak_rate: "10%",
    description: "Focuses on high-volume shippers replacing legacy TMS or fragmented spreadsheets with unified procurement, execution, and analytics."
  },
  {
    id: "pod-3",
    name: "Pod 3 - Opendock Facility & Yard Network",
    product_focus: "Opendock Dock Scheduling",
    lead_ae: "James Thorne",
    lead_sdr: "Maya Lin",
    daily_target_accounts: 20,
    active_sequenced: 16,
    meetings_booked: 5,
    pipeline_value: "$195,000",
    health_score: 97.9,
    leak_rate: "10%",
    description: "Targets multi-facility manufacturing and distribution centers facing dock congestion, detention penalties, and lack of carrier visibility."
  },
  {
    id: "pod-4",
    name: "Pod 4 - Loadsmart AI Autonomous Operations",
    product_focus: "Loadsmart AI Logistics Agents",
    lead_ae: "Carlos Mendez",
    lead_sdr: "Rachel Cole",
    daily_target_accounts: 20,
    active_sequenced: 12,
    meetings_booked: 2,
    pipeline_value: "$580,000",
    health_score: 98.4,
    leak_rate: "15%",
    description: "Engages enterprise supply chain executives with 11 autonomous AI agents executing spot quotes, tracking, and carrier vetting alongside human Freight Experts."
  }
];

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: "acc-101",
    pod_id: "pod-2",
    name: "Apex Beverage Logistics",
    domain: "apexbeverage.com",
    industry: "Food & Beverage",
    est_freight_spend: "$35,000,000",
    facility_count: 8,
    incumbent_tms: "Legacy Excel + MercuryGate",
    icp_score: 94,
    stage: "COPY_DRAFTED",
    latest_trigger: "Announced 2 new regional distribution centers in Dallas and Atlanta; expanding carrier network.",
    created_at: "2026-11-11T06:15:00Z",
    primary_contact: {
      id: "cnt-201",
      account_id: "acc-101",
      name: "Greg Sutherland",
      title: "VP Logistics & Transportation",
      persona: "VP Logistics",
      email: "greg.sutherland@apexbeverage.com",
      email_status: "VERIFIED",
      phone: "+1 (312) 555-0182",
      linkedin: "https://linkedin.com/in/greg-sutherland-logistics"
    },
    touchpoints: [
      {
        id: "tp-301",
        contact_id: "cnt-201",
        account_name: "Apex Beverage Logistics",
        contact_name: "Greg Sutherland",
        step_number: 1,
        channel: "EMAIL",
        subject: "Quick question on Dallas DC carrier procurement",
        body_text: "Greg - saw Apex is bringing two new regional facilities online in Dallas and Atlanta this winter. When shippers scale multi-region distribution on top of MercuryGate, procurement friction and manual rate lookups typically slow dispatch cycles. ShipperGuide connects your procurement directly with 230,000 vetted carriers, cutting spot quote turnaround from 4 hours to seconds inside your existing workflow. Worth a brief 10-minute glance at how comparable beverage shippers benchmarked their initial Dallas lanes?",
        proof_point: "230,000 vetted carriers, SOC 2 Type II certified platform",
        status: "DRAFTED"
      }
    ]
  },
  {
    id: "acc-102",
    pod_id: "pod-3",
    name: "Vanguard Cold Storage & DC",
    domain: "vanguardcold.com",
    industry: "Cold Chain Warehousing",
    est_freight_spend: "$18,000,000",
    facility_count: 14,
    incumbent_tms: "Manual Phone/Email Scheduling",
    icp_score: 91,
    stage: "COPY_DRAFTED",
    latest_trigger: "High dwell times and carrier detention fines reported across Ohio facilities.",
    created_at: "2026-11-11T06:22:00Z",
    primary_contact: {
      id: "cnt-202",
      account_id: "acc-102",
      name: "Danielle Vance",
      title: "Director of Warehouse Operations",
      persona: "Director DC Operations",
      email: "dvance@vanguardcold.com",
      email_status: "VERIFIED",
      phone: "+1 (614) 555-0193",
      linkedin: "https://linkedin.com/in/daniellevance-dc"
    },
    touchpoints: [
      {
        id: "tp-302",
        contact_id: "cnt-202",
        account_name: "Vanguard Cold Storage & DC",
        contact_name: "Danielle Vance",
        step_number: 1,
        channel: "EMAIL",
        subject: "Detention reduction across Vanguard cold facilities",
        body_text: "Danielle - noticing Vanguard's refrigerated network scaling to 14 facilities. In temperature-controlled distribution, manual dock scheduling over email creates costly yard bottlenecks and driver detention penalties. Opendock automates carrier appointment booking across 4,500+ warehouses with over 14 million scheduled dock appointments annually, providing gate guards and dispatchers real-time trailer visibility. Open to seeing the 2-minute workflow our cold storage operators use to eliminate check-in calls?",
        proof_point: "4,500 warehouses on network, 14M+ dock appointments annually",
        status: "DRAFTED"
      }
    ]
  },
  {
    id: "acc-103",
    pod_id: "pod-4",
    name: "Meridian Industrial Supply",
    domain: "meridianind.com",
    industry: "Industrial Manufacturing",
    est_freight_spend: "$62,000,000",
    facility_count: 22,
    incumbent_tms: "SAP S/4HANA TM",
    icp_score: 96,
    stage: "SEQUENCED",
    latest_trigger: "CIO announced Q4 supply chain automation and AI operational initiative.",
    created_at: "2026-11-10T07:10:00Z",
    primary_contact: {
      id: "cnt-203",
      account_id: "acc-103",
      name: "Karan Patel",
      title: "VP of Supply Chain Technology",
      persona: "Chief Supply Chain Officer / CIO",
      email: "kpatel@meridianind.com",
      email_status: "VERIFIED",
      phone: "+1 (415) 555-0211",
      linkedin: "https://linkedin.com/in/karanpatel-supplychain"
    }
  },
  {
    id: "acc-104",
    pod_id: "pod-1",
    name: "TrueNorth Retail Distributors",
    domain: "truenorthretail.com",
    industry: "Consumer Retail",
    est_freight_spend: "$22,000,000",
    facility_count: 5,
    incumbent_tms: "Spreadsheets",
    icp_score: 88,
    stage: "SEQUENCED",
    latest_trigger: "Holiday peak volume ramp up; need surge capacity in Midwest corridor.",
    created_at: "2026-11-10T08:00:00Z",
    primary_contact: {
      id: "cnt-204",
      account_id: "acc-104",
      name: "Marcus Brody",
      title: "Senior Director of Transportation",
      persona: "Transportation Director",
      email: "mbrody@truenorthretail.com",
      email_status: "VERIFIED",
      phone: "+1 (847) 555-0144",
      linkedin: "https://linkedin.com/in/marcusbrody-transport"
    }
  },
  {
    id: "acc-105",
    pod_id: "pod-2",
    name: "Summit Agro Chemicals",
    domain: "summitagrochem.com",
    industry: "Chemicals & AgTech",
    est_freight_spend: "$40,000,000",
    facility_count: 6,
    incumbent_tms: "Oracle OTM",
    icp_score: 65,
    stage: "PARKED_CRM_COLLISION",
    leak_reason: "Active opportunity in Salesforce owned by Enterprise Team (AE: J. Miller)",
    latest_trigger: "RFP renewal for bulk liquids and hazmat lanes.",
    created_at: "2026-11-11T06:30:00Z"
  },
  {
    id: "acc-106",
    pod_id: "pod-3",
    name: "Beacon Packaging Co",
    domain: "beaconpack.com",
    industry: "Packaging & Corrugated",
    est_freight_spend: "$8,000,000",
    facility_count: 3,
    incumbent_tms: "None",
    icp_score: 52,
    stage: "DISQUALIFIED",
    leak_reason: "Estimated transportation spend below $10M threshold and only 3 dock doors.",
    latest_trigger: "General hiring for warehouse clerk.",
    created_at: "2026-11-11T06:35:00Z"
  }
];

export const INITIAL_MAILBOXES: Mailbox[] = [
  { id: "mbx-1", pod_id: "pod-1", email: "s.jenkins@loadsmart-freight.co", domain: "loadsmart-freight.co", rep_name: "Sarah Jenkins", daily_limit: 40, sent_today: 18, bounce_rate: 0.8, warmup_status: "HEALTHY" },
  { id: "mbx-2", pod_id: "pod-1", email: "sarah.j@loadsmart-logistics.net", domain: "loadsmart-logistics.net", rep_name: "Sarah Jenkins", daily_limit: 40, sent_today: 22, bounce_rate: 1.1, warmup_status: "HEALTHY" },
  { id: "mbx-3", pod_id: "pod-2", email: "d.chen@shipperguide-tms.io", domain: "shipperguide-tms.io", rep_name: "David Chen", daily_limit: 40, sent_today: 14, bounce_rate: 0.5, warmup_status: "HEALTHY" },
  { id: "mbx-4", pod_id: "pod-2", email: "david.c@shipperguide-platform.com", domain: "shipperguide-platform.com", rep_name: "David Chen", daily_limit: 40, sent_today: 19, bounce_rate: 0.6, warmup_status: "HEALTHY" },
  { id: "mbx-5", pod_id: "pod-3", email: "m.lin@opendock-network.com", domain: "opendock-network.com", rep_name: "Maya Lin", daily_limit: 40, sent_today: 24, bounce_rate: 1.2, warmup_status: "HEALTHY" },
  { id: "mbx-6", pod_id: "pod-3", email: "maya.l@opendock-scheduler.net", domain: "opendock-scheduler.net", rep_name: "Maya Lin", daily_limit: 40, sent_today: 16, bounce_rate: 0.9, warmup_status: "HEALTHY" },
  { id: "mbx-7", pod_id: "pod-4", email: "r.cole@loadsmart-ai.cloud", domain: "loadsmart-ai.cloud", rep_name: "Rachel Cole", daily_limit: 35, sent_today: 12, bounce_rate: 0.7, warmup_status: "WARMING_UP" },
  { id: "mbx-8", pod_id: "pod-4", email: "rachel.c@loadsmart-agents.io", domain: "loadsmart-agents.io", rep_name: "Rachel Cole", daily_limit: 35, sent_today: 15, bounce_rate: 0.8, warmup_status: "WARMING_UP" }
];

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: "stg-1", code: "la-signal", time_slot: "06:00 CT", name: "Signal Scout", description: "Ingests dated buying triggers; scores 20 candidates per pod", owner: "SYSTEM", status: "COMPLETED" },
  { id: "stg-2", code: "la-crm-audit", time_slot: "06:30 CT", name: "CRM Shield", description: "Cross-references Salesforce & DNC; parks collisions", owner: "SYSTEM", status: "COMPLETED" },
  { id: "stg-3", code: "la-abm-tag", time_slot: "07:00 CT", name: "Pod Allocation", description: "Designates account tiers and verifies product mapping", owner: "REVOPS", status: "COMPLETED" },
  { id: "stg-4", code: "la-persona-enrich", time_slot: "07:15 CT", name: "Contact Reveal", description: "Executes Clay/Apollo waterfall to reveal verified decision makers", owner: "SYSTEM", status: "COMPLETED" },
  { id: "stg-5", code: "la-research", time_slot: "07:45 CT", name: "Account Brief", description: "Synthesizes tech stack, ERP, TMS, and operational pains (W=1.00)", owner: "SYSTEM", status: "COMPLETED" },
  { id: "stg-6", code: "la-email", time_slot: "08:15 CT", name: "PAS Copywriter", description: "Synthesizes 1-to-1 cold emails grounded in claims library", owner: "SYSTEM", status: "COMPLETED" },
  { id: "stg-7", code: "la-sequence", time_slot: "08:30 CT", name: "Human Gate & Sequence", description: "Rep reviews & signs off batch; dispatches to Gong / Amplemarket", owner: "AE_SDR_POD", status: "WAITING" },
  { id: "stg-8", code: "la-daily-report", time_slot: "17:00 CT", name: "Daily Leak Digest", description: "Analyzes funnel leaks, replies, and deliverability status", owner: "SYSTEM", status: "WAITING" }
];
