const express = require('express');
const router = express.Router();
const NotificationModel = require('../models/notificationModel');
const authMiddleware = require('../middleware/authMiddleware');

const NotificationController = {
  // Get user notifications
  async getUserNotifications(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 20;
      
      const notifications = await NotificationModel.getUserNotifications(userId, limit);
      const unreadCount = await NotificationModel.getUnreadCount(userId);
      
      res.json({
        success: true,
        notifications,
        unreadCount
      });
    } catch (err) {
      console.error('getUserNotifications error:', err);
      res.status(500).json({ error: 'Failed to fetch notifications', details: err.message });
    }
  },

  // Mark notification as read
  async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;
      
      const notification = await NotificationModel.markAsRead(notificationId, userId);
      
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      
      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (err) {
      console.error('markAsRead error:', err);
      res.status(500).json({ error: 'Failed to mark notification as read', details: err.message });
    }
  },

  // Mark all notifications as read
  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      
      await NotificationModel.markAllAsRead(userId);
      
      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (err) {
      console.error('markAllAsRead error:', err);
      res.status(500).json({ error: 'Failed to mark all notifications as read', details: err.message });
    }
  },

  // Get unread count only
  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const unreadCount = await NotificationModel.getUnreadCount(userId);
      
      res.json({
        success: true,
        unreadCount
      });
    } catch (err) {
      console.error('getUnreadCount error:', err);
      res.status(500).json({ error: 'Failed to get unread count', details: err.message });
    }
  }
};

// Routes
router.get('/', authMiddleware, NotificationController.getUserNotifications);
router.put('/:notificationId/read', authMiddleware, NotificationController.markAsRead);
router.put('/read-all', authMiddleware, NotificationController.markAllAsRead);
router.get('/unread-count', authMiddleware, NotificationController.getUnreadCount);

module.exports = router;
