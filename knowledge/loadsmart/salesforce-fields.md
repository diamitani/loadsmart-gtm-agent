# Salesforce fields the pipeline uses

Each step writes one field; the next step reads it. RevOps creates these once. Names are suggestions; keep whatever naming convention Loadsmart already uses and update the skills' config to match.

## Account

| Field | Type | Written by | Purpose |
| --- | --- | --- | --- |
| `ABM_Account__c` | Checkbox | la-abm-tag (existing field) | Account is on a pod list |
| `ABM_Pod__c` | Picklist | la-abm-tag | Which pod owns it |
| `ABM_Reason__c` | Long text | la-abm-tag | Why it was picked: fit, timing and coverage scores with reasons |
| `ABM_Fit_Score__c` / `ABM_Timing_Score__c` / `ABM_Priority__c` | Number (0-100) | la-signal, la-abm-tag | Ranking inside the pod |
| `ABM_Status__c` | Picklist: Active, Disqualified, Converted, Paused | Pods, la-abm-tag | Lifecycle |
| `ABM_DQ_Reason__c` | Picklist: Wrong industry, Too small, Current customer, Bad timing, No persona found, Other | Pods | Feeds la-pod-feedback |
| `Existing_Products__c` | Multi-select | RevOps | Which Loadsmart products they already use (cross-sell flag) |

## Signal (custom object `Signal__c`, child of Account)

| Field | Type | Purpose |
| --- | --- | --- |
| `Type__c` | Picklist: New site, Hiring ops, Hiring transport, TMS change, Leadership change, Earnings mention, Intent, Engagement, Product network | What happened |
| `Product__c` | Picklist: Opendock, ShipperGuide, Loadsmart AI | Which product it opens |
| `Detected_On__c` / `Event_Date__c` | Date | Freshness |
| `Source_URL__c` | URL | Required. No URL, no signal |
| `Summary__c` | Text (255) | One factual sentence |
| `Strength__c` | Number 0-1 | Used in timing score |

## Contact

| Field | Type | Written by |
| --- | --- | --- |
| `Persona__c` | Picklist: ops_dock, transport_tms, supply_chain_exec, secondary | la-persona-enrich |
| `Product__c` | Picklist | la-persona-enrich |
| `Email_Verified__c` | Picklist: valid, acceptable, unknown, invalid | la-persona-enrich |
| `Last_Verified__c` | Date | la-persona-enrich |
| `Research_Brief__c` | Long text | la-research |
| `Research_Status__c` | Picklist: ready, needs_review | la-research |
| `AI_Email_1__c` / `AI_Email_2__c` / `AI_Email_3__c` | Long text (body only) | la-email |
| `AI_Email_Status__c` | Picklist: draft, approved, rejected | la-email, pod |
| `AI_Email_Rating__c` / `AI_Email_Rating_Reason__c` | Picklist | Pod |
| `ABM_Sequence_Status__c` | Picklist: enrolled, replied, bounced, meeting, finished, stopped | la-sequence, la-daily-report |
