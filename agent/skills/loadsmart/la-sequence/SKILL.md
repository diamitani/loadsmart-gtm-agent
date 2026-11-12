---
name: la-sequence
description: Step 6 of Loadsmart's ABM pipeline. Shows the pod today's batch of drafted emails, and after explicit approval enrolls contacts in the unified Gong flow (email, call and LinkedIn steps) with caps, stop rules and an account-level touch limit. Use when enrolling ABM contacts, approving the daily batch, or changing sequence steps.
---

# la-sequence: one flow, three channels, approved daily

**Runs:** daily 08:30 CT. **Reads:** contacts with `AI_Email_Status__c = draft`, `config/pods.yaml`. **Writes (after approval):** Gong flow enrollment, `ABM_Sequence_Status__c = enrolled`, `AI_Email_Status__c = approved`.

## Unified Gong flow (12 business days)

| Day | Channel | Step |
| --- | --- | --- |
| 1 | Email | AI email 1 |
| 1 | LinkedIn | Connection note task (copilot drafts, rep sends; under 300 chars, no pitch, no link) |
| 3 | Phone | Call 1 task, references the signal |
| 4 | Email | AI email 2 (same thread) |
| 6 | Phone + LinkedIn | Call 2; DM if connected |
| 8 | Email | AI email 3 (multi-thread) |
| 10 | Phone | Call 3 (AE on top-10 priority accounts) |
| 12 | Email | Close the loop |

Stop conditions, checked **immediately before every step**, not only at enrollment: reply (any), bounce, unsubscribe, meeting booked, contact marked DQ, account `ABM_Status__c` not Active.

## Approval gate

Show the pod SDR, for this pod and today:
- number of contacts to enroll, by product and persona;
- 3 sample emails in full (subject + body as the prospect will see it);
- send window and daily cap from `pods.yaml`;
- any account that would exceed the cross-product weekly touch cap (those are held).

Wait for "approve" (or "approve except [names]"). Then enroll in batches spread across the send window. A yes covers this batch only.

## Mailboxes and voicemail (see `config/sending.yaml`)

- Each rep sends from 5 warmed inboxes on secondary domains. Assign each contact to one inbox for the whole thread; rotate new contacts across inboxes.
- Daily cold volume per inbox follows the ramp (10 -> 20 -> 35 -> 50). An inbox that breaches the bounce or complaint guardrail is paused automatically and reported.
- Tier 1 (ABM) contacts get the full 12-day flow. Tier 2 (scaled lane) contacts get the email steps only; a call task is created only after they engage.
- Call steps run in the power dialer. No answer -> drop the pre-recorded voicemail for that persona, and make sure an email lands within 24 hours. Voicemail drop goes live only after legal review.

## Rules

- Never more than `new_enrollments_per_pod_per_day` or the inbox's current ramp cap.
- Idempotency: one enrollment per (contact, flow). Retries never double-enroll.
- Log every enrollment as a Salesforce activity.
- If Gong returns an error, mark `send_failed`, never `sent`.
