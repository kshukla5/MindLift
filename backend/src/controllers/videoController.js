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
      const { title, description, category, url, videoUrl } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      console.log('Video creation request:', {
        userId,
        userRole,
        title,
        hasFile: !!req.file,
        hasUrl: !!(videoUrl || url)
      });

      // Ensure user has speaker role
      if (userRole !== 'speaker') {
        return res.status(403).json({ error: 'Only speakers can upload videos' });
      }

      let finalVideoUrl;
      if (req.file) {
        finalVideoUrl = `/uploads/${req.file.filename}`;
        console.log('Using uploaded file:', finalVideoUrl);
      } else if (videoUrl || url) {
        finalVideoUrl = videoUrl || url;
        console.log('Using URL:', finalVideoUrl);
      } else {
        return res.status(400).json({ error: 'Video file or URL is required' });
      }

      if (!title || !description || !category) {
        return res.status(400).json({ error: 'Title, description, and category are required' });
      }

      // Resolve or create speaker row for this user
      console.log('Looking up/creating speaker profile for user:', userId);
      let speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
      if (!speakerId) {
        console.log('No speaker profile found, creating one...');
        speakerId = await SpeakerModel.ensureSpeakerRow(userId);
        console.log('Created speaker profile with ID:', speakerId);
      }

      if (!speakerId) {
        console.error('Failed to create/find speaker profile for user:', userId);
        return res.status(500).json({ error: 'Failed to create speaker profile' });
      }

      console.log('Creating video with speaker ID:', speakerId);
      const video = await VideoModel.createVideo({
        title,
        description,
        category,
        videoUrl: finalVideoUrl,
        speakerId,
      });

      console.log('Video created successfully:', video.id, video.title);
      res.status(201).json(video);
    } catch (err) {
      console.error('Video upload error:', err.message, err.stack);
      res.status(500).json({ error: 'Failed to upload video', details: err.message });
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
      const videoId = req.params.id;
      const { title, description, category } = req.body;
      
      // Get the video first to check authorization
      const video = await VideoModel.getVideoById(videoId);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      // Check if user is authorized to update this video
      // Speakers can only update their own videos, admins can update all
      if (req.user.role === 'speaker') {
        const speakerId = await SpeakerModel.getSpeakerIdByUserId(req.user.id);
        if (video.speaker_id !== speakerId) {
          return res.status(403).json({ error: 'Not authorized to update this video' });
        }
      }

      const updatedVideo = await VideoModel.updateVideo(videoId, { title, description, category });
      res.json(updatedVideo);
    } catch (err) {
      console.error('Video update error:', err);
      res.status(500).json({ error: 'Failed to update video' });
    }
  },

  async remove(req, res) {
    try {
      const videoId = req.params.id;
      const video = await VideoModel.getVideoById(videoId);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      // Check if user is authorized to delete this video
      // Speakers can only delete their own videos, admins can delete all
      if (req.user.role === 'speaker') {
        const speakerId = await SpeakerModel.getSpeakerIdByUserId(req.user.id);
        if (video.speaker_id !== speakerId) {
          return res.status(403).json({ error: 'Not authorized to delete this video' });
        }
      }

      await VideoModel.deleteVideo(videoId);
      res.json({ message: 'Video deleted successfully' });
    } catch (err) {
      console.error('Video deletion error:', err);
      res.status(500).json({ error: 'Failed to delete video' });
    }
  },

  // Get video by ID with optional authorization (public can view approved videos)
  async getVideoById(req, res) {
    try {
      const jwt = require('jsonwebtoken');
      const videoId = req.params.id;
      const video = await VideoModel.getVideoById(videoId);

      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      // Public can view approved videos without auth
      if (video.approved === true) {
        return res.json(video);
      }

      // For unapproved videos, require valid auth and proper role/ownership
      const authHeader = req.headers && req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Not authorized to view this video' });
      }

      try {
        const token = authHeader.slice(7);
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
          return res.status(500).json({ error: 'Server configuration error' });
        }
        const payload = jwt.verify(token, JWT_SECRET);
        // Admins can view any
        if (payload.role === 'admin') {
          return res.json(video);
        }
        // Speakers can only view their own unapproved videos
        if (payload.role === 'speaker') {
          const speakerId = await SpeakerModel.getSpeakerIdByUserId(payload.id);
          if (video.speaker_id === speakerId) {
            return res.json(video);
          }
        }
        return res.status(403).json({ error: 'Not authorized to view this video' });
      } catch (authErr) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
    } catch (err) {
      console.error('getVideoById error:', err);
      res.status(500).json({ error: 'Failed to fetch video' });
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
