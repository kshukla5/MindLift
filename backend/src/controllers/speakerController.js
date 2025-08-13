const SpeakerModel = require('../models/speakerModel');

const SpeakerController = {
  async list(req, res) {
    try {
      const speakers = await SpeakerModel.getAllSpeakers();
      res.json(speakers);
    } catch (err) {
      console.error('SpeakerController.list error:', err);
      res.status(500).json({ error: 'Failed to fetch speakers', details: err.message });
    }
  },

  async getDashboard(req, res) {
    try {
      console.log('SpeakerController.getDashboard called for user:', req.user?.id);
      
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const userId = req.user.id;
      console.log('Fetching dashboard for userId:', userId);
      
      const speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
      console.log('Speaker ID found:', speakerId);
      
      if (!speakerId) {
        console.log('No speaker profile found, creating one...');
        
        // Create speaker profile if it doesn't exist
        const newSpeakerId = await SpeakerModel.ensureSpeakerRow(userId);
        console.log('Created speaker profile with ID:', newSpeakerId);
        
        if (!newSpeakerId) {
          return res.status(500).json({ error: 'Failed to create speaker profile' });
        }
        
        // Return default stats for new speaker
        return res.json({
          speaker: { id: newSpeakerId, email: req.user.email, role: req.user.role },
          stats: {
            totalVideos: 0,
            approvedVideos: 0,
            pendingVideos: 0,
            totalViews: 0,
          },
          recentVideos: [],
        });
      }

      console.log('Fetching stats and recent videos...');
      
      const [statsRow, recent] = await Promise.all([
        SpeakerModel.getSpeakerStats(speakerId),
        SpeakerModel.getRecentForSpeaker(speakerId, 5),
      ]);

      console.log('Stats fetched:', statsRow);
      console.log('Recent videos count:', recent?.length || 0);

      const stats = {
        totalVideos: Number(statsRow?.total_videos || 0),
        approvedVideos: Number(statsRow?.approved_videos || 0),
        pendingVideos: Number(statsRow?.pending_videos || 0),
        totalViews: 0,
      };

      res.json({
        speaker: { id: speakerId, email: req.user.email, role: req.user.role },
        stats,
        recentVideos: recent || [],
      });
    } catch (err) {
      console.error('SpeakerController.getDashboard error:', err);
      console.error('Error stack:', err.stack);
      res.status(500).json({ 
        error: 'Failed to fetch speaker dashboard data', 
        details: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
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
      console.error('SpeakerController.getById error:', err);
      res.status(500).json({ error: 'Failed to fetch speaker', details: err.message });
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
      console.error('SpeakerController.create error:', err);
      res.status(500).json({ error: 'Failed to create speaker profile', details: err.message });
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
      console.error('SpeakerController.update error:', err);
      res.status(500).json({ error: 'Failed to update speaker profile', details: err.message });
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
      console.error('SpeakerController.remove error:', err);
      res.status(500).json({ error: 'Failed to delete speaker profile', details: err.message });
    }
  },
};

module.exports = SpeakerController;
