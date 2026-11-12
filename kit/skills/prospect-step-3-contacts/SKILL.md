---
name: prospect-step-3-contacts
description: Step 3 of the 6-step prospect automation workflow. Executes persona discovery and multi-provider contact enrichment (ZoomInfo -> Clay Waterfall -> Email Verification) across Loadsmart's buying committees.
---

# Step 3: Persona Discovery & Contact Waterfall

Resolve 3–5 verified decision-makers and champions per `CRM_CLEARED` account using Loadsmart's ZoomInfo-first and Clay fallback waterfall.

## Product Buying Committees

- **Opendock**: VP Supply Chain, Director of Warehouse Operations, DC / Plant General Manager, Yard Operations Manager.
- **ShipperGuide TMS**: VP Transportation / Logistics, Director of Freight Procurement, Logistics Systems / TMS Lead, Supply Chain IT.
- **Loadsmart AI**: SVP / VP Supply Chain Strategy, Head of Logistics Operations, Chief Supply Chain Officer, Logistics Automation Lead.

## Waterfall Chain (`automations/clay/freight-waterfall-schema.json`)

1. **Primary Lookup (ZoomInfo / Salesforce Existing Contact)**: Pull title, work email, direct/mobile phone, LinkedIn URL, and tenure. Check opt-out flags.
2. **Clay Fallback Chain** (only for missing or stale records):
   - Provider 1: Apollo People Match
   - Provider 2: Hunter Email Finder / Verifier
   - Provider 3: Prospeo / Dropcontact mobile & email validation
3. **Email Verification Gate**:
   - Accept strictly `VERIFIED` business addresses (`W = 1.00`).
   - Flag `CATCH_ALL` (`W = 0.75`) for phone/LinkedIn-first sequences or single low-volume canary tests.
   - Drop `INVALID`, role-based (`info@`, `sales@`), or personal webmail addresses.

## Quality Rule

Never inflate persona titles or assume someone owns dock scheduling without checking facility/location scope for multi-plant shippers.
