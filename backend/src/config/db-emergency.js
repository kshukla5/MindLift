const { Pool } = require('pg');

// Railway Database Configuration - Emergency Override
console.log('=== EMERGENCY DATABASE FIX FOR RAILWAY ===');

// Force Railway DATABASE_URL with hard-coded fallback
const RAILWAY_DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://postgres:ELacjPGNSZZHDKcKbHhqJHMSdNnUzUFB@junction.proxy.rlwy.net:17999/railway';

console.log('Using DATABASE_URL:', RAILWAY_DATABASE_URL.replace(/:[^:@]*@/, ':***@'));

const poolConfig = {
  connectionString: RAILWAY_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 5,
  min: 0,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
  acquireTimeoutMillis: 10000
};

console.log('Creating pool with config:', {
  ...poolConfig,
  connectionString: '[REDACTED]'
});

const pool = new Pool(poolConfig);

// Immediate connection test
pool.connect((err, client, done) => {
  if (err) {
    console.error('❌ CRITICAL: Database connection failed immediately:', err);
    console.error('Error details:', {
      code: err.code,
      errno: err.errno,
      syscall: err.syscall,
      address: err.address,
      port: err.port
    });
  } else {
    console.log('✅ SUCCESS: Database connected immediately');
    client.query('SELECT NOW() as time', (err, result) => {
      done();
      if (err) {
        console.error('❌ Query test failed:', err);
      } else {
        console.log('✅ Query test successful:', result.rows[0]);
      }
    });
  }
});

module.exports = pool;
