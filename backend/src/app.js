const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

// Import route modules
const adminRoutes = require('./routes/adminRoutes');
const speakerRoutes = require('./routes/speakerRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const videoRoutes = require('./routes/videoRoutes');
const userRoutes = require('./routes/userRoutes');

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://mind-lift-sooty.vercel.app',
        'https://mindlift-frontend.vercel.app',
        'https://minlift.space',
        'https://www.minlift.space'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist (for Railway)
const uploadsPath = path.join(__dirname, '../uploads');
try {
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
  // Serve uploaded files
  app.use('/uploads', express.static(uploadsPath));
} catch (error) {
  console.warn('Could not create uploads directory:', error.message);
}

// Root route - API status
app.get('/', (req, res) => {
    res.json({
        message: 'MindLift API is running successfully! 🚀',
        status: 'healthy',
        version: '1.0.0',
        deployment: 'Railway Production',
        endpoints: {
            auth: '/api/login, /api/signup',
            health: '/health',
            videos: '/api/videos',
            dashboard: '/api/speaker/dashboard, /api/learner/dashboard, /api/admin/dashboard'
        },
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'MindLift API',
        timestamp: new Date().toISOString() 
    });
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-matches-the-one-in-app.js';

// This is a mock user database. In a real application, you would query a database.
const users = [
    { id: 1, email: 'test@example.com', password: 'password123', role: 'user' },
    { id: 2, email: 'admin@example.com', password: 'adminpassword', role: 'admin' },
    { id: 3, email: 'speaker@example.com', password: 'speakerpass', role: 'speaker' }
];

app.use('/api', adminRoutes);
app.use('/api', speakerRoutes);
app.use('/api', bookmarkRoutes);
app.use('/api', videoRoutes);
app.use('/api', userRoutes);

module.exports = app;
