const VideoModel = require('../models/videoModel');
const SpeakerModel = require('../models/speakerModel');

const VideoController = {
  // Public: only approved videos
  async list(req, res) {
    try {
      const videos = await VideoModel.getApprovedVideos();
      res.json(videos);
    } catch (err) {
      console.error('VideoController.list error:', err);
      res.status(500).json({ error: 'Failed to fetch videos', details: err.message });
    }
  },

  // Admin: list pending videos
  async listUnapproved(req, res) {
    try {
      const videos = await VideoModel.getUnapprovedVideos();
      res.json(videos);
    } catch (err) {
      console.error('VideoController.listUnapproved error:', err);
      res.status(500).json({ error: 'Failed to fetch videos', details: err.message });
    }
  },

  async getById(req, res) {
    try {
      const video = await VideoModel.getVideoById(req.params.id);
      if (!video) return res.status(404).json({ error: 'Video not found' });
      res.json(video);
    } catch (err) {
      console.error('VideoController.getById error:', err);
      res.status(500).json({ error: 'Failed to fetch video', details: err.message });
    }
  },

  // Speaker/Admin: upload -> always pending approval
  async create(req, res) {
    try {
      const { title, description, category } = req.body;
      // Support both "videoUrl" and "url" in request body
      const bodyVideoUrl = req.body.videoUrl || req.body.url;
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
      console.error('VideoController.create error:', err);
      res.status(500).json({ error: 'Failed to upload video', details: err.message });
    }
  },

  // Speaker/Admin: update video details
  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, category } = req.body;
      const userId = req.user.id;

      // Check if video exists and user has permission
      const video = await VideoModel.getVideoById(id);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      // Get speaker ID for this user
      const speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
      if (!speakerId) {
        return res.status(403).json({ error: 'Speaker profile not found' });
      }

      // Check if user owns this video or is admin
      if (video.speaker_id !== speakerId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedVideo = await VideoModel.updateVideo(id, {
        title,
        description,
        category,
      });

      if (!updatedVideo) {
        return res.status(404).json({ error: 'Video not found' });
      }

      res.json(updatedVideo);
    } catch (err) {
      console.error('VideoController.update error:', err);
      res.status(500).json({ error: 'Failed to update video', details: err.message });
    }
  },

  // Admin: approve/reject
  async updateApproval(req, res) {
    try {
      const { id } = req.params;
      const { approved } = req.body; // true = approve, false = reject

      const updated = await VideoModel.updateApproval(id, approved);
      if (!updated) return res.status(404).json({ error: 'Video not found' });

      const video = await VideoModel.getVideoById(id);
      res.json({ message: approved ? 'Approved' : 'Rejected', video });
    } catch (err) {
      console.error('VideoController.updateApproval error:', err);
      res.status(500).json({ error: 'Failed to update video approval status', details: err.message });
    }
  },

  // Admin: delete video (e.g., hard reject)
  async remove(req, res) {
    try {
      const { id } = req.params;
      const video = await VideoModel.getVideoById(id);
      if (!video) return res.status(404).json({ error: 'Video not found' });
      await VideoModel.deleteVideo(id);
      res.json({ message: 'Video deleted successfully' });
    } catch (err) {
      console.error('VideoController.remove error:', err);
      res.status(500).json({ error: 'Failed to delete video', details: err.message });
    }
  },

  // Speaker dashboard: real data with better error handling
  async getSpeakerVideos(req, res) {
    try {
      console.log('getSpeakerVideos called for user:', req.user?.id);
      
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const userId = req.user.id;
      console.log('Fetching videos for userId:', userId);
      
      // Check if user has speaker profile first
      const speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
      console.log('Speaker ID found:', speakerId);
      
      if (!speakerId) {
        // User doesn't have speaker profile, return empty videos
        console.log('No speaker profile found, returning empty array');
        return res.json({ success: true, videos: [] });
      }

      const videos = await VideoModel.getVideosByUserId(userId);
      console.log('Videos fetched:', videos?.length || 0);
      
      res.json({ success: true, videos: videos || [] });
    } catch (err) {
      console.error('VideoController.getSpeakerVideos error:', err);
      console.error('Error stack:', err.stack);
      res.status(500).json({ 
        error: 'Failed to fetch speaker videos', 
        details: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  },
};

module.exports = VideoController;
