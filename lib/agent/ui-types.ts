import type { UIMessage } from "ai";
import type { NextAction, QualityReport, StageEvent } from "@/lib/pal/types";

/** Compact run summary streamed to the chat as a `data-run` part. */
export interface RunCard {
  id: string;
  status: string;
  title: string;
  W?: number;
  waves?: string[][];
  compression?: number;
  quality?: Pick<QualityReport, "score" | "verdict">;
  truthNotice?: string | null;
  nextAction?: NextAction;
  assumptions?: string[];
  durationMs?: number;
  model: string;
}

export interface ArtifactCard {
  id: string;
  title: string;
  kind: string;
  group: "asset" | "pop";
  preview: string;
}

export type EnablyDataParts = {
  stage: StageEvent;
  artifact: ArtifactCard;
  run: RunCard;
};

export type EnablyUIMessage = UIMessage<unknown, EnablyDataParts>;
