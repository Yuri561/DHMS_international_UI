"""
Stripe webhook handler.

Mirrors backend/_legacy_node/routes/stripeWebhook.js:
  POST /checkout/webhook/stripe

Must receive the raw request body for signature verification. In
FastAPI we read `await request.body()` BEFORE anything in the
framework tries to parse JSON.

The handler is idempotent — Stripe may re-deliver the same event,
so we dedupe by stripeSessionId.
"""

from __future__ import annotations

import logging
from typing import Any

import stripe
from bson import ObjectId
from fastapi import APIRouter, Header, HTTPException, Request, status
from pymongo.errors import DuplicateKeyError

from ..config import settings
from ..database import collection
from ..models.common import utcnow
from ..models.order import new_order_document
from ..utils.email_template import (
    order_admin_notification_html,
    order_admin_notification_text,
    order_receipt_html,
    order_receipt_text,
)
from ..utils.mailer import ADMIN, MailerError, send_order_email

logger = logging.getLogger("dhms.webhook")

router = APIRouter(prefix="/checkout", tags=["webhook"])


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------


def _normalize_shipping(
    stripe_shipping: dict[str, Any] | None,
    fallback_name: str | None,
) -> dict[str, Any]:
    addr = (stripe_shipping or {}).get("address") or {}

    line1 = addr.get("line1") or ""
    line2 = addr.get("line2") or ""
    line = ", ".join(part for part in [line1, line2] if part)

    return {
        "name": (stripe_shipping or {}).get("name") or fallback_name or "",
        "address": line,
        "city": addr.get("city") or "",
        "state": addr.get("state") or "",
        "zipCode": addr.get("postal_code") or "",
    }


def _payment_intent_id(session: dict[str, Any]) -> str | None:
    pi = session.get("payment_intent")
    if isinstance(pi, str):
        return pi
    if isinstance(pi, dict):
        return pi.get("id")
    return None


# ------------------------------------------------------------------
# POST /checkout/webhook/stripe
# ------------------------------------------------------------------


@router.post("/webhook/stripe", include_in_schema=False)
async def stripe_webhook(
    request: Request,
    stripe_signature: str | None = Header(default=None, alias="stripe-signature"),
) -> dict[str, Any]:
    if not settings.stripe_webhook_secret:
        logger.error("STRIPE_WEBHOOK_SECRET is not configured")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook secret not configured",
        )

    raw_body = await request.body()

    try:
        event = stripe.Webhook.construct_event(
            payload=raw_body,
            sig_header=stripe_signature or "",
            secret=settings.stripe_webhook_secret,
        )
    except (ValueError, stripe.error.SignatureVerificationError) as exc:  # type: ignore[attr-defined]
        logger.error("Stripe webhook verification failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Webhook Error: {exc}",
        )

    event_type: str = event["type"]

    # Only interested in successful checkouts for now.
    if event_type != "checkout.session.completed":
        return {"received": True}

    session = event["data"]["object"]

    # Only fulfill once payment is actually confirmed.
    if session.get("payment_status") != "paid":
        logger.info(
            "Checkout completed but payment not paid: %s", session.get("id")
        )
        return {
            "received": True,
            "paymentStatus": session.get("payment_status"),
        }

    try:
        return await _handle_completed_checkout(session, event.get("id"))
    except Exception as exc:
        logger.exception("Stripe webhook processing error")
        # Return 500 so Stripe retries.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Webhook processing failed",
        ) from exc


# ------------------------------------------------------------------
# Business logic
# ------------------------------------------------------------------


