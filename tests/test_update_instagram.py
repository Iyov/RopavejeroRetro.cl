import importlib.util
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

spec = importlib.util.spec_from_file_location("update_instagram", ROOT / "api" / "update_instagram.py")
update_instagram = importlib.util.module_from_spec(spec)
spec.loader.exec_module(update_instagram)


def test_detects_expired_instagram_token():
    payload = {
        "error": {
            "message": "Error validating access token: Session has expired on Friday, 10-Jul-26 15:28:44 PDT.",
            "type": "OAuthException",
            "code": 190,
        }
    }

    result = update_instagram.detect_instagram_error(payload)

    assert result["is_expired_token"] is True
    assert "token" in result["message"].lower()
