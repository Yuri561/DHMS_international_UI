"""
Products routes.

Direct port of backend/_legacy_node/routes/products.js:
  GET  /products   list every product
  POST /products   sync/upsert an array of products (seed script)

The upsert key matches the legacy strict-equality behavior: every
field in the normalized object must match or a new document is
created.
"""

from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, HTTPException, status

from ..database import collection
from ..models.product import (
    ProductIn,
    new_product_timestamps,
    normalize_product,
    product_match_query,
    to_public_product,
)

logger = logging.getLogger("dhms.products")

router = APIRouter(prefix="/products", tags=["products"])


# ------------------------------------------------------------------
# GET /products
# ------------------------------------------------------------------


@router.get("")
async def list_products() -> list[dict[str, Any]]:
    try:
        cursor = collection("products").find({})
        docs = await cursor.to_list(length=None)
        return [to_public_product(doc) for doc in docs]
    except Exception:
        logger.exception("Error fetching products")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch products",
        )


# ------------------------------------------------------------------
# POST /products
# ------------------------------------------------------------------


@router.post("", status_code=status.HTTP_201_CREATED)
async def sync_products(payload: list[ProductIn]) -> dict[str, Any]:
    if not isinstance(payload, list):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Expected an array of products",
        )

    products_coll = collection("products")

    # Clean out broken entries that may have accumulated from older
    # seed runs. Mirrors the exact filter the Node code used.
    await products_coll.delete_many(
        {
            "$or": [
                {"name": ""},
                {"name": "No Name"},
                {"imageUrl": ""},
                {"imageUrl": "/"},
                {"name": {"$exists": False}},
                {"imageUrl": {"$exists": False}},
            ]
        }
    )

    inserted_count = 0

    for product in payload:
        try:
            normalized = normalize_product(product)
        except Exception:  # defensive — Pydantic already validated
            logger.exception("Skipping malformed product payload")
            continue

        match = product_match_query(normalized)
        timestamps = new_product_timestamps()

        update = {
            "$set": {**normalized, "updatedAt": timestamps["updatedAt"]},
            "$setOnInsert": {"createdAt": timestamps["createdAt"]},
        }

        try:
            result = await products_coll.update_one(match, update, upsert=True)
        except Exception:
            logger.exception("Product upsert failed")
            continue

        if result.upserted_id is not None or result.modified_count:
            inserted_count += 1

    return {
        "message": f"Sync complete. {inserted_count} products added/updated.",
    }
