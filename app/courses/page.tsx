import type { Metadata } from "next";
import { CoursesAcademy } from "@/components/courses-academy";

export const metadata: Metadata = {
  title: "Loadsmart AI Academy · Claude Code & GTM Courses",
  description:
    "Loadsmart-branded Agent Harness Mastery (Claude Code) and Mastering Claude for GTM (Chat, Cowork, Projects & Skills) courses adapted from LetsVibeAI.",
};

export default function CoursesPage() {
  return <CoursesAcademy />;
}
