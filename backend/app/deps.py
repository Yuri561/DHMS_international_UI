"""
Shared FastAPI dependencies.
"""

from __future__ import annotations

import secrets
from typing import Annotated, Any

from fastapi import Cookie, Depends, HTTPException, Request, Response, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from .config import settings
from .database import get_db


# ------------------------------------------------------------------
# Database
# ------------------------------------------------------------------

DBDep = Annotated[AsyncIOMotorDatabase, Depends(get_db)]


# ------------------------------------------------------------------
# Cart cookie
# ------------------------------------------------------------------

CART_COOKIE_NAME = "cartId"
_CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30  # 30 days — matches Node ensureCartId


def _cart_cookie_kwargs() -> dict[str, Any]:
    """Match the Node ensureCartId cookie options.

    In production (NODE_ENV=production) we need SameSite=None + Secure
    so the cross-origin fetch from dhmsint.com → api.dhmsint.com works
    with credentials. In dev we use Lax so the cookie survives top-level
    navigations.
    """
    return {
        "httponly": True,
        "samesite": "none" if settings.is_prod else "lax",
        "secure": settings.is_prod,
        "max_age": _CART_COOKIE_MAX_AGE,
        "path": "/",
    }


def ensure_cart_id(
    response: Response,
    cart_id: Annotated[str | None, Cookie(alias=CART_COOKIE_NAME)] = None,
) -> str:
    """Return the current cart id, minting + setting the cookie if absent.

    Mirrors `backend/_legacy_node/controllers/ensureCartId.js`.
    """
    if cart_id:
        return cart_id

    new_id = secrets.token_hex(16)
    response.set_cookie(key=CART_COOKIE_NAME, value=new_id, **_cart_cookie_kwargs())
    return new_id


CartIdDep = Annotated[str, Depends(ensure_cart_id)]


# ------------------------------------------------------------------
# Session / Auth
# ------------------------------------------------------------------


def require_auth(request: Request) -> dict[str, Any]:
    """Guard: raise 401 unless the session carries a userId.

    Returns the session dict so downstream handlers can read
    `userId`, `username`, `role`.
    """
    session = request.session
    if not session or not session.get("userId"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return session


SessionDep = Annotated[dict[str, Any], Depends(require_auth)]
