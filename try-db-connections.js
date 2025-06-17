/**
 * Try Different Database Connection Options
 * 
 * This script tries different connection options to find a working connection.
 */
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

console.log('=================================================');
console.log('COFFEE LAB - TRY DATABASE CONNECTIONS');
console.log('=================================================');
console.log('This script will try different database connection options.');
console.log('');

// Define different connection options to try
const connectionOptions = [
  {
    name: "External hostname with SSL",
    url: "postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a.frankfurt-postgres.render.com/coffee_lab_db_lyf9",
    ssl: { rejectUnauthorized: false }
  },
  {
    name: "External hostname without SSL",
    url: "postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a.frankfurt-postgres.render.com/coffee_lab_db_lyf9",
    ssl: false
  },
  {
    name: "Internal hostname with SSL",
    url: "postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a/coffee_lab_db_lyf9",
    ssl: { rejectUnauthorized: false }
  },
  {
    name: "Internal hostname without SSL",
    url: "postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a/coffee_lab_db_lyf9",
    ssl: false
  },
  {
    name: "External hostname with SSL (eu-central)",
    url: "postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a.eu-central-1.postgres.render.com/coffee_lab_db_lyf9",
    ssl: { rejectUnauthorized: false }
  },
  {
    name: "External hostname without SSL (eu-central)",
    url: "postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a.eu-central-1.postgres.render.com/coffee_lab_db_lyf9",
    ssl: false
  }
];

