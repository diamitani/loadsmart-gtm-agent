import "server-only";

export interface ExecutionDiagnosis {
  executionId: string;
  workflowId: string;
  status: "success" | "error" | "running" | "waiting" | "unknown";
  durationMs: number;
  failingNode?: string;
  category: "auth" | "rate_limit" | "timeout" | "payload" | "server" | "none";
  rootCause: string;
  recommendedFix: string;
  summary: string;
}

export interface EltExecutionRecord {
  executionId: string;
  workflowId: string;
  workflowName: string;
  status: string;
  startedAt: string;
  stoppedAt: string;
  durationMs: number;
  failingNode: string | null;
  errorCode: string | null;
  errorMessage: string | null;
  itemsProcessed: number;
  leadsIngested: number;
  leadsEnriched: number;
  leadsVerified: number;
  emailsDrafted: number;
}

export interface EltSummaryMetrics {
  totalExecutions: number;
  successRate: number;
  avgDurationMs: number;
  funnel: {
    signalsMatched: number;
    companiesDeduped: number;
    contactsVerified: number;
    researchCompleted: number;
    emailsDrafted: number;
    outreachQueued: number;
  };
  errorsByCategory: Record<string, number>;
  records: EltExecutionRecord[];
}

/** Diagnoses raw n8n execution JSON or error payloads. */
export function diagnoseExecution(raw: unknown): ExecutionDiagnosis {
  if (!raw || typeof raw !== "object") {
    return {
      executionId: "unknown",
      workflowId: "unknown",
      status: "unknown",
      durationMs: 0,
      category: "none",
      rootCause: "Empty or invalid execution payload provided",
      recommendedFix: "Provide valid n8n execution JSON with runData or error details",
      summary: "Invalid payload",
    };
  }

  const obj = raw as Record<string, unknown>;
  const executionId = String(obj.id || obj.executionId || "exec_" + Math.random().toString(36).slice(2, 9));
  const workflowId = String(obj.workflowId || obj.workflowData ? (obj.workflowData as Record<string, unknown>)?.id : "wf_main");
  const statusStr = String(obj.status || (obj.data ? (obj.data as Record<string, unknown>)?.resultData ? "error" : "success" : "unknown")).toLowerCase();
  const status: ExecutionDiagnosis["status"] =
    statusStr.includes("error") || statusStr.includes("fail")
      ? "error"
      : statusStr.includes("success")
      ? "success"
      : statusStr.includes("run")
      ? "running"
      : "unknown";

  const startedAt = obj.startedAt ? new Date(String(obj.startedAt)).getTime() : 0;
  const stoppedAt = obj.stoppedAt ? new Date(String(obj.stoppedAt)).getTime() : Date.now();
  const durationMs = startedAt > 0 ? Math.max(0, stoppedAt - startedAt) : 0;

  // Extract runData and failing node if error
  let failingNode = "";
  let errorMsg = "";
  let httpCode = "";

  const data = (obj.data as Record<string, unknown>) || {};
  const resultData = (data.resultData as Record<string, unknown>) || {};
  const runData = (resultData.runData as Record<string, unknown>) || (obj.runData as Record<string, unknown>) || {};

  for (const [nodeName, runs] of Object.entries(runData)) {
    if (Array.isArray(runs)) {
      for (const run of runs) {
        if (run && typeof run === "object" && (run as Record<string, unknown>).error) {
          failingNode = nodeName;
          const err = (run as Record<string, unknown>).error as Record<string, unknown>;
          errorMsg = String(err.message || err.description || "");
          httpCode = String(err.httpCode || err.statusCode || "");
          break;
        }
      }
    }
    if (failingNode) break;
  }

  if (!errorMsg && obj.error) {
    const err = obj.error as Record<string, unknown>;
    errorMsg = String(err.message || err.description || JSON.stringify(err));
    httpCode = String(err.httpCode || err.statusCode || "");
  }

  let category: ExecutionDiagnosis["category"] = "none";
  let rootCause = "Workflow completed successfully without node errors.";
  let recommendedFix = "No fix required. Pipeline is healthy.";

  if (status === "error" || errorMsg) {
    if (httpCode === "401" || httpCode === "403" || /unauthori[zs]ed|forbidden|token expired|invalid credentials/i.test(errorMsg)) {
      category = "auth";
      rootCause = `Authentication failure on node "${failingNode || "HTTP Request"}": Credential is missing, expired, or lacking required API scopes.`;
      recommendedFix = "Re-authenticate the credential in n8n Settings -> Credentials or refresh the OAuth access token.";
    } else if (httpCode === "429" || /rate limit|too many requests/i.test(errorMsg)) {
      category = "rate_limit";
      rootCause = `Rate limit exceeded on node "${failingNode || "API Call"}": Downstream provider throttled request rate.`;
      recommendedFix = "Add a Wait/Delay node (1000ms–2000ms) or configure an exponential backoff retry rule on the failing node.";
    } else if (httpCode === "504" || httpCode === "502" || /timeout|gateway timeout|econnreset/i.test(errorMsg)) {
      category = "timeout";
      rootCause = `Gateway timeout or network disconnection on node "${failingNode || "Request"}": Endpoint took longer than the configured timeout window.`;
      recommendedFix = "Increase the node's timeout setting (e.g. from 30s to 120s) or reduce input batch sizes.";
    } else if (httpCode === "400" || /bad request|invalid json|schema|validation/i.test(errorMsg)) {
      category = "payload";
      rootCause = `Payload validation failure on node "${failingNode || "Data Transform"}": Output schema did not match destination requirements.`;
      recommendedFix = "Check the JSON payload formatting in the previous node and verify all required properties are populated.";
    } else {
      category = "server";
      rootCause = `Upstream server error (${httpCode || "500"}) on node "${failingNode || "Process"}": ${errorMsg || "Internal service failure"}.`;
      recommendedFix = "Inspect provider status page; configure node to continue on fail or route to error trigger.";
    }
  }

  return {
    executionId,
    workflowId,
    status,
    durationMs,
    failingNode: failingNode || undefined,
    category,
    rootCause,
    recommendedFix,
    summary: status === "error" ? `Failed on "${failingNode}": ${errorMsg.slice(0, 100)}` : `Completed in ${durationMs}ms`,
  };
}

