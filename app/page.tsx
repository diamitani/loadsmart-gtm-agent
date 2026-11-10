import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, Check, KeyRound, Lock, PackageCheck, Upload } from "lucide-react";
import { Logo } from "@/components/brand";
import { ButtonLink } from "@/components/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import Hero, { Capabilities, FeatureCards, TrustBadges } from "@/app/components/HeroSection";
import { ASSET_TITLES } from "@/lib/pal/intent";
import { DEFAULT_PACKS } from "@/lib/billing/config";
import { SALESGENCY_URL, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Enably — the AI GTM Architect by Salesgency" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: "Enably by Salesgency",
    url: SITE_URL,
    title: "Enably — the AI GTM Architect",
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
};

const STEPS = [
  {
    icon: Upload,
    title: "Tell it what you sell",
    body: "Describe your offer in chat or a short questionnaire, and add docs, decks, links or call recordings. If something essential is missing, Enably asks one focused question.",
  },
  {
    icon: PackageCheck,
    title: "Watch the package build",
    body: "Enably plans your deliverables as a dependency graph and builds them in parallel waves. Every stage and every claim is visible, and unsupported facts are flagged.",
  },
  {
    icon: BadgeCheck,
    title: "Approve, refine, ship",
    body: "Edit assets in chat, approve them into your Library, then hand them to your CRM, email or n8n / Make / Zapier. Nothing leaves without your OK.",
  },
];

const usd = (cents: number) => `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`;
const perCredit = (cents: number, credits: number) => `${(Math.round((cents / credits) * 10) / 10).toString()}¢`;

const FAQ = [
  {
    q: "What exactly do I get from a build?",
    a: `A GTM package tailored to your inputs, assembled from ${Object.keys(ASSET_TITLES).length} asset types: ICP, buyer personas, positioning and messaging, outbound email and LinkedIn sequences, call scripts, battlecards, objection handling, KPI scorecards, playbooks, launch and prospecting plans, automation blueprints and more. Each run also includes project documentation and a single recommended next action.`,
  },
  {
    q: "How do credits work?",
    a: "Credits pay for AI on Enably's model access. Each AI model call uses credits, which are reserved up front and refunded if the call fails. Packs are one-time purchases through Stripe Checkout, not a subscription. If you run out, builds still run from structured templates.",
  },
  {
    q: "Can I use my own AI key instead?",
    a: "Yes. On the Credits & keys page you can add your own Anthropic, OpenAI or Vercel AI Gateway key. It's encrypted at rest (AES-256-GCM), only decrypted on the server to call your provider, and never shown back in the browser. Calls on your key use no credits.",
  },
  {
    q: "Will it email prospects or change my CRM on its own?",
    a: "No. Sending email, enrolling contacts, writing to your CRM, verifying addresses and handing off to workflows all require your explicit approval. You can also set daily send caps and suppression lists.",
  },
  {
    q: "Is my data private?",
    a: "Your conversations, builds, Library and Knowledge belong to your account, and other users can't see them. The data is stored in Postgres with row-level security. Integrations only use the accounts and keys you connect.",
  },
  {
    q: "Who is behind Enably?",
    a: "Enably is built by Salesgency, which designs and builds revenue systems for sales teams. Enably packages that GTM architecture process into a product you can run yourself.",
  },
];

