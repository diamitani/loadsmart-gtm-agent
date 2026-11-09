"use client";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const current = root.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("enably-theme", next);
    } catch {}
  };
  return (
    <button onClick={toggle} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-paper-2 hover:text-ink" aria-label="Toggle light/dark theme">
      <Sun className="hidden h-4 w-4 [:root[data-theme=dark]_&]:block" />
      <Moon className="h-4 w-4 [:root[data-theme=dark]_&]:hidden" />
    </button>
  );
}
