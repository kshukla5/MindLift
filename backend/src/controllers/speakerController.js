const SpeakerModel = require('../models/speakerModel');
// Whitespace change for redeploy

const SpeakerController = {
  async list(req, res) {
    try {
      const speakers = await SpeakerModel.getAllSpeakers();
      res.json(speakers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch speakers' });
    }
  },

  async getDashboard(req, res) {
    try {
      console.log('getDashboard called for user:', req.user.id, req.user.email);
      const userId = req.user.id;

      let speakerId = null;
      try {
        speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
        if (!speakerId) {
          console.log('No speaker profile found, creating one...');
          speakerId = await SpeakerModel.ensureSpeakerRow(userId);
        }
      } catch (e) {
        console.warn('Speaker profile lookup/creation failed, continuing with safe defaults:', e.message);
      }

      let stats = { totalVideos: 0, approvedVideos: 0, pendingVideos: 0, totalViews: 0 };
      let recent = [];
      if (speakerId) {
        try {
          const [statsRow, recentRows] = await Promise.all([
            SpeakerModel.getSpeakerStats(speakerId),
            SpeakerModel.getRecentForSpeaker(speakerId, 5),
          ]);
          stats = {
            totalVideos: Number(statsRow?.total_videos || 0),
            approvedVideos: Number(statsRow?.approved_videos || 0),
            pendingVideos: Number(statsRow?.pending_videos || 0),
            totalViews: 0,
          };
          recent = recentRows || [];
        } catch (e) {
          console.warn('Stats/recent fetch failed, returning safe defaults:', e.message);
        }
      }

      const response = {
        speaker: { id: speakerId, email: req.user.email, role: req.user.role },
        stats,
        recentVideos: recent,
      };
      res.json(response);
    } catch (err) {
      console.error('Speaker dashboard error (outer):', err);
      // Never fail hard; return safe defaults so UI loads
      res.json({
        speaker: { id: null, email: req.user.email, role: req.user.role },
        stats: { totalVideos: 0, approvedVideos: 0, pendingVideos: 0, totalViews: 0 },
        recentVideos: [],
      });
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
