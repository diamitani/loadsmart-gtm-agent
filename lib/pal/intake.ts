import type { Intake, IntakeInput } from "./types";

const URL_RE = /\bhttps?:\/\/[^\s<>()"']+/gi;

/**
 * Stage 1 — Intake.
 * Normalises every input channel (chat, questionnaire, files, links, webhook)
 * into one compiled MASTER.md. Every later stage reads only this document, so
 * the run is reproducible from what is stored.
 */
export function compileIntake(input: IntakeInput): Intake {
  const messages = input.messages.map((m) => m.trim()).filter(Boolean);
  const questionnaire = Object.fromEntries(
    Object.entries(input.questionnaire ?? {}).filter(([, v]) => typeof v === "string" && v.trim()),
  );
  const files = (input.files ?? []).filter((f) => f.text?.trim());

  const linksFromText = messages.join("\n").match(URL_RE) ?? [];
  const links = dedupe([...(input.links ?? []), ...linksFromText].map((l) => l.replace(/[.,;]+$/, "")));

  const qText = Object.entries(questionnaire)
    .map(([k, v]) => `${humanize(k)}: ${v}`)
    .join("\n");
  const text = [messages.join("\n\n"), qText].filter(Boolean).join("\n\n");

  const masterMd = [
    "# MASTER.md — compiled request",
    "",
    "## Request (verbatim, oldest first)",
    ...messages.map((m, i) => `${i + 1}. ${m.replace(/\n+/g, " ")}`),
    "",
    qText ? "## Questionnaire\n" + qText + "\n" : "",
    links.length ? "## Links\n" + links.map((l) => `- ${l}`).join("\n") + "\n" : "",
    files.length
      ? "## Files\n" +
        files.map((f) => `### ${f.name}\n${truncate(f.text, 4000)}`).join("\n\n") +
        "\n"
      : "",
  ]
    .filter((s) => s !== "")
    .join("\n");

  return {
    source: input.source ?? "chat",
    text,
    links,
    files,
    questionnaire,
    masterMd,
    wordCount: text.split(/\s+/).filter(Boolean).length,
  };
}

export function humanize(key: string): string {
  return key.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + "\n…[truncated]" : s;
}

function dedupe<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}
