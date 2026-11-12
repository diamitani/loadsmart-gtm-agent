---
name: prospect-step-5-email
description: Step 5 of the 6-step prospect automation workflow. Drafts 1-to-1 PAS outbound emails, LinkedIn notes, and call openers using Claude AI strictly bounded by Loadsmart's research brief and Claims Library linter.
---

# Step 5: Outbound Copy & Claims Linter

Turn Step 4's verified research into high-reply, human-sounding 1-to-1 Touch 1–3 messages tailored to each persona without generic AI filler.

## Copywriting Structure (PAS — Problem, Agitate, Solve)

- **Word Budget**: Touch 1 <= 90 words; Touch 2 (reply bump with operational angle) <= 75 words; Touch 3 (breakup / peer benchmark) <= 65 words.
- **Subject Lines**: 2–5 lowercase words referencing a real trigger (`new Reno DC docks`, `freight RFP season`, `yard turn times`). Zero clickbait or `Re:`.
- **Opening Line**: Reference the exact Step 1/4 dated signal (never `"Hope this finds you well"` or `"I noticed your impressive background"`).
- **CTA**: Low-friction operational question or 15-minute workflow walkthrough — never `"Can I get 30 mins Tuesday?"` on cold Touch 1.

## Mandatory Automated Linter Checks

Before any draft reaches the Step 6 approval queue, run these deterministic checks:

1. **Claims Library Check**: Any Loadsmart customer count, dock number, savings %, or ROI metric must cite an approved `C-XXX` row from `knowledge/loadsmart/claims-library.md`. Unapproved metrics fail linting and are stripped.
2. **Product Isolation Check**: Email pitching Opendock must not drift into ShipperGuide TMS or CarrierGuide pitches.
3. **Tone & Anti-Slop Check**: Zero em-dash chains, zero exclamation marks in Touch 1, zero banned buzzwords (`"revolutionize"`, `"synergy"`, `"game-changer"`, `"AI-powered disruption"`).
4. **Unsubscribe / Opt-Out Footer**: Include clean plain-text opt-out instruction compliant with Loadsmart outbound policy.
