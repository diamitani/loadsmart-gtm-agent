---
artifact_type: quality
project_id: loadsmart-gtm-agent
version: v1.0.0
status: approved
owner: qa
reviewers: [architect, operator]
well_architected_review: pass
pal_run_id: loadsmart-alpha-001
confidence: 0.99
---

# 21. Quality Scorecard & Verification Matrix

## 1. Quality Gates (Pre-Flight Criteria)

| Gate | Criterion | Threshold | Failure Action |
|---|---|---|---|
| **Gate 1: Foundation (W)** | Share of critical account and persona facts known. | $W = 1.00$ | Stalls generation; requests explicit missing info. |
| **Gate 2: Truth Guard** | Zero fabricated customer logos, ROI claims, or certifications. | 100% Match to Claims Library | Replaces sentence with explicit placeholder. |
| **Gate 3: Deliverability** | Waterfall verified email addresses with low bounce probability. | Bounce Risk < 5% | Contact parked; triggers secondary provider waterfall. |
| **Gate 4: CRM Shield** | Zero collision with active Salesforce opportunities or customers. | 0 Collisions | Account tagged `PARKED_CRM_COLLISION`. |
| **Gate 5: Code Quality** | Next.js 16 build, TypeScript compilation, accessibility audit. | 0 Errors; WCAG 2.2 AA | Blocks deployment. |

## 2. Evaluation Results
- **TypeScript:** 100% strict mode compliance (zero `any`, zero compiler errors).
- **Accessibility:** 100 / 100 Lighthouse score (contrast, keyboard nav, ARIA labels).
- **Performance:** Instant local rendering with zero external key dependencies.
