// Debug script for speaker dashboard issues
const API_URL = 'https://mindlift-backend-production.up.railway.app';

async function debugSpeakerDashboard() {
  console.log('🔍 Speaker Dashboard Debug Tool\n');

  // Test 1: Check if API is reachable
  console.log('1. Testing API connectivity...');
  try {
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ API Health:', healthData);
  } catch (error) {
    console.log('❌ API Health Check Failed:', error.message);
    return;
  }

  // Test 2: Check database health
  console.log('\n2. Testing database connectivity...');
  try {
    const dbResponse = await fetch(`${API_URL}/health/db`);
    const dbData = await dbResponse.json();
    console.log('✅ Database Health:', dbData);
  } catch (error) {
    console.log('❌ Database Health Check Failed:', error.message);
  }

  // Test 3: Check if we can access speaker routes (will fail without auth)
  console.log('\n3. Testing speaker routes (should fail without auth)...');
  try {
    const speakerResponse = await fetch(`${API_URL}/api/speaker/dashboard`);
    console.log('Speaker Dashboard Response:', speakerResponse.status, speakerResponse.statusText);
  } catch (error) {
    console.log('❌ Speaker Dashboard Error:', error.message);
  }

  console.log('\n📋 Next Steps:');
  console.log('1. Log in as speaker@gmail.com');
  console.log('2. Get the JWT token from browser dev tools (localStorage)');
  console.log('3. Run the authenticated tests below with your token');

  console.log('\n🔧 To test with authentication, replace YOUR_JWT_TOKEN below:');
  console.log(`
  // Test speaker dashboard with auth
  fetch('${API_URL}/api/speaker/dashboard', {
    headers: { 'Authorization': 'Bearer YOUR_JWT_TOKEN' }
  }).then(r => r.json()).then(d => console.log('Dashboard:', d));

  // Test speaker debug endpoint
  fetch('${API_URL}/api/speaker/debug', {
    headers: { 'Authorization': 'Bearer YOUR_JWT_TOKEN' }
  }).then(r => r.json()).then(d => console.log('Debug:', d));

  // Test video list for speaker
  fetch('${API_URL}/api/speaker/videos', {
    headers: { 'Authorization': 'Bearer YOUR_JWT_TOKEN' }
  }).then(r => r.json()).then(d => console.log('Videos:', d));
  `);
}

// Run the debug script
debugSpeakerDashboard().catch(console.error);
