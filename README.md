# enablygtm

Enably Go-To-Market software with a platform backend that can run **OpenClaw on Azure VM** and configure **OpenCode** for Codex/ChatGPT operations.

## What is included

- Python package in `src/enablygtm` for GTM orchestration.
- `OpenClawClient` for OpenClaw API operations (signals + campaign suggestions).
- `AzureVMBackend` to discover VM public IP, run SSH commands, and start OpenClaw.
- `OpenCodeManager` to install OpenCode on VM and configure a Codex ChatGPT profile.
- `PlatformBackend` to bootstrap infrastructure and return a ready `OpenClawClient`.
- `GTMOrchestrator` to convert account intent into campaign actions.

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .
python -m unittest discover -s tests -v
```

## Azure VM + OpenClaw + OpenCode bootstrap

```python
from enablygtm import AzureVMConfig, PlatformBackend

platform = PlatformBackend(
    azure_vm_config=AzureVMConfig(
        vm_name="openclaw-vm",
        resource_group="enably-rg",
        admin_username="azureuser",
        ssh_private_key_path="~/.ssh/id_rsa",
        openclaw_port=8080,
    ),
    openclaw_api_key="replace-me",
)

client = platform.bootstrap()
# client is ready against http://<azure-vm-public-ip>:8080
```

`bootstrap()` performs:

1. Start/refresh OpenClaw container on the VM.
2. Install OpenCode on the VM (via install script).
3. Configure OpenCode profile `codex-chatgpt` with OpenClaw backend URL.
4. Return a ready `OpenClawClient`.

## GTM processing example

```python
from enablygtm import AccountSignal, GTMOrchestrator

signal = AccountSignal(
    account_id="acct-001",
    account_name="Acme Corp",
    signal_type="product_page_spike",
    intensity=0.82,
    metadata={"region": "EMEA"},
)

orchestrator = GTMOrchestrator(client, default_owner="revops-emea")
suggestion = orchestrator.process_signal(signal)
print(suggestion)
```

## Next build steps

- Add managed identity auth for Azure CLI operations.
- Add retries/backoff and idempotency keys to OpenClaw requests.
- Add batched ingestion service for large signal streams.