// Function to test a connection
async function testConnection(option) {
  console.log(`\nTrying connection: ${option.name}`);
  console.log(`URL: ${option.url}`);
  console.log(`SSL: ${option.ssl ? 'Enabled' : 'Disabled'}`);
  
  const pool = new Pool({
    connectionString: option.url,
    ssl: option.ssl
  });
  
  try {
    console.log('Testing connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log(`Current database time: ${result.rows[0].now}`);
    
    // List all tables
    console.log('\nListing all tables...');
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
    
    return {
      success: true,
      option: option
    };
  } catch (err) {
    console.error(`❌ Connection failed: ${err.message}`);
    return {
      success: false,
      option: option,
      error: err.message
    };
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Main function to try all connections
async function tryAllConnections() {
  console.log('Testing all connection options...');
  
  const results = [];
  
  for (const option of connectionOptions) {
    const result = await testConnection(option);
    results.push(result);
  }
  
  // Summarize results
  console.log('\n=================================================');
  console.log('CONNECTION TEST RESULTS');
  console.log('=================================================');
  
  const successfulConnections = results.filter(r => r.success);
  
  if (successfulConnections.length > 0) {
    console.log(`\n✅ ${successfulConnections.length} successful connection(s):`);
    successfulConnections.forEach((result, index) => {
      console.log(`${index + 1}. ${result.option.name}`);
    });
    
    // Update the connection configuration with the first successful option
    const bestOption = successfulConnections[0].option;
    console.log(`\nUpdating connection configuration with: ${bestOption.name}`);
    
    // Update db-pg.js
    const dbPgPath = path.join(__dirname, 'backend', 'db-pg.js');
    const dbPgContent = `const { Pool } = require('pg');

// Get the DATABASE_URL from environment variables
const databaseUrl = process.env.DATABASE_URL || '${bestOption.url}';

// Create a new pool using the connection string
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: ${bestOption.ssl ? 'process.env.NODE_ENV === \'production\' ? { rejectUnauthorized: false } : false' : 'false'}
});

// Export the pool for use in other modules
module.exports = pool;
`;
    
    fs.writeFileSync(dbPgPath, dbPgContent);
    console.log('✅ db-pg.js updated successfully.');
    
    // Update .env.production
    const envProductionPath = path.join(__dirname, 'backend', '.env.production');
    const envProductionContent = `NODE_ENV=production
DATABASE_URL=${bestOption.url}
PORT=10000
`;
    
    fs.writeFileSync(envProductionPath, envProductionContent);
    console.log('✅ .env.production updated successfully.');
    
    // Update test-db-connection.js
    const testDbConnectionPath = path.join(__dirname, 'backend', 'test-db-connection.js');
    const testDbConnectionContent = `/**
 * Test Database Connection
 * 
 * This script tests the connection to the database.
 */
const fs = require('fs');
const path = require('path');

// Set NODE_ENV to production
process.env.NODE_ENV = 'production';

// Set DATABASE_URL
process.env.DATABASE_URL = '${bestOption.url}';

// Get the appropriate pool
const pool = require('./db-pg');

async function testConnection() {
  console.log('=================================================');
  console.log('COFFEE LAB - TEST DATABASE CONNECTION');
  console.log('=================================================');
  console.log('');
  
  try {
    console.log('Testing connection to the database...');
    console.log('Using connection string:');
    console.log(process.env.DATABASE_URL);
    
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log(\`Current database time: \${result.rows[0].now}\`);
    
    // List all tables
    console.log('\\nListing all tables...');
    const tablesResult = await pool.query(\`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    \`);
    
    if (tablesResult.rows.length === 0) {
      console.log('No tables found in the database.');
    } else {
      console.log('Tables in the database:');
      tablesResult.rows.forEach(row => {
        console.log(\`- \${row.table_name}\`);
      });
    }
    
    return true;
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return false;
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Run the test
testConnection().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
`;
    
    fs.writeFileSync(testDbConnectionPath, testDbConnectionContent);
    console.log('✅ test-db-connection.js updated successfully.');
    
    // Create a summary file
    const summaryPath = path.join(__dirname, 'database-connection-summary.md');
    const summaryContent = `# Database Connection Summary

## Successful Connection Options

${successfulConnections.map((result, index) => `
### ${index + 1}. ${result.option.name}
- URL: \`${result.option.url}\`
- SSL: ${result.option.ssl ? 'Enabled' : 'Disabled'}
`).join('\n')}

## Configuration Updates

The following files have been updated with the best connection option (${bestOption.name}):

1. \`backend/db-pg.js\`
2. \`backend/.env.production\`
3. \`backend/test-db-connection.js\`

## Next Steps

1. Run \`test-db-connection.bat\` to verify the connection works
2. Run \`fix-all-database-issues.bat\` to create the necessary tables
3. Run \`fix-everything-and-deploy.bat\` to deploy to Render
`;
    
    fs.writeFileSync(summaryPath, summaryContent);
    console.log('✅ database-connection-summary.md created successfully.');
    
  } else {
    console.log('\n❌ No successful connections found.');
    console.log('\nPossible issues:');
    console.log('1. The database credentials may be incorrect');
    console.log('2. The database server may be down or unreachable');
    console.log('3. There may be network issues preventing the connection');
    console.log('4. The database may have been deleted or renamed');
    
    // Create a troubleshooting guide
    const troubleshootingPath = path.join(__dirname, 'database-connection-troubleshooting.md');
    const troubleshootingContent = `# Database Connection Troubleshooting

## Connection Errors

${results.map((result, index) => `
### ${index + 1}. ${result.option.name}
- URL: \`${result.option.url}\`
- SSL: ${result.option.ssl ? 'Enabled' : 'Disabled'}
- Error: ${result.error}
`).join('\n')}

## Possible Solutions

1. **Check Database Credentials**
   - Verify the username and password are correct
   - Check if the database name is correct

2. **Check Database Server**
   - Verify the database server is running
   - Check if the hostname is correct
   - Try using a different hostname format

3. **Check Network Connectivity**
   - Verify there are no firewall issues
   - Check if the server is accessible from your location

4. **Check SSL Configuration**
   - Try with and without SSL
   - Try with different SSL options

5. **Check Render Dashboard**
   - Log in to your Render dashboard
   - Verify the database service is running
   - Check the database connection details

## Next Steps

1. Update the database credentials in \`backend/.env.production\`
2. Run \`try-db-connections.js\` again with updated credentials
3. If still unsuccessful, contact Render support
`;
    
    fs.writeFileSync(troubleshootingPath, troubleshootingContent);
    console.log('✅ database-connection-troubleshooting.md created successfully.');
  }
}

// Run the main function
tryAllConnections().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
