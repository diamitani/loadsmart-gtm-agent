# Common Clay patterns

| Pattern | Seed | Key enrichers | Gate | Notes |
|---|---|---|---|---|
| Net-new logos | Company search by ICP filters | Company enrich -> person search -> email waterfall -> verify | Verified only | Default pattern |
| Look-alike | Current best customers (domains) | Find similar companies -> same personas | ICP score threshold | Ask for 10 to 50 best customers as seed |
| Event-based | Signals: hiring for role X, funding, launches | Signal source -> company enrich -> persona | Recency of event (e.g. last 90 days) | Personalize first line from the event |
| Tech-stack targeting | Companies using tool Y | Technographic filter -> role -> region -> verify | Verified only | Great for integration or replacement pitches |
| Database cleaning | Existing CRM export | Re-verify emails, dedupe, backfill LinkedIn and company fields | Mark invalid; never delete without approval | Read-only first; write back after approval |
| ABM bundle | Named account list | Multi-thread 3 to 5 personas per account + personalization fields | Coverage per account | Pair with linkedin-dm-architect for multi-channel |

AI research columns (for example Clay's research agent) are useful for personalization fields but cost more; run them only on Tier 1 rows after filtering.
