const BookmarkModel = require('../models/bookmarkModel');

const BookmarkController = {
  async list(req, res) {
    try {
      const bookmarks = await BookmarkModel.getBookmarksByUser(req.user.id);
      res.json(bookmarks);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
  },

  async add(req, res) {
    try {
      const { videoId } = req.body;
      if (!videoId) {
        return res.status(400).json({ error: 'videoId is required' });
      }
      await BookmarkModel.addBookmark(req.user.id, videoId);
      res.status(201).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add bookmark' });
    }
  },

  async remove(req, res) {
    try {
      const { videoId } = req.params;
      await BookmarkModel.removeBookmark(req.user.id, videoId);
      res.status(204).end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to remove bookmark' });
    }
  },
};

module.exports = BookmarkController;
