const bcrypt = require('bcrypt');
const { Pool } = require('pg');

async function createAdminUser() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'mindlift',
    user: process.env.DB_USER || 'kunjalshukla',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('12345', 10);
    
    // Insert admin user
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, is_paid, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW()) 
       ON CONFLICT (email) DO UPDATE SET 
       password = EXCLUDED.password,
       role = EXCLUDED.role,
       name = EXCLUDED.name
       RETURNING id, name, email, role`,
      ['Admin User', 'kunjalcan@gmail.com', hashedPassword, 'admin', true]
    );
    
    console.log('✅ Admin user created successfully:');
    console.log('Email:', result.rows[0].email);
    console.log('Password: 12345');
    console.log('Role:', result.rows[0].role);
    console.log('User ID:', result.rows[0].id);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await pool.end();
  }
}

// Load environment variables
require('dotenv').config();

createAdminUser();
