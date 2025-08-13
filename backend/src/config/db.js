const { Pool } = require('pg');

// Railway Database Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  user: process.env.DB_USER || process.env.PGUSER || 'postgres',
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  database: process.env.DB_NAME || process.env.PGDATABASE || 'mindlift',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'password',
  port: process.env.DB_PORT || process.env.PGPORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test database connection on startup
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection test failed:', err);
  } else {
    console.log('Database connection test successful:', res.rows[0]);
  }
});

module.exports = pool;
