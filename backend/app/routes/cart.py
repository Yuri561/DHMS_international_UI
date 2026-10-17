"""
Cart routes.

Expands on the legacy Node implementation (which only mounted add /
clear / remove) with GET and PATCH endpoints the frontend was
already calling but had no server-side handler for.

Endpoints:
  GET    /cart              return current cart items
  POST   /cart/add          add or increment an item
  PATCH  /cart/update/:id   set quantity on a line
  DELETE /cart/remove/:id   remove a line
  DELETE /cart/clear        empty the cart
"""

from __future__ import annotations

import logging
from typing import Any

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter, HTTPException, status

from ..database import collection
from ..deps import CartIdDep
from ..models.cart import (
    CartItemPayload,
    UpdateQuantityPayload,
    build_item_document,
    new_cart_document,
    serialize_items,
)
from ..models.common import utcnow

logger = logging.getLogger("dhms.cart")

router = APIRouter(prefix="/cart", tags=["cart"])


def _coerce_item_id(raw: str) -> ObjectId:
    try:
        return ObjectId(raw)
    except (InvalidId, TypeError) as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid item id",
        ) from exc


def _cart_response(items: list[dict[str, Any]] | None, message: str | None = None) -> dict[str, Any]:
    serialized = serialize_items(items)
    # Expose both `cart` (CartContext) and `items` (Redux slice) so
    # neither consumer has to change.
    body: dict[str, Any] = {"cart": serialized, "items": serialized}
    if message:
        body["message"] = message
    return body


# ------------------------------------------------------------------
# GET /cart
# ------------------------------------------------------------------


@router.get("")
async def get_cart(cart_id: CartIdDep) -> dict[str, Any]:
    try:
        doc = await collection("carts").find_one({"cartId": cart_id})
    except Exception:
        logger.exception("Cart fetch failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )

    items = (doc or {}).get("items", [])
    return _cart_response(items)


# ------------------------------------------------------------------
# POST /cart/add
# ------------------------------------------------------------------


@router.post("/add")
async def add_to_cart(payload: CartItemPayload, cart_id: CartIdDep) -> dict[str, Any]:
    carts = collection("carts")

    try:
        new_item = build_item_document(payload)

        doc = await carts.find_one({"cartId": cart_id})

        if not doc:
            doc = new_cart_document(cart_id)
            doc["items"].append(new_item)
            await carts.insert_one(doc)
            return _cart_response(doc["items"], "Item added/updated")

        items: list[dict[str, Any]] = list(doc.get("items", []))

        # Merge by (productId, color) — same key the Node code used.
        existing_idx = next(
            (
                idx
                for idx, item in enumerate(items)
                if str(item.get("productId") or "") == new_item["productId"]
                and str(item.get("color") or "") == new_item["color"]
            ),
            None,
        )

        if existing_idx is not None:
            existing = items[existing_idx]
            price = float(existing.get("price") or 0)
            quantity = int(existing.get("quantity") or 0) + int(new_item["quantity"])
            existing["quantity"] = quantity
            existing["totalPrice"] = price * quantity
            items[existing_idx] = existing
        else:
            items.append(new_item)

        await carts.update_one(
            {"_id": doc["_id"]},
            {"$set": {"items": items, "updatedAt": utcnow()}},
        )

        return _cart_response(items, "Item added/updated")

    except HTTPException:
        raise
    except Exception as exc:
        logger.exception("Cart add error")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update cart: {exc}",
        )


# ------------------------------------------------------------------
# PATCH /cart/update/:id
# ------------------------------------------------------------------


@router.patch("/update/{item_id}")
async def update_cart_item(
    item_id: str,
    payload: UpdateQuantityPayload,
    cart_id: CartIdDep,
) -> dict[str, Any]:
    oid = _coerce_item_id(item_id)
    carts = collection("carts")

    try:
        doc = await carts.find_one({"cartId": cart_id})
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cart not found",
            )

        items: list[dict[str, Any]] = list(doc.get("items", []))
        target_idx = next(
            (idx for idx, item in enumerate(items) if item.get("_id") == oid),
            None,
        )

        if target_idx is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item not found",
            )

        price = float(items[target_idx].get("price") or 0)
        items[target_idx]["quantity"] = payload.quantity
        items[target_idx]["totalPrice"] = price * payload.quantity

        await carts.update_one(
            {"_id": doc["_id"]},
            {"$set": {"items": items, "updatedAt": utcnow()}},
        )

        return _cart_response(items, "Quantity updated")

    except HTTPException:
        raise
    except Exception:
        logger.exception("Cart update failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error",
        )


# ------------------------------------------------------------------
# DELETE /cart/remove/:id
# ------------------------------------------------------------------


@router.delete("/remove/{item_id}")
async def remove_cart_item(item_id: str, cart_id: CartIdDep) -> dict[str, Any]:
    oid = _coerce_item_id(item_id)
    carts = collection("carts")

    try:
        doc = await carts.find_one({"cartId": cart_id})
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cart not found",
            )

        items: list[dict[str, Any]] = list(doc.get("items", []))
        new_items = [item for item in items if item.get("_id") != oid]

        if len(new_items) == len(items):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item not found",
            )

        await carts.update_one(
            {"_id": doc["_id"]},
            {"$set": {"items": new_items, "updatedAt": utcnow()}},
        )

        return _cart_response(new_items, "Item removed")

    except HTTPException:
        raise
    except Exception:
        logger.exception("Remove failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server error",
        )


# ------------------------------------------------------------------
# DELETE /cart/clear
# ------------------------------------------------------------------


@router.delete("/clear")
async def clear_cart(cart_id: CartIdDep) -> dict[str, Any]:
    try:
        await collection("carts").delete_one({"cartId": cart_id})
    except Exception:
        logger.exception("Error clearing cart")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )

    return _cart_response([], "Cart cleared")
