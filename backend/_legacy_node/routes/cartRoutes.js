// routes/cartRoutes.js
import express from 'express';
import Cart from '../models/Cart.js';
import { ensureCartId } from '../controllers/ensureCartId.js';

const router = express.Router();
router.use(ensureCartId);

router.post('/add', async (req, res) => {
  try {
    const {
      productId, name, price, image, color, quantity, rating, category,
    } = req.body;

    const pid = String(productId || '').trim();
    const pname = String(name || '').trim();
    const pqty = Number(quantity ?? 0);
    const pprice = Number(price ?? 0);
    const pimage = String(image || '');
    const pcolor = String(color || '');
    const prating = Number(rating ?? 0);
    const pcat = String(category || '');

    if (!pid || !pname || !Number.isFinite(pqty) || pqty < 1) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    let cart = await Cart.findOne({ cartId: req.cartId });
    if (!cart) cart = new Cart({ cartId: req.cartId, items: [] });

    const idx = cart.items.findIndex(
      i => String(i.productId) === pid && String(i.color || '') === pcolor
    );

    if (idx >= 0) {
      cart.items[idx].quantity += pqty;
      cart.items[idx].totalPrice = cart.items[idx].price * cart.items[idx].quantity;
    } else {
      cart.items.push({
        productId: pid,
        name: pname,
        price: Number.isFinite(pprice) && pprice >= 0 ? pprice : 0,
        image: pimage,
        color: pcolor,
        quantity: pqty,
        rating: prating,
        category: pcat,
        totalPrice: (Number.isFinite(pprice) ? pprice : 0) * pqty,
      });
    }

    await cart.save();
    return res.status(200).json({ cart: cart.items, message: 'Item added/updated' });
  } catch (err) {
    console.error('Cart add error:', err.name, err.message, err.stack);
    return res.status(500).json({ message: 'Failed to update cart', error: err.message });
  }
});

router.delete('/clear', async (req, res) => {
  try {
    await Cart.deleteOne({ cartId: req.cartId });
    res.status(200).json({ message: 'Cart cleared', cart: [] });
  } catch (err) {
    console.error('Error clearing cart:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/remove/:id', async (req, res) => {
  try {
    const cart = await Cart.findOne({ cartId: req.cartId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.id(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.deleteOne();
    await cart.save();
    res.status(200).json({ cart: cart.items, message: 'Item removed' });
  } catch (err) {
    console.error('Remove failed:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;
