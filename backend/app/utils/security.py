"""
Password hashing (bcrypt) and reset-token signing (JWT).

Compatible with the Node backend:
  - bcrypt via `bcrypt` package — same hash format Mongoose used.
  - jsonwebtoken on Node signs HS256 by default — PyJWT does the same.
"""

from __future__ import annotations

import time
from typing import Any

import bcrypt
import jwt

from ..config import settings

# ------------------------------------------------------------------
# Password hashing
# ------------------------------------------------------------------


def hash_password(plain: str) -> str:
    """Return a bcrypt hash. Matches `bcrypt.genSalt(10)` on Node."""
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(plain.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    """Constant-time compare. Returns False on any error."""
    if not plain or not hashed:
        return False
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False


# ------------------------------------------------------------------
# Password-reset tokens
#
# Payload shape mirrors the Node implementation so historical links
# issued by the previous backend keep working if any are still in
# flight.
# ------------------------------------------------------------------

_RESET_PURPOSE = "reset-password"
_RESET_TTL_SECONDS = 60 * 15  # 15 minutes


def sign_reset_token(user_id: str, email: str) -> str:
    if not settings.jwt_key:
        raise RuntimeError(
            "JWT_KEY is not configured. Cannot sign password-reset tokens."
        )

    now = int(time.time())
    payload: dict[str, Any] = {
        "sub": str(user_id),
        "email": email,
        "iat": now,
        "exp": now + _RESET_TTL_SECONDS,
        "purpose": _RESET_PURPOSE,
    }
    return jwt.encode(payload, settings.jwt_key, algorithm="HS256")


class InvalidResetToken(Exception):
    """Raised when a reset token is malformed, wrong purpose, or expired."""


def verify_reset_token(token: str) -> dict[str, Any]:
    if not token:
        raise InvalidResetToken("Missing token")

    if not settings.jwt_key:
        raise RuntimeError(
            "JWT_KEY is not configured. Cannot verify password-reset tokens."
        )

    try:
        payload = jwt.decode(token, settings.jwt_key, algorithms=["HS256"])
    except jwt.ExpiredSignatureError as exc:
        raise InvalidResetToken("Token expired") from exc
    except jwt.InvalidTokenError as exc:
        raise InvalidResetToken("Invalid token") from exc

    if payload.get("purpose") != _RESET_PURPOSE:
        raise InvalidResetToken("Wrong token purpose")

    if not payload.get("sub"):
        raise InvalidResetToken("Missing subject")

    return payload
