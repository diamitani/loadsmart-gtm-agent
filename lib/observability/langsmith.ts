import { traceable } from "langsmith/traceable";

/**
 * LangSmith observability.
 *
 * Each PAL stage is wrapped with `traceable`, so a run shows up in LangSmith
 * as one parent trace ("enably.pal.run") with a child span per stage and per
 * asset build, including inputs/outputs and timings. When LANGSMITH_API_KEY is
 * missing this is a zero-cost pass-through.
 *
 * Env (read by the langsmith SDK): LANGSMITH_API_KEY, LANGSMITH_PROJECT,
 * LANGSMITH_TRACING=true, optional LANGSMITH_ENDPOINT.
 */
export function tracingEnabled() {
  return !!process.env.LANGSMITH_API_KEY && process.env.LANGSMITH_TRACING !== "false";
}

export function trace<F extends (...args: any[]) => any>( // eslint-disable-line @typescript-eslint/no-explicit-any
  name: string,
  fn: F,
  opts: { runType?: "chain" | "llm" | "tool" | "retriever"; tags?: string[]; metadata?: Record<string, unknown> } = {},
): F {
  if (!tracingEnabled()) return fn;
  if (!process.env.LANGSMITH_TRACING) process.env.LANGSMITH_TRACING = "true";
  return traceable(fn, {
    name,
    run_type: opts.runType ?? "chain",
    tags: ["enablygtm", ...(opts.tags ?? [])],
    metadata: opts.metadata,
    project_name: process.env.LANGSMITH_PROJECT || "enablygtm",
  }) as unknown as F;
}

/** Link to the LangSmith project so the UI can deep-link from a run. */
export function langsmithProjectUrl() {
  if (!tracingEnabled()) return undefined;
  const project = encodeURIComponent(process.env.LANGSMITH_PROJECT || "enablygtm");
  return `https://smith.langchain.com/projects?search=${project}`;
}
