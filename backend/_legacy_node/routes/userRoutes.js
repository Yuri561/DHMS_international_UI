import express from 'express';
import User from '../models/User.js';
import { isAuthenticated } from '../controllers/authController.js';

const router = express.Router();

router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId)
      .select('_id username email role'); // no password

    if (!user) {
      return res.status(404).json({ message: 'unable to retrieve session' });
    }

    return res.status(200).json({
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role ?? 'user',
      },
    });
  } catch (error) {
    console.error('error fetching user', error);
    return res.status(500).json({ message: 'error' });
  }
});

export default router;
