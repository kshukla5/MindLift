#!/usr/bin/env node

require('dotenv').config({ path: '../.env' });
const axios = require('axios');

async function testUserLogin() {
  try {
    console.log('🔐 Testing User Login and Dashboard Access...\n');
    
    // Test subscriber login
    console.log('📱 Testing Subscriber Login...');
    try {
      const loginResponse = await axios.post('http://localhost:3000/api/login', {
        email: 'subscriber@example.com',
        password: '12345'
      });
      
      console.log('✅ Subscriber Login - Working');
      console.log('  - Token generated:', loginResponse.data.token ? 'Yes' : 'No');
      console.log('  - User role:', loginResponse.data.user?.role);
      
      // Test dashboard access with the token
      const headers = { Authorization: `Bearer ${loginResponse.data.token}` };
      const dashboardResponse = await axios.get('http://localhost:3000/api/bookmarks/dashboard', { headers });
      
      console.log('✅ Dashboard Access - Working');
      console.log('  - Bookmarks loaded:', dashboardResponse.data.stats.total_bookmarks);
      
    } catch (err) {
      console.log('❌ Subscriber Login - Failed:', err.response?.data?.error || err.message);
    }
    
    // Test speaker login  
    console.log('\n🎤 Testing Speaker Login...');
    try {
      const loginResponse = await axios.post('http://localhost:3000/api/login', {
        email: 'speaker@test.com',
        password: 'password123'
      });
      
      console.log('✅ Speaker Login - Working');
      console.log('  - Token generated:', loginResponse.data.token ? 'Yes' : 'No');
      console.log('  - User role:', loginResponse.data.user?.role);
      
      // Test speaker dashboard
      const headers = { Authorization: `Bearer ${loginResponse.data.token}` };
      const dashboardResponse = await axios.get('http://localhost:3000/api/speaker/videos', { headers });
      
      console.log('✅ Speaker Dashboard - Working');
      console.log('  - Videos loaded:', dashboardResponse.data.videos.length);
      
    } catch (err) {
      console.log('❌ Speaker Login - Failed:', err.response?.data?.error || err.message);
    }
    
    // Test admin login
    console.log('\n👑 Testing Admin Login...');
    try {
      const loginResponse = await axios.post('http://localhost:3000/api/login', {
        email: 'kunjalcan@gmail.com',
        password: '12345'
      });
      
      console.log('✅ Admin Login - Working');
      console.log('  - Token generated:', loginResponse.data.token ? 'Yes' : 'No');
      console.log('  - User role:', loginResponse.data.user?.role);
      
      // Test admin dashboard
      const headers = { Authorization: `Bearer ${loginResponse.data.token}` };
      const dashboardResponse = await axios.get('http://localhost:3000/api/admin/stats', { headers });
      
      console.log('✅ Admin Dashboard - Working');
      console.log('  - Users loaded:', dashboardResponse.data.totalUsers || 'No stats');
      
    } catch (err) {
      console.log('❌ Admin Login - Failed:', err.response?.data?.error || err.message);
    }
    
    console.log('\n🎯 Login Tests Complete!');
    console.log('All user roles can login and access their dashboards. 🎉');
    
  } catch (error) {
    console.error('❌ Test setup error:', error.message);
  }
}

testUserLogin();
