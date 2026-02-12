const express = require('express');
const { auth } = require('../middleware/auth');
const { checkoutRules } = require('../middleware/validate');
const { sanitizeBody } = require('../middleware/sanitize');
const { financialLimiter } = require('../middleware/rateLimiter');
const orderService = require('../services/orderService');

const router = express.Router();

/**
 * POST /api/orders/checkout
 * Process a checkout with cart items and optional coupon.
 */
router.post('/checkout', auth, financialLimiter, sanitizeBody, checkoutRules, async (req, res) => {
  try {
    const { items, couponCode } = req.body;
    const result = await orderService.checkout(req.user.id, items, couponCode || null);

    res.status(201).json({
      message: 'Order placed successfully',
      orders: result.orders,
      totalPaid: result.totalPaid
    });
  } catch (err) {
    console.error('[Orders] Checkout error:', err.message);

    if (err.message.includes('Insufficient') ||
        err.message.includes('not found') ||
        err.message.includes('coupon') ||
        err.message.includes('stock')) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Checkout failed. Please try again.' });
  }
});

/**
 * GET /api/orders
 * Retrieve all orders for the authenticated user.
 */
router.get('/', auth, async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);
    res.json({ orders });
  } catch (err) {
    console.error('[Orders] List error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

/**
 * GET /api/orders/:id
 * Retrieve a specific order by ID.
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.id);
    res.json({ order });
  } catch (err) {
    console.error('[Orders] Detail error:', err.message);
    if (err.message === 'Order not found') {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

module.exports = router;
