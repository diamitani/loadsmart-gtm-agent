# enablygtm

Enably Go-To-Market software, now bootstrapped with an **OpenClaw integration**.

## What is included

- A lightweight Python package in `src/enablygtm`.
- `OpenClawClient` to push account signals and campaign suggestions to OpenClaw.
- `GTMOrchestrator` to convert raw account intent into campaign actions.
- Unit tests for orchestration and API error handling.

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .
python -m unittest discover -s tests -v
```

## Example

```python
from enablygtm import (
    AccountSignal,
    GTMOrchestrator,
    OpenClawClient,
    OpenClawConfig,
)

config = OpenClawConfig(
    base_url="https://api.openclaw.example",
    api_key="replace-me",
)

client = OpenClawClient(config)
orchestrator = GTMOrchestrator(client, default_owner="revops-emea")

signal = AccountSignal(
    account_id="acct-001",
    account_name="Acme Corp",
    signal_type="product_page_spike",
    intensity=0.82,
    metadata={"region": "EMEA"},
)

suggestion = orchestrator.process_signal(signal)
print(suggestion)
```

## Next build steps

- Add retries/backoff and idempotency keys to OpenClaw requests.
- Add CLI or API service layer for batch ingestion.
- Integrate CRM enrichment before scoring signal intensity.
