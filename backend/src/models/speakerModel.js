const pool = require('../config/db');

const SpeakerModel = {
  async getSpeakerIdByUserId(userId) {
    const result = await pool.query('SELECT id FROM speakers WHERE user_id = $1', [userId]);
    return result.rows[0]?.id || null;
  },

  async getStatsForSpeaker(speakerId) {
    const total = await pool.query('SELECT COUNT(*)::int AS count FROM videos WHERE speaker_id = $1', [speakerId]);
    const approved = await pool.query('SELECT COUNT(*)::int AS count FROM videos WHERE speaker_id = $1 AND approved = true', [speakerId]);
    const pending = await pool.query('SELECT COUNT(*)::int AS count FROM videos WHERE speaker_id = $1 AND approved = false', [speakerId]);
    // Views/likes/bookmarks would require extra tables; set 0 for now
    return {
      totalVideos: total.rows[0]?.count || 0,
      approvedVideos: approved.rows[0]?.count || 0,
      pendingVideos: pending.rows[0]?.count || 0,
      totalViews: 0,
      totalLikes: 0,
      totalBookmarks: 0,
    };
  },

  async getRecentForSpeaker(speakerId, limit = 5) {
    const result = await pool.query(
      `SELECT id, title, approved AS approved, created_at
       FROM videos
       WHERE speaker_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [speakerId, limit]
    );
    return result.rows.map(r => ({
      id: r.id,
      title: r.title,
      status: r.approved ? 'approved' : 'pending',
      uploadedAt: r.created_at,
      views: 0,
    }));
  },
  async getAllSpeakers() {
    const result = await pool.query('SELECT id, name, bio, photo_url, social_links FROM speakers');
    return result.rows;
  },

  async getSpeakerById(id) {
    const result = await pool.query('SELECT id, name, bio, photo_url, social_links FROM speakers WHERE id = $1', [id]);
    return result.rows[0];
  },

  async createSpeaker({ name, bio, photoUrl, socialLinks }) {
    const result = await pool.query(
      'INSERT INTO speakers (name, bio, photo_url, social_links) VALUES ($1, $2, $3, $4) RETURNING id, name, bio, photo_url, social_links',
      [name, bio, photoUrl, socialLinks]
    );
    return result.rows[0];
  },

  async updateSpeaker(id, { name, bio, photoUrl, socialLinks }) {
    const result = await pool.query(
      'UPDATE speakers SET name = $1, bio = $2, photo_url = $3, social_links = $4 WHERE id = $5 RETURNING id, name, bio, photo_url, social_links',
      [name, bio, photoUrl, socialLinks, id]
    );
    return result.rows[0];
  },

  async deleteSpeaker(id) {
    await pool.query('DELETE FROM speakers WHERE id = $1', [id]);
  },
};

module.exports = SpeakerModel;
