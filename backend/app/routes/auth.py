"""
Authentication routes.

Covers everything AuthContext.tsx + SignIn + SignUp expect:
  POST /register         create user, start session, return user
  POST /login            verify credentials, start session
  GET  /logout           clear session
  GET  /me               current user (401 when logged out)
  POST /update-password  change password while logged in

Also exposes Google OAuth under /auth/google because the Node
code shipped it. The frontend doesn't currently use it, but the
endpoint stays wire-compatible for when it does.
"""

from __future__ import annotations

import logging
import re
import secrets
from typing import Any

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel

from ..config import settings
from ..database import collection
from ..deps import SessionDep
from ..models.common import serialize_doc, utcnow
from ..models.user import (
    LoginPayload,
    RegisterPayload,
    UpdatePasswordPayload,
    new_user_document,
    public_user,
)
from ..utils.security import hash_password, verify_password

logger = logging.getLogger("dhms.auth")


# ------------------------------------------------------------------
# Session helpers
# ------------------------------------------------------------------


def _put_session(request: Request, user: dict[str, Any]) -> None:
    """Record the signed-in user on the Starlette session.

    Keys match what the Node session carried (userId, username,
    role) so the require_auth dependency and /me projection work
    the same way regardless of which backend set the session.
    """
    request.session.clear()
    request.session["userId"] = str(user["_id"])
    request.session["username"] = user.get("username", "")
    request.session["role"] = user.get("role") or "user"


def _rotate_session_id(request: Request) -> None:
    """Rotate the opaque session identifier after a successful login.

    Starlette's SessionMiddleware stores the whole session in a
    signed cookie, so "rotating" means forcing the cookie to be
    re-issued by mutating the session dict. We do this implicitly
    whenever we call _put_session.
    """
    # Writing to session is enough to trigger a cookie refresh;
    # kept as a hook in case we migrate to a server-side store.
    request.session.setdefault("_sid", secrets.token_hex(8))
    request.session["_sid"] = secrets.token_hex(8)


# ------------------------------------------------------------------
# Routers
# ------------------------------------------------------------------

# Top-level routes the frontend already calls (no prefix).
root_router = APIRouter(tags=["auth"])

# /auth/* for the Google route — same shape as the Node file.
google_router = APIRouter(prefix="/auth", tags=["auth"])


# ------------------------------------------------------------------
# POST /register
# ------------------------------------------------------------------


@root_router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterPayload, request: Request) -> dict[str, Any]:
    users = collection("users")

    username = payload.username.strip()
    email = str(payload.email).strip().lower()

    # Case-insensitive uniqueness check so "Alice" and "alice"
    # can't both register.
    name_regex = {"$regex": f"^{re.escape(username)}$", "$options": "i"}
    email_regex = {"$regex": f"^{re.escape(email)}$", "$options": "i"}

    existing = await users.find_one({"$or": [{"username": name_regex}, {"email": email_regex}]})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email is already taken",
        )

    doc = new_user_document(payload)

    try:
        result = await users.insert_one(doc)
    except Exception:
        logger.exception("Register insert failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not create account",
        )

    doc["_id"] = result.inserted_id
    _put_session(request, doc)

    user_public = public_user(doc)

    # Frontend SignUp.tsx reads response.data.username — flatten
    # the fields so both `response.data` and `response.data.user`
    # work for callers.
    return {
        "message": "User created successfully",
        "user": user_public,
        **user_public,
    }


# ------------------------------------------------------------------
# POST /login
# ------------------------------------------------------------------


@root_router.post("/login")
async def login(payload: LoginPayload, request: Request) -> dict[str, Any]:
    username = (payload.username or "").strip()
    password = payload.password or ""

    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required",
        )

    users = collection("users")
    user = await users.find_one(
        {"username": {"$regex": f"^{re.escape(username)}$", "$options": "i"}}
    )

    if not user or not verify_password(password, user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid username or password",
        )

    _rotate_session_id(request)
    _put_session(request, user)

    return {
        "message": "Login successful",
        "user": public_user(user),
    }


# ------------------------------------------------------------------
# GET /logout
#
# AuthContext.tsx uses GET /logout. We also accept POST so other
# callers (curl, future refactors) don't fight the method.
# ------------------------------------------------------------------


@root_router.get("/logout")
@root_router.post("/logout")
async def logout(request: Request) -> dict[str, Any]:
    request.session.clear()
    return {"message": "Logged out"}


# ------------------------------------------------------------------
# GET /me
# ------------------------------------------------------------------


@root_router.get("/me")
async def me(session: SessionDep) -> dict[str, Any]:
    user_id = session.get("userId")
    try:
        oid = ObjectId(str(user_id))
    except (InvalidId, TypeError):
        # Session carries a bad id — treat as logged out.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    users = collection("users")
    user = await users.find_one(
        {"_id": oid},
        projection={"password": 0},
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="unable to retrieve session",
        )

    return {"user": public_user(user)}


# ------------------------------------------------------------------
# POST /update-password
# ------------------------------------------------------------------


@root_router.post("/update-password")
async def update_password(
    payload: UpdatePasswordPayload,
    session: SessionDep,
) -> dict[str, Any]:
    user_id = session.get("userId")
    try:
        oid = ObjectId(str(user_id))
    except (InvalidId, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    users = collection("users")
    user = await users.find_one({"_id": oid})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found",
        )

    if not verify_password(payload.currentPassword, user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    if payload.newPassword == payload.currentPassword:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from the current password",
        )

    await users.update_one(
        {"_id": oid},
        {
            "$set": {
                "password": hash_password(payload.newPassword),
                "updatedAt": utcnow(),
            }
        },
    )

    return {"message": "Password updated successfully"}


# ------------------------------------------------------------------
# POST /auth/google
# ------------------------------------------------------------------


class GooglePayload(BaseModel):
    credential: str


@google_router.post("/google")
async def google_login(payload: GooglePayload, request: Request) -> dict[str, Any]:
    """Verify a Google ID token and sign the matching user in.

    Mirrors backend/_legacy_node/routes/auth.js. Lazy-imports
    google-auth so the whole backend doesn't blow up when the
    package is absent in environments that don't use Google
    sign-in.
    """
    if not settings.google_client_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google sign-in is not configured",
        )

    try:
        from google.auth.transport import requests as google_requests  # type: ignore
        from google.oauth2 import id_token  # type: ignore
    except ImportError as exc:
        logger.error("google-auth not installed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google sign-in dependencies are not installed",
        )

    try:
        info = id_token.verify_oauth2_token(
            payload.credential,
            google_requests.Request(),
            settings.google_client_id,
        )
    except ValueError:
        logger.exception("Invalid Google credential")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Google credential",
        )

    email = (info.get("email") or "").strip().lower()
    name = info.get("name") or (email.split("@")[0] if email else "")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not found in Google response",
        )

    users = collection("users")
    user = await users.find_one({"email": email})

    if not user:
        base_username = re.sub(r"\s+", "", (name or email.split("@")[0]).lower())
        username = f"{base_username}{secrets.randbelow(10000)}"

        doc = {
            "email": email,
            "username": username,
            "password": "",  # social accounts have no local password
            "role": "user",
            "shippingAddress": {
                "street": "",
                "city": "",
                "state": "",
                "zip": "",
            },
            "createdAt": utcnow(),
            "updatedAt": utcnow(),
        }
        result = await users.insert_one(doc)
        doc["_id"] = result.inserted_id
        user = doc

    _put_session(request, user)

    return {
        "message": "Google login successful",
        "user": public_user(user),
    }
