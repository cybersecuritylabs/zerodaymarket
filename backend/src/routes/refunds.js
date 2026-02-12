const express = require('express');
const { auth } = require('../middleware/auth');
const { refundRules } = require('../middleware/validate');
const { financialLimiter } = require('../middleware/rateLimiter');
const refundService = require('../services/refundService');

const router = express.Router();

/**
 * POST /api/refunds/:orderId
 * Request a refund for an eligible order.
 * Only products marked as refundable qualify for returns.
 */
router.post('/:orderId', auth, financialLimiter, refundRules, async (req, res) => {
  try {
    const result = await refundService.processRefund(req.params.orderId, req.user.id);

    res.json({
      message: `Refund of $${result.refundAmount.toFixed(2)} processed successfully`,
      refundAmount: result.refundAmount,
      orderId: result.orderId,
      productName: result.productName
    });
  } catch (err) {
    console.error('[Refunds] Process error:', err.message);

    if (err.message.includes('not found') ||
        err.message.includes('not eligible') ||
        err.message.includes('already been refunded')) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Refund processing failed. Please try again.' });
  }
});

module.exports = router;
