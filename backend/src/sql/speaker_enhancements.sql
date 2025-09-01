-- Speaker Journey Enhancements
-- This file contains database schema enhancements for the complete Speaker journey

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
  type TEXT NOT NULL, -- 'email_verification', 'speaker_approved', 'video_approved', 'milestone', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional data like video_id, milestone_count, etc.
  read BOOLEAN DEFAULT FALSE,
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create video analytics table for tracking views and engagement
CREATE TABLE IF NOT EXISTS video_analytics (
  id SERIAL PRIMARY KEY,
  video_id INTEGER REFERENCES videos(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL, -- 'view', 'like', 'complete', 'share'
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create speaker milestones table for achievements
CREATE TABLE IF NOT EXISTS speaker_milestones (
  id SERIAL PRIMARY KEY,
  speaker_id INTEGER REFERENCES speakers(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL, -- 'first_video', 'views_1000', 'videos_10', etc.
  achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data JSONB -- Additional data like view_count, video_count, etc.
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
