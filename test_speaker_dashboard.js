// Test script to verify speaker dashboard functionality
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Speaker Dashboard Components...\n');

// Test 1: Check if all required files exist
const requiredFiles = [
  'src/components/SpeakerDashboard.js',
  'src/components/SpeakerDashboard.css',
  'src/components/SpeakerVideos.js',
  'src/components/SpeakerVideos.css',
  'src/hooks/useSpeakerDashboard.js',
  'frontend/src/components/SpeakerDashboard.js',
  'frontend/src/components/SpeakerDashboard.css',
  'frontend/src/components/SpeakerVideos.js',
  'frontend/src/components/SpeakerVideos.css',
  'frontend/src/hooks/useSpeakerDashboard.js'
];

console.log('📁 Checking required files...');
let allFilesExist = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Test 2: Check if backend routes are properly configured
console.log('\n🔧 Checking backend routes...');
const videoRoutesPath = 'backend/src/routes/videoRoutes.js';
if (fs.existsSync(videoRoutesPath)) {
  const videoRoutesContent = fs.readFileSync(videoRoutesPath, 'utf8');
  const hasPatchRoute = videoRoutesContent.includes('router.patch');
  const hasGetVideoById = videoRoutesContent.includes('router.get(\'/videos/:id\'');
  const hasSpeakerVideos = videoRoutesContent.includes('router.get(\'/speaker/videos\'');
  
  console.log(`${hasPatchRoute ? '✅' : '❌'} PATCH /videos/:id route exists`);
  console.log(`${hasGetVideoById ? '✅' : '❌'} GET /videos/:id route exists`);
  console.log(`${hasSpeakerVideos ? '✅' : '❌'} GET /speaker/videos route exists`);
} else {
  console.log('❌ Video routes file not found');
}

// Test 3: Check if video controller has required methods
console.log('\n🎮 Checking video controller...');
const videoControllerPath = 'backend/src/controllers/videoController.js';
if (fs.existsSync(videoControllerPath)) {
  const videoControllerContent = fs.readFileSync(videoControllerPath, 'utf8');
  const hasGetVideoById = videoControllerContent.includes('async getVideoById');
  const hasUpdate = videoControllerContent.includes('async update');
  const hasRemove = videoControllerContent.includes('async remove');
  const hasGetSpeakerVideos = videoControllerContent.includes('async getSpeakerVideos');
  
  console.log(`${hasGetVideoById ? '✅' : '❌'} getVideoById method exists`);
  console.log(`${hasUpdate ? '✅' : '❌'} update method exists`);
  console.log(`${hasRemove ? '✅' : '❌'} remove method exists`);
  console.log(`${hasGetSpeakerVideos ? '✅' : '❌'} getSpeakerVideos method exists`);
} else {
  console.log('❌ Video controller file not found');
}

// Test 4: Check if speaker controller exists
console.log('\n🎤 Checking speaker controller...');
const speakerControllerPath = 'backend/src/controllers/speakerController.js';
if (fs.existsSync(speakerControllerPath)) {
  const speakerControllerContent = fs.readFileSync(speakerControllerPath, 'utf8');
  const hasGetDashboard = speakerControllerContent.includes('async getDashboard');
  
  console.log(`${hasGetDashboard ? '✅' : '❌'} getDashboard method exists`);
} else {
  console.log('❌ Speaker controller file not found');
}

// Test 5: Check if App.js has proper routing
console.log('\n🛣️ Checking routing configuration...');
const appJsPath = 'src/App.js';
if (fs.existsSync(appJsPath)) {
  const appJsContent = fs.readFileSync(appJsPath, 'utf8');
  const hasSpeakerRoute = appJsContent.includes('path="/speaker"');
  const hasSpeakerUploadRoute = appJsContent.includes('path="/speaker/upload"');
  const hasSpeakerEditRoute = appJsContent.includes('path="/speaker/edit/:videoId"');
  
  console.log(`${hasSpeakerRoute ? '✅' : '❌'} /speaker route exists`);
  console.log(`${hasSpeakerUploadRoute ? '✅' : '❌'} /speaker/upload route exists`);
  console.log(`${hasSpeakerEditRoute ? '✅' : '❌'} /speaker/edit/:videoId route exists`);
} else {
  console.log('❌ App.js file not found');
}

// Test 6: Check CSS content
console.log('\n🎨 Checking CSS files...');
const speakerDashboardCssPath = 'src/components/SpeakerDashboard.css';
if (fs.existsSync(speakerDashboardCssPath)) {
  const cssContent = fs.readFileSync(speakerDashboardCssPath, 'utf8');
  const hasStyles = cssContent.length > 100;
  console.log(`${hasStyles ? '✅' : '❌'} SpeakerDashboard.css has content`);
} else {
  console.log('❌ SpeakerDashboard.css not found');
}

const speakerVideosCssPath = 'src/components/SpeakerVideos.css';
if (fs.existsSync(speakerVideosCssPath)) {
  const cssContent = fs.readFileSync(speakerVideosCssPath, 'utf8');
  const hasStyles = cssContent.length > 100;
  console.log(`${hasStyles ? '✅' : '❌'} SpeakerVideos.css has content`);
} else {
  console.log('❌ SpeakerVideos.css not found');
}

// Summary
console.log('\n📊 Summary:');
console.log(`All required files exist: ${allFilesExist ? '✅' : '❌'}`);

if (allFilesExist) {
  console.log('\n🎉 Speaker Dashboard components are properly configured!');
  console.log('\n🔧 To test the full functionality:');
  console.log('1. Set up a PostgreSQL database');
  console.log('2. Configure environment variables in .env file');
  console.log('3. Start the backend: cd backend && npm start');
  console.log('4. Start the frontend: cd frontend && npm start');
  console.log('5. Navigate to /speaker in the browser');
} else {
  console.log('\n⚠️ Some components are missing. Please check the file structure.');
}
