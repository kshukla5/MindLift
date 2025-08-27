const pool = require('../config/db');

const SpeakerModel = {
  async getSpeakerIdByUserId(userId) {
    const result = await pool.query('SELECT id FROM speakers WHERE user_id = $1', [userId]);
    return result.rows[0]?.id || null;
  },
  
  async getAllSpeakers() {
    const result = await pool.query('SELECT id, user_id, bio, photo, socials, created_at FROM speakers ORDER BY created_at DESC');
    return result.rows;
  },

  async getSpeakerById(id) {
    const result = await pool.query('SELECT id, user_id, bio, photo, socials, created_at FROM speakers WHERE id = $1', [id]);
    return result.rows[0];
  },

  async getSpeakerByUserId(userId) {
    const result = await pool.query('SELECT id, user_id, bio, photo, socials, created_at FROM speakers WHERE user_id = $1', [userId]);
    return result.rows[0];
  },

  async createSpeaker({ name, bio, expertise, socialLinks, userId }) {
    const result = await pool.query(
      'INSERT INTO speakers (user_id, bio, photo, socials) VALUES ($1, $2, $3, $4) RETURNING id, user_id, bio, photo, socials, created_at',
      [userId, bio, null, JSON.stringify(socialLinks || {})]
    );
    return result.rows[0];
  },

  async updateSpeaker(id, { name, bio, expertise, socialLinks, photoUrl }) {
    const result = await pool.query(
      'UPDATE speakers SET bio = COALESCE($1, bio), photo = COALESCE($2, photo), socials = COALESCE($3, socials) WHERE id = $4 RETURNING id, user_id, bio, photo, socials, created_at',
      [bio, photoUrl, socialLinks ? JSON.stringify(socialLinks) : null, id]
    );
    return result.rows[0];
  },

  async deleteSpeaker(id) {
    await pool.query('DELETE FROM speakers WHERE id = $1', [id]);
  },

  async getSpeakerStats(speakerId) {
    const result = await pool.query(
      `SELECT
        COUNT(v.id) as total_videos,
        COUNT(CASE WHEN v.approved = true THEN 1 END) as approved_videos,
        COUNT(CASE WHEN v.approved = false THEN 1 END) as pending_videos,
        COUNT(CASE WHEN v.created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as videos_this_week,
        COUNT(CASE WHEN v.created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as videos_this_month
       FROM speakers s
       LEFT JOIN videos v ON s.id = v.speaker_id
       WHERE s.id = $1
       GROUP BY s.id`,
      [speakerId]
    );
    return result.rows[0] || { total_videos: 0, approved_videos: 0, pending_videos: 0, videos_this_week: 0, videos_this_month: 0 };
  },

  async getRecentForSpeaker(speakerId, limit = 5) {
    const result = await pool.query(
      `SELECT id, title, approved, created_at
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

  async ensureSpeakerRow(userId) {
    const existing = await this.getSpeakerByUserId(userId);
    if (existing && existing.id) return existing.id;
    const result = await pool.query(
      'INSERT INTO speakers (user_id) VALUES ($1) RETURNING id',
      [userId]
    );
    return result.rows[0]?.id || null;
  }
};

module.exports = SpeakerModel;
