/**
 * Fix Scripts for Render Deployment
 * 
 * This script fixes issues with the database connection and viewer scripts.
 */
const fs = require('fs');
const path = require('path');

console.log('=================================================');
console.log('COFFEE LAB - FIX SCRIPTS');
console.log('=================================================');
console.log('This script will fix issues with the database scripts.');
console.log('');

// Fix test-db-connection.js path issue
console.log('Fixing test-db-connection.bat...');
const testDbBatchPath = path.join(__dirname, 'test-db-connection.bat');

if (fs.existsSync(testDbBatchPath)) {
  const fixedTestDbBatchContent = `@echo off
echo ===================================
echo COFFEE LAB - TEST DATABASE CONNECTION
echo ===================================
echo.
echo This script will test the connection to the database.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running test-db-connection.js...
node backend/test-db-connection.js

echo.
echo Press any key to exit...
pause > nul`;

  fs.writeFileSync(testDbBatchPath, fixedTestDbBatchContent);
  console.log('✅ test-db-connection.bat fixed successfully.');
} else {
  console.error('❌ test-db-connection.bat not found.');
}

// Fix database-viewer.js
console.log('\nFixing database-viewer.js...');
const dbViewerPath = path.join(__dirname, 'backend', 'database-viewer.js');

if (fs.existsSync(dbViewerPath)) {
  const fixedDbViewerContent = `/**
 * Database Viewer Tool
 * 
 * This script allows you to view and check the data in the server database.
 */
const fs = require('fs');
const path = require('path');

// Set NODE_ENV to production for testing with PostgreSQL
process.env.NODE_ENV = 'production';

// Set DATABASE_URL
process.env.DATABASE_URL = 'postgresql://coffee_lab_user:JZBtkeHcgpITKIKBj6Dw7M4eAIMgh2r@dpg-d17fiiemcj7s73d4rhb0-a/coffee_lab_db_lyf9';

// Get the appropriate pool
let pool;
try {
  if (process.env.NODE_ENV === 'production') {
    pool = require('./db-pg');
    console.log('Using PostgreSQL database for viewing');
  } else {
    pool = require('./db');
    console.log('Using MySQL database for viewing');
  }
} catch (err) {
  console.error('Error loading database module:', err.message);
  process.exit(1);
}

// Function to list all tables
async function listTables() {
  try {
    let query;
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL query to list tables
      query = \`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      \`;
    } else {
      // MySQL query to list tables
      query = \`
        SHOW TABLES
      \`;
    }
    
    const result = await pool.query(query);
    console.log('Tables in the database:');
    
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL result format
      if (result.rows && result.rows.length > 0) {
        result.rows.forEach(row => {
          console.log(\`- \${row.table_name}\`);
        });
        return result.rows.map(row => row.table_name);
      } else {
        console.log('No tables found.');
        return [];
      }
    } else {
      // MySQL result format
      if (result && result.length > 0) {
        const tables = [];
        for (const row of result) {
          const tableName = Object.values(row)[0];
          console.log(\`- \${tableName}\`);
          tables.push(tableName);
        }
        return tables;
      } else {
        console.log('No tables found.');
        return [];
      }
    }
  } catch (err) {
    console.error('Error listing tables:', err);
    return [];
  }
}

// Function to view table structure
async function viewTableStructure(tableName) {
  try {
    let query;
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL query to view table structure
      query = \`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position
      \`;
      const result = await pool.query(query, [tableName]);
      
      console.log(\`\nStructure of table "\${tableName}":\`);
      console.log('Column Name | Data Type | Nullable');
      console.log('----------- | --------- | --------');
      
      if (result.rows && result.rows.length > 0) {
        result.rows.forEach(row => {
          console.log(\`\${row.column_name} | \${row.data_type} | \${row.is_nullable}\`);
        });
      } else {
        console.log('No columns found.');
      }
    } else {
      // MySQL query to view table structure
      query = \`DESCRIBE \${tableName}\`;
      const result = await pool.query(query);
      
      console.log(\`\nStructure of table "\${tableName}":\`);
      console.log('Field | Type | Null | Key | Default | Extra');
      console.log('----- | ---- | ---- | --- | ------- | -----');
      
      if (result && result.length > 0) {
        for (const row of result) {
          console.log(\`\${row.Field} | \${row.Type} | \${row.Null} | \${row.Key} | \${row.Default} | \${row.Extra}\`);
        }
      } else {
        console.log('No columns found.');
      }
    }
  } catch (err) {
    console.error(\`Error viewing structure of table "\${tableName}":\`, err);
  }
}

// Function to view table data
async function viewTableData(tableName, limit = 10) {
  try {
    const query = \`SELECT * FROM "\${tableName}" LIMIT \${limit}\`;
    
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL
      const result = await pool.query(query);
      console.log(\`\nData in table "\${tableName}" (limit \${limit}):\`);
      
      if (result.rows && result.rows.length > 0) {
        console.table(result.rows);
      } else {
        console.log('No data found in this table.');
      }
    } else {
      // MySQL
      const result = await pool.query(query);
      console.log(\`\nData in table "\${tableName}" (limit \${limit}):\`);
      
      if (result && result.length > 0) {
        console.table(result);
      } else {
        console.log('No data found in this table.');
      }
    }
  } catch (err) {
    console.error(\`Error viewing data in table "\${tableName}":\`, err);
  }
}

// Function to count records in a table
async function countRecords(tableName) {
  try {
    const query = \`SELECT COUNT(*) FROM "\${tableName}"\`;
    
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL
      const result = await pool.query(query);
      if (result.rows && result.rows.length > 0) {
        const count = parseInt(result.rows[0].count);
        console.log(\`Table "\${tableName}" contains \${count} records.\`);
        return count;
      } else {
        console.log(\`Table "\${tableName}" contains 0 records.\`);
        return 0;
      }
    } else {
      // MySQL
      const result = await pool.query(query);
      if (result && result.length > 0) {
        const count = parseInt(Object.values(result[0])[0]);
        console.log(\`Table "\${tableName}" contains \${count} records.\`);
        return count;
      } else {
        console.log(\`Table "\${tableName}" contains 0 records.\`);
        return 0;
      }
    }
  } catch (err) {
    console.error(\`Error counting records in table "\${tableName}":\`, err);
    return 0;
  }
}

// Main function
async function main() {
  console.log('=================================================');
  console.log('COFFEE LAB - DATABASE VIEWER TOOL');
  console.log('=================================================');
  console.log('');
  
  try {
    // Test connection
    console.log('Testing connection to the database...');
    try {
      const testResult = await pool.query('SELECT NOW()');
      console.log('✅ Connection successful!');
      if (process.env.NODE_ENV === 'production' && testResult.rows && testResult.rows.length > 0) {
        console.log(\`Current database time: \${testResult.rows[0].now}\`);
      }
    } catch (err) {
      console.error('❌ Connection failed:', err.message);
      return;
    }
    
    // List all tables
    console.log('\\nListing all tables...');
    const tables = await listTables();
    
    if (tables.length === 0) {
      console.log('No tables found in the database.');
      
      // Create tables if none exist
      console.log('\\nWould you like to create the necessary tables? (Y/N)');
      console.log('Automatically proceeding with Y for this script...');
      
      console.log('\\nCreating tables...');
      try {
        // Try to run init-db.js
        console.log('Running database initialization...');
        const initDb = require('./init-db');
        await initDb();
        
        // List tables again
        console.log('\\nListing tables after initialization...');
        const newTables = await listTables();
        
        if (newTables.length === 0) {
          console.log('Still no tables found. Please check the database initialization script.');
          return;
        }
        
        // Continue with the new tables
        for (const tableName of newTables) {
          await viewTableStructure(tableName);
          const count = await countRecords(tableName);
          
          if (count > 0) {
            await viewTableData(tableName);
          }
          
          console.log(''); // Add a blank line between tables
        }
      } catch (err) {
        console.error('Error creating tables:', err);
        return;
      }
    } else {
      // View structure and data for each table
      for (const tableName of tables) {
        await viewTableStructure(tableName);
        const count = await countRecords(tableName);
        
        if (count > 0) {
          await viewTableData(tableName);
        }
        
        console.log(''); // Add a blank line between tables
      }
    }
    
    console.log('Database viewing completed successfully.');
  } catch (err) {
    console.error('Error in database viewer:', err);
  } finally {
    // Close the connection pool
    if (pool.end) {
      await pool.end();
    }
  }
}

// Run the main function
main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
`;

  fs.writeFileSync(dbViewerPath, fixedDbViewerContent);
  console.log('✅ database-viewer.js fixed successfully.');
} else {
  console.error('❌ backend/database-viewer.js not found.');
}

