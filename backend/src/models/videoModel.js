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

  async createVideo({ title, description, category, videoUrl, speakerId, thumbnailUrl, durationSeconds, language = 'english', subtitleUrl, tags = [] }) {
    const result = await pool.query(
      `INSERT INTO videos (title, description, category, video_url, speaker_id, thumbnail_url, duration_seconds, language, subtitle_url, tags) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING id, title, description, category, video_url AS url, video_url, approved, created_at, thumbnail_url, duration_seconds, language, tags`,
      [title, description, category, videoUrl, speakerId, thumbnailUrl, durationSeconds, language, subtitleUrl, tags]
    );
    return result.rows[0];
  },

  async updateVideo(id, { title, description, category, thumbnailUrl, durationSeconds, language, subtitleUrl, tags }) {
    const result = await pool.query(
      `UPDATE videos SET 
         title = COALESCE($1, title), 
         description = COALESCE($2, description), 
         category = COALESCE($3, category),
         thumbnail_url = COALESCE($4, thumbnail_url),
         duration_seconds = COALESCE($5, duration_seconds),
         language = COALESCE($6, language),
         subtitle_url = COALESCE($7, subtitle_url),
         tags = COALESCE($8, tags)
       WHERE id = $9 
       RETURNING id, title, description, category, video_url AS url, video_url, approved, created_at, thumbnail_url, duration_seconds, language, tags`,
      [title, description, category, thumbnailUrl, durationSeconds, language, subtitleUrl, tags, id]
    );
    return result.rows[0];
  },

  async updateVideoApproval(id, approved, adminNotes = null) {
    const timestampField = approved ? 'approved_at' : 'rejected_at';
    const result = await pool.query(
      `UPDATE videos SET approved = $1, admin_notes = $2, ${timestampField} = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING id, title, approved, admin_notes, approved_at, rejected_at`,
      [approved, adminNotes, id]
    );
    return result.rows[0];
  },

  async deleteVideo(id) {
    await pool.query('DELETE FROM videos WHERE id = $1', [id]);
  },
};

module.exports = VideoModel;
