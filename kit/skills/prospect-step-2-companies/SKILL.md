---
name: prospect-step-2-companies
description: Step 2 of the 6-step prospect automation workflow. Qualifies candidate companies against Loadsmart freight ICP criteria and executes the Salesforce CRM Collision Shield to quarantine active customers and open opportunities.
---

# Step 2: Company Qualification & Salesforce Collision Shield

Prevent rep channel conflict and wasted enrichment credits by screening every candidate domain against Loadsmart's ICP rules and live Salesforce records before contact discovery.

## Collision Shield Checks (Mandatory Order)

Query Salesforce `Account` and `Opportunity` objects via normalized root domain (`example.com`, stripping `www.` and regional subdomains carefully):

1. **Active Customer Check**: Is `Type = 'Customer'` or any `Contract` active for the target Loadsmart product?
   - **Action**: Quarantine as `PARKED_CRM_COLLISION` (`CURRENT_CUSTOMER`). Route cross-sell notes to Account Manager only; block cold outbound.
2. **Open Opportunity Check**: Does `Opportunity` exist with `IsClosed = false` across any AE pod within the last 90 days?
   - **Action**: Quarantine as `PARKED_CRM_COLLISION` (`OPEN_OPP_ELSEWHERE`). Never touch another rep's live deal.
3. **Competitor / Carrier Exclusion**: Is the account a 3PL, freight broker, or motor carrier outside Enterprise Shipper pods?
   - **Action**: Mark `DISQUALIFIED` (`COMPETITOR_OR_BROKER`).
4. **Suppression / DNC List**: Match against `suppressions` opt-out table.

## ICP Fit Scoring Rubric (0–100)

- **Industry Fit (0–25)**: Manufacturing, CPG, Food & Beverage, Retail/Wholesale Distribution, Building Materials.
- **Facility & Freight Footprint (0–35)**: Multi-warehouse operations (3+ docks for Opendock; $10M+ freight spend for ShipperGuide / Loadsmart AI).
- **Buying Signal Timing (0–40)**: Carried forward from Step 1 (`timing_score * 40`).

Only accounts scoring `>= 65` with `CRM_CLEARED` status advance to **Step 3 (Contacts)**.
