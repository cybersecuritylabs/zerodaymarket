const express = require('express');
const { auth, requireAdmin } = require('../middleware/auth');
const { sanitizeBody } = require('../middleware/sanitize');
const { User, Order, Product, Wallet, Transaction, Coupon } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(auth);
router.use(requireAdmin);

/**
 * GET /api/internal-admin-dashboard/stats
 * Revenue and platform analytics.
 */
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalOrders = await Order.count();
    const completedOrders = await Order.count({ where: { status: 'completed' } });
    const refundedOrders = await Order.count({ where: { status: 'refunded' } });

    const revenueResult = await Order.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('amount_paid')), 'totalRevenue']],
      where: { status: 'completed' }
    });

    const refundResult = await Transaction.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'totalRefunds']],
      where: { referenceType: 'refund', type: 'credit' }
    });

    const activeCoupons = await Coupon.count({ where: { isUsed: false } });

    res.json({
      stats: {
        totalUsers,
        totalOrders,
        completedOrders,
        refundedOrders,
        revenue: parseFloat(revenueResult?.dataValues.totalRevenue || 0),
        totalRefunds: parseFloat(refundResult?.dataValues.totalRefunds || 0),
        activeCoupons
      }
    });
  } catch (err) {
    console.error('[Admin] Stats error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});

/**
 * GET /api/internal-admin-dashboard/users
 * List all registered users (passwords excluded).
 */
router.get('/users', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 25));
    const offset = (page - 1) * limit;

    const { count, rows } = await User.findAndCountAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      include: [{ model: Wallet, as: 'wallet', attributes: ['balance'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      users: rows,
      pagination: { page, limit, total: count, pages: Math.ceil(count / limit) }
    });
  } catch (err) {
    console.error('[Admin] Users error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

/**
 * GET /api/internal-admin-dashboard/orders
 * List all orders across the platform.
 */
router.get('/orders', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 25));
    const offset = (page - 1) * limit;

    const statusFilter = req.query.status;
    const where = {};
    if (statusFilter && ['completed', 'refunded'].includes(statusFilter)) {
      where.status = statusFilter;
    }

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: Product, as: 'product', attributes: ['name', 'price', 'category'] }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    res.json({
      orders: rows,
      pagination: { page, limit, total: count, pages: Math.ceil(count / limit) }
    });
  } catch (err) {
    console.error('[Admin] Orders error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

/**
 * GET /api/internal-admin-dashboard/refunds
 * List all refunded orders.
 */
router.get('/refunds', async (req, res) => {
  try {
    const refunds = await Order.findAll({
      where: { status: 'refunded' },
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: Product, as: 'product', attributes: ['name', 'price'] }
      ],
      order: [['updated_at', 'DESC']],
      limit: 100
    });

    res.json({ refunds });
  } catch (err) {
    console.error('[Admin] Refunds error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve refunds' });
  }
});

/**
 * GET /api/internal-admin-dashboard/promotions
 * List active promotions and coupon usage.
 */
router.get('/promotions', async (req, res) => {
  try {
    const totalCoupons = await Coupon.count();
    const usedCoupons = await Coupon.count({ where: { isUsed: true } });
    const activeCoupons = await Coupon.count({
      where: { isUsed: false, expiresAt: { [Op.gt]: new Date() } }
    });

    const cashbackTotal = await Transaction.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      where: { referenceType: 'cashback', type: 'credit' }
    });

    res.json({
      promotions: {
        activeOffer: 'Limited Time Offer — Buy any $30 product and get full cashback + exclusive $10 coupon!',
        totalCouponsIssued: totalCoupons,
        couponsUsed: usedCoupons,
        couponsActive: activeCoupons,
        totalCashbackIssued: parseFloat(cashbackTotal?.dataValues.total || 0)
      }
    });
  } catch (err) {
    console.error('[Admin] Promotions error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve promotions' });
  }
});

/**
 * PUT /api/internal-admin-dashboard/settings
 * Update site settings (demonstration endpoint — fully secured).
 */
router.put('/settings', sanitizeBody, async (req, res) => {
  try {
    const allowedFields = ['siteName', 'themeColor', 'maintenanceMode', 'logoUrl'];
    const settings = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] === 'string' && req.body[field].length > 500) {
          return res.status(400).json({ error: `${field} exceeds maximum length` });
        }
        settings[field] = req.body[field];
      }
    }

    // In a production system, these would persist to database.
    // For this application, settings are acknowledged but not stored.
    res.json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (err) {
    console.error('[Admin] Settings error:', err.message);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
