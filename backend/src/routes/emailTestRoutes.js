const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');
const authMiddleware = require('../middleware/authMiddleware');

// Test email endpoint (for development/testing only)
router.post('/test-email', authMiddleware, async (req, res) => {
  try {
    const { type, email, name } = req.body;
    
    let result;
    switch (type) {
      case 'welcome':
        result = await emailService.sendSpeakerWelcomeEmail(email || req.user.email, name || req.user.name);
        break;
      case 'approval':
        result = await emailService.sendSpeakerApprovalEmail(email || req.user.email, name || req.user.name);
        break;
      case 'rejection':
        result = await emailService.sendSpeakerRejectionEmail(email || req.user.email, name || req.user.name, 'Test rejection reason');
        break;
      case 'admin':
        result = await emailService.sendAdminNotificationEmail('admin@mindlift.com', name || req.user.name, email || req.user.email);
        break;
      default:
        return res.status(400).json({ error: 'Invalid email type. Use: welcome, approval, rejection, admin' });
    }
    
    res.json({
      success: true,
      message: `Test ${type} email sent successfully`,
      result
    });
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ error: 'Failed to send test email', details: err.message });
  }
});

module.exports = router;
