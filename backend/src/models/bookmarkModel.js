const pool = require('../config/db');

const BookmarkModel = {
  async addBookmark(userId, videoId) {
    const result = await pool.query(
      'INSERT INTO bookmarks (user_id, video_id) VALUES ($1, $2) ON CONFLICT (user_id, video_id) DO NOTHING RETURNING id',
      [userId, videoId]
    );
    return result.rows[0];
  },

  async removeBookmark(userId, videoId) {
    await pool.query('DELETE FROM bookmarks WHERE user_id = $1 AND video_id = $2', [userId, videoId]);
  },

  async getBookmarksByUser(userId) {
    const result = await pool.query(
      `SELECT v.id, v.title, v.description, v.category, v.video_url, v.approved, v.created_at
       FROM bookmarks b
       JOIN videos v ON b.video_id = v.id
       WHERE b.user_id = $1 AND v.approved = true
       ORDER BY b.created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  async getUserBookmarkStats(userId) {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_bookmarks,
        COUNT(DISTINCT v.category) as categories_explored,
        COUNT(CASE WHEN b.created_at > NOW() - INTERVAL '7 days' THEN 1 END) as bookmarks_this_week,
        COUNT(CASE WHEN b.created_at > NOW() - INTERVAL '30 days' THEN 1 END) as bookmarks_this_month,
        MAX(b.created_at) as last_bookmark_date
      FROM bookmarks b
      JOIN videos v ON b.video_id = v.id
      WHERE b.user_id = $1 AND v.approved = true
    `, [userId]);
    return result.rows[0];
  },

  async getRecentBookmarks(userId, limit = 5) {
    const result = await pool.query(`
      SELECT v.id, v.title, v.category, v.video_url, b.created_at as bookmarked_at
      FROM bookmarks b
      JOIN videos v ON b.video_id = v.id
      WHERE b.user_id = $1 AND v.approved = true
      ORDER BY b.created_at DESC
      LIMIT $2
    `, [userId, limit]);
    return result.rows;
  },

  async getCategoryBreakdown(userId) {
    const result = await pool.query(`
      SELECT 
        v.category,
        COUNT(*) as bookmark_count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM bookmarks b2 JOIN videos v2 ON b2.video_id = v2.id WHERE b2.user_id = $1 AND v2.approved = true), 2) as percentage
      FROM bookmarks b
      JOIN videos v ON b.video_id = v.id
      WHERE b.user_id = $1 AND v.approved = true
      GROUP BY v.category
      ORDER BY bookmark_count DESC
    `, [userId]);
    return result.rows;
  },
};

module.exports = BookmarkModel;
