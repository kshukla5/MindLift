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
};

module.exports = VideoController;
