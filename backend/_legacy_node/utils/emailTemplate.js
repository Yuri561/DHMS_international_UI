// utils/emailTemplate.js
// Transactional email templates for DHMS International.
//
// Exports:
//   orderReceiptHTML(order)              - customer-facing confirmation (HTML)
//   orderReceiptText(order)              - customer-facing confirmation (plain)
//   orderAdminNotificationHTML(order)    - internal order notification (HTML)
//   orderAdminNotificationText(order)    - internal order notification (plain)
//   passwordResetHTML({ name, link })    - password reset email (HTML)
//   passwordResetText({ name, link })    - password reset email (plain)

const BRAND_NAME = "DHMS International";
const BRAND_COLOR = "#0f2e5c"; // deep navy
const ACCENT_COLOR = "#c9a24a"; // soft gold
const FRONTEND_URL =
  (process.env.FRONTEND_URL || "https://dhmsint.com").replace(/\/+$/, "");

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function money(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "$0.00";
  return `$${n.toFixed(2)}`;
}

function esc(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shippingLinesHTML(shipping) {
  if (!shipping) return "";

  const name = esc(shipping.name || "");
  const address = esc(shipping.address || "");

  const cityStateZip = [
    shipping.city,
    shipping.state,
    shipping.zipCode,
  ]
    .filter(Boolean)
    .map(esc)
    .join(", ");

  return [name, address, cityStateZip]
    .filter(Boolean)
    .join("<br/>");
}

function shippingLinesText(shipping) {
  if (!shipping) return "";

  const cityStateZip = [
    shipping.city,
    shipping.state,
    shipping.zipCode,
  ]
    .filter(Boolean)
    .join(", ");

  return [shipping.name, shipping.address, cityStateZip]
    .filter(Boolean)
    .join("\n");
}

function itemsRowsHTML(products) {
  return (products || [])
    .map((item) => {
      const name = esc(item.name || "Item");
      const qty = Number(item.quantity ?? 1);

      const unit = Number(
        item.price ??
          (item.totalPrice && qty ? item.totalPrice / qty : 0)
      );

      const lineTotal = Number(item.totalPrice ?? unit * qty);

      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #ececec;font-size:14px;color:#1a1a1a;">${name}</td>
          <td style="padding:12px 0;border-bottom:1px solid #ececec;font-size:14px;color:#5a6577;text-align:center;">${qty}</td>
          <td style="padding:12px 0;border-bottom:1px solid #ececec;font-size:14px;color:#1a1a1a;text-align:right;">${money(lineTotal)}</td>
        </tr>`;
    })
    .join("");
}

function itemsLinesText(products) {
  return (products || [])
    .map((item) => {
      const name = item.name || "Item";
      const qty = Number(item.quantity ?? 1);

      const unit = Number(
        item.price ??
          (item.totalPrice && qty ? item.totalPrice / qty : 0)
      );

      const lineTotal = Number(item.totalPrice ?? unit * qty);

      return `  - ${name} x${qty}  ${money(lineTotal)}`;
    })
    .join("\n");
}

function layout({ heading, intro, bodyHTML, footerNote }) {
  const prettyUrl = FRONTEND_URL.replace(/^https?:\/\//, "");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1"/>
    <title>${esc(heading)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f6fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fa;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 2px rgba(16,24,40,.06);">
            <tr>
              <td style="background:${BRAND_COLOR};padding:28px 32px;color:#ffffff;">
                <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:.75;">${esc(BRAND_NAME)}</div>
                <div style="font-size:22px;font-weight:600;margin-top:6px;line-height:1.3;">${esc(heading)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="font-size:16px;line-height:1.55;margin:0 0 20px;color:#1a1a1a;">${intro}</p>
                ${bodyHTML}
              </td>
            </tr>
            <tr>
              <td style="background:#fafbfd;padding:20px 32px;color:#5a6577;font-size:12px;line-height:1.6;border-top:1px solid #ececec;">
                ${footerNote}
                <div style="margin-top:12px;">${esc(BRAND_NAME)} &middot; <a href="${esc(FRONTEND_URL)}" style="color:${BRAND_COLOR};text-decoration:none;">${esc(prettyUrl)}</a></div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// ------------------------------------------------------------------
// Customer receipt
// ------------------------------------------------------------------

export function orderReceiptHTML(order) {
  const customer = esc(order.customerName || "there");
  const orderId = esc(order._id || "");
  const shippingHTML = shippingLinesHTML(order.shipping);

  const bodyHTML = `
    <p style="font-size:15px;line-height:1.6;margin:0 0 20px;color:#1a1a1a;">
      Thank you for your purchase. Your payment has been received in full and your order is now being prepared.
      A member of our team will be in touch with you shortly to confirm the details and arrange the next steps.
    </p>

    <div style="background:#f4f6fa;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
      <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#5a6577;">Order Reference</div>
      <div style="font-size:18px;font-weight:600;margin-top:4px;color:#1a1a1a;">#${orderId}</div>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px;">
      <thead>
        <tr>
          <th align="left" style="padding:10px 0;border-bottom:2px solid ${BRAND_COLOR};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5a6577;">Item</th>
          <th align="center" style="padding:10px 0;border-bottom:2px solid ${BRAND_COLOR};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5a6577;">Qty</th>
          <th align="right" style="padding:10px 0;border-bottom:2px solid ${BRAND_COLOR};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5a6577;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemsRowsHTML(order.products)}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding:16px 0 0;text-align:right;font-size:13px;color:#5a6577;">Total paid</td>
          <td style="padding:16px 0 0;text-align:right;font-size:18px;font-weight:600;color:#1a1a1a;">${money(order.totalAmount)}</td>
        </tr>
      </tfoot>
    </table>

    ${
      shippingHTML
        ? `
    <div style="margin:0 0 24px;">
      <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#5a6577;margin-bottom:6px;">Shipping to</div>
      <div style="font-size:14px;line-height:1.6;color:#1a1a1a;">${shippingHTML}</div>
    </div>`
        : ""
    }

    <p style="font-size:14px;line-height:1.6;margin:24px 0 0;color:#333;">
      If you need to make any changes to your order or have questions, simply reply to this email and we will take care of it personally.
    </p>

    <p style="font-size:14px;line-height:1.6;margin:16px 0 0;color:#333;">
      Thank you for choosing ${esc(BRAND_NAME)}.
    </p>

    <p style="font-size:14px;line-height:1.6;margin:16px 0 0;color:#333;">
      Warm regards,<br/>
      <strong>The ${esc(BRAND_NAME)} Team</strong>
    </p>
  `;

  return layout({
    heading: "Thank you for your order",
    intro: `Dear ${customer},`,
    bodyHTML,
    footerNote: `This email confirms payment for order #${orderId}. Please keep it for your records.`,
  });
}

export function orderReceiptText(order) {
  const customer = order.customerName || "there";
  const orderId = order._id || "";
  const items = itemsLinesText(order.products);
  const shippingText = shippingLinesText(order.shipping);

  const lines = [
    `Dear ${customer},`,
    ``,
    `Thank you for your purchase. Your payment has been received in full and your order is now being prepared. A member of our team will be in touch with you shortly to confirm the details and arrange the next steps.`,
    ``,
    `Order Reference: #${orderId}`,
    ``,
    `Items`,
    items || "  (no line items)",
    ``,
    `Total paid: ${money(order.totalAmount)}`,
  ];

  if (shippingText) {
    lines.push(``, `Shipping to`, shippingText);
  }

  lines.push(
    ``,
    `If you need to make any changes to your order or have questions, simply reply to this email and we will take care of it personally.`,
    ``,
    `Thank you for choosing ${BRAND_NAME}.`,
    ``,
    `Warm regards,`,
    `The ${BRAND_NAME} Team`
  );

  return lines.join("\n");
}

// ------------------------------------------------------------------
// Admin notification
// ------------------------------------------------------------------

export function orderAdminNotificationHTML(order) {
  const orderId = esc(order._id || "");
  const customerName = esc(order.customerName || "—");
  const customerEmail = esc(order.customerEmail || "");
  const shippingHTML = shippingLinesHTML(order.shipping);

  const bodyHTML = `
    <div style="background:#fff8e1;border-left:4px solid ${ACCENT_COLOR};padding:14px 18px;margin:0 0 24px;border-radius:4px;">
      <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#8a6d1e;">Action required</div>
      <div style="font-size:14px;color:#4a3b0b;margin-top:4px;">Follow up with the customer and begin fulfillment.</div>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6577;width:35%;">Customer</td>
        <td style="padding:6px 0;font-size:14px;color:#1a1a1a;">${customerName}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6577;">Email</td>
        <td style="padding:6px 0;font-size:14px;color:#1a1a1a;">${
          customerEmail
            ? `<a href="mailto:${customerEmail}" style="color:${BRAND_COLOR};text-decoration:none;">${customerEmail}</a>`
            : "—"
        }</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6577;">Order ID</td>
        <td style="padding:6px 0;font-size:14px;color:#1a1a1a;">#${orderId}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:12px;color:#5a6577;">Total paid</td>
        <td style="padding:6px 0;font-size:16px;color:#1a1a1a;font-weight:600;">${money(order.totalAmount)}</td>
      </tr>
    </table>

    ${
      shippingHTML
        ? `
    <div style="margin:0 0 24px;">
      <div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#5a6577;margin-bottom:6px;">Shipping address</div>
      <div style="font-size:14px;line-height:1.6;color:#1a1a1a;">${shippingHTML}</div>
    </div>`
        : ""
    }

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 20px;">
      <thead>
        <tr>
          <th align="left" style="padding:10px 0;border-bottom:2px solid ${BRAND_COLOR};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5a6577;">Item</th>
          <th align="center" style="padding:10px 0;border-bottom:2px solid ${BRAND_COLOR};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5a6577;">Qty</th>
          <th align="right" style="padding:10px 0;border-bottom:2px solid ${BRAND_COLOR};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5a6577;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemsRowsHTML(order.products)}</tbody>
    </table>
  `;

  return layout({
    heading: "New order received",
    intro: `A new order has been placed and payment has cleared.`,
    bodyHTML,
    footerNote: `Automated administrative notification for order #${orderId}.`,
  });
}

export function orderAdminNotificationText(order) {
  const orderId = order._id || "";
  const items = itemsLinesText(order.products);
  const shippingText = shippingLinesText(order.shipping);

  const lines = [
    `NEW ORDER RECEIVED - ${BRAND_NAME}`,
    ``,
    `Order #${orderId}`,
    `Total paid: ${money(order.totalAmount)}`,
    ``,
    `Customer: ${order.customerName || "—"}`,
    `Email:    ${order.customerEmail || "—"}`,
  ];

  if (shippingText) {
    lines.push(``, `Shipping to`, shippingText);
  }

  lines.push(
    ``,
    `Items`,
    items || "  (no line items)",
    ``,
    `Please follow up with the customer and begin fulfillment.`
  );

  return lines.join("\n");
}

// ------------------------------------------------------------------
// Password reset
// ------------------------------------------------------------------

export function passwordResetHTML({ name, link }) {
  const customer = esc(name || "there");
  const safeLink = esc(link || "");

  const bodyHTML = `
    <p style="font-size:15px;line-height:1.6;margin:0 0 20px;color:#1a1a1a;">
      We received a request to reset the password associated with this email address.
      Click the button below to choose a new password. This link will expire in 15 minutes.
    </p>

    <p style="text-align:center;margin:28px 0;">
      <a href="${safeLink}" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600;">
        Reset my password
      </a>
    </p>

    <p style="font-size:13px;line-height:1.6;margin:20px 0 0;color:#5a6577;">
      If the button above does not work, copy and paste the following link into your browser:
    </p>
    <p style="font-size:13px;line-height:1.6;margin:6px 0 0;word-break:break-all;">
      <a href="${safeLink}" style="color:${BRAND_COLOR};">${safeLink}</a>
    </p>

    <p style="font-size:13px;line-height:1.6;margin:24px 0 0;color:#5a6577;">
      If you did not request a password reset, you can safely ignore this email.
    </p>
  `;

  return layout({
    heading: "Reset your password",
    intro: `Hi ${customer},`,
    bodyHTML,
    footerNote: `For your security, this link will expire in 15 minutes.`,
  });
}

export function passwordResetText({ name, link }) {
  return [
    `Hi ${name || "there"},`,
    ``,
    `We received a request to reset the password associated with this email address.`,
    `Open the link below to choose a new password. This link will expire in 15 minutes.`,
    ``,
    link || "",
    ``,
    `If you did not request a password reset, you can safely ignore this email.`,
    ``,
    `— The ${BRAND_NAME} Team`,
  ].join("\n");
}
