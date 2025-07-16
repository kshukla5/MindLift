const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Import routes
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');
const speakerRoutes = require('./routes/speakerRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Use routes
app.use('/api', userRoutes);
app.use('/api', videoRoutes);
app.use('/api', speakerRoutes);
app.use('/api', bookmarkRoutes);
app.use('/api', adminRoutes);
app.use('/api', paymentRoutes);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'MindLift API is running' });
});

module.exports = app;