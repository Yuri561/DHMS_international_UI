// Load environment variables BEFORE any other import so route modules
// that read process.env at module scope (stripe.js, stripeWebhook.js, etc.)
// see populated values. ESM evaluates imports before top-level statements,
// so a plain `config()` call below the imports is too late.
import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import User from './models/User.js';
import cartRoutes from './routes/cartRoutes.js';
import ProductRoutes from './routes/products.js';
// import AuthRoutes from './routes/auth.js';
import CheckoutRoutes from './routes/stripe.js';
import webHookRoutes from './routes/stripeWebhook.js';

const app = express();
const port = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

const corsOrigins = [
  'https://www.dhmsint.com',
  'https://dhmsint.com',
  'https://dhms-client.vercel.app',
  'http://localhost:5173',
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin || corsOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
  },
}));

// Routes
app.get('/', (_req, res) => res.send('We are live'));


//   try {
//     const { username, email, password, shippingAddress } = req.body;
//     const existingUser = await User.findOne({ username });
//     if (existingUser) return res.status(400).json({ message: 'username is already taken' });
//     const newUser = new User({ email, password, username, shippingAddress });
//     await newUser.save();
//     res.status(201).json({ message: 'User created successfully' });
//     console.log('User created successfully');
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/login', loginUser);



app.use('/products', ProductRoutes);
app.use('/cart', cartRoutes);        
app.use('/checkout', CheckoutRoutes);
app.use('/checkout', webHookRoutes);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
})();