export default function Landing() {
  return (
    <div className="overflow-x-hidden">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b hairline bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="hidden text-xs text-faint sm:inline">by Salesgency</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm text-muted md:flex" aria-label="Primary">
            <a href="#features" className="hover:text-ink">Features</a>
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#pricing" className="hover:text-ink">Pricing</a>
            <a href="#faq" className="hover:text-ink">FAQ</a>
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <ButtonLink href="/signin" variant="ghost" size="sm">Sign in</ButtonLink>
            <ButtonLink href="/signup" variant="clay" size="sm">Get started</ButtonLink>
          </div>
        </div>
      </header>

      <main id="main">
        <Hero />
        <Capabilities />
        <TrustBadges />

        {/* Features */}
        <section id="features" aria-labelledby="features-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="max-w-2xl">
            <p className="eyebrow !text-clay">What it does</p>
            <h2 id="features-title" className="display mt-3 text-3xl text-ink sm:text-4xl">An AI architect, not another blank doc.</h2>
            <p className="mt-3 text-muted">Enably runs the same process a GTM strategist would: gather, clarify, plan, build, verify, present. You see every step of it.</p>
          </div>
          <div className="mt-10">
            <FeatureCards />
          </div>
        </section>

        {/* How it works */}
        <section id="how" aria-labelledby="how-title" className="border-y hairline bg-paper-2/70">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="max-w-2xl">
              <p className="eyebrow !text-clay">How it works</p>
              <h2 id="how-title" className="display mt-3 text-3xl text-ink sm:text-4xl">Three steps from scattered notes to a pipeline engine.</h2>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, body }, i) => (
                <li key={title} className="card relative p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-clay text-sm font-bold text-clay-ink" aria-hidden>{i + 1}</span>
                    <Icon className="h-5 w-5 text-muted" aria-hidden />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">
                    <span className="sr-only">Step {i + 1}: </span>
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What it builds */}
        <section id="builds" aria-labelledby="builds-title" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="eyebrow !text-clay">What it builds</p>
              <h2 id="builds-title" className="display mt-3 text-3xl text-ink sm:text-4xl">The whole GTM engine, versioned in your Library.</h2>
              <p className="mt-3 text-muted">
                {Object.keys(ASSET_TITLES).length} asset types written by specialist subagents. Enably picks the ones your goal needs, then you refine them in chat and approve the final versions.
              </p>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {Object.values(ASSET_TITLES).map((t) => (
                <li key={t} className="flex items-center gap-3 rounded-xl border hairline bg-surface px-4 py-3 text-sm text-ink">
                  <Check className="h-4 w-4 shrink-0 text-clay" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" aria-labelledby="pricing-title" className="border-y hairline bg-paper-2/70">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow !text-clay">Pricing</p>
              <h2 id="pricing-title" className="display mt-3 text-3xl text-ink sm:text-4xl">Pay for what you use, or bring your own key.</h2>
              <p className="mt-3 text-muted">There's no subscription. Credit packs are one-time purchases, and using your own AI key costs nothing on Enably.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {DEFAULT_PACKS.map((p) => {
                const featured = p.id === "growth";
                return (
                  <article key={p.id} className={`card relative flex flex-col p-6 ${featured ? "ring-2 ring-clay" : ""}`} aria-label={`${p.label} credit pack`}>
                    {featured && <span className="absolute -top-3 left-6 rounded-full bg-flame px-2.5 py-0.5 text-[11px] font-semibold text-white">Recommended</span>}
                    <h3 className="text-sm font-semibold text-ink">{p.label}</h3>
                    <p className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight text-ink">{usd(p.amountCents)}</span>
                      <span className="text-sm text-muted">one-time</span>
                    </p>
                    <p className="mt-1 text-sm font-medium text-clay">{p.credits.toLocaleString("en-US")} credits</p>
                    <p className="mt-1 text-xs text-faint">{perCredit(p.amountCents, p.credits)} per credit</p>
                    <ul className="mt-5 space-y-2 text-sm text-muted">
                      <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-evergreen" aria-hidden /> Enably's model access</li>
                      <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-evergreen" aria-hidden /> Refunded if an AI call fails</li>
                      <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-evergreen" aria-hidden /> Secure Stripe Checkout</li>
                    </ul>
                    <ButtonLink href="/signup" variant={featured ? "clay" : "outline"} className="mt-6 w-full">Get {p.label}</ButtonLink>
                  </article>
                );
              })}
              <article className="card flex flex-col bg-ink p-6 text-paper" aria-label="Bring your own key">
                <h3 className="flex items-center gap-2 text-sm font-semibold"><KeyRound className="h-4 w-4 text-flame" aria-hidden /> Bring your own key</h3>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">$0</span>
                  <span className="text-sm text-paper/70">on Enably</span>
                </p>
                <p className="mt-1 text-sm font-medium text-paper/80">No credits used</p>
                <ul className="mt-5 space-y-2 text-sm text-paper/75">
                  <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-flame" aria-hidden /> Anthropic, OpenAI or Vercel AI Gateway</li>
                  <li className="flex gap-2"><Lock className="mt-0.5 h-4 w-4 shrink-0 text-flame" aria-hidden /> Encrypted at rest, never shown back</li>
                  <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-flame" aria-hidden /> Your provider bills you directly</li>
                </ul>
                <ButtonLink href="/signup" variant="clay" className="mt-6 w-full">Add your key</ButtonLink>
              </article>
            </div>
            <p className="mt-6 text-center text-xs text-faint">Each AI model call uses credits. Without credits or a key, builds still run from structured templates. Prices are in USD.</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-title" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <p className="eyebrow text-center !text-clay">FAQ</p>
          <h2 id="faq-title" className="display mt-3 text-center text-3xl text-ink sm:text-4xl">Questions, answered.</h2>
          <div className="mt-10 divide-y divide-line rounded-2xl border hairline bg-surface">
            {FAQ.map((f) => (
              <details key={f.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md font-medium text-ink">
                  {f.q}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-paper-2 text-muted transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section aria-labelledby="cta-title" className="px-4 pb-20 sm:px-6">
          <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-3xl bg-ink px-6 py-14 text-paper sm:px-12">
            <div className="hero-glow absolute inset-0 -z-10 opacity-70" aria-hidden />
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-xl">
                <h2 id="cta-title" className="display text-3xl sm:text-4xl">Tell it what you sell. Get the engine back.</h2>
                <p className="mt-3 text-paper/75">Create an account with Google or email and start your first GTM build in a couple of minutes.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/signup" variant="clay" className="h-12 px-6 text-base">
                  Get started <ArrowRight className="h-4 w-4" aria-hidden />
                </ButtonLink>
                <ButtonLink href="/signin" variant="ghost" className="h-12 px-6 text-base !text-paper hover:!bg-paper/10">
                  Sign in
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t hairline bg-paper-2/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-sm text-muted">The AI GTM Architect. A product by <a href={SALESGENCY_URL} className="font-medium text-ink underline-offset-2 hover:underline">Salesgency</a>.</p>
          </div>
          <nav aria-label="Product">
            <h3 className="eyebrow">Product</h3>
            <ul className="mt-3 space-y-2 text-muted">
              <li><a href="#features" className="hover:text-ink">Features</a></li>
              <li><a href="#how" className="hover:text-ink">How it works</a></li>
              <li><a href="#pricing" className="hover:text-ink">Pricing</a></li>
              <li><a href="#faq" className="hover:text-ink">FAQ</a></li>
            </ul>
          </nav>
          <nav aria-label="Account">
            <h3 className="eyebrow">Account</h3>
            <ul className="mt-3 space-y-2 text-muted">
              <li><a href="/signup" className="hover:text-ink">Create account</a></li>
              <li><a href="/signin" className="hover:text-ink">Sign in</a></li>
              <li><a href={SALESGENCY_URL} className="hover:text-ink">Salesgency.com</a></li>
            </ul>
          </nav>
        </div>
        <div className="border-t hairline">
          <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-faint sm:px-6">© {new Date().getFullYear()} Salesgency. Enably is a Salesgency product.</p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Enably",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            publisher: { "@type": "Organization", name: "Salesgency", url: SALESGENCY_URL },
            offers: DEFAULT_PACKS.map((p) => ({ "@type": "Offer", name: `${p.label} — ${p.credits} credits`, price: (p.amountCents / 100).toFixed(2), priceCurrency: p.currency.toUpperCase() })),
          }),
        }}
      />
    </div>
  );
}
