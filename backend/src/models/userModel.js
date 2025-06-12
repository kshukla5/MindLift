const pool = require('../config/db');

const UserModel = {
  async getAllUsers() {
    const result = await pool.query('SELECT id, name, role FROM users');
    return result.rows;
  },

  async createUser({ name, email, password, role }) {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, password, role]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },
};

module.exports = UserModel;
