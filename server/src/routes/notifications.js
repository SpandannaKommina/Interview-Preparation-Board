const express = require('express');
const router = express.Router();
const { getDB, saveDB } = require('../db/database');
const { authenticateToken } = require('../middleware/auth');

// Get notifications for user
router.get('/', authenticateToken, (req, res) => {
  const db = getDB();
  const notifications = (db.notifications || []).filter(n => n.userId === req.user.id);
  const unreadCount = notifications.filter(n => !n.read).length;

  res.json({
    notifications,
    unreadCount
  });
});

// Mark single notification as read
router.put('/:id/read', authenticateToken, (req, res) => {
  const db = getDB();
  const notif = (db.notifications || []).find(n => n.id === req.params.id && n.userId === req.user.id);

  if (!notif) {
    return res.status(404).json({ message: 'Notification not found.' });
  }

  notif.read = true;
  saveDB();

  res.json({ message: 'Marked as read.', notification: notif });
});

// Mark all as read
router.put('/mark-all-read', authenticateToken, (req, res) => {
  const db = getDB();
  (db.notifications || []).forEach(n => {
    if (n.userId === req.user.id) {
      n.read = true;
    }
  });

  saveDB();

  res.json({ message: 'All notifications marked as read.' });
});

module.exports = router;
