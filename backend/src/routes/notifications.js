const express = require('express');
const { auth } = require('../middleware/auth');
const { Notification } = require('../models');

const router = express.Router();

/**
 * GET /api/notifications
 * Retrieve notifications for the authenticated user.
 */
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['created_at', 'DESC']],
      limit: 50
    });

    res.json({ notifications });
  } catch (err) {
    console.error('[Notifications] List error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
});

/**
 * GET /api/notifications/unread
 * Retrieve unread notifications.
 */
router.get('/unread', auth, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id, isRead: false },
      order: [['created_at', 'DESC']],
      limit: 20
    });

    res.json({ notifications });
  } catch (err) {
    console.error('[Notifications] Unread error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
});

/**
 * PATCH /api/notifications/:id/read
 * Mark a single notification as read.
 */
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true });
  } catch (err) {
    console.error('[Notifications] Read error:', err.message);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read.
 */
router.patch('/read-all', auth, async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('[Notifications] Read all error:', err.message);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

module.exports = router;
