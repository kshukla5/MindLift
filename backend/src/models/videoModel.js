const pool = require('../config/db');

const VideoModel = {
  async getAllVideos() {
    const result = await pool.query('SELECT id, title, description, category, video_url, approved, created_at FROM videos ORDER BY created_at DESC');
    return result.rows;
  },

  async getVideoById(id) {
    const result = await pool.query('SELECT id, title, description, category, video_url, approved, created_at FROM videos WHERE id = $1', [id]);
    return result.rows[0];
  },

  async createVideo({ title, description, category, videoUrl }) {
    const result = await pool.query(
      'INSERT INTO videos (title, description, category, video_url) VALUES ($1, $2, $3, $4) RETURNING id, title, description, category, video_url, approved, created_at',
      [title, description, category, videoUrl]
    );
    return result.rows[0];
  },

  async getUnapprovedVideos() {
    const result = await pool.query('SELECT id, title, description, category, video_url, approved, created_at FROM videos WHERE approved = false ORDER BY created_at DESC');
    return result.rows;
  },

  async updateApproval(id, approved) {
    const result = await pool.query('UPDATE videos SET approved = $1 WHERE id = $2 RETURNING id, approved', [approved, id]);
    return result.rows[0];
  },
};

module.exports = VideoModel;
