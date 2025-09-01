const pool = require('../config/db');

const NotificationModel = {
  async createNotification({ userId, type, title, message, data = null }) {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, data) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, user_id, type, title, message, data, read, email_sent, created_at`,
      [userId, type, title, message, data ? JSON.stringify(data) : null]
    );
    return result.rows[0];
  },

  async getUserNotifications(userId, limit = 20) {
    const result = await pool.query(
      `SELECT id, type, title, message, data, read, created_at 
       FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  },

  async markAsRead(notificationId, userId) {
    const result = await pool.query(
      `UPDATE notifications SET read = true 
       WHERE id = $1 AND user_id = $2 
       RETURNING id`,
      [notificationId, userId]
    );
    return result.rows[0];
  },

  async markAllAsRead(userId) {
    const result = await pool.query(
      `UPDATE notifications SET read = true 
       WHERE user_id = $1 AND read = false 
       RETURNING count(*) as updated_count`,
      [userId]
    );
    return result.rows[0];
  },

  async getUnreadCount(userId) {
    const result = await pool.query(
      `SELECT COUNT(*) as unread_count 
       FROM notifications 
       WHERE user_id = $1 AND read = false`,
      [userId]
    );
    return parseInt(result.rows[0].unread_count);
  },

  // Email notification helpers
  async getPendingEmailNotifications() {
    const result = await pool.query(
      `SELECT n.id, n.user_id, n.type, n.title, n.message, n.data, n.created_at,
              u.email, u.name
       FROM notifications n
       JOIN users u ON n.user_id = u.id
       WHERE n.email_sent = false AND u.email_verified = true
       ORDER BY n.created_at ASC`
    );
    return result.rows;
  },

  async markEmailAsSent(notificationId) {
    const result = await pool.query(
      `UPDATE notifications SET email_sent = true 
       WHERE id = $1 
       RETURNING id`,
      [notificationId]
    );
    return result.rows[0];
  },

  // Specific notification creators
  async notifyEmailVerification(userId, verificationToken) {
    return this.createNotification({
      userId,
      type: 'email_verification',
      title: 'Verify Your Email',
      message: 'Please verify your email address to complete your registration.',
      data: { verification_token: verificationToken }
    });
  },

  async notifySpeakerApproved(userId, speakerId) {
    return this.createNotification({
      userId,
      type: 'speaker_approved',
      title: 'Speaker Profile Approved! 🎉',
      message: 'Congratulations! Your speaker profile has been approved. You can now upload videos.',
      data: { speaker_id: speakerId }
    });
  },

  async notifySpeakerRejected(userId, reason) {
    return this.createNotification({
      userId,
      type: 'speaker_rejected',
      title: 'Speaker Profile Needs Updates',
      message: `Your speaker profile requires some updates: ${reason}`,
      data: { rejection_reason: reason }
    });
  },

  async notifyVideoApproved(userId, videoId, videoTitle) {
    return this.createNotification({
      userId,
      type: 'video_approved',
      title: 'Video Approved! 🎬',
      message: `Your video "${videoTitle}" has been approved and is now live!`,
      data: { video_id: videoId, video_title: videoTitle }
    });
  },

  async notifyVideoRejected(userId, videoId, videoTitle, reason) {
    return this.createNotification({
      userId,
      type: 'video_rejected',
      title: 'Video Needs Updates',
      message: `Your video "${videoTitle}" requires updates: ${reason}`,
      data: { video_id: videoId, video_title: videoTitle, rejection_reason: reason }
    });
  },

  async notifyMilestone(userId, milestone, data) {
    const messages = {
      'first_video': 'You uploaded your first video! 🎬',
      'views_1000': 'Your videos have reached 1,000 views! 🎉',
      'views_10000': 'Amazing! 10,000+ people have watched your content! 🚀',
      'videos_10': 'You\'ve uploaded 10 videos! Keep creating! 📹',
      'videos_50': 'Incredible! 50 videos uploaded! You\'re a content machine! 🎯'
    };

    return this.createNotification({
      userId,
      type: 'milestone',
      title: 'Milestone Achieved! 🏆',
      message: messages[milestone] || 'You\'ve achieved a new milestone!',
      data: { milestone, ...data }
    });
  }
};

module.exports = NotificationModel;
