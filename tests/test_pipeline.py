import unittest
from unittest.mock import MagicMock

from enablygtm.models import AccountSignal
from enablygtm.pipeline import GTMOrchestrator


class GTMOrchestratorTests(unittest.TestCase):
    def test_process_signal_persists_signal_and_suggestion(self):
        client = MagicMock()
        orchestrator = GTMOrchestrator(client, default_owner="alice")
        signal = AccountSignal(
            account_id="acct-1",
            account_name="Acme",
            signal_type="pricing_page_views",
            intensity=0.85,
        )

        suggestion = orchestrator.process_signal(signal)

        client.upsert_signal.assert_called_once_with(signal)
        client.create_campaign_suggestion.assert_called_once_with(suggestion)
        self.assertEqual("P1", suggestion.priority)
        self.assertEqual("account-exec-email", suggestion.channel)
        self.assertEqual("alice", suggestion.owner)


if __name__ == "__main__":
    unittest.main()
