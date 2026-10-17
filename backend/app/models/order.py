"""
Order helpers.
"""

from __future__ import annotations

from typing import Any

from .common import serialize_doc, utcnow


def new_order_document(
    *,
    cart_id: str,
    customer_email: str,
    customer_name: str,
    products: list[dict[str, Any]],
    total_amount: float,
    shipping: dict[str, Any] | None,
    stripe_session_id: str,
    stripe_payment_intent_id: str | None,
) -> dict[str, Any]:
    now = utcnow()

    # Store a stripped copy of each product line so order history
    # survives even if the underlying product doc changes/vanishes.
    stored_products: list[dict[str, Any]] = []
    for p in products or []:
        stored_products.append(
            {
                "productId": str(p.get("productId") or ""),
                "name": p.get("name") or "",
                "price": float(p.get("price") or 0),
                "quantity": int(p.get("quantity") or 0),
                "image": p.get("image") or "",
                "color": p.get("color") or "",
                "rating": p.get("rating"),
                "category": p.get("category") or "",
                "totalPrice": float(p.get("totalPrice") or 0),
            }
        )

    return {
        "cartId": cart_id,
        "customerEmail": customer_email,
        "customerName": customer_name,
        "products": stored_products,
        "totalAmount": float(total_amount),
        "shipping": shipping,
        "status": "paid",
        "stripeSessionId": stripe_session_id,
        "stripePaymentIntentId": stripe_payment_intent_id,
        "createdAt": now,
        "updatedAt": now,
    }


def serialize_order(doc: dict[str, Any] | None) -> dict[str, Any] | None:
    serialized = serialize_doc(doc)
    if serialized is None:
        return None

    # Frontend OrderHistory.tsx reads `order.items`, not `order.products`.
    # Expose both names so either shape works.
    serialized.setdefault("items", serialized.get("products", []))
    return serialized
