// Simple migration runner for Railway/Postgres
// Executes SQL files in backend/sql in a safe order

const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

async function run() {
  const files = [
    'schema.sql',
    'users.sql',
    'videos.sql',
    'bookmarks.sql',
    'migration_add_speaker_id.sql',
  ];

  console.log('Starting migrations...');
  for (const file of files) {
    const full = path.join(__dirname, '..', 'sql', file);
    if (!fs.existsSync(full)) {
      console.log(`- Skip missing ${file}`);
      continue;
    }
    const sql = fs.readFileSync(full, 'utf8');
    console.log(`- Applying ${file} (${sql.length} bytes)`);
    try {
      await pool.query(sql);
      console.log(`  ✓ ${file} applied`);
    } catch (err) {
      console.error(`  ✗ Failed to apply ${file}:`, err.message);
      process.exitCode = 1;
      break;
    }
  }

  // end
  await pool.end();
  console.log('Migrations finished');
}

run().catch((e) => {
  console.error('Migration runner error:', e);
  process.exit(1);
});

