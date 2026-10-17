import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google login route
router.post('/google', async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    const name = payload?.name || email?.split('@')[0];

    if (!email) {
      return res.status(400).json({ message: 'Email not found in Google response' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const baseUsername = name.toLowerCase().replace(/\s+/g, '');
      const username = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
      
      user = await User.create({
        email,
        username,
      });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    return res.status(200).json({ message: 'Google login successful', user });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({ message: 'Google login failed' });
  }
});

router.get('/', (req, res) => {
  if (req.session.user) {
    return res.status(200).json({ user: req.session.user });
    console.log(`session user: ${req.session.user}`)
  } else {
    return res.status(401).json({ message: 'Not authenticated' });
  }
});

export default router;
