---
artifact_type: frontend-ui
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: design
reviewers: [architect, product]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.99
---

# 14. Frontend UI Specifications: Loadsmart GTM OS

## 1. Page Architectures & Wireframes

### Page 1: Mission Overview (`/`)
- **Header:** Loadsmart logo, environment indicator (`Live` / `Simulated Demo`), theme toggle, pod quick selector.
- **Hero Grid:** Primary metrics roll-up across all pods (total target accounts, open pipeline, aggregate deliverability).
- **Active Pod Cards:** Cards for Pod 1, Pod 2, Pod 3, and Pod 4 showing assigned AEs/SDRs, target product, and today's pipeline completion status.
- **Quick Action Bar:** Direct entry points to launch Copilot, review pending copy approvals, inspect mailboxes, and download n8n workflows.

### Page 2: ABM Pod Dashboard (`/dashboard`)
- **Control Bar:** Pod switcher (`All Pods`, `Pod 1`, `Pod 2`, `Pod 3`, `Pod 4`), CSV upload triggers (`Accounts CSV`, `Emails CSV`, `Runs CSV`), simulation demo toggle.
- **Metric Tiles (6 Columns):** Target Accounts, In Sequence, Meetings Booked, Pipeline Generated, Mailbox Deliverability, Pod Leak Rate.
- **Split Visualizer:**
  - Left: Interactive Funnel Progression with percentage drops.
  - Right: Parked & Disqualified Accounts with specific reason codes (`MISSING_FREIGHT_SPEND`, `CRM_COLLISION`, etc.).
- **Lower Section:**
  - Stuck Accounts Triage Table with 1-click resolution actions.
  - Multi-Mailbox Health Matrix displaying individual rep sending domains, daily caps, and warm-up statuses.

### Page 3: Live Multi-Agent Copilot (`/copilot`)
- **Layout:** High-density split view:
  - Left / Main: Real-time chat dialogue with token streaming, Markdown formatting, and interactive tool badges.
  - Right Sidebar: Staged Copy Approval Drawer and Account Inspector for instant review and sequence authorization.
- **Starter Prompts:** One-click prompt pills (e.g. *"Nominate 20 accounts for Opendock"*, *"Check Pod 1 mailbox health"*, *"Audit Salesforce territory collisions"*).

### Page 4: 10-Step Deterministic Pipeline (`/pipeline`)
- **Visual Step Tracker:** Step-by-step progress cards from `06:00 Signal Scout` to `17:00 Daily Report`.
- **Run Controller:** Single-step execution or full-pipeline automated batching with live log output.

### Page 5: Sales Playbook v2 & Battlecards (`/playbook`)
- **Sidebar Navigation:** Product deep dives (ShipperGuide, Opendock, Loadsmart AI, Brokerage), Buyer Personas, Objection Handling, Cold Call Scripts.
- **Battlecards:** Side-by-side matrices comparing Loadsmart against legacy TMS (Oracle, Manhattan, SAP) and dock management competitors.
