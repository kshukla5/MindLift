const app = require('./app');

// Load environment variables
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 MindLift API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 JWT_SECRET: ${process.env.JWT_SECRET ? 'SET' : 'NOT SET'}`);
  console.log(`🗄️  DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`);
});
