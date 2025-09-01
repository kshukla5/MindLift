const StatsModel = require('../models/statsModel');
const SpeakerModel = require('../models/speakerModel');
const VideoModel = require('../models/videoModel');
const UserModel = require('../models/userModel');
const NotificationModel = require('../models/notificationModel');

const AdminController = {
  async getStats(req, res) {
    try {
      // Get real data from database
      const [usersByRole, subscriptionStats, pendingVideos] = await Promise.all([
        StatsModel.getUserCountByRole(),
        StatsModel.getSubscriptionStats(),
        StatsModel.getPendingVideos()
      ]);

      // Get additional stats
      const pendingSpeakers = await SpeakerModel.getPendingSpeakers();
      const allUsers = await UserModel.getAllUsers();
      const allVideos = await VideoModel.getAllVideos();

      const stats = {
        usersByRole: usersByRole.reduce((acc, row) => {
          acc[row.role] = parseInt(row.count);
          return acc;
        }, {}),
        subscriptionStats: {
          totalRevenue: 15750, // Mock for now
          monthlyRevenue: 2850, // Mock for now
          activeSubscriptions: subscriptionStats.find(s => s.status === 'paid')?.count || 0,
          churnRate: 5.2 // Mock for now
        },
        pendingVideos: pendingVideos.map(video => ({
          id: video.id,
          title: video.title,
          description: video.description,
          category: video.category,
          submittedAt: video.created_at,
          speaker: video.speaker_name || 'Unknown Speaker',
          speakerEmail: video.speaker_email
        })),
        pendingSpeakers: pendingSpeakers.map(speaker => ({
          id: speaker.id,
          name: speaker.full_name || speaker.name,
          email: speaker.email,
          bio: speaker.bio,
          areasOfExpertise: speaker.areas_of_expertise,
          country: speaker.country,
          submittedAt: speaker.created_at,
          profilePicture: speaker.profile_picture_url,
          introVideo: speaker.intro_video_url
        })),
        platformOverview: {
          totalUsers: allUsers.length,
          totalVideos: allVideos.length,
          approvedVideos: allVideos.filter(v => v.approved).length,
          pendingVideos: allVideos.filter(v => !v.approved).length,
          totalSpeakers: usersByRole.find(r => r.role === 'speaker')?.count || 0,
          pendingSpeakers: pendingSpeakers.length,
          totalRevenue: 15750 // Mock for now
        }
      };
      
      res.json(stats);
    } catch (err) {
      console.error('getStats error:', err);
      res.status(500).json({ error: 'Failed to fetch admin stats', details: err.message });
    }
  },

  // Approve speaker profile
  async approveSpeaker(req, res) {
    try {
      const { speakerId } = req.params;
      const { adminNotes } = req.body;

      const speaker = await SpeakerModel.getSpeakerById(speakerId);
      if (!speaker) {
        return res.status(404).json({ error: 'Speaker not found' });
      }

      await SpeakerModel.updateSpeakerApproval(speakerId, 'approved', adminNotes);

      // Notify speaker of approval
      await NotificationModel.notifySpeakerApproved(speaker.user_id, speakerId);

      res.json({
        success: true,
        message: 'Speaker approved successfully'
      });
    } catch (err) {
      console.error('approveSpeaker error:', err);
      res.status(500).json({ error: 'Failed to approve speaker', details: err.message });
    }
  },

  // Reject speaker profile
  async rejectSpeaker(req, res) {
    try {
      const { speakerId } = req.params;
      const { reason, adminNotes } = req.body;

      if (!reason) {
        return res.status(400).json({ error: 'Rejection reason is required' });
      }

      const speaker = await SpeakerModel.getSpeakerById(speakerId);
      if (!speaker) {
        return res.status(404).json({ error: 'Speaker not found' });
      }

      await SpeakerModel.updateSpeakerApproval(speakerId, 'rejected', adminNotes || reason);

      // Notify speaker of rejection
      await NotificationModel.notifySpeakerRejected(speaker.user_id, reason);

      res.json({
        success: true,
        message: 'Speaker rejected with feedback sent'
      });
    } catch (err) {
      console.error('rejectSpeaker error:', err);
      res.status(500).json({ error: 'Failed to reject speaker', details: err.message });
    }
  },

  // Approve video
  async approveVideo(req, res) {
    try {
      const { videoId } = req.params;
      const { adminNotes } = req.body;

      const video = await VideoModel.getVideoById(videoId);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      await VideoModel.updateVideoApproval(videoId, true, adminNotes);

      // Get speaker info to notify
      const speaker = await SpeakerModel.getSpeakerById(video.speaker_id);
      if (speaker) {
        await NotificationModel.notifyVideoApproved(speaker.user_id, videoId, video.title);
      }

      res.json({
        success: true,
        message: 'Video approved successfully'
      });
    } catch (err) {
      console.error('approveVideo error:', err);
      res.status(500).json({ error: 'Failed to approve video', details: err.message });
    }
  },

  // Reject video
  async rejectVideo(req, res) {
    try {
      const { videoId } = req.params;
      const { reason, adminNotes } = req.body;

      if (!reason) {
        return res.status(400).json({ error: 'Rejection reason is required' });
      }

      const video = await VideoModel.getVideoById(videoId);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }

      await VideoModel.updateVideoApproval(videoId, false, adminNotes || reason);

      // Get speaker info to notify
      const speaker = await SpeakerModel.getSpeakerById(video.speaker_id);
      if (speaker) {
        await NotificationModel.notifyVideoRejected(speaker.user_id, videoId, video.title, reason);
      }

      res.json({
        success: true,
        message: 'Video rejected with feedback sent'
      });
    } catch (err) {
      console.error('rejectVideo error:', err);
      res.status(500).json({ error: 'Failed to reject video', details: err.message });
    }
  }
};

module.exports = AdminController;
