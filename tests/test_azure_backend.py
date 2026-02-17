import subprocess
import unittest
from unittest.mock import patch

from enablygtm.azure_backend import AzureBackendError, AzureVMBackend
from enablygtm.config import AzureVMConfig


class AzureVMBackendTests(unittest.TestCase):
    def setUp(self):
        self.backend = AzureVMBackend(
            AzureVMConfig(
                vm_name="vm1",
                resource_group="rg1",
                admin_username="azureuser",
                ssh_private_key_path="~/.ssh/id_rsa",
            )
        )

    @patch("subprocess.run")
    def test_get_public_ip_uses_azure_cli(self, mock_run):
        mock_run.return_value = subprocess.CompletedProcess(
            args=["az"], returncode=0, stdout="1.2.3.4\n", stderr=""
        )

        ip = self.backend.get_public_ip()

        self.assertEqual("1.2.3.4", ip)

    @patch("subprocess.run")
    def test_failed_command_raises_backend_error(self, mock_run):
        mock_run.return_value = subprocess.CompletedProcess(
            args=["az"], returncode=1, stdout="", stderr="boom"
        )

        with self.assertRaises(AzureBackendError):
            self.backend.get_public_ip()


if __name__ == "__main__":
    unittest.main()
