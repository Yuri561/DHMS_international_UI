"""
Stripe Checkout session creation.

Mirrors backend/_legacy_node/routes/stripe.js:
  POST /checkout/create-checkout-session
"""

from __future__ import annotations

import logging
from typing import Any

import stripe
from fastapi import APIRouter, Cookie, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

from ..config import settings

logger = logging.getLogger("dhms.checkout")

router = APIRouter(prefix="/checkout", tags=["checkout"])

# Configure the Stripe SDK once per process.
if settings.stripe_key:
    stripe.api_key = settings.stripe_key


# ------------------------------------------------------------------
# Request shape
# ------------------------------------------------------------------


class ProductData(BaseModel):
    name: str = "Item"

    model_config = {"extra": "ignore"}


class PriceData(BaseModel):
    currency: str = "usd"
    product_data: ProductData = Field(default_factory=ProductData)
    unit_amount: int = 0

    model_config = {"extra": "ignore"}


class LineItem(BaseModel):
    price_data: PriceData = Field(default_factory=PriceData)
    quantity: int = 0

    model_config = {"extra": "ignore"}


class CheckoutPayload(BaseModel):
    email: EmailStr | None = None
    name: str | None = None
    homeAddress: str | None = None
    city: str | None = None
    state: str | None = None
    zipCode: str | None = None
    line_items: list[LineItem] = Field(default_factory=list)

    model_config = {"extra": "ignore"}


# ------------------------------------------------------------------
# POST /checkout/create-checkout-session
# ------------------------------------------------------------------


def _success_url() -> str:
    base = settings.frontend_url or "https://dhmsint.com"
    return f"{base.rstrip('/')}/success?session_id={{CHECKOUT_SESSION_ID}}"


def _cancel_url() -> str:
    base = settings.frontend_url or "https://dhmsint.com"
    return f"{base.rstrip('/')}/cart?canceled=1"


@router.post("/create-checkout-session")
async def create_checkout_session(
    payload: CheckoutPayload,
    cart_id_cookie: str | None = Cookie(default=None, alias="cartId"),
) -> dict[str, Any]:
    if not settings.stripe_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Stripe is not configured on the server",
        )

    if not payload.line_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No items to checkout",
        )

    # Server-side filter: reject invalid lines before handing to
    # Stripe. Matches the Node validation.
    items: list[dict[str, Any]] = []
    for li in payload.line_items:
        unit_amount = int(round(li.price_data.unit_amount))
        quantity = int(li.quantity)
        pname = (li.price_data.product_data.name or "Item").strip() or "Item"

        if unit_amount >= 1 and quantity >= 1:
            items.append(
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {"name": pname},
                        "unit_amount": unit_amount,
                    },
                    "quantity": quantity,
                }
            )

    if not items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All line items were invalid",
        )

    address_parts = [payload.homeAddress, payload.city, payload.state, payload.zipCode]
    address_str = ", ".join(part for part in address_parts if part)

    try:
        session = await _create_stripe_session(
            line_items=items,
            customer_email=str(payload.email) if payload.email else None,
            metadata={
                "name": payload.name or "",
                "address": address_str,
                "cartId": cart_id_cookie or "",
            },
        )
    except stripe.error.StripeError as exc:  # type: ignore[attr-defined]
        message = getattr(exc, "user_message", None) or str(exc)
        logger.exception("Stripe error creating checkout session")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=message,
        )
    except Exception as exc:
        logger.exception("Unexpected error creating checkout session")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc) or "Stripe error",
        )

    return {"url": session.url}


async def _create_stripe_session(
    *,
    line_items: list[dict[str, Any]],
    customer_email: str | None,
    metadata: dict[str, str],
) -> Any:
    """Create a Stripe Checkout Session.

    The Stripe Python SDK is synchronous — we call it directly here
    (Starlette will run us in a threadpool for a blocking call since
    we're an async handler, but Stripe calls are quick network ops
    and this matches the Node code's semantics). If we needed better
    concurrency we'd wrap with `anyio.to_thread.run_sync`.
    """
    kwargs: dict[str, Any] = {
        "mode": "payment",
        "line_items": line_items,
        "success_url": _success_url(),
        "cancel_url": _cancel_url(),
        "customer_creation": "always",
        "billing_address_collection": "required",
        "shipping_address_collection": {"allowed_countries": ["US", "CA"]},
        "automatic_tax": {"enabled": False},
        "allow_promotion_codes": True,
        "metadata": metadata,
    }

    if customer_email:
        kwargs["customer_email"] = customer_email

    return stripe.checkout.Session.create(**kwargs)
