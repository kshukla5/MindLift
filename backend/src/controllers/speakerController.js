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
      console.log('getDashboard called for user:', req.user.id, req.user.email, req.user.role);
      const userId = req.user.id;

      // Ensure user has speaker role before proceeding
      if (req.user.role !== 'speaker') {
        return res.status(403).json({
          error: 'Access denied. Speaker role required.',
          speaker: null,
          stats: { totalVideos: 0, approvedVideos: 0, pendingVideos: 0, totalViews: 0, videos_this_week: 0, videos_this_month: 0 },
          recentVideos: [],
        });
      }

      let speakerId = null;
      try {
        speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
        if (!speakerId) {
          console.log('No speaker profile found, creating one for user:', userId);
          speakerId = await SpeakerModel.ensureSpeakerRow(userId);
          console.log('Created speaker profile with ID:', speakerId);
        }
      } catch (e) {
        console.error('Speaker profile lookup/creation failed:', e.message);
        return res.status(500).json({
          error: 'Failed to create speaker profile. Please try again.',
          speaker: null,
          stats: { totalVideos: 0, approvedVideos: 0, pendingVideos: 0, totalViews: 0, videos_this_week: 0, videos_this_month: 0 },
          recentVideos: [],
        });
      }

      console.log('Using speaker ID:', speakerId, 'for user:', userId);

      let stats = { totalVideos: 0, approvedVideos: 0, pendingVideos: 0, totalViews: 0, videos_this_week: 0, videos_this_month: 0 };
      let recent = [];
      if (speakerId) {
        try {
          const [statsRow, recentRows] = await Promise.all([
            SpeakerModel.getSpeakerStats(speakerId),
            SpeakerModel.getRecentForSpeaker(speakerId, 5),
          ]);

          console.log('Raw stats from DB:', statsRow);
          console.log('Recent videos from DB:', recentRows?.length || 0, 'videos');

          stats = {
            totalVideos: Number(statsRow?.total_videos || 0),
            approvedVideos: Number(statsRow?.approved_videos || 0),
            pendingVideos: Number(statsRow?.pending_videos || 0),
            totalViews: 0,
            videos_this_week: Number(statsRow?.videos_this_week || 0),
            videos_this_month: Number(statsRow?.videos_this_month || 0),
          };
          recent = recentRows || [];
        } catch (e) {
          console.error('Stats/recent fetch failed:', e.message, e.stack);
          // Continue with safe defaults
        }
      }

      const response = {
        speaker: { id: speakerId, email: req.user.email, role: req.user.role },
        stats,
        recentVideos: recent,
      };

      console.log('Sending dashboard response:', {
        speaker: response.speaker,
        stats: response.stats,
        recentCount: response.recentVideos.length
      });

      res.json(response);
    } catch (err) {
      console.error('Speaker dashboard error (outer):', err.message, err.stack);
      res.status(500).json({
        error: 'Failed to load dashboard data',
        speaker: null,
        stats: { totalVideos: 0, approvedVideos: 0, pendingVideos: 0, totalViews: 0, videos_this_week: 0, videos_this_month: 0 },
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

  // Debug endpoint for troubleshooting
  async debugSpeakerData(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const userEmail = req.user.email;

      const speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
      const speakerProfile = speakerId ? await SpeakerModel.getSpeakerById(speakerId) : null;

      let stats = null;
      let videos = [];
      let recentVideos = [];

      if (speakerId) {
        stats = await SpeakerModel.getSpeakerStats(speakerId);
        videos = await SpeakerModel.getRecentForSpeaker(speakerId, 10);
        recentVideos = videos;
      }

      res.json({
        debug: {
          userId,
          userRole,
          userEmail,
          speakerId,
          hasSpeakerProfile: !!speakerProfile,
          speakerProfile,
          stats,
          videoCount: videos.length,
          recentVideos: recentVideos.map(v => ({
            id: v.id,
            title: v.title,
            approved: v.approved,
            created_at: v.created_at
          }))
        }
      });
    } catch (err) {
      console.error('Debug endpoint error:', err);
      res.status(500).json({ error: err.message, stack: err.stack });
    }
  }
};

module.exports = SpeakerController;
