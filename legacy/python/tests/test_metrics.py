import pytest

from gtm.metrics import calculate_conversion_rate, stage_dropoff_rates


def test_calculate_conversion_rate_basic():
    assert calculate_conversion_rate(200, 50) == 0.25


def test_calculate_conversion_rate_zero_leads_returns_zero():
    assert calculate_conversion_rate(0, 0) == 0.0


def test_calculate_conversion_rate_invalid_inputs():
    with pytest.raises(ValueError):
        calculate_conversion_rate(-1, 0)
    with pytest.raises(ValueError):
        calculate_conversion_rate(10, -1)
    with pytest.raises(ValueError):
        calculate_conversion_rate(5, 6)


def test_stage_dropoff_rates_basic():
    assert stage_dropoff_rates([100, 60, 30, 15]) == [0.4, 0.5, 0.5]


def test_stage_dropoff_rates_handles_empty_previous_stage():
    assert stage_dropoff_rates([0, 0, 0]) == [0.0, 0.0]


def test_stage_dropoff_rates_rejects_increases():
    with pytest.raises(ValueError):
        stage_dropoff_rates([100, 120])


def test_stage_dropoff_rates_rejects_negative():
    with pytest.raises(ValueError):
        stage_dropoff_rates([100, -10])
