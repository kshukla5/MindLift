const StatsModel = require('../models/statsModel');

const AdminController = {
  async getStats(req, res) {
    try {
      const [usersByRole, subscriptionStats, pendingVideos] = await Promise.all([
        StatsModel.getUserCountByRole(),
        StatsModel.getSubscriptionStats(),
        StatsModel.getPendingVideos(),
      ]);
      res.json({ usersByRole, subscriptionStats, pendingVideos });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch stats' });
    }
  },
};

module.exports = AdminController;
