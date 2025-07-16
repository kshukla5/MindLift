const BookmarkModel = require('../models/bookmarkModel');

const BookmarkController = {
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

  async getLearnerDashboard(req, res) {
    try {
      const userId = req.user.userId || req.user.id;
      
      const [bookmarkStats, recentBookmarks, categoryBreakdown] = await Promise.all([
        BookmarkModel.getUserBookmarkStats(userId),
        BookmarkModel.getRecentBookmarks(userId),
        BookmarkModel.getCategoryBreakdown(userId)
      ]);
      
      res.json({
        stats: bookmarkStats,
        recentBookmarks,
        categoryBreakdown
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch learner dashboard data' });
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
