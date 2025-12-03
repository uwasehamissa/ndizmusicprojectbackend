const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const validation = require('./validation');

// GET /api/notifications - Get notifications
router.get('/',
  validation.getNotifications,
  bookingController.getNotifications
);

// GET /api/notifications/unread - Get unread notifications count
router.get('/unread', bookingController.getUnreadCount);

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/:id/read',
  bookingController.markNotificationAsRead
);

// PATCH /api/notifications/mark-all-read - Mark all notifications as read
router.patch('/mark-all-read',
  validation.markAllRead,
  bookingController.markAllNotificationsAsRead
);

// POST /api/notifications/test - Send test notification
router.post('/test',
  validation.sendTestNotification,
  bookingController.sendTestNotification
);

// POST /api/notifications/reminder - Send custom reminder
router.post('/reminder',
  bookingController.sendCustomReminder
);

module.exports = router;