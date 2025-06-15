const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Zoespeppas2025!',
  database: process.env.DB_NAME || 'coffee_lab_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT NOW() as now');
    console.log('Connected to MySQL database at:', rows[0].now);
  } catch (err) {
    console.error('Error connecting to MySQL database:', err);
  }
}

// Call the test function
testConnection();

// Export the pool for use in other files
module.exports = pool;
