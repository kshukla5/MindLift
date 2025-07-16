require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testBookmarkAPI() {
  try {
    // Create a test JWT token for the subscriber user
    const token = jwt.sign(
      { id: 15, email: 'subscriber@example.com', role: 'subscriber' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('Testing bookmark dashboard API...');
    
    // Call the bookmark API endpoint
    const response = await axios.get('http://localhost:3001/api/bookmarks/dashboard', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Bookmark API Response:', response.data);
    
  } catch (err) {
    console.error('Error testing bookmark API:', err.response?.data || err.message);
  }
}

testBookmarkAPI();
