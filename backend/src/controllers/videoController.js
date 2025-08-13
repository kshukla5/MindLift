const VideoModel = require('../models/videoModel');
const SpeakerModel = require('../models/speakerModel');

const VideoController = {
  // Public: only approved videos
  async list(req, res) {
    try {
      const videos = await VideoModel.getApprovedVideos();
      res.json(videos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch videos' });
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
      if (!video) return res.status(404).json({ error: 'Video not found' });
      res.json(video);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch video' });
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
      console.error('Video upload error:', err);
      res.status(500).json({ error: 'Failed to upload video' });
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
      console.error('Approval update error:', err);
      res.status(500).json({ error: 'Failed to update video approval status' });
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
      console.error('Video deletion error:', err);
      res.status(500).json({ error: 'Failed to delete video' });
    }
  },

  // Speaker dashboard: real data
  async getSpeakerVideos(req, res) {
    try {
      const videos = await VideoModel.getVideosByUserId(req.user.id);
      res.json({ success: true, videos });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch speaker videos' });
    }
  },
};

module.exports = VideoController;