// Fix view-database.bat
console.log('\nFixing view-database.bat...');
const viewDbBatchPath = path.join(__dirname, 'view-database.bat');

if (fs.existsSync(viewDbBatchPath)) {
  const fixedViewDbBatchContent = `@echo off
echo ===================================
echo COFFEE LAB - DATABASE VIEWER TOOL
echo ===================================
echo.
echo This script will show the contents of the database.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running database-viewer.js...
node backend/database-viewer.js

echo.
echo Press any key to exit...
pause > nul`;

  fs.writeFileSync(viewDbBatchPath, fixedViewDbBatchContent);
  console.log('✅ view-database.bat fixed successfully.');
} else {
  console.error('❌ view-database.bat not found.');
}

// Fix fix-everything-and-deploy.bat
console.log('\nFixing fix-everything-and-deploy.bat...');
const fixEverythingPath = path.join(__dirname, 'fix-everything-and-deploy.bat');

if (fs.existsSync(fixEverythingPath)) {
  const fixedFixEverythingContent = `@echo off
echo ===================================
echo COFFEE LAB - FIX EVERYTHING AND DEPLOY
echo ===================================
echo.
echo This script will fix all issues and deploy to Render.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Updating database connection...
call update-db-connection.bat

echo.
echo Step 2: Fixing all database issues...
call fix-all-database-issues.bat

echo.
echo Step 3: Fixing dependencies...
call fix-render-dependencies.bat

echo.
echo Step 4: Fixing path-to-regexp error...
call fix-path-to-regexp-error.bat

echo.
echo Step 5: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 6: Deploying to Render...
call deploy-to-render.bat

echo.
echo All steps completed!
echo.
echo The application has been fixed and deployed to Render.
echo.
echo Press any key to exit...
pause > nul`;

  fs.writeFileSync(fixEverythingPath, fixedFixEverythingContent);
  console.log('✅ fix-everything-and-deploy.bat fixed successfully.');
} else {
  console.error('❌ fix-everything-and-deploy.bat not found.');
}

// Create a batch file to run this script
console.log('\nCreating fix-scripts.bat...');
const batchPath = path.join(__dirname, 'fix-scripts.bat');

const batchContent = `@echo off
echo ===================================
echo COFFEE LAB - FIX SCRIPTS
echo ===================================
echo.
echo This script will fix issues with the database scripts.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-scripts.js...
node fix-scripts.js

echo.
echo Press any key to exit...
pause > nul`;

fs.writeFileSync(batchPath, batchContent);
console.log('✅ fix-scripts.bat created successfully.');

console.log('\n=================================================');
console.log('SCRIPTS FIX COMPLETED');
console.log('=================================================');
console.log('The scripts have been fixed.');
console.log('');
console.log('To run the fixed scripts:');
console.log('1. First run fix-scripts.bat');
console.log('2. Then run test-db-connection.bat to test the database connection');
console.log('3. Then run view-database.bat to view the database contents');
console.log('4. Finally run fix-everything-and-deploy.bat to fix all issues and deploy to Render');
