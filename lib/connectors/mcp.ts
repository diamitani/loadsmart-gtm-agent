import "server-only";
import { createMCPClient, type MCPClient } from "@ai-sdk/mcp";
import type { ToolSet } from "ai";

/**
 * MCP client hub — plugs any Model Context Protocol server into the Architect.
 *
 * ENABLY_MCP_SERVERS is a JSON array, e.g.
 *   [{"name":"clay","url":"https://…/mcp","headers":{"Authorization":"Bearer ${CLAY_MCP_TOKEN}"}},
 *    {"name":"n8n","url":"https://your-n8n/mcp-server/http","readOnly":false,"allow":["create_tasks"]}]
 *
 * - `${VAR}` in header values is filled from server env, so secrets never sit in the JSON.
 * - Tools are namespaced `<server>__<tool>`.
 * - Read-looking tools (get/list/search/find/read/query/describe/fetch) run freely;
 *   every other tool requires human approval in the chat. `readOnly: true` hides write tools.
 * - `allow` (optional) limits which tools are exposed.
 */
export interface McpServerConfig {
  name: string;
  url: string;
  transport?: "http" | "sse";
  headers?: Record<string, string>;
  readOnly?: boolean;
  allow?: string[];
}

export const READ_TOOL = /^(get|list|search|find|read|query|describe|fetch|lookup|count)[_-]?/i;

export function parseMcpConfig(raw = process.env.ENABLY_MCP_SERVERS): McpServerConfig[] {
  if (!raw) return [];
  try {
    const list = JSON.parse(raw) as McpServerConfig[];
    return list.filter((s) => s?.name && /^https:\/\//.test(s.url ?? "") && /^[a-z0-9_-]+$/i.test(s.name));
  } catch {
    console.warn("[enably] ENABLY_MCP_SERVERS is not valid JSON — ignoring");
    return [];
  }
}

export function fillEnv(headers: Record<string, string> = {}): Record<string, string> {
  return Object.fromEntries(Object.entries(headers).map(([k, v]) => [k, v.replace(/\$\{([A-Z0-9_]+)\}/g, (_, n) => process.env[n] ?? "")]));
}

export interface McpLoadResult {
  tools: ToolSet;
  servers: { name: string; ok: boolean; tools: number; error?: string }[];
  close: () => Promise<void>;
}

export async function loadMcpTools(configs = parseMcpConfig()): Promise<McpLoadResult> {
  const clients: MCPClient[] = [];
  const tools: ToolSet = {};
  const servers: McpLoadResult["servers"] = [];

  await Promise.all(
    configs.map(async (cfg) => {
      try {
        const client = await withTimeout(createMCPClient({ transport: { type: cfg.transport ?? "http", url: cfg.url, headers: fillEnv(cfg.headers) } }), 6000);
        clients.push(client);
        const set = await withTimeout(client.tools(), 6000);
        let count = 0;
        for (const [name, t] of Object.entries(set)) {
          if (cfg.allow?.length && !cfg.allow.includes(name)) continue;
          const isRead = READ_TOOL.test(name);
          if (cfg.readOnly && !isRead) continue;
          tools[`${cfg.name}__${name}`] = { ...(t as object), needsApproval: !isRead } as ToolSet[string];
          count++;
        }
        servers.push({ name: cfg.name, ok: true, tools: count });
      } catch (err) {
        servers.push({ name: cfg.name, ok: false, tools: 0, error: (err as Error).message });
      }
    }),
  );

  return {
    tools,
    servers,
    close: async () => {
      await Promise.allSettled(clients.map((c) => (c as unknown as { close: () => Promise<void> }).close()));
    },
  };
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`timed out after ${ms}ms`)), ms))]);
}
