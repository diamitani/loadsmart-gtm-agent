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
