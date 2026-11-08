/** Regenerates agent/skills/sdr-assistant/tools.schema.json from the implemented tools: `npx tsx --conditions=react-server scripts/export-tool-schemas.ts` */
import fs from "node:fs";
import { z } from "zod";
import { sdrTools } from "@/lib/connectors/sdr-tools";

const out = Object.entries(sdrTools()).map(([name, t]) => {
  const tt = t as unknown as { description?: string; inputSchema: z.ZodType; needsApproval?: boolean };
  return { name, description: tt.description, needsApproval: tt.needsApproval === true, parameters: z.toJSONSchema(tt.inputSchema, { io: "input" }) };
});
fs.writeFileSync("agent/skills/sdr-assistant/tools.schema.json", JSON.stringify(out, null, 2) + "\n");
console.log(`wrote ${out.length} tool schemas`);
