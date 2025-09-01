const pool = require('../config/db');
const crypto = require('crypto');

const UserModel = {
  async getAllUsers() {
    const result = await pool.query(`
      SELECT id, name, email, role, is_paid, created_at, email_verified, 
             country, profile_completed, last_login 
      FROM users ORDER BY created_at DESC
    `);
    return result.rows;
  },

  async createUser({ name, email, password, role, country = null }) {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, is_paid, country, verification_token) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, name, email, role, is_paid, created_at, email_verified, country, verification_token`,
      [name, email, password, role, true, country, verificationToken]
    );
    return result.rows[0];
  },

  async updatePaidStatus(id, isPaid) {
    await pool.query('UPDATE users SET is_paid = $1 WHERE id = $2', [isPaid, id]);
  },

  async findById(id) {
    const result = await pool.query(`
      SELECT id, name, email, role, is_paid, created_at, email_verified, 
             country, profile_completed, last_login 
      FROM users WHERE id = $1
    `, [id]);
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query(`
      SELECT id, name, email, password, role, is_paid, created_at, email_verified, 
             country, profile_completed, verification_token 
      FROM users WHERE email = $1
    `, [email]);
    return result.rows[0];
  },

  async updateUser(id, { name, email, country }) {
    const result = await pool.query(
      `UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), country = COALESCE($3, country)
       WHERE id = $4 
       RETURNING id, name, email, role, is_paid, country, email_verified, profile_completed`,
      [name, email, country, id]
    );
    return result.rows[0];
  },

  async verifyEmail(verificationToken) {
    const result = await pool.query(
      `UPDATE users SET email_verified = true, verification_token = null 
       WHERE verification_token = $1 
       RETURNING id, name, email, role`,
      [verificationToken]
    );
    return result.rows[0];
  },

  async updateProfileCompleted(id, completed = true) {
    const result = await pool.query(
      `UPDATE users SET profile_completed = $1 WHERE id = $2 
       RETURNING id, profile_completed`,
      [completed, id]
    );
    return result.rows[0];
  },

  async updateLastLogin(id) {
    const result = await pool.query(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1 
       RETURNING last_login`,
      [id]
    );
    return result.rows[0];
  },

  async generatePasswordResetToken(email) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const result = await pool.query(
      `UPDATE users SET verification_token = $1 WHERE email = $2 
       RETURNING id, name, email`,
      [resetToken, email]
    );
    return { user: result.rows[0], resetToken };
  },

  async deleteUser(id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  },
};

module.exports = UserModel;
