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

// CORS configuration (dynamic for Railway + Vercel)
const defaultAllowedOrigins = [
  'http://localhost:3000',
  'https://mind-lift-sooty.vercel.app',
  'https://mindlift-frontend.vercel.app',
  'https://mindlift.space',
  'https://www.mindlift.space'
];

const envAllowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools
    const isVercelPreview = /https:\/\/.+\.vercel\.app$/.test(origin);
    if (allowedOrigins.includes(origin) || isVercelPreview) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed from origin: ' + origin), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

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
        version: '1.0.1', // Updated version to verify deployment
        deployment: 'Railway Production',
        endpoints: {
            auth: '/api/login, /api/signup',
            health: '/health',
            videos: '/api/videos',
            dashboard: '/api/speaker/dashboard, /api/learner/dashboard, /api/admin/dashboard',
            debug: '/api/debug' // Added debug endpoint
        },
        timestamp: new Date().toISOString(),
        security: 'Enhanced authentication with input validation'
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

// Database health check endpoint
app.get('/health/db', async (req, res) => {
    try {
        const pool = require('./config/db');
        const result = await pool.query('SELECT NOW() as current_time, current_database() as db_name');
        res.json({
            status: 'healthy',
            database: 'connected',
            current_time: result.rows[0].current_time,
            database_name: result.rows[0].db_name,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            database: 'connection_failed',
            error: error.message,
            error_code: error.code,
            error_details: {
                address: error.address,
                port: error.port,
                syscall: error.syscall
            },
            timestamp: new Date().toISOString()
        });
    }
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
// Route fix Mon Aug 11 16:55:37 EDT 2025
