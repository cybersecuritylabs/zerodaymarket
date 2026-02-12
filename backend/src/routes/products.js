const express = require('express');
const { Product } = require('../models');
const { sanitizeQuery } = require('../middleware/sanitize');

const router = express.Router();

/**
 * GET /api/products
 * Retrieve all products, optionally filtered by category.
 * Public endpoint — no authentication required.
 */
router.get('/', sanitizeQuery, async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = {};

    if (category) {
      where.category = category;
    }

    const products = await Product.findAll({
      where,
      order: [['price', 'ASC']],
      attributes: ['id', 'name', 'description', 'price', 'imageKey', 'category', 'isRefundable', 'stock']
    });

    // Apply search filter in application layer (safe from injection)
    let results = products;
    if (search) {
      const term = search.toLowerCase();
      results = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }

    res.json({ products: results });
  } catch (err) {
    console.error('[Products] List error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

/**
 * GET /api/products/categories
 * Retrieve distinct product categories.
 */
router.get('/categories', async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['category'],
      group: ['category'],
      order: [['category', 'ASC']]
    });

    const categories = products.map(p => p.category);
    res.json({ categories });
  } catch (err) {
    console.error('[Products] Categories error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

/**
 * GET /api/products/:id
 * Retrieve a single product by ID.
 * Public endpoint — no authentication required.
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      attributes: ['id', 'name', 'description', 'price', 'imageKey', 'category', 'isRefundable', 'stock']
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (err) {
    console.error('[Products] Detail error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

module.exports = router;
