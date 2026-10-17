import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Normalize a product to the expected schema
const normalizeProducts = (prod) => ({
  name: prod.name,
  description: prod.description,
  price: prod.price,
  category: prod.category,
  imageUrl: prod.imageUrl,
  quantity: prod.quantity,
  rating: prod.rating,
  inStore: prod.inStore,
  inStock: prod.inStock,
  brand: prod.brand
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Sync and update products
router.post('/', async (req, res) => {
  try {
    const newProducts = req.body;
    if (!Array.isArray(newProducts)) {
      return res.status(400).json({ message: 'Expected an array of products' });
    }

    // Clean out broken entries
    await Product.deleteMany({
      $or: [
        { name: '' },
        { name: 'No Name' },
        { imageUrl: '' },
        { imageUrl: '/' },
        { name: { $exists: false } },
        { imageUrl: { $exists: false } }
      ]
    });

    let insertedCount = 0;

    for (const product of newProducts) {
      const normalized = normalizeProducts(product);
      const updated = await Product.findOneAndUpdate(
        {
          name: normalized.name,
          price: normalized.price,
          category: normalized.category,
          description: normalized.description,
          brand: normalized.brand,
          imageUrl: normalized.imageUrl,
          rating: normalized.rating,
          inStore: normalized.inStore,
          inStock: normalized.inStock,
          quantity: normalized.quantity

        },
        normalized,
        { upsert: true, new: true }
      );

      if (updated) insertedCount++;
    }

    return res.status(201).json({
      message: `Sync complete. ${insertedCount} products added/updated.`
    });
  } catch (error) {
    console.error('Issue with receiving products:', error);
    res.status(500).json({ message: 'Unable to receive products' });
  }
});

export default router;
