---
name: prospect-step-6-outreach
description: Step 6 of the 6-step prospect automation workflow. Manages the mandatory human-in-the-loop approval drawer, Gong Engage / Apollo sequence enrollment, mailbox throttling, and Salesforce logging with dry_run=true default.
---

# Step 6: Approval Gate & Controlled Outreach Dispatch

Guarantee zero blind sends, protect Loadsmart's sending domain reputation, and keep Salesforce perfectly synced once an AE or SDR approves a batch.

## Mandatory Safety Gates

```text
Draft Batch Ready -> [REQUIRE_APPROVAL == true?] -> Post Slack Approval Drawer
                                                      |
                            [Human clicks Approve & dry_run == false?]
                                                      |
                                                      v
                     Gong / Apollo Enroll + Salesforce Touchpoint__c Log
```

1. **Batch Approval First**: Group daily drafts by Pod (`<= 20` accounts/pod/day). Require explicit reviewer ID + timestamp before moving status from `COPY_DRAFTED` to `APPROVED`.
2. **Dry-Run Protection**: Workflow parameter `dry_run` defaults to `true`. In dry-run mode, payloads are validated and logged to preview tables without calling live Gong/Apollo send endpoints.
3. **Deliverability Guardrails**:
   - Respect daily per-mailbox send caps (`<= 35` new cold emails/mailbox/day).
   - Auto-pause any pod sequence if rolling 7-day bounce rate exceeds `2.0%`.
4. **CRM & Analytics Writeback**: Log approved enrollment IDs, sequence step numbers, and trigger IDs back to Salesforce (`Task` / custom `Touchpoint__c`) and feed outcomes to `la-daily-report` at 17:00 CT.