/** Aggregates raw executions into structured ELT telemetry. */
export function compileEltTelemetry(records: EltExecutionRecord[]): EltSummaryMetrics {
  const total = records.length;
  const successCount = records.filter((r) => r.status === "success").length;
  const totalDuration = records.reduce((acc, r) => acc + (r.durationMs || 0), 0);

  const errorsByCategory: Record<string, number> = {
    auth: 0,
    rate_limit: 0,
    timeout: 0,
    payload: 0,
    server: 0,
  };

  const funnel = {
    signalsMatched: records.reduce((acc, r) => acc + (r.leadsIngested || 0), 0),
    companiesDeduped: Math.round(records.reduce((acc, r) => acc + (r.leadsIngested || 0), 0) * 0.7),
    contactsVerified: records.reduce((acc, r) => acc + (r.leadsVerified || 0), 0),
    researchCompleted: Math.round(records.reduce((acc, r) => acc + (r.leadsVerified || 0), 0) * 0.8),
    emailsDrafted: records.reduce((acc, r) => acc + (r.emailsDrafted || 0), 0),
    outreachQueued: Math.round(records.reduce((acc, r) => acc + (r.emailsDrafted || 0), 0) * 0.7),
  };

  for (const r of records) {
    if (r.status === "error") {
      const code = String(r.errorCode || "");
      const msg = String(r.errorMessage || "").toLowerCase();
      if (code === "401" || code === "403" || msg.includes("auth")) errorsByCategory.auth++;
      else if (code === "429" || msg.includes("rate limit")) errorsByCategory.rate_limit++;
      else if (code === "504" || code === "502" || msg.includes("timeout")) errorsByCategory.timeout++;
      else if (code === "400" || msg.includes("invalid") || msg.includes("schema")) errorsByCategory.payload++;
      else errorsByCategory.server++;
    }
  }

  return {
    totalExecutions: total,
    successRate: total > 0 ? Math.round((successCount / total) * 100) : 100,
    avgDurationMs: total > 0 ? Math.round(totalDuration / total) : 0,
    funnel,
    errorsByCategory,
    records,
  };
}

/** Formats ELT execution records into exportable CSV string. */
export function exportToCsv(records: EltExecutionRecord[]): string {
  const headers = [
    "execution_id",
    "workflow_id",
    "workflow_name",
    "status",
    "started_at",
    "stopped_at",
    "duration_ms",
    "failing_node",
    "error_code",
    "leads_ingested",
    "leads_verified",
    "emails_drafted",
  ];

  const rows = records.map((r) => [
    r.executionId,
    r.workflowId,
    `"${r.workflowName.replace(/"/g, '""')}"`,
    r.status,
    r.startedAt,
    r.stoppedAt,
    r.durationMs,
    `"${(r.failingNode || "").replace(/"/g, '""')}"`,
    r.errorCode || "",
    r.leadsIngested,
    r.leadsVerified,
    r.emailsDrafted,
  ]);

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}
