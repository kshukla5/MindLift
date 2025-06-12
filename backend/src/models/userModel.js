const pool = require('../config/db');

const UserModel = {
  async getAllUsers() {
    const result = await pool.query('SELECT id, name FROM users');
    return result.rows;
  },
};

module.exports = UserModel;
