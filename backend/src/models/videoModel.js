const pool = require('../config/db');

const VideoModel = {
  async findAll(options = {}) {
    let query = 'SELECT id, title, description, category, video_url as url, file_path, approved, created_at, speaker_id FROM videos';
    const params = [];
    const conditions = [];

    if (options.approved !== undefined) {
      conditions.push(`approved = $${params.length + 1}`);
      params.push(options.approved);
    }

    if (options.category) {
      conditions.push(`category = $${params.length + 1}`);
      params.push(options.category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(options.limit);
    }

    if (options.offset) {
      query += ` OFFSET $${params.length + 1}`;
      params.push(options.offset);
    }

    const result = await pool.query(query, params);
    return result.rows;
  },

  async findById(id) {
    const result = await pool.query(
      'SELECT id, title, description, category, video_url as url, file_path, approved, created_at, speaker_id FROM videos WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  async findBySpeakerId(speakerId) {
    const result = await pool.query(
      'SELECT id, title, description, category, video_url as url, file_path, approved, created_at FROM videos WHERE speaker_id = $1 ORDER BY created_at DESC',
      [speakerId]
    );
    return result.rows;
  },

  async create(videoData) {
    const { title, description, category, speaker_id, url, file_path, approved = false } = videoData;
    const result = await pool.query(
      'INSERT INTO videos (title, description, category, speaker_id, video_url, file_path, approved) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, title, description, category, video_url as url, file_path, speaker_id, approved, created_at',
      [title, description, category, speaker_id, url, file_path, approved]
    );
    return result.rows[0];
  },

  async update(id, updateData) {
    const { title, description, category } = updateData;
    const result = await pool.query(
      'UPDATE videos SET title = $1, description = $2, category = $3 WHERE id = $4 RETURNING id, title, description, category, video_url as url, file_path, approved, created_at',
      [title, description, category, id]
    );
    return result.rows[0];
  },

  async updateApproval(id, approved) {
    const result = await pool.query(
      'UPDATE videos SET approved = $1 WHERE id = $2 RETURNING id, title, description, category, video_url as url, file_path, approved, created_at',
      [approved, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM videos WHERE id = $1', [id]);
    return true;
  },

  async getSpeakerStats(speakerId) {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_videos,
        COUNT(CASE WHEN approved = true THEN 1 END) as approved_videos,
        COUNT(CASE WHEN approved = false THEN 1 END) as pending_videos,
        0 as total_views
      FROM videos 
      WHERE speaker_id = $1
    `, [speakerId]);
    return result.rows[0] || { total_videos: 0, approved_videos: 0, pending_videos: 0, total_views: 0 };
  },

  // Legacy methods for backward compatibility
  async getAllVideos() {
    return this.findAll({ approved: true });
  },

  async getVideoById(id) {
    return this.findById(id);
  },

  async createVideo({ title, description, category, videoUrl, userId }) {
    return this.create({
      title,
      description,
      category,
      speaker_id: userId,
      url: videoUrl
    });
  },

  async getUnapprovedVideos() {
    return this.findAll({ approved: false });
  },

  async deleteVideo(id) {
    return this.delete(id);
  },

  async updateVideo(id, updateData) {
    return this.update(id, updateData);
  },

  async getVideosByUserId(userId) {
    return this.findBySpeakerId(userId);
  },

  async getRecentActivity(userId, limit = 5) {
    const result = await pool.query(`
      SELECT id, title, approved, created_at, 
             CASE 
               WHEN approved = true THEN 'published'
               WHEN approved = false THEN 'pending'
             END as status
      FROM videos 
      WHERE speaker_id = $1 
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
        COUNT(DISTINCT speaker_id) as active_speakers,
        COUNT(DISTINCT category) as total_categories,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_this_week,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_this_month
      FROM videos
      WHERE approved = true
    `);
    return result.rows[0] || { total_videos: 0, published_videos: 0, active_speakers: 0, total_categories: 0, new_this_week: 0, new_this_month: 0 };
  },

  async getPopularCategories(limit = 5) {
    const result = await pool.query(`
      SELECT 
        category,
        COUNT(*) as video_count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM videos WHERE approved = true), 2) as percentage
      FROM videos 
      WHERE approved = true AND category IS NOT NULL
      GROUP BY category
      ORDER BY video_count DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  },

  async getRecentVideos(limit = 10) {
    const result = await pool.query(`
      SELECT id, title, description, category, video_url as url, file_path, created_at
      FROM videos
      WHERE approved = true
      ORDER BY created_at DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  },
};

module.exports = VideoModel;
