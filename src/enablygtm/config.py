"""Configuration objects for external integrations."""

from dataclasses import dataclass


@dataclass(frozen=True)
class OpenClawConfig:
    """Runtime settings for connecting to OpenClaw."""

    base_url: str
    api_key: str
    timeout_seconds: float = 10.0

    def auth_headers(self) -> dict[str, str]:
        """Return authorization headers expected by OpenClaw's API."""
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }


@dataclass(frozen=True)
class AzureVMConfig:
    """Connection settings for running OpenClaw on an Azure VM."""

    vm_name: str
    resource_group: str
    admin_username: str
    ssh_private_key_path: str
    openclaw_port: int = 8080


@dataclass(frozen=True)
class OpenCodeConfig:
    """Settings required to install and run OpenCode on the VM."""

    install_script_url: str = "https://opencode.ai/install.sh"
    opencode_binary_path: str = "/usr/local/bin/opencode"
    codex_profile_name: str = "codex-chatgpt"
