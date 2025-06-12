const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
const UserModel = require('../models/userModel');

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
      });

      await UserModel.updateStatus(userId, 'paid');

      res.json({ clientSecret: intent.client_secret });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to initiate payment' });
    }
  },
};

module.exports = PaymentController;
