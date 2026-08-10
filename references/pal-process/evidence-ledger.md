# PAL Evidence Ledger

## Ledger row

```json
{
  "claim_id": "string",
  "claim": "string",
  "source_id": "string",
  "source_type": "official|primary|internal|approved_secondary",
  "source_url": "string",
  "retrieved_at": "ISO-8601 datetime",
  "evidence_excerpt": "short excerpt or artifact pointer",
  "confidence": "high|medium|low",
  "applies_to": ["acceptance_criterion_id"],
  "date_sensitivity": "stable|time_sensitive|expires",
  "contradictions": ["claim_id"]
}
```

## Source priority

1. Official product, platform, or policy documentation.
2. Primary system records, customer-provided files, contracts, or Asana artifacts.
3. Internal knowledge bases approved for the project.
4. Approved secondary sources when primary coverage is unavailable.

## Coverage report

The evidence agent must report coverage for every acceptance criterion as `covered`, `partial`, `unsupported`, or `contradicted`.
