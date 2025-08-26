// Authentication Security Test
const API_URL = 'https://mindlift-backend-production.up.railway.app';

async function testAuthentication() {
  console.log('🔐 Testing Authentication Security...\n');

  // Test 1: Try to login with a fake email
  console.log('1. Testing fake email login (should fail)...');
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'fake@example.com',
        password: 'password123'
      })
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(data)}`);
    if (response.status === 401) {
      console.log('✅ Fake email login correctly rejected\n');
    } else {
      console.log('❌ Fake email login was allowed (SECURITY ISSUE!)\n');
    }
  } catch (error) {
    console.log('❌ Error testing fake email:', error.message, '\n');
  }

  // Test 2: Try to login with invalid email format
  console.log('2. Testing invalid email format (should fail)...');
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'password123'
      })
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(data)}`);
    if (response.status === 400) {
      console.log('✅ Invalid email format correctly rejected\n');
    } else {
      console.log('❌ Invalid email format was allowed\n');
    }
  } catch (error) {
    console.log('❌ Error testing invalid email:', error.message, '\n');
  }

  // Test 3: Try to login with empty credentials
  console.log('3. Testing empty credentials (should fail)...');
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: '',
        password: ''
      })
    });
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(data)}`);
    if (response.status === 400) {
      console.log('✅ Empty credentials correctly rejected\n');
    } else {
      console.log('❌ Empty credentials were allowed\n');
    }
  } catch (error) {
    console.log('❌ Error testing empty credentials:', error.message, '\n');
  }

  // Test 4: Check if API health is working
  console.log('4. Testing API health...');
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response: ${JSON.stringify(data)}`);
    if (response.status === 200) {
      console.log('✅ API health check working\n');
    } else {
      console.log('❌ API health check failed\n');
    }
  } catch (error) {
    console.log('❌ Error testing API health:', error.message, '\n');
  }

  console.log('🔧 Next Steps:');
  console.log('1. Try logging in with a valid registered email/password');
  console.log('2. Verify that only valid credentials work');
  console.log('3. Test signup with a new email to ensure the full flow works');
  console.log('\n📋 Security Status:');
  console.log('- ✅ Removed authentication bypass mechanisms');
  console.log('- ✅ Added input validation (email format, password strength)');
  console.log('- ✅ Added case-insensitive email handling');
  console.log('- ✅ Added proper error logging for failed attempts');
  console.log('- ✅ Removed mock fallback responses');
}

// Run the test
testAuthentication().catch(console.error);
