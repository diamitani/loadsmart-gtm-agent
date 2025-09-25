"""Core analytics helpers for Enably GTM dashboards."""

from __future__ import annotations

from typing import List, Sequence


def calculate_conversion_rate(leads_generated: int, deals_won: int, *, precision: int | None = 4) -> float:
    """Return the win rate for a cohort of leads.

    Historically the function divided ``deals_won`` by ``leads_generated`` without
    guarding against ``leads_generated`` being zero.  That created a ``ZeroDivisionError``
    whenever marketing imported an empty cohort, crashing the analytics pipeline.
    We now guard against the empty cohort case and return ``0.0`` instead.

    Args:
        leads_generated: Number of leads entering the funnel.
        deals_won: Number of those leads that eventually closed.
        precision: Decimal places to round to. ``None`` disables rounding.

    Returns:
        The conversion rate as a float between 0 and 1.

    Raises:
        ValueError: If provided counts are inconsistent.
    """

    if leads_generated < 0:
        raise ValueError("Lead count cannot be negative")
    if deals_won < 0:
        raise ValueError("Won deals cannot be negative")
    if deals_won > leads_generated:
        raise ValueError("Won deals cannot exceed generated leads")

    if leads_generated == 0:
        return 0.0

    rate = deals_won / leads_generated
    if precision is None:
        return rate
    return round(rate, precision)


def stage_dropoff_rates(stage_totals: Sequence[int]) -> List[float]:
    """Calculate drop-off rates between sequential pipeline stages.

    Args:
        stage_totals: Ordered counts for each stage from top-of-funnel to close.

    Returns:
        A list of drop-off rates between 0 and 1 for the transition between each
        stage and the next one.

    Raises:
        ValueError: If stage counts are invalid (negative or increasing).
    """

    validated: List[int] = []
    for count in stage_totals:
        if count < 0:
            raise ValueError("Stage counts cannot be negative")
        if validated and count > validated[-1]:
            raise ValueError("Stage counts must be non-increasing through the funnel")
        validated.append(count)

    dropoffs: List[float] = []
    for previous, current in zip(validated, validated[1:]):
        if previous == 0:
            dropoffs.append(0.0)
            continue
        dropoffs.append((previous - current) / previous)
    return dropoffs


__all__ = ["calculate_conversion_rate", "stage_dropoff_rates"]
