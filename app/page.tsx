import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { answers, author } from "@/lib/answers";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-blue-50/80 via-white to-white" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 pt-20 sm:pt-28 pb-16">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-600">
            GTM Engineer · Case answers
          </p>
          <h1 className="mt-5 max-w-4xl text-[40px] sm:text-[64px] font-bold leading-[1.04] tracking-[-0.035em] text-slate-900">
            Where the program leaks, and how I&apos;d fix it.
          </h1>
          <p className="mt-6 max-w-2xl text-[18px] sm:text-[20px] leading-relaxed text-slate-600">
            My answers to Loadsmart&apos;s seven questions on the AE/SDR pod program: diagnosis, list quality,
            signals, measurement, working with the pods, tools, and blind spots.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] text-slate-500">
            <span className="font-medium text-slate-900">{author.name}</span>
            <span>{author.role}</span>
            <span>{author.date}</span>
          </div>

          {/* Index */}
          <ol className="mt-14 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-px rounded-2xl overflow-hidden border border-slate-200 bg-slate-200">
            {answers.map((a) => (
              <li key={a.n} className="bg-white">
                <a href={`#q${a.n}`} className="group flex h-full flex-col justify-between gap-6 p-4 hover:bg-slate-50 transition-colors">
                  <span className="font-mono text-[12px] text-slate-400">0{a.n}</span>
                  <span className="text-[14px] font-semibold leading-snug text-slate-900 group-hover:text-blue-600 transition-colors">
                    {a.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The short version */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 pb-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-blue-300">The short version</p>
          <ul className="mt-6 grid sm:grid-cols-2 gap-x-10 gap-y-5">
            {answers.map((a) => (
              <li key={a.n} className="flex gap-4">
                <span className="font-mono text-[13px] text-slate-500 pt-1">0{a.n}</span>
                <span className="text-[17px] leading-snug text-slate-100">{a.headline}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Answers */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {answers.map((a) => (
          <section key={a.n} id={`q${a.n}`} className="scroll-mt-20 py-16 sm:py-20 border-b border-slate-200 last:border-b-0">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <p className="font-mono text-[13px] text-blue-600">Question 0{a.n}</p>
                  <h2 className="mt-2 text-[28px] sm:text-[32px] font-bold tracking-[-0.025em] text-slate-900">{a.title}</h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-slate-500">{a.question}</p>
                </div>
              </div>

              <div className="lg:col-span-8">
                <p className="text-[24px] sm:text-[30px] font-semibold leading-[1.2] tracking-[-0.02em] text-slate-900">
                  {a.headline}
                </p>

                <div className="mt-8 grid gap-4">
                  {a.blocks.map((b) => (
                    <div key={b.label} className="rounded-2xl border border-slate-200 p-6">
                      <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-500">{b.label}</h3>
                      {b.points.length > 3 && b.points.every((p) => p.length < 28) ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {b.points.map((p) => (
                            <span key={p} className="rounded-full bg-slate-100 px-3.5 py-1.5 text-[14px] font-medium text-slate-800">
                              {p}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <ul className="mt-4 space-y-3">
                          {b.points.map((p) => (
                            <li key={p} className="flex gap-3 text-[16px] leading-relaxed text-slate-700">
                              <span aria-hidden className="mt-[11px] size-1.5 shrink-0 rounded-full bg-blue-600" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                {a.chain && (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-6">
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Telling them apart
                    </h3>
                    <div className="mt-5 grid sm:grid-cols-3 gap-3 items-stretch">
                      {[
                        { k: "Red flag", v: a.chain.redFlag, c: "text-amber-700" },
                        { k: "Symptom", v: a.chain.symptom, c: "text-slate-700" },
                        { k: "Root cause", v: a.chain.rootCause, c: "text-blue-700" },
                      ].map((s, i) => (
                        <div key={s.k} className="relative rounded-xl bg-white border border-slate-200 p-4">
                          <p className={`text-[12px] font-semibold uppercase tracking-[0.1em] ${s.c}`}>{s.k}</p>
                          <p className="mt-1.5 text-[16px] font-medium text-slate-900">{s.v}</p>
                          {i < 2 && (
                            <ArrowRight aria-hidden className="hidden sm:block absolute -right-[18px] top-1/2 -translate-y-1/2 size-4 text-slate-300 z-10" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Next */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8 py-20">
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/presentation" className="group rounded-3xl border border-slate-200 p-8 hover:border-slate-300 hover:shadow-sm transition-all">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-slate-500">Next</p>
            <p className="mt-3 text-[24px] font-semibold tracking-[-0.02em] text-slate-900">The presentation</p>
            <p className="mt-2 text-[15px] text-slate-600">The same answers as a deck, plus the playbook and build docs.</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue-600">
              Open <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
          <Link href="/demo" className="group rounded-3xl bg-blue-600 p-8 text-white hover:bg-blue-700 transition-colors">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-blue-200">Then</p>
            <p className="mt-3 text-[24px] font-semibold tracking-[-0.02em]">The agent, live</p>
            <p className="mt-2 text-[15px] text-blue-100">Talk to the pod agent and download all 11 skills.</p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold">
              Try it <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
