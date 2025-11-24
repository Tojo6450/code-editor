const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

const setupDatabase = async () => {
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('⏳ Running database migrations...');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log('Database setup complete! Tables created and seeded.');
    process.exit(0);
  } catch (err) {
    console.error(' Error setting up database:', err);
    process.exit(1);
  }
};

setupDatabase();