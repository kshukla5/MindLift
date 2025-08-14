const BookmarkModel = require('../models/bookmarkModel');

const BookmarkController = {
  async getLearnerDashboard(req, res) {
    try {
      // Mock bookmark dashboard data
      const dashboard = {
        stats: {
          totalBookmarks: 12,
          categoriesBookmarked: 5,
          totalWatchTime: 240, // minutes
          lastBookmarkDate: "2024-01-20T10:00:00Z"
        },
        recentBookmarks: [
          {
            id: 1,
            videoId: 1,
            title: "Introduction to React Hooks",
            speaker: "John Doe",
            category: "React",
            bookmarkedAt: "2024-01-20T09:30:00Z",
            thumbnail: "/api/placeholder/200/120"
          },
          {
            id: 2,
            videoId: 2,
            title: "Advanced JavaScript Patterns",
            speaker: "Jane Smith", 
            category: "JavaScript",
            bookmarkedAt: "2024-01-19T14:15:00Z",
            thumbnail: "/api/placeholder/200/120"
          }
        ],
        categoryBreakdown: [
          { category: "React", count: 4, percentage: 33 },
          { category: "JavaScript", count: 3, percentage: 25 },
          { category: "Python", count: 3, percentage: 25 },
          { category: "Node.js", count: 2, percentage: 17 }
        ]
      };
      
      res.json(dashboard);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch learner dashboard data' });
    }
  },

  async addBookmark(req, res) {
    try {
      const { videoId } = req.body;
      const userId = req.user.userId || req.user.id;
      const bookmark = await BookmarkModel.addBookmark(userId, videoId);
      res.json({ message: 'Bookmark added successfully', bookmark });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add bookmark' });
    }
  },

  async removeBookmark(req, res) {
    try {
      const { videoId } = req.params;
      const userId = req.user.userId || req.user.id;
      await BookmarkModel.removeBookmark(userId, videoId);
      res.json({ message: 'Bookmark removed successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to remove bookmark' });
    }
  },

  async getUserBookmarks(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const bookmarks = await BookmarkModel.getBookmarksByUser(userId);
      res.json(bookmarks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
  },

  // Legacy methods for backward compatibility
  async list(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      const bookmarks = await BookmarkModel.getBookmarksByUser(userId);
      res.json(bookmarks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
  },

  async add(req, res) {
    try {
      const { videoId } = req.body;
      const userId = req.user.userId || req.user.id;
      const bookmark = await BookmarkModel.addBookmark(userId, videoId);
      res.json({ message: 'Bookmark added successfully', bookmark });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add bookmark' });
    }
  },

  async remove(req, res) {
    try {
      const { videoId } = req.params;
      const userId = req.user.userId || req.user.id;
      await BookmarkModel.removeBookmark(userId, videoId);
      res.json({ message: 'Bookmark removed successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to remove bookmark' });
    }
  },
};

module.exports = BookmarkController;
