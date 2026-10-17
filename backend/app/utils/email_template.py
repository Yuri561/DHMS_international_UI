"""
Transactional email templates — direct port of the Node utils.

Exports:
  order_receipt_html(order)              - customer-facing (HTML)
  order_receipt_text(order)              - customer-facing (plain)
  order_admin_notification_html(order)   - internal (HTML)
  order_admin_notification_text(order)   - internal (plain)
  password_reset_html({name, link})      - password reset (HTML)
  password_reset_text({name, link})      - password reset (plain)
"""

from __future__ import annotations

from html import escape as _esc
from typing import Any, Iterable, Mapping

from ..config import settings

BRAND_NAME = "DHMS International"
BRAND_COLOR = "#0f2e5c"
ACCENT_COLOR = "#c9a24a"


def _frontend_url() -> str:
    return (settings.frontend_url or "https://dhmsint.com").rstrip("/")


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------


def _money(amount: Any) -> str:
    try:
        n = float(amount)
    except (TypeError, ValueError):
        return "$0.00"

    if n != n or n in (float("inf"), float("-inf")):
        return "$0.00"

    return f"${n:,.2f}"


def esc(value: Any) -> str:
    """HTML-escape a value, treating None as empty."""
    if value is None:
        return ""
    return _esc(str(value), quote=True)


def _shipping_lines_html(shipping: Mapping[str, Any] | None) -> str:
    if not shipping:
        return ""

    name = esc(shipping.get("name") or "")
    address = esc(shipping.get("address") or "")

    parts = [shipping.get("city"), shipping.get("state"), shipping.get("zipCode")]
    city_state_zip = ", ".join(esc(p) for p in parts if p)

    return "<br/>".join(line for line in [name, address, city_state_zip] if line)


def _shipping_lines_text(shipping: Mapping[str, Any] | None) -> str:
    if not shipping:
        return ""

    parts = [shipping.get("city"), shipping.get("state"), shipping.get("zipCode")]
    city_state_zip = ", ".join(str(p) for p in parts if p)

    lines = [
        shipping.get("name") or "",
        shipping.get("address") or "",
        city_state_zip,
    ]
    return "\n".join(line for line in lines if line)


def _item_unit_price(item: Mapping[str, Any], qty: float) -> float:
    """Fallback to totalPrice/qty if `price` is missing."""
    raw_price = item.get("price")
    if raw_price is not None:
        try:
            return float(raw_price)
        except (TypeError, ValueError):
            pass

    total = item.get("totalPrice")
    if total is not None and qty:
        try:
            return float(total) / float(qty)
        except (TypeError, ValueError, ZeroDivisionError):
            return 0.0

    return 0.0


def _items_rows_html(products: Iterable[Mapping[str, Any]] | None) -> str:
    products = products or []
    rows: list[str] = []

    for item in products:
        name = esc(item.get("name") or "Item")

        try:
            qty = float(item.get("quantity") or 1)
        except (TypeError, ValueError):
            qty = 1.0

        unit = _item_unit_price(item, qty)

        total_raw = item.get("totalPrice")
        try:
            line_total = float(total_raw) if total_raw is not None else unit * qty
        except (TypeError, ValueError):
            line_total = unit * qty

        qty_display = int(qty) if qty.is_integer() else qty

        rows.append(
            f"""
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #ececec;font-size:14px;color:#1a1a1a;">{name}</td>
          <td style="padding:12px 0;border-bottom:1px solid #ececec;font-size:14px;color:#5a6577;text-align:center;">{qty_display}</td>
          <td style="padding:12px 0;border-bottom:1px solid #ececec;font-size:14px;color:#1a1a1a;text-align:right;">{_money(line_total)}</td>
        </tr>"""
        )

    return "".join(rows)


def _items_lines_text(products: Iterable[Mapping[str, Any]] | None) -> str:
    products = products or []
    lines: list[str] = []

    for item in products:
        name = item.get("name") or "Item"

        try:
            qty = float(item.get("quantity") or 1)
        except (TypeError, ValueError):
            qty = 1.0

        unit = _item_unit_price(item, qty)

        total_raw = item.get("totalPrice")
        try:
            line_total = float(total_raw) if total_raw is not None else unit * qty
        except (TypeError, ValueError):
            line_total = unit * qty

        qty_display = int(qty) if qty.is_integer() else qty

        lines.append(f"  - {name} x{qty_display}  {_money(line_total)}")

    return "\n".join(lines)


