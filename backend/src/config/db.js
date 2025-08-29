const { Pool } = require('pg');

const isTest = process.env.NODE_ENV === 'test';

if (!isTest) {
  // Debug environment variables (silenced in tests)
  console.log('=== Database Configuration Debug ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('DATABASE_URL (first 50 chars):', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'undefined');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('PGHOST:', process.env.PGHOST);
  console.log('PGPORT:', process.env.PGPORT);
}

// Railway Database Configuration with multiple fallback strategies
let poolConfig;

if (process.env.DATABASE_URL) {
  // Primary: Use Railway DATABASE_URL
  if (!isTest) console.log('Using DATABASE_URL for connection');
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
} else if (process.env.PGHOST || process.env.DB_HOST) {
  // Fallback: Use individual Railway environment variables
  if (!isTest) console.log('Using individual environment variables for connection');
  poolConfig = {
    user: process.env.PGUSER || process.env.DB_USER || 'postgres',
    host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
    database: process.env.PGDATABASE || process.env.DB_NAME || 'mindlift',
    password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'password',
    port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432'),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
} else {
  // Local development fallback
  if (!isTest) console.log('Using local development database');
  poolConfig = {
    user: 'postgres',
    host: 'localhost',
    database: 'mindlift',
    password: 'password',
    port: 5432,
    ssl: false,
  };
}

if (!isTest) {
  console.log('Final pool config:', {
    ...poolConfig,
    password: poolConfig.password ? '[REDACTED]' : undefined,
    connectionString: poolConfig.connectionString ? '[REDACTED]' : undefined
  });
}

const pool = new Pool(poolConfig);

if (!isTest) {
  // Test database connection on startup
  pool.on('connect', () => {
    console.log('✅ Successfully connected to PostgreSQL database');
  });

  pool.on('error', (err) => {
    console.error('❌ Database connection error:', err);
  });

  // Test connection immediately
  pool.query('SELECT NOW() as current_time, version() as db_version', (err, res) => {
    if (err) {
      console.error('❌ Database connection test failed:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        errno: err.errno,
        syscall: err.syscall,
        address: err.address,
        port: err.port
      });
    } else {
      console.log('✅ Database connection test successful');
      console.log('Current time:', res.rows[0]?.current_time);
      console.log('Database version:', res.rows[0]?.db_version);
    }
  });
}

module.exports = pool;
