const express = require('express');
const userRoutes = require('./routes/userRoutes');
const speakerRoutes = require('./routes/speakerRoutes');
const videoRoutes = require('./routes/videoRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', speakerRoutes);
app.use('/api', videoRoutes);
app.use('/api', paymentRoutes);

module.exports = app;
