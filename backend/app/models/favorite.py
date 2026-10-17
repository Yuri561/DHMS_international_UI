"""Favorites helpers."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel

from .common import serialize_doc, utcnow


class FavoritePayload(BaseModel):
    name: str
    imageUrl: str
    price: float
    brand: str | None = None

    model_config = {"extra": "ignore"}


def new_favorite_document(user_id: str, payload: FavoritePayload) -> dict[str, Any]:
    now = utcnow()
    return {
        "userId": user_id,
        "name": payload.name,
        "imageUrl": payload.imageUrl,
        "price": payload.price,
        "brand": payload.brand or "",
        "createdAt": now,
        "updatedAt": now,
    }


def serialize_favorite(doc: dict[str, Any] | None) -> dict[str, Any] | None:
    return serialize_doc(doc)
