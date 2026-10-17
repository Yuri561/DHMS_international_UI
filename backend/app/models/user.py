"""
User document helpers.

The Mongoose schema the Node app wrote looks like:

  {
    _id: ObjectId,
    username: str,
    email: str,
    password: str (bcrypt hash),
    shippingAddress: { street, city, state, zip } | missing,
    phone?: str,
    role?: str,
    createdAt, updatedAt
  }

Python handlers write documents using the same keys so existing
users remain usable without any migration.
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, EmailStr, Field

from ..utils.security import hash_password
from .common import serialize_doc, utcnow


class RegisterPayload(BaseModel):
    username: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=200)
    shippingAddress: Any | None = None  # frontend currently sends a string
    phone: str | None = None


class LoginPayload(BaseModel):
    username: str
    password: str

    # The Node code accepts either `{ username, password }` or a
    # wrapped `{ data: { username, password } }`. We only accept the
    # flat shape — the frontend uses the flat shape in AuthContext.


class UpdatePasswordPayload(BaseModel):
    currentPassword: str
    newPassword: str = Field(..., min_length=6)


def new_user_document(payload: RegisterPayload) -> dict[str, Any]:
    """Build the document that will be inserted into Mongo."""
    now = utcnow()

    shipping = payload.shippingAddress
    if shipping is None:
        shipping_doc: dict[str, Any] = {
            "street": "",
            "city": "",
            "state": "",
            "zip": "",
        }
    elif isinstance(shipping, dict):
        shipping_doc = {
            "street": shipping.get("street", ""),
            "city": shipping.get("city", ""),
            "state": shipping.get("state", ""),
            "zip": shipping.get("zip") or shipping.get("zipCode", ""),
        }
    else:
        # String form from SignUp — store as a single-line street.
        shipping_doc = {
            "street": str(shipping),
            "city": "",
            "state": "",
            "zip": "",
        }

    return {
        "username": payload.username.strip(),
        "email": str(payload.email).strip().lower(),
        "password": hash_password(payload.password),
        "shippingAddress": shipping_doc,
        "phone": payload.phone or "",
        "role": "user",
        "createdAt": now,
        "updatedAt": now,
    }


def public_user(doc: dict[str, Any]) -> dict[str, Any]:
    """Project the fields the frontend expects on /me and /register."""
    safe = serialize_doc(doc) or {}
    safe.pop("password", None)

    return {
        "id": safe.get("_id"),
        "username": safe.get("username"),
        "email": safe.get("email"),
        "role": safe.get("role") or "user",
        "createdAt": safe.get("createdAt"),
        "updatedAt": safe.get("updatedAt"),
        "phone": safe.get("phone"),
        "shippingAddress": safe.get("shippingAddress"),
    }
