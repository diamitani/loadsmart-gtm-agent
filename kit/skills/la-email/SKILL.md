---
name: la-email
description: Step 5 of Loadsmart's ABM pipeline. Writes body-only cold emails (email 1, 2, 3) for one product and one persona from the research brief, checks them against QA rules, and stores them in AI_Email fields for pod approval. Use when drafting or rewriting ABM emails for Opendock, ShipperGuide or Loadsmart AI buyers.
---

# la-email: body-only emails the template wraps

**Runs:** daily 08:00 CT. **Reads:** `Research_Brief__c` (status `ready`), `config/personas.yaml`. **Writes:** `AI_Email_1__c`, `AI_Email_2__c`, `AI_Email_3__c`, `AI_Email_Status__c = draft`.

The Gong template supplies the greeting ("Hi [First Name],"), the rep signature, the opt-out line and postal address. You write **only the body**.

## Three emails per contact

| Field | Day | Job | Length |
| --- | --- | --- | --- |
| `AI_Email_1__c` | 1 | Signal + why it matters to this persona + soft question (persona's `soft_cta`) | 60-120 words, 2 short paragraphs |
| `AI_Email_2__c` | 4 | One use case or approved proof point for the same persona; if no approved proof, a concrete "how teams handle X" question | 40-90 words |
| `AI_Email_3__c` | 8 | Multi-thread: mention you also reached the [other persona role] about [other product]; offer one useful thing | 40-80 words |

Also return a subject line under 50 characters for email 1 (lowercase-friendly, no clickbait).

## QA rules (an email that fails any rule is rejected and rewritten once, then parked)

- Mentions only facts present in the research brief; every number is from `approved_proof_points`.
- One product, one persona. No product the persona doesn't buy.
- No fake "Re:" or "Fwd:", no exclamation marks, no links, no attachments, no "I hope this finds you well".
- No left-over `[placeholders]` except approved proof slots, which block approval until filled.
- Under the word limit. Reads like one person writing to one person.

## Example (Opendock, ops_dock)

> Saw that [Company] is opening [site from signal]. New sites usually start with inbound appointments booked by phone and email, which is where gate waits and detention creep in.
>
> How is [site] planning to handle inbound scheduling? Worth comparing notes on how other sites book it?

## Approval

Emails stay `draft` until the pod SDR approves the batch in `la-sequence`. Pod ratings (`AI_Email_Rating__c`) feed `la-pod-feedback`.
