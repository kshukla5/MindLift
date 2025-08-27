-- Migration to add speaker_id column to videos table
-- Run this if your videos table doesn't have speaker_id column

-- Add speaker_id column if it doesn't exist
ALTER TABLE videos
ADD COLUMN IF NOT EXISTS speaker_id INTEGER REFERENCES speakers(id) ON DELETE SET NULL;

-- Update existing videos to link to speakers based on user_id
-- This assumes videos were created by speakers who have user accounts
UPDATE videos
SET speaker_id = s.id
FROM speakers s
WHERE videos.speaker_id IS NULL
AND s.user_id IN (
  SELECT user_id FROM speakers
  WHERE id = s.id
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_videos_speaker_id ON videos(speaker_id);
CREATE INDEX IF NOT EXISTS idx_videos_approved ON videos(approved);
