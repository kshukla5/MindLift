const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
const UserModel = require('../models/userModel');
const mailer = require('../config/mailer');

const PaymentController = {
  async subscribe(req, res) {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const intent = await stripe.paymentIntents.create({
        amount: 1000,
        currency: 'usd',
        description: 'Monthly subscription',
        automatic_payment_methods: { enabled: true },
        metadata: { userId },
      });

      res.json({ clientSecret: intent.client_secret });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to initiate payment' });
    }
  },

  async webhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const intent = event.data.object;
    const userId = intent.metadata && intent.metadata.userId;

    try {
      if (event.type === 'payment_intent.succeeded') {
        if (userId) {
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
        }
      } else if (event.type === 'payment_intent.payment_failed') {
        if (userId) {
          await UserModel.updateStatus(userId, 'unpaid');
        }
      }
    } catch (err) {
      console.error('Failed to update user status:', err);
      return res.status(500).end();
    }

    res.json({ received: true });
  },
};

module.exports = PaymentController;
