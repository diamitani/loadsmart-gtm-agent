"""High-level GTM orchestration pipeline."""

from __future__ import annotations

from .models import AccountSignal, CampaignSuggestion
from .openclaw import OpenClawClient


class GTMOrchestrator:
    """Turns account signals into OpenClaw campaign suggestions."""

    def __init__(self, openclaw_client: OpenClawClient, default_owner: str = "revops"):
        self._openclaw = openclaw_client
        self._default_owner = default_owner

    def process_signal(self, signal: AccountSignal) -> CampaignSuggestion:
        """Persist signal and generate a campaign suggestion."""
        self._openclaw.upsert_signal(signal)
        suggestion = self._build_suggestion(signal)
        self._openclaw.create_campaign_suggestion(suggestion)
        return suggestion

    def _build_suggestion(self, signal: AccountSignal) -> CampaignSuggestion:
        if signal.intensity >= 0.8:
            priority = "P1"
            channel = "account-exec-email"
        elif signal.intensity >= 0.5:
            priority = "P2"
            channel = "linkedin-outreach"
        else:
            priority = "P3"
            channel = "nurture-sequence"

        message = (
            f"{signal.account_name} triggered {signal.signal_type} signal "
            f"(intensity={signal.intensity:.2f})."
        )

        return CampaignSuggestion(
            account_id=signal.account_id,
            priority=priority,
            message=message,
            channel=channel,
            owner=self._default_owner,
        )
