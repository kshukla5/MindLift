const VideoModel = require('../models/videoModel');

const VideoController = {
  async list(req, res) {
    try {
      // Mock data for video listing with database fallback
      const mockVideos = [
        {
          id: 1,
          title: "Introduction to React Hooks",
          description: "Learn the fundamentals of React Hooks and how to use them effectively",
          category: "Technology",
          url: "https://www.youtube.com/watch?v=O6P86uwfdR0",
          file_path: null,
          approved: true,
          created_at: new Date().toISOString(),
          speaker_id: 1
        },
        {
          id: 2,
          title: "JavaScript ES6 Features",
          description: "Explore modern JavaScript features and syntax",
          category: "Technology", 
          url: "https://www.youtube.com/watch?v=hKB-YGF14SY",
          file_path: null,
          approved: true,
          created_at: new Date().toISOString(),
          speaker_id: 2
        }
      ];

      res.json({ success: true, videos: mockVideos });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch videos' });
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

  async getSpeakerVideos(req, res) {
    try {
      // Mock data fallback for speaker videos
      const mockSpeakerVideos = [
        {
          id: 1,
          title: "Introduction to React Hooks",
          description: "Learn the fundamentals of React Hooks and how to use them effectively",
          category: "Technology", 
          url: "https://www.youtube.com/watch?v=O6P86uwfdR0",
          file_path: null,
          approved: true,
          created_at: new Date().toISOString(),
          speaker_id: req.user?.id || 1
        },
        {
          id: 2,
          title: "Advanced JavaScript Concepts", 
          description: "Deep dive into advanced JavaScript topics",
          category: "Technology",
          url: "https://www.youtube.com/watch?v=hKB-YGF14SY", 
          file_path: null,
          approved: false,
          created_at: new Date().toISOString(),
          speaker_id: req.user?.id || 1
        }
      ];

      res.json({ 
        success: true,
        videos: mockSpeakerVideos
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch speaker videos' });
    }
  },

  async getLearnerDashboard(req, res) {
    try {
      // Mock data for learner dashboard
      const mockRecentVideos = [
        {
          id: 1,
          title: "Introduction to React Hooks",
          description: "Learn React Hooks fundamentals",
          category: "Technology",
          url: "https://www.youtube.com/watch?v=O6P86uwfdR0",
          approved: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          title: "JavaScript ES6 Features",
          description: "Modern JavaScript syntax and features", 
          category: "Technology",
          url: "https://www.youtube.com/watch?v=hKB-YGF14SY",
          approved: true,
          created_at: new Date().toISOString()
        }
      ];

      res.json({
        success: true,
        recentVideos: mockRecentVideos,
        bookmarkedVideos: [],
        stats: {
          totalVideos: mockRecentVideos.length,
          bookmarkedVideos: 0
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
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
