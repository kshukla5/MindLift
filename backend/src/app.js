const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

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

    // If credentials are valid, create a JWT containing the user's ID and role
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
});

// Define the /api/signup route
app.post('/api/signup', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Check if a user with this email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    // In a real-world application, you MUST hash the password before saving it.
    // Example: const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: users.length + 1, // Note: This is not a robust way to generate IDs
        email,
        password, // Storing plain text is insecure and for demonstration only.
        role: 'user', // Assign a default role
    };
    users.push(newUser);

    // Create a token to log the user in immediately after signup
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
        expiresIn: '1h',
    });

    res.status(201).json({ token });
});

module.exports = app;