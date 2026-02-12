const express = require('express');
const { auth } = require('../middleware/auth');
const walletService = require('../services/walletService');

const router = express.Router();

/**
 * GET /api/wallet/balance
 * Retrieve the current wallet balance.
 */
router.get('/balance', auth, async (req, res) => {
  try {
    const balance = await walletService.getBalance(req.user.id);
    res.json({ balance });
  } catch (err) {
    console.error('[Wallet] Balance error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve balance' });
  }
});

/**
 * GET /api/wallet/transactions
 * Retrieve paginated transaction history.
 */
router.get('/transactions', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));

    const result = await walletService.getTransactions(req.user.id, page, limit);
    res.json(result);
  } catch (err) {
    console.error('[Wallet] Transactions error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
});

module.exports = router;
