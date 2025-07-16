#!/usr/bin/env node

require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const jwt = require('jsonwebtoken');

async function testFrontendAPIs() {
  try {
    console.log('Testing frontend API endpoints...');
    
    // Generate a fresh token for the test subscriber
    const token = jwt.sign(
      { userId: 15, role: 'subscriber' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    console.log('Generated token:', token);
    
    // Test through React's proxy (frontend port)
    const headers = { Authorization: `Bearer ${token}` };
    
    console.log('\nTesting /api/bookmarks/dashboard through frontend proxy...');
    try {
      const bookmarkResponse = await axios.get('http://localhost:3000/api/bookmarks/dashboard', { headers });
      console.log('Bookmark Dashboard Response:', JSON.stringify(bookmarkResponse.data, null, 2));
    } catch (err) {
      console.error('Bookmark Dashboard Error:', err.response?.data || err.message);
    }
    
    console.log('\nTesting /api/learner/dashboard through frontend proxy...');
    try {
      const learnerResponse = await axios.get('http://localhost:3000/api/learner/dashboard', { headers });
      console.log('Learner Dashboard Response:', JSON.stringify(learnerResponse.data, null, 2));
    } catch (err) {
      console.error('Learner Dashboard Error:', err.response?.data || err.message);
    }
    
    console.log('\nTesting /api/videos through frontend proxy...');
    try {
      const videosResponse = await axios.get('http://localhost:3000/api/videos', { headers });
      console.log('Videos Response:', JSON.stringify(videosResponse.data, null, 2));
    } catch (err) {
      console.error('Videos Error:', err.response?.data || err.message);
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testFrontendAPIs();
