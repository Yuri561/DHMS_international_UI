import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    color: String,
    rating: Number,
    category: String,
    totalPrice: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    cartId: { type: String, required: true, index: true },
    userId: { type: String }, // optional if user was logged in
    customerEmail: { type: String },
    customerName: { type: String },
    products: [OrderItemSchema],
    totalAmount: { type: Number, required: true, default: 0 },
    shipping: {
      name: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
    },
    status: { type: String, enum: ['paid', 'pending', 'canceled', 'refunded'], default: 'paid' },
    stripeSessionId: { type: String, index: true },
    stripePaymentIntentId: { type: String, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
