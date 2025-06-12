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
      const video = await VideoModel.createVideo({ title, description, category, videoUrl: uploaded });
      res.status(201).json(video);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload video' });
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
