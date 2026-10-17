"""
Product helpers.

Preserves the Mongoose shape so existing documents keep working:
  { name, description, price, brand, category, imageUrl, quantity,
    rating, inStore, inStock, createdAt, updatedAt }
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

from .common import serialize_doc, utcnow


class ProductIn(BaseModel):
    name: str | None = None
    description: str | None = "No description provided"
    price: float
    brand: str = "brand not available"
    category: str
    imageUrl: str
    quantity: float | None = None
    rating: float = 0
    inStore: bool = True
    inStock: bool = True

    model_config = {"extra": "ignore"}


def normalize_product(payload: ProductIn) -> dict[str, Any]:
    return {
        "name": payload.name,
        "description": payload.description or "No description provided",
        "price": payload.price,
        "category": payload.category,
        "imageUrl": payload.imageUrl,
        "quantity": payload.quantity,
        "rating": payload.rating,
        "inStore": payload.inStore,
        "inStock": payload.inStock,
        "brand": payload.brand,
    }


def product_match_query(normalized: dict[str, Any]) -> dict[str, Any]:
    """Replicates the strict equality upsert key the Node code used.

    The Node code treated the whole normalized object as the match
    filter so re-posting the exact same product updates in place,
    and any one differing field creates a new document.
    """
    return dict(normalized)


def to_public_product(doc: dict[str, Any]) -> dict[str, Any]:
    return serialize_doc(doc) or {}


def new_product_timestamps() -> dict[str, Any]:
    now = utcnow()
    return {"createdAt": now, "updatedAt": now}
