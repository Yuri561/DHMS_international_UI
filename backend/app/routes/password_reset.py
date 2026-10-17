"""
Password-reset flow.

  POST /reset-password-request
      Accepts { email }. Looks the user up. If found, signs a
      15-minute JWT and emails the reset link via Brevo. Always
      returns the same generic message to avoid account
      enumeration.

  POST /reset-password
      Accepts { token, newPassword }. Verifies the token, then
      updates the user's password.
"""

from __future__ import annotations

import logging
from urllib.parse import quote

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from ..config import settings
from ..database import collection
from ..models.common import utcnow
from ..utils.email_template import password_reset_html, password_reset_text
from ..utils.mailer import MailerError, send_order_email
from ..utils.security import (
    InvalidResetToken,
    hash_password,
    sign_reset_token,
    verify_reset_token,
)

logger = logging.getLogger("dhms.reset")

router = APIRouter(tags=["password-reset"])

GENERIC_SUCCESS = {
    "message": (
        "If an account exists for that email, a password reset link has been sent."
    )
}


# ------------------------------------------------------------------
# POST /reset-password-request
# ------------------------------------------------------------------


class ResetRequestPayload(BaseModel):
    email: EmailStr | None = None


@router.post("/reset-password-request")
async def reset_password_request(payload: ResetRequestPayload) -> dict[str, str]:
    logger.info("/reset-password-request hit")

    user_email = (payload.email or "").strip().lower() if payload.email else ""
    if not user_email:
        # Mirror the Node behavior — generic response even for an
        # empty body. Do not reveal the field was missing.
        return GENERIC_SUCCESS

    users = collection("users")
    user = await users.find_one({"email": user_email})

    if not user:
        return GENERIC_SUCCESS

    try:
        token = sign_reset_token(str(user["_id"]), user_email)
    except RuntimeError:
        logger.exception("JWT_KEY misconfiguration while signing reset token")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "We could not send the reset email at this time. "
                "Please try again shortly."
            ),
        )

    base_link = (settings.reset_link or "").rstrip("/")
    reset_link = f"{base_link}?token={quote(token, safe='')}"

    display_name = user.get("username") or user.get("name") or user_email

    try:
        await send_order_email(
            to=user_email,
            to_name=display_name,
            subject="Reset your DHMS International password",
            html=password_reset_html(name=display_name, link=reset_link),
            text=password_reset_text(name=display_name, link=reset_link),
            tags=["password-reset"],
        )
    except MailerError as exc:
        logger.error("Failed to send password reset email: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=(
                "We could not send the reset email at this time. "
                "Please try again shortly."
            ),
        )

    return GENERIC_SUCCESS


# ------------------------------------------------------------------
# POST /reset-password
# ------------------------------------------------------------------


class ResetApplyPayload(BaseModel):
    token: str = Field(..., min_length=1)
    newPassword: str = Field(..., min_length=6)


@router.post("/reset-password")
async def reset_password_apply(payload: ResetApplyPayload) -> dict[str, str]:
    try:
        decoded = verify_reset_token(payload.token)
    except InvalidResetToken as exc:
        # Match the status codes the frontend's ResetPassword.tsx
        # treats as "expired or invalid link".
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc) or "Invalid token",
        )

    try:
        user_id = ObjectId(str(decoded.get("sub")))
    except (InvalidId, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token subject",
        )

    users = collection("users")
    user = await users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account no longer exists",
        )

    await users.update_one(
        {"_id": user_id},
        {
            "$set": {
                "password": hash_password(payload.newPassword),
                "updatedAt": utcnow(),
            }
        },
    )

    return {"message": "Your password has been updated. You can now sign in."}
