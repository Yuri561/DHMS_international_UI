"""
Favorites routes.

Not shipped by the legacy Node backend but called by the frontend
Dashboard. Implemented against the existing Favorites model shape
(models/Favorites.js in the legacy folder).

  GET    /favorites         list the signed-in user's favorites
  POST   /favorites         add a new favorite
  DELETE /favorites/:id     remove by id

All endpoints require an authenticated session.
"""

from __future__ import annotations

import logging
from typing import Any

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, HTTPException, status

from ..database import collection
from ..deps import SessionDep
from ..models.favorite import FavoritePayload, new_favorite_document, serialize_favorite

logger = logging.getLogger("dhms.favorites")

router = APIRouter(prefix="/favorites", tags=["favorites"])


def _coerce_id(raw: str) -> ObjectId:
    try:
        return ObjectId(raw)
    except (InvalidId, TypeError) as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid favorite id",
        ) from exc


@router.get("")
async def list_favorites(session: SessionDep) -> dict[str, Any]:
    user_id = str(session["userId"])
    favorites = collection("favorites")

    try:
        cursor = favorites.find({"userId": user_id})
        docs = await cursor.to_list(length=None)
    except Exception:
        logger.exception("Favorites fetch failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch favorites",
        )

    return {"favorites": [serialize_favorite(doc) or {} for doc in docs]}


@router.post("", status_code=status.HTTP_201_CREATED)
async def add_favorite(payload: FavoritePayload, session: SessionDep) -> dict[str, Any]:
    user_id = str(session["userId"])
    doc = new_favorite_document(user_id, payload)

    try:
        result = await collection("favorites").insert_one(doc)
    except Exception:
        logger.exception("Favorite insert failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to add favorite",
        )

    doc["_id"] = result.inserted_id
    return {"favorite": serialize_favorite(doc)}


@router.delete("/{favorite_id}")
async def remove_favorite(favorite_id: str, session: SessionDep) -> dict[str, Any]:
    user_id = str(session["userId"])
    oid = _coerce_id(favorite_id)

    try:
        result = await collection("favorites").delete_one(
            {"_id": oid, "userId": user_id}
        )
    except Exception:
        logger.exception("Favorite delete failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to remove favorite",
        )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found",
        )

    return {"message": "Favorite removed"}
