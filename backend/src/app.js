const express = require('express');
const userRoutes = require('./routes/userRoutes');
const speakerRoutes = require('./routes/speakerRoutes');
const videoRoutes = require('./routes/videoRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const PaymentController = require('./controllers/paymentController');

const app = express();

// Stripe webhook needs the raw body
app.post('/api/webhook', express.raw({ type: 'application/json' }), PaymentController.webhook);

app.use(express.json());

// Optional: Add a handler for the root path
app.get('/', (req, res) => {
  res.send('MindLift API is running!');
});

app.use('/api', userRoutes);
app.use('/api', speakerRoutes);
app.use('/api', videoRoutes);
app.use('/api', bookmarkRoutes);
app.use('/api', paymentRoutes);
app.use('/api', adminRoutes);

module.exports = app;
