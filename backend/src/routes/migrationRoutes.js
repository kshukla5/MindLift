const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

// Database migration endpoint (admin only, for development)
router.post('/migrate', async (req, res) => {
  try {
    const { adminKey } = req.body;
    
    // Simple admin key check (in production, use proper authentication)
    if (adminKey !== 'mindlift-migrate-2024') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Read the SQL file
    const sqlPath = path.join(__dirname, '../sql/speaker_enhancements.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    await pool.query(sql);

    res.json({
      success: true,
      message: 'Database schema migration completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Migration error:', err);
    res.status(500).json({ 
      error: 'Migration failed', 
      details: err.message,
      code: err.code
    });
  }
});

// Check migration status
router.get('/migration-status', async (req, res) => {
  try {
    // Check if enhanced tables exist
    const checkTables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('notifications', 'video_analytics', 'speaker_milestones')
    `);

    // Check if enhanced columns exist
    const checkColumns = await pool.query(`
      SELECT column_name, table_name
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'speakers', 'videos')
      AND column_name IN ('approval_status', 'full_name', 'areas_of_expertise', 'thumbnail_url', 'tags')
    `);

    const tablesExist = checkTables.rows.map(r => r.table_name);
    const columnsExist = checkColumns.rows.map(r => `${r.table_name}.${r.column_name}`);

    res.json({
      status: 'checked',
      enhanced_tables: tablesExist,
      enhanced_columns: columnsExist,
      migration_needed: tablesExist.length < 3 || columnsExist.length < 5,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Migration status check error:', err);
    res.status(500).json({ error: 'Failed to check migration status', details: err.message });
  }
});

module.exports = router;
