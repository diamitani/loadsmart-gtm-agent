"""Domain models used by Enably GTM orchestration."""

from dataclasses import dataclass, field


@dataclass(frozen=True)
class AccountSignal:
    """Represents a buying signal for a target account."""

    account_id: str
    account_name: str
    signal_type: str
    intensity: float
    metadata: dict[str, str] = field(default_factory=dict)


@dataclass(frozen=True)
class CampaignSuggestion:
    """Recommended campaign generated from account signals."""

    account_id: str
    priority: str
    message: str
    channel: str
    owner: str
