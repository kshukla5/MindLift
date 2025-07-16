const axios = require('axios');

async function testAdminFlow() {
  const API_URL = 'http://localhost:3001';
  
  console.log('Testing admin dashboard flow...\n');
  
  try {
    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    const loginResponse = await axios.post(`${API_URL}/api/login`, {
      email: 'kunjalcan@gmail.com',
      password: '12345'
    });
    
    const token = loginResponse.data.token;
    console.log('✓ Admin login successful');
    
    // Step 2: Fetch admin stats (this is what was failing)
    console.log('2. Fetching admin stats...');
    const statsResponse = await axios.get(`${API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✓ Admin stats fetched successfully:');
    console.log('  - Users by role:', statsResponse.data.usersByRole);
    console.log('  - Subscription stats:', statsResponse.data.subscriptionStats);
    console.log('  - Pending videos:', statsResponse.data.pendingVideos.length, 'videos');
    
    // Step 3: Test video approval (if there are pending videos)
    if (statsResponse.data.pendingVideos.length > 0) {
      const videoId = statsResponse.data.pendingVideos[0].id;
      console.log(`3. Testing video approval for video ID ${videoId}...`);
      
      const approvalResponse = await axios.patch(
        `${API_URL}/api/admin/videos/${videoId}/approval`,
        { approved: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('✓ Video approval successful:', approvalResponse.data);
    } else {
      console.log('3. No pending videos to approve');
    }
    
    console.log('\n✅ All admin dashboard tests passed!');
    
  } catch (error) {
    console.error('❌ Admin dashboard test failed:');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data?.error || error.message);
    
    if (error.response?.status === 401) {
      console.error('→ Authentication error - check admin credentials');
    } else if (error.response?.status === 403) {
      console.error('→ Authorization error - check admin role');
    } else if (error.response?.status === 500) {
      console.error('→ Server error - check backend logs');
    }
  }
}

testAdminFlow();
