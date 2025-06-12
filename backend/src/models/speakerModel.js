const pool = require('../config/db');

const SpeakerModel = {
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
