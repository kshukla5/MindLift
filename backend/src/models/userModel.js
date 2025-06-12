const pool = require('../config/db');

const UserModel = {
  async getAllUsers() {
    const result = await pool.query('SELECT id, name, role, status FROM users');
    return result.rows;
  },

  async createUser({ name, email, password, role }) {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, status',
      [name, email, password, role, 'unpaid']
    );
    return result.rows[0];
  },

  async updateStatus(id, status) {
    await pool.query('UPDATE users SET status = $1 WHERE id = $2', [status, id]);
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },
};

module.exports = UserModel;