def _layout(*, heading: str, intro: str, body_html: str, footer_note: str) -> str:
    frontend_url = _frontend_url()
    pretty_url = frontend_url.split("://", 1)[-1]

    return f"""<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>{esc(heading)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f6fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fa;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(16,24,40,.06);">
            <tr>
              <td style="background:{BRAND_COLOR};padding:28px 32px;color:#ffffff;">
                <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.75;">{esc(BRAND_NAME)}</div>
                <div style="font-size:22px;font-weight:600;margin-top:6px;line-height:1.3;">{esc(heading)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="font-size:16px;line-height:1.55;margin:0 0 20px;color:#1a1a1a;">{intro}</p>
                {body_html}
              </td>
            </tr>
            <tr>
              <td style="background:#fafbfd;padding:20px 32px;color:#5a6577;font-size:12px;line-height:1.6;border-top:1px solid #ececec;">
                {footer_note}
                <div style="margin-top:12px;">{esc(BRAND_NAME)} &middot; <a href="{esc(frontend_url)}" style="color:{BRAND_COLOR};text-decoration:none;">{esc(pretty_url)}</a></div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>"""


# ------------------------------------------------------------------
# Customer receipt
# ------------------------------------------------------------------


def order_receipt_html(order: Mapping[str, Any]) -> str:
    customer = esc(order.get("customerName") or "there")
    order_id = esc(order.get("_id") or "")
    shipping_html = _shipping_lines_html(order.get("shipping"))

    shipping_block = (
        f"""
    <div style="margin:0 0 24px;">
      <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#5a6577;margin-bottom:6px;">Shipping to</div>
      <div style="font-size:14px;line-height:1.6;color:#1a1a1a;">{shipping_html}</div>
    </div>"""
        if shipping_html
        else ""
    )

    body_html = f"""
    <p style="font-size:15px;line-height:1.6;margin:0 0 20px;color:#1a1a1a;">
      Thank you for your purchase. Your payment has been received in full and your order is now being prepared.
      A member of our team will be in touch with you shortly to confirm the details and arrange the next steps.
    </p>

    <div style="background:#f4f6fa;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
      <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#5a6577;">Order Reference</div>
      <div style="font-size:18px;font-weight:600;margin-top:4px;color:#1a1a1a;">#{order_id}</div>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px;">
      <thead>
        <tr>
          <th align="left" style="padding:10px 0;border-bottom:2px solid {BRAND_COLOR};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5a6577;">Item</th>
          <th align="center" style="padding:10px 0;border-bottom:2px solid {BRAND_COLOR};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5a6577;">Qty</th>
          <th align="right" style="padding:10px 0;border-bottom:2px solid {BRAND_COLOR};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5a6577;">Amount</th>
        </tr>
      </thead>
      <tbody>{_items_rows_html(order.get("products"))}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding:16px 0 0;text-align:right;font-size:13px;color:#5a6577;">Total paid</td>
          <td style="padding:16px 0 0;text-align:right;font-size:18px;font-weight:600;color:#1a1a1a;">{_money(order.get("totalAmount"))}</td>
        </tr>
      </tfoot>
    </table>

    {shipping_block}

    <p style="font-size:14px;line-height:1.6;margin:24px 0 0;color:#333;">
      If you need to make any changes to your order or have questions, simply reply to this email and we will take care of it personally.
    </p>

    <p style="font-size:14px;line-height:1.6;margin:16px 0 0;color:#333;">
      Thank you for choosing {esc(BRAND_NAME)}.
    </p>

    <p style="font-size:14px;line-height:1.6;margin:16px 0 0;color:#333;">
      Warm regards,<br/>
      <strong>The {esc(BRAND_NAME)} Team</strong>
    </p>
  """

    return _layout(
        heading="Thank you for your order",
        intro=f"Dear {customer},",
        body_html=body_html,
        footer_note=f"This email confirms payment for order #{order_id}. Please keep it for your records.",
    )


def order_receipt_text(order: Mapping[str, Any]) -> str:
    customer = order.get("customerName") or "there"
    order_id = order.get("_id") or ""
    items = _items_lines_text(order.get("products"))
    shipping_text = _shipping_lines_text(order.get("shipping"))

    lines: list[str] = [
        f"Dear {customer},",
        "",
        (
            "Thank you for your purchase. Your payment has been received in "
            "full and your order is now being prepared. A member of our team "
            "will be in touch with you shortly to confirm the details and "
            "arrange the next steps."
        ),
        "",
        f"Order Reference: #{order_id}",
        "",
        "Items",
        items or "  (no line items)",
        "",
        f"Total paid: {_money(order.get('totalAmount'))}",
    ]

    if shipping_text:
        lines += ["", "Shipping to", shipping_text]

    lines += [
        "",
        (
            "If you need to make any changes to your order or have questions, "
            "simply reply to this email and we will take care of it personally."
        ),
        "",
        f"Thank you for choosing {BRAND_NAME}.",
        "",
        "Warm regards,",
        f"The {BRAND_NAME} Team",
    ]

    return "\n".join(lines)


# ------------------------------------------------------------------
# Admin notification
# ------------------------------------------------------------------


