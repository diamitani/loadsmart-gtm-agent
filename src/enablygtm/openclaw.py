"""OpenClaw integration client.

This module intentionally uses only the Python standard library so it can run
without additional installation steps.
"""

from __future__ import annotations

import json
from dataclasses import asdict
from urllib import request
from urllib.error import HTTPError, URLError

from .config import OpenClawConfig
from .models import AccountSignal, CampaignSuggestion


class OpenClawError(RuntimeError):
    """Raised when OpenClaw requests fail."""


class OpenClawClient:
    """Minimal client for sending GTM signals into OpenClaw."""

    def __init__(self, config: OpenClawConfig):
        self._config = config

    def upsert_signal(self, signal: AccountSignal) -> dict:
        """Push a signal to OpenClaw and return the parsed response."""
        return self._post("/v1/signals", asdict(signal))

    def create_campaign_suggestion(self, suggestion: CampaignSuggestion) -> dict:
        """Create or update a campaign recommendation in OpenClaw."""
        return self._post("/v1/campaign-suggestions", asdict(suggestion))

    def _post(self, path: str, payload: dict) -> dict:
        url = f"{self._config.base_url.rstrip('/')}{path}"
        req = request.Request(
            url=url,
            data=json.dumps(payload).encode("utf-8"),
            headers=self._config.auth_headers(),
            method="POST",
        )

        try:
            with request.urlopen(req, timeout=self._config.timeout_seconds) as resp:
                body = resp.read().decode("utf-8")
        except HTTPError as exc:
            body = exc.read().decode("utf-8", errors="ignore")
            raise OpenClawError(
                f"OpenClaw request failed: status={exc.code} body={body}"
            ) from exc
        except URLError as exc:
            raise OpenClawError(f"OpenClaw connection error: {exc.reason}") from exc

        if not body:
            return {}
        return json.loads(body)
