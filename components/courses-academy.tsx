"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Download,
  Terminal,
  Sparkles,
  ArrowRight,
  Workflow,
  Bot,
} from "lucide-react";
import { COURSE_LESSONS, COURSE_TRACKS, type CourseTrackId } from "@/lib/courses-data";

const STORAGE_KEY = "loadsmart-academy-completed-v1";

export function CoursesAcademy() {
  const [activeTrack, setActiveTrack] = useState<CourseTrackId>("harness");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("harness-01-setup");
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCompletedIds(parsed);
      }
    } catch {}
  }, []);

  function toggleComplete(id: string) {
    setCompletedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  const trackLessons = useMemo(
    () => COURSE_LESSONS.filter((l) => l.track === activeTrack),
    [activeTrack],
  );

  const currentTrackMeta = useMemo(
    () => COURSE_TRACKS.find((t) => t.id === activeTrack) ?? COURSE_TRACKS[0],
    [activeTrack],
  );

  const activeLesson = useMemo(() => {
    return (
      trackLessons.find((l) => l.id === selectedLessonId) ||
      trackLessons[0]
    );
  }, [trackLessons, selectedLessonId]);

  const completedInTrack = useMemo(
    () => trackLessons.filter((l) => completedIds.includes(l.id)).length,
    [trackLessons, completedIds],
  );

  const totalCompleted = completedIds.length;
  const totalLessons = COURSE_LESSONS.length;
  const overallPct = Math.round((totalCompleted / totalLessons) * 100);

  function handleSelectTrack(track: CourseTrackId) {
    setActiveTrack(track);
    const first = COURSE_LESSONS.find((l) => l.track === track);
    if (first) setSelectedLessonId(first.id);
  }

  function handleCopyCode(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function handleDownloadArtifact(filename: string, content: string) {
    const isJson = filename.endsWith(".json");
    const blob = new Blob([content], { type: isJson ? "application/json" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const isCompleted = completedIds.includes(activeLesson.id);
  const currentIdx = trackLessons.findIndex((l) => l.id === activeLesson.id);
  const prevLesson = currentIdx > 0 ? trackLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < trackLessons.length - 1 ? trackLessons[currentIdx + 1] : null;

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 space-y-10">
      {/* Hero Header */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-blue-600">
            Loadsmart GTM AI Academy · Built on LetsVibeAI Curriculum
          </p>
          <h1 className="mt-2 max-w-3xl text-[32px] sm:text-[46px] font-bold leading-[1.06] tracking-[-0.03em] text-slate-900 text-balance">
            Claude Code &amp; GTM Mastery for Loadsmart Pods.
          </h1>
          <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-slate-600">
            Two practical tracks adapting LetsVibeAI&apos;s Agent Harness Mastery and GTM Cowork playbooks specifically for Opendock, ShipperGuide TMS, and Loadsmart AI revenue teams.
          </p>
        </div>

        {/* Overall Progress Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 min-w-[260px] space-y-2.5 shrink-0">
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-semibold text-slate-900">Academy Progress</span>
            <span className="font-mono font-semibold tabular-nums text-blue-700">
              {totalCompleted}/{totalLessons} ({overallPct}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-200"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <p className="text-[12px] text-slate-500">
            Zero sign-in needed · Progress saves locally in your browser
          </p>
        </div>
      </section>

      {/* Track Selector Cards */}
      <section className="grid md:grid-cols-2 gap-4" role="tablist" aria-label="Course tracks">
        {COURSE_TRACKS.map((track) => {
          const active = activeTrack === track.id;
          const countDone = COURSE_LESSONS.filter(
            (l) => l.track === track.id && completedIds.includes(l.id),
          ).length;

          return (
            <button
              key={track.id}
              role="tab"
              aria-selected={active}
              onClick={() => handleSelectTrack(track.id)}
              className={`text-left rounded-2xl border p-6 transition-all ${
                active
                  ? "border-blue-600 bg-blue-50/50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-[12px] font-mono text-slate-500 tabular-nums">
                <span className="font-semibold text-blue-700">
                  {track.id === "harness" ? "Track 01 · Claude Code" : "Track 02 · Claude GTM"}
                </span>
                <span>
                  {countDone}/{track.lessonCount} complete
                </span>
              </div>
              <h2 className="mt-2 text-[20px] font-bold text-slate-900">{track.title}</h2>
              <p className="mt-0.5 text-[13.5px] font-medium text-slate-700">{track.subtitle}</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{track.description}</p>
              <p className="mt-3 text-[12px] text-slate-500">Audience: {track.audience}</p>
            </button>
          );
        })}
      </section>

      {/* Two-Zone Course Sandbox */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right/Side Syllabus Navigation (First on mobile or Left Sidebar on desktop) */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-[14px] font-bold text-slate-900">{currentTrackMeta.title}</h3>
                <p className="text-[12px] text-slate-500 tabular-nums">
                  {completedInTrack} of {trackLessons.length} lessons completed
                </p>
              </div>
              <BookOpen className="size-4 text-blue-600" />
            </div>

            <div className="space-y-1.5">
              {trackLessons.map((lesson) => {
                const selected = lesson.id === activeLesson.id;
                const done = completedIds.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`w-full text-left rounded-xl border p-3 transition-colors flex items-start gap-3 ${
                      selected
                        ? "border-blue-600 bg-blue-50/70"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span className="mt-0.5 shrink-0">
                      {done ? (
                        <CheckCircle2 className="size-4 text-emerald-600" />
                      ) : (
                        <Circle className={`size-4 ${selected ? "text-blue-600" : "text-slate-300"}`} />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-500 tabular-nums">
                        <span>Lesson {lesson.number}</span>
                        <span className="truncate">{lesson.duration}</span>
                      </div>
                      <p className="mt-0.5 text-[13.5px] font-semibold text-slate-900 leading-snug">
                        {lesson.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 space-y-2.5">
            <p className="text-[13.5px] font-bold text-slate-900">Practice With Live Tools</p>
            <div className="space-y-2 text-[13px]">
              <Link
                href="/skills"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-800 hover:border-blue-300"
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="size-3.5 text-blue-600" /> Download Skill .zip Files
                </span>
                <ArrowRight className="size-3.5 text-slate-400" />
              </Link>
              <Link
                href="/automations"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-800 hover:border-blue-300"
              >
                <span className="inline-flex items-center gap-2">
                  <Workflow className="size-3.5 text-blue-600" /> n8n Engine + Setup Prompt
                </span>
                <ArrowRight className="size-3.5 text-slate-400" />
              </Link>
              <Link
                href="/demo"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-medium text-slate-800 hover:border-blue-300"
              >
                <span className="inline-flex items-center gap-2">
                  <Bot className="size-3.5 text-blue-600" /> Open Agent Workspace
                </span>
                <ArrowRight className="size-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Left/Main Lesson Stage */}
        <motion.article
          key={activeLesson.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6"
        >
          {/* Lesson Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 text-[12px] font-mono text-slate-500 tabular-nums">
                <span className="font-semibold text-blue-700">
                  {activeLesson.track === "harness" ? "Track 01" : "Track 02"} · Lesson {activeLesson.number}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeLesson.duration}</span>
                <span aria-hidden="true">·</span>
                <span>{activeLesson.roleFocus}</span>
              </div>
              <h2 className="text-[24px] sm:text-[28px] font-bold tracking-tight text-slate-900">
                {activeLesson.title}
              </h2>
              <p className="text-[15px] leading-relaxed text-slate-600">{activeLesson.summary}</p>
            </div>

            <button
              onClick={() => toggleComplete(activeLesson.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-semibold whitespace-nowrap shrink-0 border transition-colors ${
                isCompleted
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="size-4 text-emerald-600" />
              ) : (
                <Circle className="size-4 text-slate-400" />
              )}
              <span>{isCompleted ? "Completed" : "Mark Complete"}</span>
            </button>
          </div>

          {/* Key Principles & Loadsmart Scenario */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <h3 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
                Core Principles
              </h3>
              <ul className="space-y-2.5 text-[14px] leading-relaxed text-slate-700">
                {activeLesson.keyTakeaways.map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-2">
              <h3 className="text-[12.5px] font-semibold uppercase tracking-wider text-blue-700">
                Loadsmart Pod Field Scenario
              </h3>
              <p className="text-[14px] leading-relaxed text-slate-700">
                {activeLesson.loadsmartScenario}
              </p>
            </div>
          </div>

          {/* Copyable & Downloadable Lab Config / Prompt */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Terminal className="size-4 text-blue-600 shrink-0" />
                <div>
                  <p className="text-[13.5px] font-semibold text-slate-900">{activeLesson.artifactTitle}</p>
                  <p className="text-[11.5px] font-mono text-slate-500">{activeLesson.artifactFilename}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopyCode(activeLesson.artifactCode)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-slate-700 hover:bg-slate-100 whitespace-nowrap"
                >
                  {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                  <span>{copied ? "Copied" : "Copy Snippet"}</span>
                </button>
                <button
                  onClick={() =>
                    handleDownloadArtifact(activeLesson.artifactFilename, activeLesson.artifactCode)
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-[12.5px] font-semibold text-white hover:bg-slate-800 whitespace-nowrap"
                >
                  <Download className="size-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <pre className="p-4 sm:p-5 bg-slate-950 text-slate-100 text-[12.5px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {activeLesson.artifactCode}
            </pre>
          </div>

          {/* Hands-on Rep Action Steps */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-slate-500">
              Hands-On Pod Lab Steps
            </h3>
            <ol className="space-y-2 text-[14px] text-slate-700 list-decimal pl-5">
              {activeLesson.repChecklist.map((step) => (
                <li key={step} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Prev / Next Lesson Controls */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 text-[13.5px] font-semibold">
            {prevLesson ? (
              <button
                onClick={() => setSelectedLessonId(prevLesson.id)}
                className="text-slate-600 hover:text-blue-600 transition-colors text-left"
              >
                ← Lesson {prevLesson.number}: {prevLesson.title}
              </button>
            ) : (
              <span />
            )}

            {nextLesson && (
              <button
                onClick={() => setSelectedLessonId(nextLesson.id)}
                className="text-blue-600 hover:text-blue-700 transition-colors text-right ml-auto"
              >
                Lesson {nextLesson.number}: {nextLesson.title} →
              </button>
            )}
          </div>
        </motion.article>
      </section>
    </div>
  );
}
