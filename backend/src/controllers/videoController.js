const VideoModel = require('../models/videoModel');
const path = require('path');

class VideoController {
  async list(req, res) {
    try {
      const { category, limit = 10, offset = 0 } = req.query;
      
      // If there's no database, return mock data
      const videos = await VideoModel.findAll({
        category,
        approved: true,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }).catch(() => [
        {
          id: 1,
          title: "Sample Video - Introduction to React",
          description: "Learn the basics of React development",
          category: "Technology",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          file_path: null,
          approved: true,
          created_at: new Date().toISOString(),
          speaker_id: 1
        }
      ]);
      
      res.json({ success: true, videos });
    } catch (error) {
      console.error('Error listing videos:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async listUnapproved(req, res) {
    try {
      const videos = await VideoModel.findAll({ approved: false });
      res.json({ success: true, videos });
    } catch (error) {
      console.error('Error listing unapproved videos:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const video = await VideoModel.findById(id);
      if (!video) {
        return res.status(404).json({ success: false, error: 'Video not found' });
      }
      res.json({ success: true, video });
    } catch (error) {
      console.error('Error getting video:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async create(req, res) {
    try {
      const { title, description, category, url } = req.body;
      const userId = req.user.id;

      let videoData = {
        title,
        description,
        category,
        speaker_id: userId,
        approved: false
      };

      if (req.file) {
        videoData.file_path = `/uploads/${req.file.filename}`;
      } else if (url) {
        videoData.url = url;
      } else {
        return res.status(400).json({ success: false, error: 'Video file or URL is required' });
      }

      const video = await VideoModel.create(videoData);
      res.status(201).json({ success: true, video, message: 'Video uploaded successfully and pending approval' });
    } catch (error) {
      console.error('Error creating video:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, category } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      const video = await VideoModel.findById(id);
      if (!video) {
        return res.status(404).json({ success: false, error: 'Video not found' });
      }

      // Check if user owns the video or is admin
      if (video.speaker_id !== userId && userRole !== 'admin') {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }

      const updatedVideo = await VideoModel.update(id, { title, description, category });
      res.json({ success: true, video: updatedVideo, message: 'Video updated successfully' });
    } catch (error) {
      console.error('Error updating video:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateApproval(req, res) {
    try {
      const { id } = req.params;
      const { approved } = req.body;

      const video = await VideoModel.updateApproval(id, approved);
      if (!video) {
        return res.status(404).json({ success: false, error: 'Video not found' });
      }

      const message = approved ? 'Video approved successfully' : 'Video rejected';
      res.json({ success: true, video, message });
    } catch (error) {
      console.error('Error updating video approval:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async remove(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const video = await VideoModel.findById(id);
      if (!video) {
        return res.status(404).json({ success: false, error: 'Video not found' });
      }

      // Check if user owns the video or is admin
      if (video.speaker_id !== userId && userRole !== 'admin') {
        return res.status(403).json({ success: false, error: 'Access denied' });
      }

      await VideoModel.delete(id);
      res.json({ success: true, message: 'Video deleted successfully' });
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getSpeakerVideos(req, res) {
    try {
      const userId = req.user.id;
      const videos = await VideoModel.findBySpeakerId(userId).catch(() => []);
      const stats = await VideoModel.getSpeakerStats(userId).catch(() => ({
        totalVideos: 0,
        approvedVideos: 0,
        pendingVideos: 0,
        totalViews: 0
      }));
      
      res.json({ 
        success: true, 
        videos,
        stats: {
          totalVideos: stats.total_videos || 0,
          approvedVideos: stats.approved_videos || 0,
          pendingVideos: stats.pending_videos || 0,
          totalViews: stats.total_views || 0
        }
      });
    } catch (error) {
      console.error('Error getting speaker videos:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getSpeakerStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await VideoModel.getSpeakerStats(userId);
      
      res.json({ 
        success: true, 
        stats: {
          totalVideos: stats.total_videos || 0,
          approvedVideos: stats.approved_videos || 0,
          pendingVideos: stats.pending_videos || 0,
          totalViews: stats.total_views || 0
        }
      });
    } catch (error) {
      console.error('Error getting speaker stats:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getLearnerDashboard(req, res) {
    try {
      const userId = req.user.id;
      
      // Get recent videos with fallback
      const recentVideos = await VideoModel.findAll({ 
        approved: true, 
        limit: 6, 
        offset: 0 
      }).catch(() => [
        {
          id: 1,
          title: "Welcome to MindLift",
          description: "Getting started with our learning platform",
          category: "Introduction",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          approved: true,
          created_at: new Date().toISOString()
        }
      ]);
      
      // Get user's bookmarked videos with fallback
      let bookmarks = [];
      try {
        const BookmarkModel = require('../models/bookmarkModel');
        bookmarks = await BookmarkModel.findByUserId(userId);
      } catch (error) {
        console.warn('Bookmarks not available:', error.message);
        bookmarks = [];
      }
      
      res.json({ 
        success: true, 
        recentVideos,
        bookmarkedVideos: bookmarks || [],
        stats: {
          totalVideos: recentVideos.length,
          bookmarkedVideos: bookmarks ? bookmarks.length : 0
        }
      });
    } catch (error) {
      console.error('Error getting learner dashboard:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new VideoController();
