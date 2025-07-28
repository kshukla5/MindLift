const SpeakerModel = require('../models/speakerModel');

const SpeakerController = {
  async getDashboard(req, res) {
    try {
      // Mock speaker dashboard data
      const dashboard = {
        videos: [
          {
            id: 1,
            title: "Introduction to React Hooks",
            description: "Learn the basics of React Hooks",
            status: "published",
            views: 1250,
            likes: 89,
            createdAt: "2024-01-15T10:00:00Z"
          },
          {
            id: 2,
            title: "Advanced JavaScript Patterns",
            description: "Deep dive into JavaScript design patterns",
            status: "published",
            views: 890,
            likes: 67,
            createdAt: "2024-01-10T14:30:00Z"
          }
        ],
        stats: {
          totalVideos: 2,
          totalViews: 2140,
          totalLikes: 156,
          averageRating: 4.7
        },
        recentActivity: [
          {
            type: "new_view",
            message: "Your video 'Introduction to React Hooks' received 50 new views",
            timestamp: "2024-01-20T09:15:00Z"
          },
          {
            type: "new_like",
            message: "Someone liked your video 'Advanced JavaScript Patterns'",
            timestamp: "2024-01-19T16:45:00Z"
          }
        ]
      };
      
      res.json(dashboard);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch speaker dashboard' });
    }
  },

  async list(req, res) {
    try {
      const speakers = await SpeakerModel.getAllSpeakers();
      res.json(speakers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch speakers' });
    }
  },

  async getById(req, res) {
    try {
      const speaker = await SpeakerModel.getSpeakerById(req.params.id);
      if (!speaker) {
        return res.status(404).json({ error: 'Speaker not found' });
      }
      res.json(speaker);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch speaker' });
    }
  },

  async create(req, res) {
    try {
      const { name, bio, photoUrl, socialLinks } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
      const speaker = await SpeakerModel.createSpeaker({ name, bio, photoUrl, socialLinks });
      res.status(201).json(speaker);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create speaker' });
    }
  },

  async update(req, res) {
    try {
      const { name, bio, photoUrl, socialLinks } = req.body;
      const speaker = await SpeakerModel.updateSpeaker(req.params.id, { name, bio, photoUrl, socialLinks });
      if (!speaker) {
        return res.status(404).json({ error: 'Speaker not found' });
      }
      res.json(speaker);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update speaker' });
    }
  },

  async remove(req, res) {
    try {
      await SpeakerModel.deleteSpeaker(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete speaker' });
    }
  },
};

module.exports = SpeakerController;
