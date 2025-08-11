const SpeakerModel = require('../models/speakerModel');

const SpeakerController = {
  async getDashboard(req, res) {
    try {
      const userId = req.user.id;
      const speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
      if (!speakerId) {
        return res.status(404).json({ error: 'Speaker profile not found' });
      }
      const [stats, recent] = await Promise.all([
        SpeakerModel.getStatsForSpeaker(speakerId),
        SpeakerModel.getRecentForSpeaker(speakerId, 5),
      ]);
      res.json({
        speaker: { id: speakerId, email: req.user.email, role: req.user.role },
        stats,
        recentVideos: recent,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch speaker dashboard' });
    }
  },
        stats: {
          totalVideos: 8,
          approvedVideos: 5,
          pendingVideos: 3,
          totalViews: 1245,
          totalLikes: 89,
          totalBookmarks: 24
        },
        recentVideos: [
          {
            id: 1,
            title: "Introduction to Leadership",
            status: "approved",
            uploadedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            views: 156
          },
          {
            id: 2,
            title: "Effective Communication Skills",
            status: "pending",
            uploadedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            views: 0
          }
        ],
        analytics: {
          weeklyViews: [45, 78, 123, 89, 156, 134, 98],
          topCategories: ["Leadership", "Communication", "Technology"]
        }
      };
      
      res.json(dashboardData);
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
// whitespace redeploy Mon Aug 11 16:15:27 EDT 2025
