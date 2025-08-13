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
      
      // Auto-create speaker profile if it doesn't exist
      let speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
      console.log('Found speaker ID:', speakerId);
      
      if (!speakerId) {
        console.log('No speaker profile found, creating one...');
        speakerId = await SpeakerModel.ensureSpeakerRow(userId);
        console.log('Created speaker ID:', speakerId);
      }

      if (!speakerId) {
        console.error('Failed to create/find speaker profile for user:', userId);
        return res.status(500).json({ error: 'Failed to create speaker profile' });
      }

      console.log('Fetching stats and recent videos for speaker:', speakerId);
      const [statsRow, recent] = await Promise.all([
        SpeakerModel.getSpeakerStats(speakerId),
        SpeakerModel.getRecentForSpeaker(speakerId, 5),
      ]);

      console.log('Stats row:', statsRow);
      console.log('Recent videos:', recent);

      const stats = {
        totalVideos: Number(statsRow.total_videos || 0),
        approvedVideos: Number(statsRow.approved_videos || 0),
        pendingVideos: Number(statsRow.pending_videos || 0),
        totalViews: 0,
      };

      const response = {
        speaker: { id: speakerId, email: req.user.email, role: req.user.role },
        stats,
        recentVideos: recent,
      };

      console.log('Sending dashboard response:', response);
      res.json(response);
    } catch (err) {
      console.error('Speaker dashboard error:', err);
      console.error('Stack trace:', err.stack);
      res.status(500).json({ error: 'Failed to fetch speaker dashboard data', details: err.message });
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
