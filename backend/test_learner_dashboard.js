require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcrypt');

// Check if environment variables are loaded correctly
console.log('Environment check:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS ? '[HIDDEN]' : 'NOT SET');

const pool = require('./src/config/db');

async function createTestSubscriber() {
  try {
    // Check if subscriber already exists
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', ['subscriber@example.com']);
    
    if (existing.rows.length > 0) {
      console.log('Subscriber user already exists:', existing.rows[0]);
      return existing.rows[0];
    }

    // Create new subscriber user
    const hashedPassword = await bcrypt.hash('12345', 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, is_paid) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
      ['Test Subscriber', 'subscriber@example.com', hashedPassword, 'subscriber', true]
    );
    
    console.log('Created subscriber user:', result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.error('Error creating subscriber user:', err);
  }
}

async function testLearnerDashboard() {
  try {
    const user = await createTestSubscriber();
    
    // Test the bookmark stats query
    const BookmarkModel = require('./src/models/bookmarkModel');
    const stats = await BookmarkModel.getUserBookmarkStats(user.id);
    console.log('Bookmark stats:', stats);
    
    const recentBookmarks = await BookmarkModel.getRecentBookmarks(user.id);
    console.log('Recent bookmarks:', recentBookmarks);
    
    const categoryBreakdown = await BookmarkModel.getCategoryBreakdown(user.id);
    console.log('Category breakdown:', categoryBreakdown);
    
    process.exit(0);
  } catch (err) {
    console.error('Error testing learner dashboard:', err);
    process.exit(1);
  }
}

testLearnerDashboard();
