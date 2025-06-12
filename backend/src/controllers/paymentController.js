const UserModel = require('../models/userModel');
const mailer = require('../config/mailer');

const PaymentController = {
  async subscribe(req, res) {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      // Immediately mark the user as paid since subscriptions are free
      await UserModel.updateStatus(userId, 'paid');
      const user = await UserModel.findById(userId);
      if (user && user.email) {
        try {
          await mailer.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: user.email,
            subject: 'Subscription Confirmed',
            text: 'Your subscription is active. Thank you for choosing MindLift!',
          });
        } catch (emailErr) {
          console.error('Failed to send confirmation email:', emailErr);
        }
      }

      res.json({ message: 'Subscription activated without payment.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to activate subscription' });
    }
  },

  async webhook(req, res) {
    // Stripe is disabled, but keep the endpoint for compatibility
    res.json({ received: true });
  },
};

module.exports = PaymentController;