async def _handle_completed_checkout(
    session: dict[str, Any],
    event_id: str | None,
) -> dict[str, Any]:
    cart_id = (session.get("metadata") or {}).get("cartId")

    customer_name = (
        (session.get("metadata") or {}).get("name")
        or (session.get("customer_details") or {}).get("name")
        or "Customer"
    )
    customer_email = (
        (session.get("customer_details") or {}).get("email")
        or session.get("customer_email")
        or ""
    )

    shipping_details = (
        (session.get("collected_information") or {}).get("shipping_details")
        or session.get("shipping_details")
        or None
    )
    shipping = _normalize_shipping(shipping_details, customer_name)

    logger.info(
        "Payment received: session=%s event=%s cart=%s customer=%s email=%s",
        session.get("id"),
        event_id,
        cart_id,
        customer_name,
        customer_email,
    )

    if not cart_id:
        logger.error("Missing cartId in Stripe metadata: %s", session.get("id"))
        return {"received": True, "warning": "Missing cartId"}

    orders = collection("orders")
    carts = collection("carts")

    # ------------------------------------------------------------------
    # Idempotency: look up by stripeSessionId first.
    # ------------------------------------------------------------------
    order = await orders.find_one({"stripeSessionId": session["id"]})

    if not order:
        order = await orders.find_one({"cartId": cart_id})

    is_new_order = False
    products: list[dict[str, Any]] = []

    if order:
        logger.info("Existing order found: %s", order.get("_id"))
        products = list(order.get("products") or [])

        # Backfill legacy orders that may be missing a few fields.
        dirty_set: dict[str, Any] = {}

        if not order.get("stripeSessionId"):
            dirty_set["stripeSessionId"] = session["id"]
        if not order.get("customerEmail") and customer_email:
            dirty_set["customerEmail"] = customer_email
        if not order.get("customerName") and customer_name:
            dirty_set["customerName"] = customer_name

        current_shipping = order.get("shipping") or {}
        if not current_shipping.get("address") and shipping.get("address"):
            dirty_set["shipping"] = shipping

        if dirty_set:
            dirty_set["updatedAt"] = utcnow()
            await orders.update_one({"_id": order["_id"]}, {"$set": dirty_set})
            order.update(dirty_set)
    else:
        # First time seeing this session — build an order from the cart.
        cart_doc = await carts.find_one({"cartId": cart_id})
        if not cart_doc:
            logger.error("Cart not found for session: %s", cart_id)
            return {"received": True, "warning": "Cart not found"}

        products = list(cart_doc.get("items") or [])

        total_amount = 0.0
        for item in products:
            try:
                total_amount += float(item.get("totalPrice") or 0)
            except (TypeError, ValueError):
                continue

        new_doc = new_order_document(
            cart_id=cart_id,
            customer_email=customer_email,
            customer_name=customer_name,
            products=products,
            total_amount=total_amount,
            shipping=shipping,
            stripe_session_id=session["id"],
            stripe_payment_intent_id=_payment_intent_id(session),
        )

        try:
            result = await orders.insert_one(new_doc)
            new_doc["_id"] = result.inserted_id
            order = new_doc
            is_new_order = True
            logger.info("Order saved: %s", order.get("_id"))
        except DuplicateKeyError:
            logger.warning(
                "Duplicate order create raced, reloading: %s", session["id"]
            )
            order = await orders.find_one({"stripeSessionId": session["id"]})
            if not order:
                order = await orders.find_one({"cartId": cart_id})
            products = list((order or {}).get("products") or products)
            is_new_order = False

    if order is None:
        logger.error("Order lookup unexpectedly empty after processing")
        return {"received": True, "warning": "Order not available"}

    order_id = _format_order_id(order.get("_id"))

    # ------------------------------------------------------------------
    # Emails — only on first processing.
    # ------------------------------------------------------------------
    if not is_new_order:
        logger.info("Skipping emails for already-processed order: %s", order_id)
    else:
        order_for_email = {
            "_id": order_id,
            "customerName": customer_name,
            "customerEmail": customer_email,
            "products": products,
            "totalAmount": order.get("totalAmount"),
            "shipping": shipping,
        }

        # Customer receipt
        if customer_email:
            try:
                message_id = await send_order_email(
                    to=customer_email,
                    to_name=customer_name,
                    subject=f"Your DHMS International order confirmation — #{order_id}",
                    html=order_receipt_html(order_for_email),
                    text=order_receipt_text(order_for_email),
                    tags=["order-confirmation", "customer"],
                    headers={
                        "X-DHMS-Order-Id": order_id,
                        "X-DHMS-Stripe-Session": session["id"],
                    },
                )
                logger.info("Customer email accepted by Brevo: %s", message_id)
            except MailerError as exc:
                logger.error("Customer email failed: %s", exc)
        else:
            logger.warning("Customer email address is missing.")

        # Admin notification
        if ADMIN:
            try:
                total_amount = float(order.get("totalAmount") or 0)
                reply_to: dict[str, str] | None = None
                if customer_email:
                    reply_to = {
                        "email": customer_email,
                        "name": customer_name or customer_email,
                    }

                message_id = await send_order_email(
                    to=ADMIN,
                    to_name="DHMS Orders",
                    subject=(
                        f"New order #{order_id} — {customer_name} — "
                        f"${total_amount:.2f}"
                    ),
                    html=order_admin_notification_html(order_for_email),
                    text=order_admin_notification_text(order_for_email),
                    reply_to=reply_to,
                    tags=["order-notification", "admin"],
                    headers={
                        "X-DHMS-Order-Id": order_id,
                        "X-DHMS-Stripe-Session": session["id"],
                    },
                )
                logger.info("Admin email accepted by Brevo: %s", message_id)
            except MailerError as exc:
                logger.error("Admin email failed: %s", exc)
        else:
            logger.warning("ADMIN_EMAIL is not configured.")

    # ------------------------------------------------------------------
    # Clear the cart (safe to run on retries too).
    # ------------------------------------------------------------------
    try:
        await carts.delete_one({"cartId": cart_id})
    except Exception:
        logger.exception("Failed to clear cart %s", cart_id)

    logger.info("Order processed: %s", order_id)

    return {
        "received": True,
        "orderId": order_id,
        "duplicate": not is_new_order,
    }


def _format_order_id(raw: Any) -> str:
    if isinstance(raw, ObjectId):
        return str(raw)
    return str(raw or "")
