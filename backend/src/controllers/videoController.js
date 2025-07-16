const VideoModel = require('../models/videoModel');

const VideoController = {
  async list(req, res) {
    try {
      const videos = await VideoModel.getAllVideos();
      res.json(videos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch videos' });
    }
  },

  async listUnapproved(req, res) {
    try {
      const videos = await VideoModel.getUnapprovedVideos();
      res.json(videos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch videos' });
    }
  },

  async getSpeakerVideos(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const videos = await VideoModel.getVideosByUserId(userId);
      const stats = await VideoModel.getSpeakerStats(userId);
      const recentActivity = await VideoModel.getRecentActivity(userId);
      res.json({ videos, stats, recentActivity });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch speaker videos' });
    }
  },

  async getSpeakerStats(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const stats = await VideoModel.getSpeakerStats(userId);
      res.json(stats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch speaker stats' });
    }
  },

  async getLearnerDashboard(req, res) {
    try {
      const [platformStats, popularCategories, recentVideos] = await Promise.all([
        VideoModel.getLearnerStats(),
        VideoModel.getPopularCategories(),
        VideoModel.getRecentVideos()
      ]);
      
      res.json({
        platformStats,
        popularCategories,
        recentVideos
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch learner dashboard data' });
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
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch video' });
    }
  },

  async create(req, res) {
    try {
      const { title, description, category, videoUrl } = req.body;
      const uploaded = req.file ? `/uploads/${req.file.filename}` : videoUrl;
      if (!title || !uploaded) {
        return res.status(400).json({ error: 'Title and video are required' });
      }
      
      // For now, we'll link videos directly to users instead of the speakers table
      // This simplifies the process and avoids the need for speaker profile creation
      const video = await VideoModel.createVideo({ 
        title, 
        description, 
        category, 
        videoUrl: uploaded, 
        userId: req.user.userId || req.user.id 
      });
      res.status(201).json(video);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload video' });
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
      console.error(err);
      res.status(500).json({ error: 'Failed to update video' });
    }
  },

  async updateApproval(req, res) {
    try {
      const { approved } = req.body;
      const video = await VideoModel.updateApproval(req.params.id, approved);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      res.json(video);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update status' });
    }
  },

  async remove(req, res) {
    try {
      await VideoModel.deleteVideo(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete video' });
    }
  },
};

module.exports = VideoController;
