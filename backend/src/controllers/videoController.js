const VideoModel = require('../models/videoModel');
const SpeakerModel = require('../models/speakerModel');

const VideoController = {
  // Public: only approved videos
  async list(req, res) {
    try {
      console.log('=== Video List Request ===');
      console.log('Environment:', process.env.NODE_ENV);
      console.log('Database URL exists:', !!process.env.DATABASE_URL);
      console.log('DB Host:', process.env.DB_HOST || process.env.PGHOST || 'localhost');
      console.log('DB Port:', process.env.DB_PORT || process.env.PGPORT || 5432);
      console.log('Fetching approved videos...');
      
      const videos = await VideoModel.getApprovedVideos();
      console.log(`Found ${videos.length} approved videos`);
      res.json(videos);
    } catch (err) {
      console.error('Video list error:', err);
      console.error('Error message:', err.message);
      console.error('Error code:', err.code);
      console.error('Stack trace:', err.stack);
      res.status(500).json({ 
        error: 'Failed to fetch videos', 
        details: err.message,
        code: err.code 
      });
    }
  },

  // Admin: list pending videos
  async listUnapproved(req, res) {
    try {
      const videos = await VideoModel.getUnapprovedVideos();
      res.json(videos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch videos' });
    }
  },

  async getById(req, res) {
    try {
      const video = await VideoModel.getVideoById(req.params.id);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      res.json(video);
    } catch (err) {
      console.error('Get video error:', err);
      res.status(500).json({ error: 'Failed to fetch video' });
    }
  },

  async create(req, res) {
    try {
      const { title, description, category, videoUrl: bodyVideoUrl } = req.body;
      const userId = req.user.id;

      let finalVideoUrl;
      if (req.file) {
        finalVideoUrl = `/uploads/${req.file.filename}`;
      } else if (bodyVideoUrl) {
        finalVideoUrl = bodyVideoUrl;
      } else {
        return res.status(400).json({ error: 'Video file or URL is required' });
      }
      if (!title || !description || !category) {
        return res.status(400).json({ error: 'Title, description, and category are required' });
      }

      // Resolve or create speaker row for this user
      let speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
      if (!speakerId) {
        speakerId = await SpeakerModel.ensureSpeakerRow(userId);
      }

      const video = await VideoModel.createVideo({
        title,
        description,
        category,
        videoUrl: finalVideoUrl,
        speakerId,
      });

      res.status(201).json(video);
    } catch (err) {
      console.error('Video upload error:', err);
      res.status(500).json({ error: 'Failed to upload video' });
    }
  },

  // Admin: approve/reject
  async updateApproval(req, res) {
    try {
      const { approved } = req.body;
      const video = await VideoModel.updateVideoApproval(req.params.id, approved);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      res.json(video);
    } catch (err) {
      console.error('Video approval error:', err);
      res.status(500).json({ error: 'Failed to update video approval' });
    }
  },

  async update(req, res) {
    try {
      const { title, description, category } = req.body;
      const video = await VideoModel.updateVideo(req.params.id, { title, description, category });
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      res.json(video);
    } catch (err) {
      console.error('Video update error:', err);
      res.status(500).json({ error: 'Failed to update video' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const video = await VideoModel.getVideoById(id);
      if (!video) return res.status(404).json({ error: 'Video not found' });
      await VideoModel.deleteVideo(id);
      res.json({ message: 'Video deleted successfully' });
    } catch (err) {
      console.error('Video deletion error:', err);
      res.status(500).json({ error: 'Failed to delete video' });
    }
  },

  // Speaker dashboard: real data
  async getSpeakerVideos(req, res) {
    try {
      console.log('getSpeakerVideos called for user:', req.user.id, req.user.email);
      const userId = req.user.id;
      
      // Auto-create speaker profile if it doesn't exist
      let speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
      
      if (!speakerId) {
        console.log('No speaker profile found for videos, creating one...');
        speakerId = await SpeakerModel.ensureSpeakerRow(userId);
        console.log('Created speaker ID:', speakerId);
      }

      console.log('Fetching videos for user:', userId);
      const videos = await VideoModel.getVideosByUserId(userId);
      console.log('Found videos:', videos.length);
      
      res.json({ success: true, videos });
    } catch (err) {
      console.error('getSpeakerVideos error:', err);
      console.error('Stack trace:', err.stack);
      res.status(500).json({ error: 'Failed to fetch speaker videos', details: err.message });
    }
  },
};

module.exports = VideoController;
