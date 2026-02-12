const express = require('express');
const bcrypt = require('bcryptjs');
const { User, Wallet } = require('../models');
const { generateToken, auth } = require('../middleware/auth');
const { loginRules, registerRules } = require('../middleware/validate');
const { sanitizeBody } = require('../middleware/sanitize');
const { authLimiter } = require('../middleware/rateLimiter');
const walletService = require('../services/walletService');
const labService = require('../services/labService');

const router = express.Router();

const SALT_ROUNDS = 12;

/**
 * POST /api/auth/register
 * Create a new user account with a wallet.
 */
router.post('/register', authLimiter, sanitizeBody, registerRules, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email is already taken
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'user'
    });

    // Create wallet with initial balance
    await walletService.createWallet(user.id);

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[Auth] Register error:', err.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

/**
 * POST /api/auth/login
 * Authenticate a user and return a JWT.
 */
router.post('/login', authLimiter, sanitizeBody, loginRules, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[Auth] Login error:', err.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

/**
 * GET /api/auth/me
 * Retrieve current user profile data.
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Include achievement status
    const labStatus = await labService.isCompleted(req.user.id);

    const wallet = await Wallet.findOne({ where: { userId: req.user.id } });

    res.json({
      user: {
        ...user.toJSON(),
        walletBalance: wallet ? parseFloat(wallet.balance) : 0,
        achievements: labStatus.completed
          ? [{ type: 'lab_completion', completedAt: labStatus.completedAt }]
          : []
      }
    });
  } catch (err) {
    console.error('[Auth] Profile error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

module.exports = router;
