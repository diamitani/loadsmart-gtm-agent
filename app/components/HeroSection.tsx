import Image from 'next/image';
import { FaCheckCircle, FaShieldCheck, FaChartLine, FaDownload } from 'react-icons/fa';
import { CgSettings, CgInfo } from 'react-icons/cg';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <p className="eyebrow">GTM Architect</p>
        <h1 className="display">We engineer the revenue systems your sales team <em>runs on.</em></h1>
        <p className="lede">
          SalesGency designs, builds and hands over the automation behind your pipeline: signal-based outbound, sub-minute inbound response, call prep, follow-up and CRM hygiene. It lives in your CRM and n8n, your team approves every send, and you own all of it.
        </p>
        <div className="ctas">
          <a className="btn btn-primary btn-lg" href="/app">
            Open the Architect
          </a>
          <a className="btn btn-ghost btn-lg" href="/app/settings">
            Settings
          </a>
        </div>
        <p className="note">
          <span>Fixed scope</span>
          <span>Fixed price</span>
          <span>You own the code</span>
        </p>
      </div>
    </section>
  );
}

/* Stats section */
export function Stats() {
  return (
    <div className="stats">
      <div className="stat">
        <span className="stat-num">$9M+</span>
        <span className="stat-label">Attributed inbound pipeline</span>
      </div>
      <div className="stat">
        <span className="stat-num">55%+</span>
        <span className="stat-label">Open rate on engine-written outbound</span>
      </div>
      <div className="stat">
        <span className="stat-num">~70%</span>
        <span className="stat-label">Lower enrichment cost</span>
      </div>
      <div className="stat">
        <span className="stat-num">16</span>
        <span className="stat-label">Production AI systems shipped</span>
      </div>
    </div>
  );
}

/* Trust badges */
export function TrustBadges() {
  return (
    <section className="trust">
      <div className="trust-inner">
        <span className="trust-label">Built on the stack you already run</span>
        <div className="trust-items">
          <span>HubSpot</span>
          <span>Salesforce</span>
          <span>n8n</span>
          <span>Clay</span>
          <span>Apollo</span>
          <span>Slack</span>
          <span>Smartlead</span>
          <span>Gong</span>
        </div>
      </div>
    </section>
  );
}

/* Feature Cards */
export function FeatureCards() {
  return (
    <section className="cards">
      <Card
        icon={<FaChartLine />}
        title="Signal-Based Outbound"
        description="Intent signals become enriched, ICP-fit accounts, deduped against your CRM, with PAS drafts waiting for approval."
      />
      <Card
        icon={<FaShieldCheck />}
        title="Inbound Automation"
        description="Form and chat leads verified, scored against your ICP and sent to the right rep in Slack, with the CRM updated."
      />
      <Card
        icon={<FaCheckCircle />}
        title="Pre-Call Research"
        description="External meetings trigger company research and a one-screen brief in the rep's Slack 15 minutes before the call."
      />
      <Card
        icon={<FaDownload />}
        title="CRM Hygiene"
        description="Daily automated cleanup, contact enrichment, and deal health scoring so your data stays fresh."
      />
    </section>
  );
}

function Card({icon, title, description}) {
  return (
    <article className="card">
      <div className="icon-tile">
        {icon}
      </div>
      <span className="mono-tag">{title.split(' ')[0]}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}