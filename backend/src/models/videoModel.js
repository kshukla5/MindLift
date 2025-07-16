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

  async createVideo({ title, description, category, videoUrl, userId }) {
    const result = await pool.query(
      'INSERT INTO videos (title, description, category, video_url, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, category, video_url, user_id, approved, created_at',
      [title, description, category, videoUrl, userId]
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

  async deleteVideo(id) {
    await pool.query('DELETE FROM videos WHERE id = $1', [id]);
  },

  async updateVideo(id, { title, description, category }) {
    const result = await pool.query(
      'UPDATE videos SET title = $1, description = $2, category = $3 WHERE id = $4 RETURNING id, title, description, category, video_url, approved, created_at',
      [title, description, category, id]
    );
    return result.rows[0];
  },

  async getVideosByUserId(userId) {
    const result = await pool.query('SELECT id, title, description, category, video_url, approved, created_at FROM videos WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  },

  async getSpeakerStats(userId) {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_videos,
        COUNT(CASE WHEN approved = true THEN 1 END) as approved_videos,
        COUNT(CASE WHEN approved = false THEN 1 END) as pending_videos,
        AVG(CASE WHEN approved = true THEN 1 ELSE 0 END) as approval_rate,
        MAX(created_at) as latest_upload,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as videos_this_week,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as videos_this_month
      FROM videos 
      WHERE user_id = $1
    `, [userId]);
    return result.rows[0];
  },

  async getRecentActivity(userId, limit = 5) {
    const result = await pool.query(`
      SELECT id, title, approved, created_at, 
             CASE 
               WHEN approved = true THEN 'published'
               WHEN approved = false THEN 'pending'
             END as status
      FROM videos 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `, [userId, limit]);
    return result.rows;
  },

  async getLearnerStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_videos,
        COUNT(CASE WHEN approved = true THEN 1 END) as published_videos,
        COUNT(DISTINCT user_id) as active_speakers,
        COUNT(DISTINCT category) as total_categories,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_this_week,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_this_month
      FROM videos
      WHERE approved = true
    `);
    return result.rows[0];
  },

  async getPopularCategories(limit = 5) {
    const result = await pool.query(`
      SELECT 
        category,
        COUNT(*) as video_count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM videos WHERE approved = true), 2) as percentage
      FROM videos 
      WHERE approved = true
      GROUP BY category
      ORDER BY video_count DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  },

  async getRecentVideos(limit = 10) {
    const result = await pool.query(`
      SELECT id, title, description, category, video_url, created_at
      FROM videos
      WHERE approved = true
      ORDER BY created_at DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  },
};

module.exports = VideoModel;
