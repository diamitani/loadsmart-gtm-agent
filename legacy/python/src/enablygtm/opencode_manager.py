"""OpenCode installer/manager helpers for OpenClaw operations."""

from __future__ import annotations

from .azure_backend import AzureVMBackend
from .config import OpenCodeConfig


class OpenCodeManager:
    """Installs OpenCode and configures Codex ChatGPT profile on the VM."""

    def __init__(self, backend: AzureVMBackend, config: OpenCodeConfig | None = None):
        self._backend = backend
        self._config = config or OpenCodeConfig()

    def install(self) -> str:
        """Install OpenCode binary on remote VM."""
        cmd = (
            f"curl -fsSL {self._config.install_script_url} | sh "
            f"&& test -x {self._config.opencode_binary_path}"
        )
        return self._backend.run_remote(cmd)

    def configure_codex_chatgpt_profile(self, openclaw_base_url: str) -> str:
        """Create a reusable OpenCode profile targeting OpenClaw backend."""
        profile = self._config.codex_profile_name
        binary = self._config.opencode_binary_path
        cmd = (
            f"{binary} profile create {profile} "
            f"--provider codex-chatgpt --backend-url {openclaw_base_url}"
        )
        return self._backend.run_remote(cmd)

    def setup_for_openclaw(self, openclaw_base_url: str) -> None:
        """Install OpenCode and configure the Codex ChatGPT profile."""
        self.install()
        self.configure_codex_chatgpt_profile(openclaw_base_url)
