"""
Centralised configuration for the DHMS backend.

Reads from the same .env file the legacy Node backend used so the
two can be swapped without touching the frontend or env values.
"""

from __future__ import annotations

import os
from functools import lru_cache
from typing import List

from dotenv import load_dotenv

# Load .env located next to this file's parent (backend/.env).
load_dotenv()


def _env(name: str, default: str = "") -> str:
    value = os.getenv(name)
    return value if value is not None else default


def _env_required(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(
            f"Required environment variable {name!r} is not set. "
            "Add it to backend/.env before starting the server."
        )
    return value


class Settings:
    """Resolved settings for the running process."""

    # Runtime
    port: int = int(_env("PORT", "8080"))
    env: str = _env("NODE_ENV", "development")  # keep same key the Node code used
    is_prod: bool = _env("NODE_ENV", "development") == "production"

    # Mongo
    mongodb_uri: str = _env("MONGODB_URI", "")
    mongodb_db_name: str = _env("MONGODB_DB_NAME", "")  # optional override

    # Session / Auth
    session_secret: str = _env("SESSION_SECRET", "dhms-dev-session-secret")
    jwt_key: str = _env("JWT_KEY", "")

    google_client_id: str = _env("GOOGLE_CLIENT_ID", "")

    # Stripe
    stripe_key: str = _env("STRIPE_KEY", "")
    stripe_webhook_secret: str = _env("STRIPE_WEBHOOK_SECRET", "")

    # URLs
    client_url: str = _env("CLIENT_URL", "http://localhost:5173/").rstrip("/")
    frontend_url: str = _env("FRONTEND_URL", "https://dhmsint.com").rstrip("/")
    reset_link: str = _env(
        "RESET_LINK",
        "https://dhms-client.vercel.app/reset-password",
    ).rstrip("/")

    # Brevo
    brevo_api_key: str = _env("BREVO_API_KEY", "")
    brevo_sender_email: str = _env("BREVO_SENDER_EMAIL", "")
    brevo_sender_name: str = _env("BREVO_SENDER_NAME", "DHMS International")
    admin_email: str = _env("ADMIN_EMAIL", "")
    contact_recipient_email: str = _env("CONTACT_RECIPIENT_EMAIL", "")

    # CORS — matches the Node backend
    cors_origins: List[str] = [
        "https://www.dhmsint.com",
        "https://dhmsint.com",
        "https://dhms-client.vercel.app",
        "http://localhost:5173",
    ]

    # ------------------------------------------------------------------
    # Validation helpers
    # ------------------------------------------------------------------

    def ensure_startup_ready(self) -> None:
        """Blow up loudly at startup for missing critical config."""
        missing: list[str] = []

        if not self.mongodb_uri:
            missing.append("MONGODB_URI")
        if not self.stripe_key:
            missing.append("STRIPE_KEY")
        if not self.session_secret:
            missing.append("SESSION_SECRET")

        if missing:
            raise RuntimeError(
                "Missing required environment variables: "
                + ", ".join(missing)
            )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


# Convenience for `from app.config import settings`
settings = get_settings()
