const StatsModel = require('../models/statsModel');

const AdminController = {
  async getStats(req, res) {
    try {
      // Mock admin dashboard data
      const stats = {
        usersByRole: {
          admin: 2,
          speaker: 15,
          subscriber: 350,
          user: 150
        },
        subscriptionStats: {
          totalRevenue: 15750,
          monthlyRevenue: 2850,
          activeSubscriptions: 285,
          churnRate: 5.2
        },
        pendingVideos: [
          {
            id: 1,
            title: "New React Features 2024",
            speaker: "John Doe",
            submittedAt: "2024-01-20T08:00:00Z",
            category: "React",
            duration: "35 min"
          },
          {
            id: 2,
            title: "Python FastAPI Tutorial", 
            speaker: "Jane Smith",
            submittedAt: "2024-01-19T16:30:00Z",
            category: "Python", 
            duration: "50 min"
          }
        ],
        platformOverview: {
          totalUsers: 517,
          totalVideos: 150,
          totalSpeakers: 15,
          totalRevenue: 15750
        }
      };
      
      res.json(stats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
  },
};

module.exports = AdminController;
