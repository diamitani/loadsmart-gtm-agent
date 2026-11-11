import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { AutomationBlueprint } from "@/lib/types";

export async function GET() {
  try {
    const automationsDir = path.join(process.cwd(), "automations");
    const blueprints: AutomationBlueprint[] = [];

    // 1. Read n8n workflows
    const n8nDir = path.join(automationsDir, "n8n");
    if (fs.existsSync(n8nDir)) {
      const files = fs.readdirSync(n8nDir);
      for (const file of files) {
        if (file.endsWith(".json")) {
          const content = fs.readFileSync(path.join(n8nDir, file), "utf-8");
          const parsed = JSON.parse(content);
          blueprints.push({
            id: file.replace(".json", ""),
            name: parsed.name || file,
            type: "n8n",
            platform: "n8n Self-Hosted / Cloud",
            description: "Deterministic workflow for Loadsmart ABM Pod pipeline execution.",
            filename: file,
            content
          });
        }
      }
    }

    // 2. Read Clay schema
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
        content
      });
    }

    // 3. Read Salesforce schema
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
        content
      });
    }

    return NextResponse.json({ workflows: blueprints });
  } catch (error) {
    console.error("Failed to read automations:", error);
    return NextResponse.json({ error: "Failed to list automation blueprints" }, { status: 500 });
  }
}
