// models/Cart.js
import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },   
  price: { type: Number, default: 0 },
  name: {type: String, required: true},
  image: { type: String, default: '' },
  color: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 1 },
  rating: { type: Number, default: 0 },
  category: { type: String, default: '' },
  totalPrice: { type: Number, default: 0 },
}, { _id: true });

const CartSchema = new mongoose.Schema({
  cartId: { type: String, index: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // future
  items: [ItemSchema],
}, { timestamps: true });

export default mongoose.model('Cart', CartSchema);