def order_admin_notification_html(order: Mapping[str, Any]) -> str:
    order_id = esc(order.get("_id") or "")
    customer_name = esc(order.get("customerName") or "—")
    customer_email_raw = order.get("customerEmail") or ""
    customer_email = esc(customer_email_raw)
    shipping_html = _shipping_lines_html(order.get("shipping"))

    email_cell = (
        f'<a href="mailto:{customer_email}" style="color:{BRAND_COLOR};text-decoration:none;">{customer_email}</a>'
        if customer_email_raw
        else "—"
    )

    shipping_block = (
        f"""
    <div style="margin:0 0 24px;">
      <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#5a6577;margin-bottom:6px;">Shipping address</div>
      <div style="font-size:14px;line-height:1.6;color:#1a1a1a;">{shipping_html}</div>
    </div>"""
        if shipping_html
        else ""
    )

    body_html = f"""
    <div style="background:#fff8e1;border-left:4px solid {ACCENT_COLOR};padding:14px 18px;margin:0 0 24px;border-radius:4px;">
      <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a6d1e;">Action required</div>
      <div style="font-size:14px;color:#4a3b0b;margin-top:4px;">Follow up with the customer and begin fulfillment.</div>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6577;width:35%;">Customer</td>
        <td style="padding:6px 0;font-size:14px;color:#1a1a1a;">{customer_name}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6577;">Email</td>
        <td style="padding:6px 0;font-size:14px;color:#1a1a1a;">{email_cell}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6577;">Order ID</td>
        <td style="padding:6px 0;font-size:14px;color:#1a1a1a;">#{order_id}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6577;">Total paid</td>
        <td style="padding:6px 0;font-size:16px;color:#1a1a1a;font-weight:600;">{_money(order.get("totalAmount"))}</td>
      </tr>
    </table>

    {shipping_block}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px;">
      <thead>
        <tr>
          <th align="left" style="padding:10px 0;border-bottom:2px solid {BRAND_COLOR};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5a6577;">Item</th>
          <th align="center" style="padding:10px 0;border-bottom:2px solid {BRAND_COLOR};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5a6577;">Qty</th>
          <th align="right" style="padding:10px 0;border-bottom:2px solid {BRAND_COLOR};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5a6577;">Amount</th>
        </tr>
      </thead>
      <tbody>{_items_rows_html(order.get("products"))}</tbody>
    </table>
  """

    return _layout(
        heading="New order received",
        intro="A new order has been placed and payment has cleared.",
        body_html=body_html,
        footer_note=f"Automated administrative notification for order #{order_id}.",
    )


def order_admin_notification_text(order: Mapping[str, Any]) -> str:
    order_id = order.get("_id") or ""
    items = _items_lines_text(order.get("products"))
    shipping_text = _shipping_lines_text(order.get("shipping"))

    lines: list[str] = [
        f"NEW ORDER RECEIVED - {BRAND_NAME}",
        "",
        f"Order #{order_id}",
        f"Total paid: {_money(order.get('totalAmount'))}",
        "",
        f"Customer: {order.get('customerName') or '—'}",
        f"Email:    {order.get('customerEmail') or '—'}",
    ]

    if shipping_text:
        lines += ["", "Shipping to", shipping_text]

    lines += [
        "",
        "Items",
        items or "  (no line items)",
        "",
        "Please follow up with the customer and begin fulfillment.",
    ]

    return "\n".join(lines)


# ------------------------------------------------------------------
# Password reset
# ------------------------------------------------------------------


def password_reset_html(*, name: str | None, link: str) -> str:
    customer = esc(name or "there")
    safe_link = esc(link or "")

    body_html = f"""
    <p style="font-size:15px;line-height:1.6;margin:0 0 20px;color:#1a1a1a;">
      We received a request to reset the password associated with this email address.
      Click the button below to choose a new password. This link will expire in 15 minutes.
    </p>

    <p style="text-align:center;margin:28px 0;">
      <a href="{safe_link}" style="display:inline-block;background:{BRAND_COLOR};color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600;">
        Reset my password
      </a>
    </p>

    <p style="font-size:13px;line-height:1.6;margin:20px 0 0;color:#5a6577;">
      If the button above does not work, copy and paste the following link into your browser:
    </p>
    <p style="font-size:13px;line-height:1.6;margin:6px 0 0;word-break:break-all;">
      <a href="{safe_link}" style="color:{BRAND_COLOR};">{safe_link}</a>
    </p>

    <p style="font-size:13px;line-height:1.6;margin:24px 0 0;color:#5a6577;">
      If you did not request a password reset, you can safely ignore this email.
    </p>
  """

    return _layout(
        heading="Reset your password",
        intro=f"Hi {customer},",
        body_html=body_html,
        footer_note="For your security, this link will expire in 15 minutes.",
    )


def password_reset_text(*, name: str | None, link: str) -> str:
    return "\n".join(
        [
            f"Hi {name or 'there'},",
            "",
            "We received a request to reset the password associated with this email address.",
            "Open the link below to choose a new password. This link will expire in 15 minutes.",
            "",
            link or "",
            "",
            "If you did not request a password reset, you can safely ignore this email.",
            "",
            f"— The {BRAND_NAME} Team",
        ]
    )
