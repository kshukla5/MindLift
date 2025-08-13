const pool = require('../config/db');

const VideoModel = {
  // Public: Only approved videos with speaker info
  async getApprovedVideos() {
    try {
      const result = await pool.query(
        `SELECT v.id, v.title, v.description, v.category,
                v.video_url AS url,
                v.video_url,
                v.approved, v.created_at,
                v.speaker_id,
                u.name as speaker_name,
                u.email as speaker_email
           FROM videos v
           LEFT JOIN speakers s ON v.speaker_id = s.id
           LEFT JOIN users u ON s.user_id = u.id
          WHERE v.approved = true
          ORDER BY v.created_at DESC`
      );
      console.log(`VideoModel.getApprovedVideos: Found ${result.rows.length} videos`);
      return result.rows;
    } catch (error) {
      console.error('VideoModel.getApprovedVideos error:', error);
      throw error;
    }
  },

  // Admin/internal: Fetch all videos with speaker info
  async getAllVideos() {
    try {
      const result = await pool.query(
        `SELECT v.id, v.title, v.description, v.category,
                v.video_url AS url,
                v.video_url,
                v.approved, v.created_at,
                v.speaker_id,
                u.name as speaker_name,
                u.email as speaker_email
           FROM videos v
           LEFT JOIN speakers s ON v.speaker_id = s.id
           LEFT JOIN users u ON s.user_id = u.id
          ORDER BY v.created_at DESC`
      );
      console.log(`VideoModel.getAllVideos: Found ${result.rows.length} videos`);
      return result.rows;
    } catch (error) {
      console.error('VideoModel.getAllVideos error:', error);
      throw error;
    }
  },

  async getUnapprovedVideos() {
    const result = await pool.query(
      `SELECT v.id, v.title, v.description, v.category,
              v.video_url AS url,
              v.video_url,
              v.approved, v.created_at,
              v.speaker_id,
              u.name as speaker_name,
              u.email as speaker_email
         FROM videos v
         LEFT JOIN speakers s ON v.speaker_id = s.id
         LEFT JOIN users u ON s.user_id = u.id
        WHERE v.approved = false
        ORDER BY v.created_at DESC`
    );
    return result.rows;
  },

  async getVideoById(id) {
    const result = await pool.query(
      `SELECT v.id, v.title, v.description, v.category,
              v.video_url AS url,
              v.video_url,
              v.approved, v.created_at,
              v.speaker_id,
              u.name as speaker_name,
              u.email as speaker_email
         FROM videos v
         LEFT JOIN speakers s ON v.speaker_id = s.id
         LEFT JOIN users u ON s.user_id = u.id
        WHERE v.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Speaker dashboard: list user's own videos (approved + pending)
  async getVideosByUserId(userId) {
    const result = await pool.query(
      `SELECT v.id, v.title, v.description, v.category,
              v.video_url AS url,
              v.video_url,
              v.approved, v.created_at,
              v.speaker_id
         FROM videos v
         JOIN speakers s ON v.speaker_id = s.id
        WHERE s.user_id = $1
        ORDER BY v.created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  // Helper: list by speaker id directly
  async getVideosBySpeakerId(speakerId) {
    const result = await pool.query(
      `SELECT id, title, description, category,
              video_url AS url,
              video_url,
              approved, created_at
         FROM videos
        WHERE speaker_id = $1
        ORDER BY created_at DESC`,
      [speakerId]
    );
    return result.rows;
  },

  async createVideo({ title, description, category, videoUrl, speakerId }) {
    const result = await pool.query(
      'INSERT INTO videos (title, description, category, video_url, speaker_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, category, video_url AS url, video_url, approved, created_at',
      [title, description, category, videoUrl, speakerId]
    );
    return result.rows[0];
  },

  async updateVideo(id, { title, description, category }) {
    const result = await pool.query(
      'UPDATE videos SET title = COALESCE($1, title), description = COALESCE($2, description), category = COALESCE($3, category) WHERE id = $4 RETURNING id, title, description, category, video_url AS url, video_url, approved, created_at',
      [title, description, category, id]
    );
    return result.rows[0];
  },

  async updateVideoApproval(id, approved) {
    const result = await pool.query(
      'UPDATE videos SET approved = $1 WHERE id = $2 RETURNING id, title, description, category, video_url AS url, video_url, approved, created_at',
      [approved, id]
    );
    return result.rows[0];
  },

  async deleteVideo(id) {
    await pool.query('DELETE FROM videos WHERE id = $1', [id]);
  },
};

module.exports = VideoModel;
