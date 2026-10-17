// routes/stripeWebhook.js

import "dotenv/config";
import express from "express";
import Stripe from "stripe";

import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

import {
  sendOrderEmail,
  ADMIN,
} from "../utils/mailer.js";

import {
  orderReceiptHTML,
  orderReceiptText,
  orderAdminNotificationHTML,
  orderAdminNotificationText,
} from "../utils/emailTemplate.js";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

function normalizeShipping(stripeShipping, fallbackName) {
  // Stripe returns:
  //   { name, address: { line1, line2, city, state, postal_code, country } }
  const addr = stripeShipping?.address || {};

  const line = [addr.line1, addr.line2].filter(Boolean).join(", ");

  return {
    name: stripeShipping?.name || fallbackName || "",
    address: line,
    city: addr.city || "",
    state: addr.state || "",
    zipCode: addr.postal_code || "",
  };
}

// ---------------------------------------------------------
// STRIPE WEBHOOK
// ---------------------------------------------------------

router.post(
  "/webhook/stripe",

  express.raw({ type: "application/json" }),

  async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    // -----------------------------------------------------
    // VERIFY STRIPE SIGNATURE
    // -----------------------------------------------------

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (error) {
      console.error(
        "Stripe webhook verification failed:",
        error.message
      );

      return res
        .status(400)
        .send(`Webhook Error: ${error.message}`);
    }

    // -----------------------------------------------------
    // HANDLE SUCCESSFUL CHECKOUT ONLY
    // -----------------------------------------------------

    if (event.type !== "checkout.session.completed") {
      return res.status(200).json({ received: true });
    }

    const session = event.data.object;

    // Only fulfill once payment is actually confirmed.
    if (session.payment_status !== "paid") {
      console.log(
        "Checkout completed but payment is not paid:",
        session.id
      );

      return res.status(200).json({
        received: true,
        paymentStatus: session.payment_status,
      });
    }

    try {
      // ---------------------------------------------------
      // EXTRACT CUSTOMER + SHIPPING FROM STRIPE SESSION
      // ---------------------------------------------------

      const cartId = session.metadata?.cartId;

      const customerName =
        session.metadata?.name ||
        session.customer_details?.name ||
        "Customer";

      const customerEmail =
        session.customer_details?.email ||
        session.customer_email ||
        "";

      const shippingDetails =
        session.collected_information?.shipping_details ||
        session.shipping_details ||
        null;

      const shipping = normalizeShipping(
        shippingDetails,
        customerName
      );

      console.log("Payment received:", {
        sessionId: session.id,
        eventId: event.id,
        cartId,
        customerName,
        customerEmail,
      });

      // ---------------------------------------------------
      // VALIDATE CART ID
      // ---------------------------------------------------

      if (!cartId) {
        console.error(
          "Missing cartId in Stripe metadata:",
          session.id
        );

        // Ack so Stripe stops retrying; nothing we can do.
        return res.status(200).json({
          received: true,
          warning: "Missing cartId",
        });
      }

      // ---------------------------------------------------
      // IDEMPOTENCY — ORDER LOOKUP BY STRIPE SESSION ID
      //
      // Stripe may replay the same checkout.session.completed
      // event. We dedupe by stripeSessionId: if an order
      // already exists for this session, we skip email sends.
      // ---------------------------------------------------

      let orderHistory = await Order.findOne({
        stripeSessionId: session.id,
      });

      // Fallback for pre-existing orders that were saved
      // before stripeSessionId was being persisted.
      if (!orderHistory) {
        orderHistory = await Order.findOne({ cartId });
      }

      let isNewOrder = false;
      let products;

      if (orderHistory) {
        console.log("Existing order found:", orderHistory._id);

        products = orderHistory.products;

        // Backfill fields that may be missing on legacy orders
        // so admin notifications still render usefully.
        let dirty = false;

        if (!orderHistory.stripeSessionId) {
          orderHistory.stripeSessionId = session.id;
          dirty = true;
        }

        if (!orderHistory.customerEmail && customerEmail) {
          orderHistory.customerEmail = customerEmail;
          dirty = true;
        }

        if (!orderHistory.customerName && customerName) {
          orderHistory.customerName = customerName;
          dirty = true;
        }

        if (
          (!orderHistory.shipping ||
            !orderHistory.shipping.address) &&
          shipping.address
        ) {
          orderHistory.shipping = shipping;
          dirty = true;
        }

        if (dirty) {
          await orderHistory.save();
        }
      } else {
        // -------------------------------------------------
        // FIRST TIME SEEING THIS CHECKOUT — CREATE ORDER
        // -------------------------------------------------

        const userCart = await Cart.findOne({ cartId });

        if (!userCart) {
          console.error("Cart not found:", cartId);

          return res.status(200).json({
            received: true,
            warning: "Cart not found",
          });
        }

        products = userCart.items;

        const totalAmount = products.reduce(
          (sum, item) => sum + Number(item.totalPrice || 0),
          0
        );

        try {
          orderHistory = await Order.create({
            cartId,
            customerName,
            customerEmail,
            products,
            totalAmount,
            shipping,
            status: "paid",
            stripeSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id || undefined,
          });

          isNewOrder = true;

          console.log("Order saved:", orderHistory._id);
        } catch (createError) {
          // If a concurrent delivery raced us and created
          // the same order, swallow the duplicate and fall
          // back to the existing document.
          if (createError?.code === 11000) {
            console.warn(
              "Duplicate order create raced, reloading:",
              session.id
            );

            orderHistory = await Order.findOne({
              stripeSessionId: session.id,
            });

            if (!orderHistory) {
              orderHistory = await Order.findOne({ cartId });
            }

            products = orderHistory?.products || products;
            isNewOrder = false;
          } else {
            throw createError;
          }
        }
      }

      // ---------------------------------------------------
      // SEND EMAILS — ONLY ON FIRST SUCCESSFUL PROCESSING
      // ---------------------------------------------------

      if (!isNewOrder) {
        console.log(
          "Skipping emails for already-processed order:",
          orderHistory?._id
        );
      } else {
        const orderForEmail = {
          _id: orderHistory._id,
          customerName,
          customerEmail,
          products,
          totalAmount: orderHistory.totalAmount,
          shipping,
        };

        // ---- CUSTOMER RECEIPT -----------------------------
        if (customerEmail) {
          try {
            const customerMessageId = await sendOrderEmail({
              to: customerEmail,
              toName: customerName,
              subject: `Your DHMS International order confirmation — #${orderHistory._id}`,
              html: orderReceiptHTML(orderForEmail),
              text: orderReceiptText(orderForEmail),
              tags: ["order-confirmation", "customer"],
              headers: {
                "X-DHMS-Order-Id": String(orderHistory._id),
                "X-DHMS-Stripe-Session": session.id,
              },
            });

            console.log(
              "Customer email accepted by Brevo:",
              customerMessageId
            );
          } catch (emailError) {
            console.error(
              "Customer email failed:",
              emailError.message
            );
          }
        } else {
          console.warn("Customer email address is missing.");
        }

        // ---- ADMIN NOTIFICATION ---------------------------
        if (ADMIN) {
          try {
            const adminMessageId = await sendOrderEmail({
              to: ADMIN,
              toName: "DHMS Orders",
              subject: `New order #${orderHistory._id} — ${customerName} — $${Number(
                orderHistory.totalAmount || 0
              ).toFixed(2)}`,
              html: orderAdminNotificationHTML(orderForEmail),
              text: orderAdminNotificationText(orderForEmail),
              replyTo: customerEmail
                ? { email: customerEmail, name: customerName }
                : undefined,
              tags: ["order-notification", "admin"],
              headers: {
                "X-DHMS-Order-Id": String(orderHistory._id),
                "X-DHMS-Stripe-Session": session.id,
              },
            });

            console.log(
              "Admin email accepted by Brevo:",
              adminMessageId
            );
          } catch (emailError) {
            console.error(
              "Admin email failed:",
              emailError.message
            );
          }
        } else {
          console.warn("ADMIN_EMAIL is not configured.");
        }
      }

      // ---------------------------------------------------
      // CLEAR CUSTOMER CART (safe to run on retries too)
      // ---------------------------------------------------

      await Cart.deleteOne({ cartId });

      console.log("Order processed:", orderHistory._id);

      return res.status(200).json({
        received: true,
        orderId: orderHistory._id,
        duplicate: !isNewOrder,
      });
    } catch (error) {
      console.error(
        "Stripe webhook processing error:",
        error
      );

      return res.status(500).json({
        received: false,
        error: "Webhook processing failed",
      });
    }
  }
);

export default router;
