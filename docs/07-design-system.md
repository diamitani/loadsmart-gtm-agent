---
artifact_type: design-system
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: design
reviewers: [architect, product]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.99
---

# 07. Design System & Taste Brief: Loadsmart GTM OS

## 1. Aesthetic Doctrine (Taste Skill Compliance)
- **Anti-AI-Slop Standard:** Clean executive typography, purposeful density, zero meaningless 3D floating blobs, and zero purple gradient text.
- **Tone:** Enterprise Logistics Precision. Designed to feel like Bloomberg Terminal meets Linear: crisp hairlines, high-contrast tabular data, clear status pills, and deliberate spacing.
- **Color Philosophy:**
  - Neutral Base: Cool slate / ink background with sharp borders.
  - Action Primary: Loadsmart Blue (`#0d6efd` / `#3b82f6`) for primary actions.
  - Verified Green (`#10b981`): Contact verified, deliverability healthy, batch approved.
  - Amber Warning (`#f59e0b`): Mailbox warm-up limit approaching, missing phone number, placeholder copy.
  - Rose Critical (`#ef4444`): CRM territory collision, hard bounce, invalid domain.

## 2. Token Set

```css
:root {
  --bg-app: #090d16;
  --bg-card: #0f172a;
  --bg-subtle: #1e293b;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --text-faint: #64748b;
  --border-subtle: #1e293b;
  --border-strong: #334155;
  --brand-blue: #2563eb;
  --brand-blue-hover: #1d4ed8;
  --status-good: #10b981;
  --status-warn: #f59e0b;
  --status-bad: #ef4444;
}
```

## 3. UI Component Standards
- **Metric Tiles:** Large numeric values in tabular font with descriptive label, micro trend pill, and contextual indicator.
- **Funnel Bar Visualizers:** Proportional fill bars with tabular percentage and absolute count labels.
- **Review Drawers:** Slide-over or modal card with side-by-side comparison of raw contact metadata vs. generated email/LinkedIn touchpoints.
- **Tool Badges:** Inline interactive indicators displaying agent tool calls (e.g. `⚡ CRM Shield Checked (0 Collisions)`).
