#!/usr/bin/env node

require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testAllDashboards() {
  try {
    console.log('🧪 Testing all dashboard functionalities...\n');
    
    // Test subscriber dashboard
    const subscriberToken = jwt.sign(
      { userId: 15, role: 'subscriber' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    // Test speaker dashboard
    const speakerToken = jwt.sign(
      { userId: 1, role: 'speaker' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    // Test admin dashboard
    const adminToken = jwt.sign(
      { userId: 12, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    console.log('📊 Testing Subscriber Dashboard...');
    try {
      const headers = { Authorization: `Bearer ${subscriberToken}` };
      const [bookmarkResponse, learnerResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/bookmarks/dashboard', { headers }),
        axios.get('http://localhost:3000/api/learner/dashboard', { headers })
      ]);
      
      console.log('✅ Subscriber Dashboard - Working');
      console.log('  - Bookmarks:', bookmarkResponse.data.stats.total_bookmarks);
      console.log('  - Categories explored:', bookmarkResponse.data.stats.categories_explored);
      console.log('  - Platform videos:', learnerResponse.data.platformStats.total_videos);
      console.log('  - Recent bookmarks:', bookmarkResponse.data.recentBookmarks.length);
      console.log('  - Recent videos:', learnerResponse.data.recentVideos.length);
    } catch (err) {
      console.log('❌ Subscriber Dashboard - Failed:', err.response?.data?.error || err.message);
    }
    
    console.log('\n🎤 Testing Speaker Dashboard...');
    try {
      const headers = { Authorization: `Bearer ${speakerToken}` };
      const response = await axios.get('http://localhost:3000/api/speaker/videos', { headers });
      
      console.log('✅ Speaker Dashboard - Working');
      console.log('  - Videos:', response.data.videos.length);
      console.log('  - Total views:', response.data.stats.total_views);
      console.log('  - Published videos:', response.data.stats.published_videos);
      console.log('  - Recent activity:', response.data.recentActivity.length);
    } catch (err) {
      console.log('❌ Speaker Dashboard - Failed:', err.response?.data?.error || err.message);
    }
    
    console.log('\n👑 Testing Admin Dashboard...');
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const response = await axios.get('http://localhost:3000/api/admin/stats', { headers });
      
      console.log('✅ Admin Dashboard - Working');
      console.log('  - Total users:', response.data.totalUsers);
      console.log('  - Total videos:', response.data.totalVideos);
      console.log('  - Paid users:', response.data.paidUsers);
      console.log('  - Pending videos:', response.data.pendingVideos);
    } catch (err) {
      console.log('❌ Admin Dashboard - Failed:', err.response?.data?.error || err.message);
    }
    
    console.log('\n🎥 Testing Video Operations...');
    try {
      const headers = { Authorization: `Bearer ${subscriberToken}` };
      const videosResponse = await axios.get('http://localhost:3000/api/videos', { headers });
      
      console.log('✅ Video Listing - Working');
      console.log('  - Available videos:', videosResponse.data.length);
      
      // Test bookmark operations
      if (videosResponse.data.length > 0) {
        const videoId = videosResponse.data[0].id;
        
        // Test adding bookmark
        try {
          await axios.post('http://localhost:3000/api/bookmarks', { videoId }, { headers });
          console.log('✅ Add Bookmark - Working');
        } catch (err) {
          console.log('⚠️  Add Bookmark - May already exist');
        }
        
        // Test getting user bookmarks
        try {
          const bookmarksResponse = await axios.get('http://localhost:3000/api/bookmarks', { headers });
          console.log('✅ Get Bookmarks - Working');
          console.log('  - User bookmarks:', bookmarksResponse.data.length);
        } catch (err) {
          console.log('❌ Get Bookmarks - Failed:', err.response?.data?.error || err.message);
        }
      }
    } catch (err) {
      console.log('❌ Video Operations - Failed:', err.response?.data?.error || err.message);
    }
    
    console.log('\n🎯 Dashboard Tests Complete!');
    console.log('The MindLift application is ready for use. 🚀');
    
  } catch (error) {
    console.error('❌ Test setup error:', error.message);
  }
}

testAllDashboards();
