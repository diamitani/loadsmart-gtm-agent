import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { AutomationBlueprint } from "@/lib/types";

const n8nDescriptions: Record<string, string> = {
  "00-loadsmart-6step-prospect-engine.json":
    "Unified 6-step master workflow (Signals -> Salesforce CRM Shield -> ZoomInfo/Clay Waterfall -> EDGAR/Perplexity Research -> Claude PAS + Claims Linter -> Slack Approval & Gong/Apollo Dispatch with dry_run=true).",
  "01-loadsmart-daily-signal-scout.json":
    "06:00 CT signal scout scanning freight news, facility permits, and logistics hiring triggers per pod.",
  "02-loadsmart-clay-waterfall-enrich.json":
    "Clay webhook orchestrating Apollo -> Hunter -> Prospeo contact discovery for cleared accounts.",
  "03-loadsmart-gong-sequence-enroll.json":
    "Approved batch dispatcher enrolling vetted contacts into Gong Engage multi-channel flows.",
  "04-loadsmart-pod-leak-digest.json":
    "17:00 CT daily funnel digest reporting replies, meetings, bounce rates, and leak points to Slack.",
  "05-loadsmart-error-alert-handler.json":
    "Companion n8n Error Trigger workflow formatting node failures and alerting #gtm-ops-alerts.",
};

export async function GET() {
  try {
    const automationsDir = path.join(process.cwd(), "automations");
    const blueprints: AutomationBlueprint[] = [];

    // 1. Read n8n workflows in deterministic order (00 master first)
    const n8nDir = path.join(automationsDir, "n8n");
    if (fs.existsSync(n8nDir)) {
      const files = fs.readdirSync(n8nDir).filter((f) => f.endsWith(".json")).sort();
      for (const file of files) {
        const content = fs.readFileSync(path.join(n8nDir, file), "utf-8");
        const parsed = JSON.parse(content);
        blueprints.push({
          id: file.replace(".json", ""),
          name: parsed.name || file,
          type: "n8n",
          platform: "n8n Workflow JSON",
          description:
            n8nDescriptions[file] ||
            "Deterministic workflow for Loadsmart ABM Pod pipeline execution.",
          filename: file,
          content,
        });
      }
    }

    // 2. Read AI Setup Prompt
    const promptFile = path.join(automationsDir, "prompts", "loadsmart-n8n-setup-prompt.md");
    if (fs.existsSync(promptFile)) {
      const content = fs.readFileSync(promptFile, "utf-8");
      blueprints.push({
        id: "loadsmart-n8n-setup-prompt",
        name: "Loadsmart n8n AI Setup & Customization Prompt",
        type: "prompt",
        platform: "Claude / n8n Setup Prompt",
        description:
          "Copy-and-paste prompt configuring Salesforce OAuth, Clay waterfall webhooks, Claims Library rules, and dry-run verification.",
        filename: "loadsmart-n8n-setup-prompt.md",
        content,
      });
    }

    // 3. Read Clay schema
    const clayFile = path.join(automationsDir, "clay", "freight-waterfall-schema.json");
    if (fs.existsSync(clayFile)) {
      const content = fs.readFileSync(clayFile, "utf-8");
      blueprints.push({
        id: "clay-freight-waterfall",
        name: "Clay Waterfall Contact Enrichment Schema",
        type: "clay",
        platform: "Clay Table",
        description: "Enrichment formula chain: Apollo -> Hunter -> Prospeo -> Dropcontact.",
        filename: "freight-waterfall-schema.json",
        content,
      });
    }

    // 4. Read Salesforce schema
    const sfFile = path.join(automationsDir, "salesforce", "loadsmart-fields.json");
    if (fs.existsSync(sfFile)) {
      const content = fs.readFileSync(sfFile, "utf-8");
      blueprints.push({
        id: "salesforce-custom-fields",
        name: "Salesforce Custom Field Mapping (Account Object)",
        type: "salesforce",
        platform: "Salesforce CRM",
        description: "Custom ABM Pod and ICP fields for account scoring and deduplication.",
        filename: "loadsmart-fields.json",
        content,
      });
    }

    return NextResponse.json({ workflows: blueprints });
  } catch (error) {
    console.error("Failed to read automations:", error);
    return NextResponse.json({ error: "Failed to list automation blueprints" }, { status: 500 });
  }
}
