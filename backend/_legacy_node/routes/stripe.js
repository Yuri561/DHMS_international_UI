// routes/stripe.js

// Belt-and-suspenders: ensure .env is loaded even if this module is ever
// imported before server.js has initialised dotenv. Without this, Stripe
// would be instantiated with an undefined key and later throw a cryptic
// "authenticator is not a function" error on the first request.
import 'dotenv/config';

import express from 'express';
import Stripe from 'stripe';

if (!process.env.STRIPE_KEY) {
  throw new Error(
    'STRIPE_KEY is not set. Add it to your .env before starting the server.'
  );
}

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_KEY, { apiVersion: '2024-06-20' });

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { email, name, homeAddress, city, state, zipCode, line_items = [] } = req.body;

    if (!Array.isArray(line_items) || line_items.length === 0) {
      return res.status(400).json({ message: 'No items to checkout' });
    }

    const items = line_items
      .map(li => {
        const unit_amount = Math.round(Number(li?.price_data?.unit_amount ?? 0));
        const quantity = Number(li?.quantity ?? 0);
        const pname = String(li?.price_data?.product_data?.name ?? 'Item');

        return {
          price_data: {
            currency: 'usd',
            product_data: { name: pname },
            unit_amount,
          },
          quantity,
        };
      })
      .filter(li => Number.isInteger(li.price_data.unit_amount) && li.price_data.unit_amount >= 1 && li.quantity >= 1);

    if (items.length === 0) {
      return res.status(400).json({ message: 'All line items were invalid' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items,
      success_url: `https://dhmsint.com/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://dhmsint.com/cart?canceled=1`,
      customer_email: email,
      customer_creation: "always",
      billing_address_collection: 'required',
      shipping_address_collection: { allowed_countries: ['US', 'CA'] },
      automatic_tax: {
        enabled: false
      },
      allow_promotion_codes: true,
      metadata: {
        name: name ?? '',
        address: [homeAddress, city, state, zipCode].filter(Boolean).join(', '),
        cartId: req.cookies?.cartId || '',
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('create-checkout-session error:', error);
    return res.status(500).json({ message: error?.raw?.message || error.message || 'Stripe error' });
  }
});

export default router;
