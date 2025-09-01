const pool = require('../config/db');

const SpeakerModel = {
  async getSpeakerIdByUserId(userId) {
    const result = await pool.query('SELECT id FROM speakers WHERE user_id = $1', [userId]);
    return result.rows[0]?.id || null;
  },
  
  async getAllSpeakers() {
    const result = await pool.query(`
      SELECT s.id, s.user_id, s.bio, s.photo, s.socials, s.created_at,
             s.full_name, s.areas_of_expertise, s.profile_picture_url, 
             s.intro_video_url, s.approval_status, s.approved_at,
             u.name, u.email, u.country
      FROM speakers s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `);
    return result.rows;
  },

  async getSpeakerById(id) {
    const result = await pool.query(`
      SELECT s.id, s.user_id, s.bio, s.photo, s.socials, s.created_at,
             s.full_name, s.areas_of_expertise, s.profile_picture_url,
             s.intro_video_url, s.approval_status, s.approved_at, s.admin_notes,
             u.name, u.email, u.country, u.email_verified, u.profile_completed
      FROM speakers s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = $1
    `, [id]);
    return result.rows[0];
  },

  async getSpeakerByUserId(userId) {
    const result = await pool.query(`
      SELECT s.id, s.user_id, s.bio, s.photo, s.socials, s.created_at,
             s.full_name, s.areas_of_expertise, s.profile_picture_url,
             s.intro_video_url, s.approval_status, s.approved_at,
             u.name, u.email, u.country, u.email_verified, u.profile_completed
      FROM speakers s
      JOIN users u ON s.user_id = u.id
      WHERE s.user_id = $1
    `, [userId]);
    return result.rows[0];
  },

  async createSpeaker({ name, bio, expertise, socialLinks, userId, fullName, profilePictureUrl, introVideoUrl }) {
    const result = await pool.query(
      `INSERT INTO speakers (user_id, bio, photo, socials, full_name, areas_of_expertise, profile_picture_url, intro_video_url, approval_status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING id, user_id, bio, photo, socials, full_name, areas_of_expertise, profile_picture_url, intro_video_url, approval_status, created_at`,
      [userId, bio, profilePictureUrl || null, JSON.stringify(socialLinks || {}), fullName, expertise || [], profilePictureUrl, introVideoUrl, 'pending']
    );
    return result.rows[0];
  },

  async updateSpeaker(id, { name, bio, expertise, socialLinks, photoUrl, fullName, profilePictureUrl, introVideoUrl }) {
    const result = await pool.query(
      `UPDATE speakers SET 
         bio = COALESCE($1, bio), 
         photo = COALESCE($2, photo), 
         socials = COALESCE($3, socials),
         full_name = COALESCE($4, full_name),
         areas_of_expertise = COALESCE($5, areas_of_expertise),
         profile_picture_url = COALESCE($6, profile_picture_url),
         intro_video_url = COALESCE($7, intro_video_url)
       WHERE id = $8 
       RETURNING id, user_id, bio, photo, socials, full_name, areas_of_expertise, profile_picture_url, intro_video_url, approval_status, created_at`,
      [bio, photoUrl || profilePictureUrl, socialLinks ? JSON.stringify(socialLinks) : null, fullName, expertise, profilePictureUrl, introVideoUrl, id]
    );
    return result.rows[0];
  },

  async updateSpeakerApproval(id, status, adminNotes = null) {
    const timestampField = status === 'approved' ? 'approved_at' : status === 'rejected' ? 'rejected_at' : null;
    const query = timestampField 
      ? `UPDATE speakers SET approval_status = $1, admin_notes = $2, ${timestampField} = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`
      : `UPDATE speakers SET approval_status = $1, admin_notes = $2 WHERE id = $3 RETURNING *`;
    
    const result = await pool.query(query, [status, adminNotes, id]);
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
      'INSERT INTO speakers (user_id, approval_status) VALUES ($1, $2) RETURNING id',
      [userId, 'pending']
    );
    return result.rows[0]?.id || null;
  },

  // Speaker profile completion and analytics
  async getProfileCompletionStatus(userId) {
    const speaker = await this.getSpeakerByUserId(userId);
    if (!speaker) return { completed: false, percentage: 0, missing: ['profile'] };

    const required = ['bio', 'full_name', 'areas_of_expertise', 'profile_picture_url'];
    const optional = ['intro_video_url', 'socials'];
    const completed = [];
    const missing = [];

    required.forEach(field => {
      if (speaker[field] && (Array.isArray(speaker[field]) ? speaker[field].length > 0 : true)) {
        completed.push(field);
      } else {
        missing.push(field);
      }
    });

    optional.forEach(field => {
      if (speaker[field] && (field === 'socials' ? Object.keys(JSON.parse(speaker[field] || '{}')).length > 0 : true)) {
        completed.push(field);
      }
    });

    const percentage = Math.round((completed.length / (required.length + optional.length)) * 100);
    return {
      completed: missing.length === 0,
      percentage,
      missing,
      approvalStatus: speaker.approval_status
    };
  },

  // Get speakers pending approval
  async getPendingSpeakers() {
    const result = await pool.query(`
      SELECT s.id, s.user_id, s.bio, s.full_name, s.areas_of_expertise, 
             s.profile_picture_url, s.intro_video_url, s.created_at,
             u.name, u.email, u.country
      FROM speakers s
      JOIN users u ON s.user_id = u.id
      WHERE s.approval_status = 'pending'
      ORDER BY s.created_at ASC
    `);
    return result.rows;
  }
};

module.exports = SpeakerModel;
