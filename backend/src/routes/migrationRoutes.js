const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Database migration endpoint (admin only, for development)
router.post('/migrate', async (req, res) => {
  try {
    const { adminKey } = req.body;
    
    // Simple admin key check (in production, use proper authentication)
    if (adminKey !== 'mindlift-migrate-2024') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // First, create base schema if needed
    const baseSchema = `
-- Base schema for MindLift
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS speakers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  photo TEXT,
  socials JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  speaker_id INTEGER REFERENCES speakers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  video_url TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, video_id)
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  stripe_id TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `;

    // Then apply enhancements
    const enhancements = `
-- Speaker Journey Enhancements
-- Add new fields to users table for better profile management
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;

-- Enhance speakers table for comprehensive profile
ALTER TABLE speakers ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE speakers ADD COLUMN IF NOT EXISTS areas_of_expertise TEXT[];
ALTER TABLE speakers ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;
ALTER TABLE speakers ADD COLUMN IF NOT EXISTS intro_video_url TEXT;
ALTER TABLE speakers ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending';
ALTER TABLE speakers ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE speakers ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
ALTER TABLE speakers ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP;

-- Add video enhancement fields
ALTER TABLE videos ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS duration_seconds INTEGER;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'english';
ALTER TABLE videos ADD COLUMN IF NOT EXISTS subtitle_url TEXT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE videos ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
ALTER TABLE videos ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP;

-- Create notifications table for email alerts and system notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create video analytics table for tracking views and engagement
CREATE TABLE IF NOT EXISTS video_analytics (
  id SERIAL PRIMARY KEY,
  video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create speaker milestones table for achievements
CREATE TABLE IF NOT EXISTS speaker_milestones (
  id SERIAL PRIMARY KEY,
  speaker_id INTEGER REFERENCES speakers(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL,
  achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data JSONB
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_speakers_approval_status ON speakers(approval_status);
CREATE INDEX IF NOT EXISTS idx_videos_approved ON videos(approved);
CREATE INDEX IF NOT EXISTS idx_videos_speaker_id ON videos(speaker_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_video_id ON video_analytics(video_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_event_type ON video_analytics(event_type);

-- Update existing speaker records to have 'approved' status if they have videos
UPDATE speakers SET approval_status = 'approved', approved_at = CURRENT_TIMESTAMP 
WHERE id IN (SELECT DISTINCT speaker_id FROM videos WHERE speaker_id IS NOT NULL)
AND approval_status = 'pending';

-- Update existing user records to mark profile as completed if they have speaker data
UPDATE users SET profile_completed = TRUE 
WHERE id IN (
  SELECT u.id FROM users u 
  JOIN speakers s ON u.id = s.user_id 
  WHERE u.role = 'speaker' AND s.bio IS NOT NULL
);
    `;

    // Execute base schema first
    await pool.query(baseSchema);
    
    // Then execute enhancements
    await pool.query(enhancements);

    res.json({
      success: true,
      message: 'Database schema migration completed successfully',
      applied: ['base_schema', 'speaker_enhancements'],
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Migration error:', err);
    res.status(500).json({ 
      error: 'Migration failed', 
      details: err.message,
      code: err.code
    });
  }
});

// Check migration status
router.get('/migration-status', async (req, res) => {
  try {
    // Check what tables exist
    const allTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    // Check if enhanced tables exist
    const checkTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('notifications', 'video_analytics', 'speaker_milestones')
    `);

    // Check if base tables exist
    const baseTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'speakers', 'videos')
    `);

    const existingTables = allTables.rows.map(r => r.table_name);
    const baseTablesExist = baseTables.rows.map(r => r.table_name);
    const enhancedTablesExist = checkTables.rows.map(r => r.table_name);

    res.json({
      status: 'checked',
      all_tables: existingTables,
      base_tables: baseTablesExist,
      enhanced_tables: enhancedTablesExist,
      missing_base_tables: ['users', 'speakers', 'videos'].filter(t => !baseTablesExist.includes(t)),
      migration_needed: baseTablesExist.length < 3 || enhancedTablesExist.length < 3,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Migration status check error:', err);
    res.status(500).json({ error: 'Failed to check migration status', details: err.message });
  }
});

module.exports = router;
