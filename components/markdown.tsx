"use client";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";

/** Streaming-safe Markdown (handles half-finished tables/code while tokens arrive). */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose-enably", className)}>
      <Streamdown>{children}</Streamdown>
    </div>
  );
}
