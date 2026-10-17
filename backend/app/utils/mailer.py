"""
Brevo (Sendinblue) transactional email client.

Direct REST calls via httpx — matches the Node implementation
which used `fetch` against the same endpoint.
"""

from __future__ import annotations

import logging
from typing import Any, Mapping

import httpx

from ..config import settings

logger = logging.getLogger("dhms.mailer")

BREVO_URL = "https://api.brevo.com/v3/smtp/email"


class MailerError(RuntimeError):
    """Raised when Brevo rejects a message or we can't reach it."""


# Public constants used by the webhook when it decides whether to
# notify the admin inbox at all.
ADMIN: str = settings.admin_email


def _sender() -> dict[str, str]:
    email = settings.brevo_sender_email
    name = settings.brevo_sender_name or "DHMS International"

    if not email:
        raise MailerError("BREVO_SENDER_EMAIL is not configured.")

    return {"email": email, "name": name}


def _api_key() -> str:
    key = settings.brevo_api_key
    if not key or key == "your_brevo_api_key":
        raise MailerError(
            "BREVO_API_KEY is missing or still set to the placeholder value."
        )
    return key


async def send_order_email(
    *,
    to: str,
    subject: str,
    html: str,
    text: str | None = None,
    to_name: str | None = None,
    reply_to: str | Mapping[str, str] | None = None,
    tags: list[str] | None = None,
    headers: Mapping[str, str] | None = None,
) -> str | None:
    """Send a transactional email through Brevo.

    Returns the Brevo message id on success. Raises `MailerError` on
    any failure so callers can decide whether to surface or swallow.
    """
    if not to:
        raise MailerError("Email recipient is missing.")
    if not subject:
        raise MailerError("Email subject is missing.")
    if not html:
        raise MailerError("Email HTML body is missing.")

    sender = _sender()

    payload: dict[str, Any] = {
        "sender": sender,
        "to": [{"email": to, "name": to_name or to}],
        "subject": subject,
        "htmlContent": html,
    }

    if text:
        payload["textContent"] = text

    if reply_to is None:
        payload["replyTo"] = sender
    elif isinstance(reply_to, str):
        payload["replyTo"] = {"email": reply_to}
    else:
        payload["replyTo"] = dict(reply_to)

    if tags:
        payload["tags"] = list(tags)

    if headers:
        payload["headers"] = dict(headers)

    logger.info("BREVO: sending to %s (%s)", to, subject)

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                BREVO_URL,
                headers={
                    "api-key": _api_key(),
                    "accept": "application/json",
                    "content-type": "application/json",
                },
                json=payload,
            )
    except httpx.HTTPError as exc:
        logger.exception("BREVO network error")
        raise MailerError(f"Brevo request failed: {exc}") from exc

    if response.status_code >= 400:
        detail: str
        try:
            data = response.json()
            detail = data.get("message") or data.get("code") or response.text
        except ValueError:
            detail = response.text or f"HTTP {response.status_code}"

        logger.error("BREVO error: %s", detail)
        raise MailerError(f"Brevo failed to send email: {detail}")

    try:
        data = response.json()
    except ValueError:
        data = {}

    message_id = data.get("messageId")
    logger.info("BREVO accepted messageId=%s", message_id)
    return message_id
