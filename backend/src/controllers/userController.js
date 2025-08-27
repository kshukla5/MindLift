const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const allowedRoles = ['speaker', 'subscriber', 'admin'];
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-matches-the-one-in-app.js';

const UserController = {
  async list(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },

  async signup(req, res) {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
      }

      const userRole = allowedRoles.includes(role) ? role : 'subscriber';
      
      try {
        const existing = await UserModel.findByEmail(email);
        if (existing) {
          return res.status(409).json({ error: 'User with this email already exists.' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await UserModel.createUser({ name, email, password: hashed, role: userRole });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
      } catch (dbError) {
        console.error('Database error during signup:', dbError);
        return res.status(503).json({ 
          error: 'Database temporarily unavailable. Please try again later.',
          code: 'DATABASE_UNAVAILABLE'
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Signup failed' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      try {
        const user = await UserModel.findByEmail(email);
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } catch (dbError) {
        console.error('Database error during login:', dbError);
        return res.status(503).json({ 
          error: 'Database temporarily unavailable. Please try again later.',
          code: 'DATABASE_UNAVAILABLE'
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Login failed' });
    }
  },

  async update(req, res) {
    try {
      const { name, email } = req.body;
      const user = await UserModel.updateUser(req.params.id, { name, email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update user' });
    }
  },

  async remove(req, res) {
    try {
      await UserModel.deleteUser(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  },

  async getLearnerDashboard(req, res) {
    try {
      // Mock data for learner dashboard
      const dashboardData = {
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role
        },
        stats: {
          videosWatched: 12,
          bookmarks: 5,
          completedCourses: 3
        },
        recentVideos: [
          {
            id: 1,
            title: "Introduction to React Hooks",
            category: "Technology",
            watchedAt: new Date().toISOString()
          }
        ]
      };
      
      res.json(dashboardData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch learner dashboard' });
    }
  },

  // Debug endpoint for troubleshooting
  async debugEnv(req, res) {
    try {
      const envInfo = {
        node_env: process.env.NODE_ENV,
        has_database_url: !!process.env.DATABASE_URL,
        database_url_length: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
        has_pg_vars: !!(process.env.PGHOST || process.env.DB_HOST),
        pghost: process.env.PGHOST ? '[SET]' : '[NOT SET]',
        pguser: process.env.PGUSER ? '[SET]' : '[NOT SET]',
        pgdatabase: process.env.PGDATABASE ? '[SET]' : '[NOT SET]',
        jwt_secret_set: !!process.env.JWT_SECRET,
        timestamp: new Date().toISOString()
      };

      // Test database connection
      try {
        const pool = require('../config/db');
        const result = await pool.query('SELECT NOW() as current_time');
        envInfo.db_connection = 'SUCCESS';
        envInfo.db_time = result.rows[0].current_time;
      } catch (dbErr) {
        envInfo.db_connection = 'FAILED';
        envInfo.db_error = dbErr.message;
        envInfo.db_code = dbErr.code;
      }

      res.json(envInfo);
    } catch (err) {
      console.error('Debug endpoint error:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = UserController;
