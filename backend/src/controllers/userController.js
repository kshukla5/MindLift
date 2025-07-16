const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const allowedRoles = ['speaker', 'subscriber', 'admin'];

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
