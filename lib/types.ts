export interface Pod {
  id: string;
  name: string;
  product_focus: string;
  lead_ae: string;
  lead_sdr: string;
  daily_target_accounts: number;
  active_sequenced: number;
  meetings_booked: number;
  pipeline_value: string;
  health_score: number;
  leak_rate: string;
  description: string;
}

export type AccountStage =
  | "NOMINATED"
  | "PARKED_CRM_COLLISION"
  | "CRM_CLEARED"
  | "ENRICHED"
  | "RESEARCHED"
  | "COPY_DRAFTED"
  | "APPROVED"
  | "SEQUENCED"
  | "MEETING_BOOKED"
  | "DISQUALIFIED";

export interface Account {
  id: string;
  pod_id: string;
  name: string;
  domain: string;
  industry: string;
  est_freight_spend: string;
  facility_count: number;
  incumbent_tms: string;
  icp_score: number;
  stage: AccountStage;
  leak_reason?: string;
  latest_trigger?: string;
  primary_contact?: Contact;
  touchpoints?: Touchpoint[];
  created_at: string;
}

export interface Contact {
  id: string;
  account_id: string;
  name: string;
  title: string;
  persona: string;
  email: string;
  email_status: "VERIFIED" | "CATCH_ALL" | "INVALID" | "PENDING";
  phone: string;
  linkedin: string;
}

export interface Touchpoint {
  id: string;
  contact_id: string;
  account_name: string;
  contact_name: string;
  step_number: number;
  channel: "EMAIL" | "PHONE" | "LINKEDIN" | "VOICEMAIL_DROP";
  subject: string;
  body_text: string;
  proof_point: string;
  status: "DRAFTED" | "APPROVED" | "SENT" | "REPLIED";
}

export interface Mailbox {
  id: string;
  pod_id: string;
  email: string;
  domain: string;
  rep_name: string;
  daily_limit: number;
  sent_today: number;
  bounce_rate: number;
  warmup_status: "HEALTHY" | "WARMING_UP" | "THROTTLED" | "PAUSED";
}

export interface PipelineStage {
  id: string;
  code: string;
  time_slot: string;
  name: string;
  description: string;
  owner: "SYSTEM" | "REVOPS" | "AE_SDR_POD";
  status: "COMPLETED" | "RUNNING" | "WAITING" | "PAUSED";
}

export interface AutomationBlueprint {
  id: string;
  name: string;
  type: "n8n" | "clay" | "salesforce" | "gong";
  platform: string;
  description: string;
  filename: string;
  content: string;
}

export interface PodMetricsSummary {
  targetAccounts: number;
  activeSequenced: number;
  meetingsBooked: number;
  pipelineValue: string;
  mailboxHealthScore: number;
  leakRate: number;
}
