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
       WHERE b.user_id = $1`,
      [userId]
    );
    return result.rows;
  },
};

module.exports = BookmarkModel;
