const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const allowedRoles = ['speaker', 'subscriber', 'admin'];

const UserController = {
  async getLearnerDashboard(req, res) {
    try {
      // Mock learner dashboard data
      const dashboard = {
        platformStats: {
          totalVideos: 150,
          totalSpeakers: 25,
          totalHours: 320,
          activeUsers: 1200
        },
        popularCategories: [
          { name: "JavaScript", count: 45, color: "#F7DF1E" },
          { name: "React", count: 32, color: "#61DAFB" },
          { name: "Python", count: 28, color: "#3776AB" },
          { name: "Node.js", count: 24, color: "#339933" }
        ],
        recentVideos: [
          {
            id: 1,
            title: "Advanced React Patterns",
            speaker: "John Doe",
            duration: "45 min",
            category: "React",
            thumbnail: "/api/placeholder/300/200"
          },
          {
            id: 2,
            title: "Python Data Science",
            speaker: "Jane Smith",
            duration: "60 min", 
            category: "Python",
            thumbnail: "/api/placeholder/300/200"
          }
        ]
      };
      
      res.json(dashboard);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch learner dashboard' });
    }
  },

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

      const existing = await UserModel.findByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'User already exists' });
      }

      const userRole = allowedRoles.includes(role) ? role : 'subscriber';
      const hashed = await bcrypt.hash(password, 10);
      const user = await UserModel.createUser({ name, email, password: hashed, role: userRole });

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
      res.status(201).json({ token });
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

      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
      res.json({ token });
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
};

module.exports = UserController;
