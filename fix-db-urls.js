/**
 * Fix Database URLs
 * 
 * This script fixes the database URLs for internal and external connections.
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('=================================================');
console.log('COFFEE LAB - FIX DATABASE URLS');
console.log('=================================================');
console.log('This script will fix the database URLs for internal and external connections.');
console.log('');

// Define the files to update
const filesToUpdate = [
  'test-updated-db-connection.js',
  'fix-users-table.js',
  'create-and-populate-db.js',
  'fix-user-management.js'
];

// Define the correct URLs
const externalUrl = "postgresql://coffee_lab_user:jz5x00jzGHaKyrqDWehqfsCu6vRb688b@dpg-d18qgkruibrs73duejs0-a.frankfurt-postgres.render.com/coffee_lab_db_dldc";
const internalUrl = "postgresql://coffee_lab_user:jz5x00jzGHaKyrqDWehqfsCu6vRb688b@dpg-d18qgkruibrs73duejs0-a/coffee_lab_db_dldc";

// Function to update the files
function updateFiles() {
  let updatedFiles = 0;
  
  for (const file of filesToUpdate) {
    try {
      const filePath = path.join(__dirname, file);
      
      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${file}`);
        continue;
      }
      
      // Read the file content
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Check if the file contains the URLs
      if (!content.includes('url:') && !content.includes('URL:')) {
        console.log(`❌ File does not contain URLs: ${file}`);
        continue;
      }
      
      // Update the content
      let updatedContent = content;
      
      // Replace the external URL
      const externalUrlRegex = /url:\s*"postgresql:\/\/coffee_lab_user:[^@]+@[^\/]+\.frankfurt-postgres\.render\.com\/coffee_lab_db_lyf9"/g;
      updatedContent = updatedContent.replace(externalUrlRegex, `url: "${externalUrl}"`);
      
      // Replace the internal URL
      const internalUrlRegex = /url:\s*"postgresql:\/\/coffee_lab_user:[^@]+@[^\/]+\/coffee_lab_db_lyf9"/g;
      updatedContent = updatedContent.replace(internalUrlRegex, `url: "${internalUrl}"`);
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      
      console.log(`✅ Updated URLs in file: ${file}`);
      updatedFiles++;
      
    } catch (error) {
      console.error(`❌ Error updating file ${file}:`, error);
    }
  }
  
  console.log('');
  console.log('=================================================');
  console.log('DATABASE URLS FIX RESULTS');
  console.log('=================================================');
  console.log(`Updated ${updatedFiles} out of ${filesToUpdate.length} files.`);
  
  if (updatedFiles > 0) {
    console.log('✅ Database URLs fixed successfully!');
  } else {
    console.log('❌ No files were updated.');
  }
}

// Run the function
updateFiles();
