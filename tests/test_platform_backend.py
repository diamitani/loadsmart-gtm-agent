import unittest
from unittest.mock import MagicMock, patch

from enablygtm.config import AzureVMConfig
from enablygtm.platform import PlatformBackend


class PlatformBackendTests(unittest.TestCase):
    @patch("enablygtm.platform.OpenCodeManager")
    @patch("enablygtm.platform.AzureVMBackend")
    def test_bootstrap_starts_openclaw_and_configures_opencode(self, mock_backend_cls, mock_manager_cls):
        backend = MagicMock()
        backend.get_public_ip.return_value = "52.10.10.10"
        mock_backend_cls.return_value = backend

        manager = MagicMock()
        mock_manager_cls.return_value = manager

        platform = PlatformBackend(
            azure_vm_config=AzureVMConfig(
                vm_name="openclaw-vm",
                resource_group="enably-rg",
                admin_username="azureuser",
                ssh_private_key_path="~/.ssh/id_rsa",
            ),
            openclaw_api_key="key-123",
        )

        client = platform.bootstrap()

        backend.ensure_openclaw_service.assert_called_once_with()
        manager.setup_for_openclaw.assert_called_once_with("http://52.10.10.10:8080")
        self.assertEqual("http://52.10.10.10:8080", client._config.base_url)


if __name__ == "__main__":
    unittest.main()
