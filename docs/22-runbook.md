---
artifact_type: runbook
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: ops
reviewers: [architect, operator]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.98
---

# 22. Operations Runbook & Incident Response

## 1. Daily Deployment & Local Run
```bash
# 1. Install dependencies (or leverage pre-linked node_modules)
npm install

# 2. Start development server
npm run dev

# 3. Open executive command center
open http://localhost:3000
```

## 2. Emergency Incident Procedures

### Incident 1: Mailbox Spike in Bounce Rate (> 2%)
1. Sentinel automatically pauses sending for the affected mailbox.
2. Operator navigates to `/settings` → Mailboxes.
3. Review DNS records (SPF, DKIM, DMARC) for the affected domain.
4. Verify whether list source was enriched via degraded provider.
5. Re-enable mailbox only after 7 days of 100% warm-up pass.

### Incident 2: Salesforce Sync / Territory Collision Alert
1. Identify colliding account ID in `/dashboard` → Stuck Accounts.
2. Confirm active AE owner in Salesforce.
3. Click "Park Account" in dashboard to remove from pod sequence.
4. Notify AE via Slack with the newly uncovered trigger signal.
