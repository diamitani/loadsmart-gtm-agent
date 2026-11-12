---
name: loadsmart
description: Loadsmart Live GTM Sovereign Agent OS — ABM pod coordination, collision shielding, and deterministic 8-step pipeline execution.
trigger: When coordinating Loadsmart AE/SDR outbound pods across Opendock, ShipperGuide, and Loadsmart AI.
category: ABM Operations
---

# Loadsmart Live GTM Sovereign Agent OS

Master orchestrator for Loadsmart's hybrid AE/SDR Account-Based Marketing (ABM) pods. Standardizes the daily journey from signal scout to sequenced outreach across four dedicated product lines:

1. **Opendock**: Dock appointment scheduling and yard management for multi-facility warehouse operators and 3PLs (4,500+ warehouses, 14M+ appointments).
2. **ShipperGuide**: Enterprise cloud TMS for freight planning, spot procurement, routing guides, and track & trace (shippers spending \$10M–\$150M+).
3. **Loadsmart AI**: 11 autonomous freight agents handling repetitive spot quotes, tracking, and carrier vetting inside existing shipper systems, backed by human Freight Experts.
4. **Freight Services**: Full Truckload (Dry Van, Reefer, Flatbed), LTL, and multimodal brokerage backed by 230,000+ vetted carriers.

## Operating Invariants

- **REQUIRE_APPROVAL = true**: Zero blind sends. Nothing in outbound or CRM writes executes without explicit human batch approval.
- **Verified Claims Library**: No hallucinated metrics or fabricated customer references.
- **Product Boundaries**: Keep Opendock, ShipperGuide, and Loadsmart AI to their respective buyer personas.
- **CRM Collision Shield**: Accounts with active opportunities or existing customer contracts are flagged and parked.
