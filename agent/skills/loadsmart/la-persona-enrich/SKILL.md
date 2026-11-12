---
name: la-persona-enrich
description: Step 3 of Loadsmart's ABM pipeline. For every ABM account, finds and verifies contacts for each product's buyer persona (Opendock ops, ShipperGuide transportation, Loadsmart AI supply chain exec) using ZoomInfo first, then Clay/Apollo waterfall, and tags them by persona and product. Use when contacts are missing, wrong, bouncing, or an account is single-threaded.
---

# la-persona-enrich: the right people for each product

**Runs:** daily 07:00 CT. **Reads:** ABM accounts, `config/personas.yaml`. **Writes:** Contacts with `Persona__c`, `Product__c`, `Email_Verified__c`, `Last_Verified__c`.

## Steps

1. For each ABM account, list the persona slots: `ops_dock`, `transport_tms`, `supply_chain_exec` (plus up to 1 secondary per product). Skip slots already filled with a contact verified in the last 90 days.
2. Search ZoomInfo by **function + seniority + title include list** from `personas.yaml`. Reject anyone matching `titles_exclude` or outside the listed functions (an IT director is not an Opendock buyer).
3. If ZoomInfo returns nothing, run the waterfall in Clay: Apollo, then other configured providers. Stop at the first verified hit.
4. Verify every email (verifier in Clay or standalone). Keep `valid` and `acceptable`. Park `unknown` for manual review. Drop `invalid`.
5. Dedupe against existing contacts (email, then name + account), suppression list and prior opt-outs.
6. Write contacts and tags. Report per account: slots filled, slots empty and why (none found, all unverified, excluded titles).

## Coverage rule

An account is **covered** when 2 of 3 product personas have a verified contact. Uncovered accounts are listed in the daily report so the AE can source a contact by referral or LinkedIn.

## Re-enrich triggers

- Hard bounce or "no longer with company" reply on a contact -> re-run that slot within 24 hours.
- `Last_Verified__c` older than 90 days -> re-verify before the next sequence step.

## Rules

- Never guess an email address and mark it verified.
- Personal emails and personal phone numbers are out of scope.
- Respect the credit cap set by RevOps; stop and report when it is reached.
