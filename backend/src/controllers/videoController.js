const VideoModel = require('../models/videoModel');
const path = require('path');

class VideoController {
  async list(req, res) {
    try {
      // For now, return mock data until database is properly configured
      const videos = [
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
      // Mock speaker videos for testing
      const videos = [
        {
          id: 1,
          title: "My First Video",
          description: "Getting started with video creation",
          category: "Tutorial",
          url: "https://www.youtube.com/watch?v=example1",
          approved: true,
          created_at: new Date().toISOString()
        }
      ];
      
      const stats = {
        totalVideos: 5,
        approvedVideos: 4,
        pendingVideos: 1,
        totalViews: 120
      };
      
      res.json({ success: true, videos, stats });
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
      // Mock learner dashboard for testing
      const recentVideos = [
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
      
      const bookmarkedVideos = [];
      
      res.json({ 
        success: true, 
        recentVideos,
        bookmarkedVideos,
        stats: {
          totalVideos: recentVideos.length,
          bookmarkedVideos: bookmarkedVideos.length
        }
      });
    } catch (error) {
      console.error('Error getting learner dashboard:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new VideoController();
