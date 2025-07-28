const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://mind-lift-sooty.vercel.app',
        'https://mindlift-frontend.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());

// Root route - API status
app.get('/', (req, res) => {
    res.json({
        message: 'MindLift API is running successfully! 🚀',
        status: 'healthy',
        version: '1.0.0',
        deployment: 'Railway Production',
        endpoints: {
            auth: '/api/login, /api/signup',
            health: '/health'
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
    { id: 2, email: 'admin@example.com', password: 'adminpassword', role: 'admin' }
];

// Define the /api/login route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find the user in our mock database
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: '1h',
    });

    res.json({ token });
});

// Define the /api/signup route
app.post('/api/signup', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists.' });
    }

    // Create new user
    const newUser = {
        id: users.length + 1,
        email,
        password, // In production, hash this password!
        role: 'user'
    };

    users.push(newUser);

    // Create a token to log the user in immediately after signup
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
        expiresIn: '1h',
    });

    res.status(201).json({ token });
});

module.exports = app;
