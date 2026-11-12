---
name: la-research
description: Step 4 of Loadsmart's ABM pipeline. Builds a short, sourced research brief per contact (account signal, persona pain, product angle) and keeps only facts that trace to evidence. Use when preparing personalization, call prep for an ABM contact, or when emails read generic.
---

# la-research: why this person, why now, in their words

**Runs:** daily 07:30 CT. **Reads:** verified contacts, their account's `Signal__c` rows, `config/personas.yaml`. **Writes:** `Research_Brief__c`, `Research_Status__c`.

## Brief format (stored in `Research_Brief__c`)

```
Product: Opendock | Persona: ops_dock
Signal: [one sentence] (source: URL, date)
Account context: [facts: sites, footprint, systems] (sources)
Persona angle: [which goal/pain from personas.yaml this signal touches] (assumption unless sourced)
Hooks (max 2): [specific, true opening points, each with its source]
Do not mention: [anything unverified or sensitive]
Call opener: [one line the rep can say]
```

## Steps

1. Gather evidence: the account's signals, firmographics, recent news, the contact's public professional profile (role, tenure, recent posts about work).
2. Propose up to 2 hooks. Each hook must quote or point to its evidence.
3. Verify: keep a hook only if its evidence is present in what was gathered. Count dropped hooks; a high drop count means the checker works, do not loosen it.
4. If evidence is under about 2 sentences, set `Research_Status__c = needs_review`, reason `no_evidence`. No email is written for that contact.
5. Pick the persona angle from `personas.yaml`. If the pain is still marked assumed, phrase it as a question, not a claim.

## Rules

- Professional, public information only. Nothing about family, health, home or personal accounts.
- No numbers or customer results unless they are in `approved_proof_points`.
- One product per brief. If a contact fits two products, choose the one their persona maps to.
