require('dotenv').config({ path: '../.env' });
const pool = require('./src/config/db');

async function addTestBookmarks() {
  try {
    const userId = 15; // subscriber user ID
    const videos = [1, 2, 11, 12]; // some video IDs
    
    for (const videoId of videos) {
      await pool.query(
        'INSERT INTO bookmarks (user_id, video_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [userId, videoId]
      );
    }
    
    console.log('Added test bookmarks for user', userId);
    
    // Test the queries again
    const BookmarkModel = require('./src/models/bookmarkModel');
    const stats = await BookmarkModel.getUserBookmarkStats(userId);
    console.log('Updated bookmark stats:', stats);
    
    const recentBookmarks = await BookmarkModel.getRecentBookmarks(userId);
    console.log('Recent bookmarks:', recentBookmarks);
    
    const categoryBreakdown = await BookmarkModel.getCategoryBreakdown(userId);
    console.log('Category breakdown:', categoryBreakdown);
    
    process.exit(0);
  } catch (err) {
    console.error('Error adding test bookmarks:', err);
    process.exit(1);
  }
}

addTestBookmarks();
