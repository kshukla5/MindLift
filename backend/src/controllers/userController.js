const UserModel = require('../models/userModel');

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
};

module.exports = UserController;
