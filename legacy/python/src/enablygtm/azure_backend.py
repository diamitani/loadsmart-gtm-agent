"""Azure VM backend utilities for hosting OpenClaw."""

from __future__ import annotations

import shlex
import subprocess

from .config import AzureVMConfig


class AzureBackendError(RuntimeError):
    """Raised when Azure VM operations fail."""


class AzureVMBackend:
    """Runs operational commands for OpenClaw on an Azure VM."""

    def __init__(self, config: AzureVMConfig):
        self._config = config

    def get_public_ip(self) -> str:
        """Resolve the VM public IP through Azure CLI."""
        cmd = [
            "az",
            "vm",
            "show",
            "--name",
            self._config.vm_name,
            "--resource-group",
            self._config.resource_group,
            "--show-details",
            "--query",
            "publicIps",
            "--output",
            "tsv",
        ]
        result = self._run_local(cmd)
        ip = result.stdout.strip()
        if not ip:
            raise AzureBackendError("No public IP returned by Azure CLI for VM")
        return ip

    def run_remote(self, remote_command: str) -> str:
        """Execute a remote command over SSH and return stdout."""
        host = self.get_public_ip()
        ssh_cmd = [
            "ssh",
            "-i",
            self._config.ssh_private_key_path,
            "-o",
            "StrictHostKeyChecking=no",
            f"{self._config.admin_username}@{host}",
            remote_command,
        ]
        return self._run_local(ssh_cmd).stdout

    def ensure_openclaw_service(self, image: str = "ghcr.io/openclaw/openclaw:latest") -> str:
        """Install Docker (if needed) and run OpenClaw as a container."""
        command = " && ".join(
            [
                "command -v docker >/dev/null || (curl -fsSL https://get.docker.com | sh)",
                "sudo docker rm -f openclaw >/dev/null 2>&1 || true",
                (
                    "sudo docker run -d --name openclaw --restart unless-stopped "
                    f"-p {self._config.openclaw_port}:8080 {shlex.quote(image)}"
                ),
            ]
        )
        return self.run_remote(command)

    @staticmethod
    def _run_local(cmd: list[str]) -> subprocess.CompletedProcess:
        result = subprocess.run(cmd, check=False, capture_output=True, text=True)
        if result.returncode != 0:
            raise AzureBackendError(
                f"Command failed ({' '.join(cmd)}): {result.stderr.strip()}"
            )
        return result
