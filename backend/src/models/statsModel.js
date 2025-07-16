const pool = require('../config/db');

const StatsModel = {
  async getUserCountByRole() {
    const result = await pool.query('SELECT role, COUNT(*) AS count FROM users GROUP BY role');
    return result.rows;
  },

  async getSubscriptionStats() {
    const result = await pool.query(
      'SELECT CASE WHEN is_paid = true THEN \'paid\' ELSE \'free\' END as status, COUNT(*) AS count FROM users GROUP BY is_paid'
    );
    return result.rows;
  },

  async getPendingVideos() {
    const result = await pool.query(
      'SELECT id, title, description, category, video_url, created_at FROM videos WHERE approved = false ORDER BY created_at DESC'
    );
    return result.rows;
  },
};

module.exports = StatsModel;
