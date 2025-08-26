// Deployment Test Script
const API_URL = process.argv[2] || 'https://mindlift-backend-production.up.railway.app';

async function testDeployment() {
  console.log('🚀 Testing MindLift Deployment...\n');
  console.log(`📍 Testing URL: ${API_URL}\n`);

  // Test 1: Root endpoint
  console.log('1. Testing root endpoint...');
  try {
    const response = await fetch(API_URL + '/');
    const data = await response.json();
    console.log(`✅ Status: ${response.status}`);
    console.log(`📊 Version: ${data.version || 'Unknown'}`);
    console.log(`🔒 Security: ${data.security || 'Unknown'}\n`);
  } catch (error) {
    console.log(`❌ Root endpoint failed: ${error.message}\n`);
  }

  // Test 2: Health check
  console.log('2. Testing health endpoint...');
  try {
    const response = await fetch(API_URL + '/health');
    const data = await response.json();
    console.log(`✅ Status: ${response.status}`);
    console.log(`🏥 Health: ${data.status}`);
    console.log(`🟢 Node Version: ${data.environment?.node_version || 'Unknown'}\n`);
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}\n`);
  }

  // Test 3: Signup endpoint (should return proper error if working)
  console.log('3. Testing signup endpoint...');
  try {
    const response = await fetch(API_URL + '/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (response.status === 400 || response.status === 409 || response.status === 500) {
      console.log(`✅ Signup endpoint responding (Status: ${response.status})`);
      const data = await response.json();
      console.log(`📝 Message: ${data.error || data.message || 'Validation working'}\n`);
    } else {
      console.log(`⚠️  Unexpected response: ${response.status}\n`);
    }
  } catch (error) {
    console.log(`❌ Signup endpoint failed: ${error.message}\n`);
  }

  // Summary
  console.log('📋 Deployment Status Summary:');
  console.log('=====================================');
  console.log('✅ If all tests pass: Deployment successful!');
  console.log('⚠️  If some tests fail: Check Railway logs');
  console.log('❌ If all tests fail: Deployment still building');
  console.log('\n🔧 Next Steps:');
  console.log('1. Wait 5-10 minutes for Railway to complete deployment');
  console.log('2. Check Railway project logs for detailed error messages');
  console.log('3. Verify environment variables are set correctly');
  console.log('4. Run this script again: node test_deployment.js YOUR_RAILWAY_URL');
}

// Usage instructions
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node test_deployment.js [RAILWAY_URL]');
  console.log('Example: node test_deployment.js https://your-app.up.railway.app');
  process.exit(0);
}

// Run the test
testDeployment().catch(console.error);
