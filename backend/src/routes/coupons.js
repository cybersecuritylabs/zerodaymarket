const express = require('express');
const { auth } = require('../middleware/auth');
const couponService = require('../services/couponService');

const router = express.Router();

/**
 * GET /api/coupons
 * Retrieve all coupons belonging to the authenticated user.
 */
router.get('/', auth, async (req, res) => {
  try {
    const coupons = await couponService.getUserCoupons(req.user.id);
    res.json({ coupons });
  } catch (err) {
    console.error('[Coupons] List error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve coupons' });
  }
});

/**
 * POST /api/coupons/validate
 * Validate a coupon code without using it.
 */
router.post('/validate', auth, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({ error: 'Coupon code is required' });
    }

    const coupon = await couponService.validate(code.trim(), req.user.id);

    res.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountAmount: parseFloat(coupon.discountAmount),
        expiresAt: coupon.expiresAt
      }
    });
  } catch (err) {
    res.status(400).json({ valid: false, error: err.message });
  }
});

module.exports = router;
