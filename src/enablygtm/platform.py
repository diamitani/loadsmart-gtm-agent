"""Platform composition for Azure VM + OpenClaw + OpenCode."""

from __future__ import annotations

from .azure_backend import AzureVMBackend
from .config import AzureVMConfig, OpenClawConfig, OpenCodeConfig
from .openclaw import OpenClawClient
from .opencode_manager import OpenCodeManager


class PlatformBackend:
    """Composes infrastructure setup and OpenClaw client creation."""

    def __init__(
        self,
        azure_vm_config: AzureVMConfig,
        openclaw_api_key: str,
        opencode_config: OpenCodeConfig | None = None,
    ):
        self._azure = AzureVMBackend(azure_vm_config)
        self._openclaw_api_key = openclaw_api_key
        self._opencode = OpenCodeManager(self._azure, opencode_config)
        self._port = azure_vm_config.openclaw_port

    def bootstrap(self) -> OpenClawClient:
        """Ensure OpenClaw runtime and OpenCode profile exist, then return client."""
        self._azure.ensure_openclaw_service()
        base_url = f"http://{self._azure.get_public_ip()}:{self._port}"
        self._opencode.setup_for_openclaw(base_url)
        return OpenClawClient(OpenClawConfig(base_url=base_url, api_key=self._openclaw_api_key))
