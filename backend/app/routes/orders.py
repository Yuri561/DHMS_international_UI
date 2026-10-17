"""
Orders routes.

Serves the dashboard's order history view. Orders are matched
to the signed-in user either by customerEmail (if the user has
an email on file) or by any order whose userId was recorded at
checkout.
"""

from __future__ import annotations

import logging
from typing import Any

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, HTTPException, status

from ..database import collection
from ..deps import SessionDep
from ..models.order import serialize_order

logger = logging.getLogger("dhms.orders")

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("")
async def list_orders(session: SessionDep) -> dict[str, Any]:
    user_id = str(session["userId"])

    try:
        oid = ObjectId(user_id)
    except (InvalidId, TypeError):
        oid = None

    users = collection("users")
    orders = collection("orders")

    user_email: str | None = None
    if oid is not None:
        user = await users.find_one({"_id": oid}, projection={"email": 1})
        if user and user.get("email"):
            user_email = str(user["email"]).lower()

    query: dict[str, Any] = {"$or": [{"userId": user_id}]}
    if user_email:
        query["$or"].append({"customerEmail": {"$regex": f"^{user_email}$", "$options": "i"}})

    try:
        cursor = orders.find(query).sort("createdAt", -1)
        docs = await cursor.to_list(length=None)
    except Exception:
        logger.exception("Order history fetch failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch orders",
        )

    return {"orders": [serialize_order(doc) or {} for doc in docs]}
