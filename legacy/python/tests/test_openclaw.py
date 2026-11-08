import io
import json
import unittest
from unittest.mock import patch
from urllib.error import HTTPError

from enablygtm.config import OpenClawConfig
from enablygtm.models import AccountSignal
from enablygtm.openclaw import OpenClawClient, OpenClawError


class _FakeResponse:
    def __init__(self, payload: dict):
        self._payload = payload

    def read(self):
        return json.dumps(self._payload).encode("utf-8")

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False


class OpenClawClientTests(unittest.TestCase):
    def setUp(self):
        self.client = OpenClawClient(
            OpenClawConfig(base_url="https://api.openclaw.example", api_key="test")
        )

    @patch("urllib.request.urlopen")
    def test_upsert_signal_returns_response(self, mock_urlopen):
        mock_urlopen.return_value = _FakeResponse({"id": "sig-123", "status": "ok"})

        result = self.client.upsert_signal(
            AccountSignal(
                account_id="acct-2",
                account_name="Umbrella",
                signal_type="intent_spike",
                intensity=0.4,
            )
        )

        self.assertEqual("sig-123", result["id"])

    @patch("urllib.request.urlopen")
    def test_http_error_raises_openclaw_error(self, mock_urlopen):
        mock_urlopen.side_effect = HTTPError(
            url="https://api.openclaw.example/v1/signals",
            code=500,
            msg="server error",
            hdrs=None,
            fp=io.BytesIO(b'{"error":"oops"}'),
        )

        with self.assertRaises(OpenClawError):
            self.client.upsert_signal(
                AccountSignal(
                    account_id="acct-2",
                    account_name="Umbrella",
                    signal_type="intent_spike",
                    intensity=0.4,
                )
            )


if __name__ == "__main__":
    unittest.main()
