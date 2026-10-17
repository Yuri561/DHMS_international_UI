
import { randomBytes } from 'crypto';

export function ensureCartId(req, res, next) {
  let { cartId } = req.cookies || {};
  if (!cartId) {
    cartId = randomBytes(16).toString('hex');
    res.cookie('cartId', cartId, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
  }
  req.cartId = cartId;
  next();
}
