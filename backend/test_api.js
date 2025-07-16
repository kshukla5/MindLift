require('dotenv').config({ path: '../.env' });
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testLearnerDashboardAPI() {
  try {
    // Create a test JWT token for the subscriber user
    const token = jwt.sign(
      { id: 15, email: 'subscriber@example.com', role: 'subscriber' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('Generated token:', token);
    
    // Call the API endpoint
    const response = await axios.get('http://localhost:3001/api/learner/dashboard', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API Response:', response.data);
    
  } catch (err) {
    console.error('Error testing API:', err.response?.data || err.message);
  }
}

testLearnerDashboardAPI();
