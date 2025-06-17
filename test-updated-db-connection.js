/**
 * Test Updated Database Connection
 * 
 * This script tests the connection to the database with the updated credentials.
 */
const { Pool } = require('pg');

console.log('=================================================');
console.log('COFFEE LAB - TEST UPDATED DATABASE CONNECTION');
console.log('=================================================');
console.log('This script will test the connection to the database with the updated credentials.');
console.log('');

// Define the database connection options
const connectionOptions = [
  {
    name: "Render PostgreSQL (External)",
    url: "postgresql://coffee_lab_user:jz5x00jzGHaKyrqDWehqfsCu6vRb688b@dpg-d18qgkruibrs73duejs0-a/coffee_lab_db_dldc",
    ssl: { rejectUnauthorized: false }
  },
  {
    name: "Render PostgreSQL (Internal)",
    url: "postgresql://coffee_lab_user:jz5x00jzGHaKyrqDWehqfsCu6vRb688b@dpg-d18qgkruibrs73duejs0-a/coffee_lab_db_dldc",
    ssl: { rejectUnauthorized: false }
  }
];

// Function to test the connection
async function testConnection() {
  console.log('Testing database connections...');
  
  let successfulConnections = 0;
  
  // Try each connection option
  for (const option of connectionOptions) {
    console.log(`\nTrying connection: ${option.name}`);
    console.log(`URL: ${option.url}`);
    console.log(`SSL: ${option.ssl ? 'Enabled' : 'Disabled'}`);
    
    try {
      const pool = new Pool({
        connectionString: option.url,
        ssl: option.ssl
      });
      
      // Test the connection
      const result = await pool.query('SELECT NOW()');
      console.log('✅ Connection successful!');
      console.log(`Current database time: ${result.rows[0].now}`);
      
      // List all tables
      try {
        const tablesResult = await pool.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
        `);
        
        if (tablesResult.rows.length === 0) {
          console.log('No tables found in the database.');
        } else {
          console.log('Tables in the database:');
          tablesResult.rows.forEach(row => {
            console.log(`- ${row.table_name}`);
          });
        }
      } catch (err) {
        console.error('❌ Error listing tables:', err.message);
      }
      
      // Count rows in each table
      const tables = ['users', 'network', 'stores', 'checklist_templates', 'checklists'];
      
      console.log('\nCounting rows in each table:');
      for (const table of tables) {
        try {
          const countResult = await pool.query(`SELECT COUNT(*) FROM ${table}`);
          console.log(`- ${table}: ${countResult.rows[0].count} rows`);
        } catch (err) {
          console.error(`❌ Error counting rows in ${table}:`, err.message);
        }
      }
      
      // Close the connection pool
      await pool.end();
      
      successfulConnections++;
    } catch (err) {
      console.error(`❌ Connection failed: ${err.message}`);
    }
  }
  
  console.log('\n=================================================');
  console.log('CONNECTION TEST RESULTS');
  console.log('=================================================');
  console.log(`Successful connections: ${successfulConnections}/${connectionOptions.length}`);
  
  if (successfulConnections > 0) {
    console.log('\n✅ At least one connection was successful!');
    console.log('You can now run create-and-populate-db.bat to create and populate the database.');
    console.log('Then run fix-everything-and-deploy.bat to deploy to Render.');
    return true;
  } else {
    console.log('\n❌ All connections failed.');
    console.log('Please check your database credentials and try again.');
    return false;
  }
}

// Run the test
testConnection()
  .then(success => {
    if (!success) {
      console.log('\nPossible issues:');
      console.log('1. The database credentials may be incorrect');
      console.log('2. The database server may be down or unreachable');
      console.log('3. There may be network issues preventing the connection');
      console.log('4. The database may have been deleted or renamed');
    }
  })
  .catch(err => {
    console.error('❌ Unhandled error:', err);
  });
