"""
Cart helpers.

Mongoose shape:
  {
    cartId: str (indexed),
    userId: ObjectId | missing,
    items: [{ _id, productId, price, name, image, color, quantity,
              rating, category, totalPrice }],
    createdAt, updatedAt
  }

Items have `_id` so the frontend can address individual lines.
We mint ObjectIds on insert to stay compatible with Mongoose data.
"""

from __future__ import annotations

from typing import Any

from bson import ObjectId
from pydantic import BaseModel, Field

from .common import serialize_doc, utcnow


class CartItemPayload(BaseModel):
    productId: str
    name: str
    price: float = 0
    image: str = ""
    color: str = ""
    quantity: int = Field(..., ge=1)
    rating: float = 0
    category: str = ""
    totalPrice: float = 0

    model_config = {"extra": "ignore"}


class UpdateQuantityPayload(BaseModel):
    quantity: int = Field(..., ge=1)


def build_item_document(payload: CartItemPayload) -> dict[str, Any]:
    price = payload.price if payload.price >= 0 else 0
    return {
        "_id": ObjectId(),
        "productId": payload.productId.strip(),
        "name": payload.name.strip(),
        "price": price,
        "image": payload.image or "",
        "color": payload.color or "",
        "quantity": payload.quantity,
        "rating": payload.rating,
        "category": payload.category or "",
        "totalPrice": price * payload.quantity,
    }


def serialize_items(items: list[dict[str, Any]] | None) -> list[dict[str, Any]]:
    """Convert embedded cart items to JSON-safe dicts."""
    return [serialize_doc(item) or {} for item in (items or [])]


def new_cart_document(cart_id: str) -> dict[str, Any]:
    now = utcnow()
    return {
        "cartId": cart_id,
        "items": [],
        "createdAt": now,
        "updatedAt": now,
    }
