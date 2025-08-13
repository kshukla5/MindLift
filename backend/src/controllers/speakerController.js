const SpeakerModel = require('../models/speakerModel');

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
      const userId = req.user.id;
      const speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
      if (!speakerId) {
        return res.status(404).json({ error: 'Speaker profile not found' });
      }

      const [statsRow, recent] = await Promise.all([
        SpeakerModel.getSpeakerStats(speakerId),
        SpeakerModel.getRecentForSpeaker(speakerId, 5),
      ]);

      const stats = {
        totalVideos: Number(statsRow.total_videos || 0),
        approvedVideos: Number(statsRow.approved_videos || 0),
        pendingVideos: Number(statsRow.pending_videos || 0),
        totalViews: 0,
      };

      res.json({
        speaker: { id: speakerId, email: req.user.email, role: req.user.role },
        stats,
        recentVideos: recent,
      });
    } catch (err) {
      console.error('Speaker dashboard error:', err);
      res.status(500).json({ error: 'Failed to fetch speaker dashboard data' });
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
      const { name, bio, expertise } = req.body;
      const userId = req.user.id;

      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const speaker = await SpeakerModel.createSpeaker({
        name,
        bio: bio || '',
        expertise: expertise || '',
        userId,
      });

      res.status(201).json(speaker);
    } catch (err) {
      console.error('Speaker creation error:', err);
      res.status(500).json({ error: 'Failed to create speaker profile' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, bio, expertise } = req.body;

      const speaker = await SpeakerModel.getSpeakerById(id);
      if (!speaker) {
        return res.status(404).json({ error: 'Speaker not found' });
      }

      if (speaker.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updated = await SpeakerModel.updateSpeaker(id, { name, bio, expertise });
      res.json(updated);
    } catch (err) {
      console.error('Speaker update error:', err);
      res.status(500).json({ error: 'Failed to update speaker profile' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const speaker = await SpeakerModel.getSpeakerById(id);
      
      if (!speaker) {
        return res.status(404).json({ error: 'Speaker not found' });
      }

      if (speaker.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
      }

      await SpeakerModel.deleteSpeaker(id);
      res.json({ message: 'Speaker profile deleted successfully' });
    } catch (err) {
      console.error('Speaker deletion error:', err);
      res.status(500).json({ error: 'Failed to delete speaker profile' });
    }
  },
};

module.exports = SpeakerController;
