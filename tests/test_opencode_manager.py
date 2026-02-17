import unittest
from unittest.mock import MagicMock

from enablygtm.config import OpenCodeConfig
from enablygtm.opencode_manager import OpenCodeManager


class OpenCodeManagerTests(unittest.TestCase):
    def test_setup_runs_install_and_profile_configuration(self):
        backend = MagicMock()
        manager = OpenCodeManager(
            backend,
            OpenCodeConfig(
                install_script_url="https://opencode.example/install.sh",
                opencode_binary_path="/usr/bin/opencode",
                codex_profile_name="codex-chatgpt",
            ),
        )

        manager.setup_for_openclaw("http://10.0.0.5:8080")

        self.assertEqual(2, backend.run_remote.call_count)
        install_cmd = backend.run_remote.call_args_list[0].args[0]
        profile_cmd = backend.run_remote.call_args_list[1].args[0]
        self.assertIn("https://opencode.example/install.sh", install_cmd)
        self.assertIn("profile create codex-chatgpt", profile_cmd)
        self.assertIn("--backend-url http://10.0.0.5:8080", profile_cmd)


if __name__ == "__main__":
    unittest.main()
