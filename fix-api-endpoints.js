const fs = require('fs');
const path = require('path');

// Function to recursively find all .jsx and .js files in a directory
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to fix API endpoints in a file
function fixApiEndpoints(filePath) {
  console.log(`Checking file: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Replace direct API calls without /api prefix
  const patterns = [
    { from: /api\.get\(['"]\/users/g, to: 'api.get("/api/users' },
    { from: /api\.post\(['"]\/users/g, to: 'api.post("/api/users' },
    { from: /api\.put\(['"]\/users/g, to: 'api.put("/api/users' },
    { from: /api\.delete\(['"]\/users/g, to: 'api.delete("/api/users' },
    { from: /api\.get\(['"]\/checklists/g, to: 'api.get("/api/checklists' },
    { from: /api\.post\(['"]\/checklists/g, to: 'api.post("/api/checklists' },
    { from: /api\.put\(['"]\/checklists/g, to: 'api.put("/api/checklists' },
    { from: /api\.delete\(['"]\/checklists/g, to: 'api.delete("/api/checklists' },
    { from: /api\.get\(['"]\/templates/g, to: 'api.get("/api/templates' },
    { from: /api\.post\(['"]\/templates/g, to: 'api.post("/api/templates' },
    { from: /api\.put\(['"]\/templates/g, to: 'api.put("/api/templates' },
    { from: /api\.delete\(['"]\/templates/g, to: 'api.delete("/api/templates' },
    { from: /api\.get\(['"]\/stores/g, to: 'api.get("/api/stores' },
    { from: /api\.post\(['"]\/stores/g, to: 'api.post("/api/stores' },
    { from: /api\.put\(['"]\/stores/g, to: 'api.put("/api/stores' },
    { from: /api\.delete\(['"]\/stores/g, to: 'api.delete("/api/stores' },
    { from: /api\.get\(['"]\/network/g, to: 'api.get("/api/network' },
    { from: /api\.post\(['"]\/network/g, to: 'api.post("/api/network' },
    { from: /api\.put\(['"]\/network/g, to: 'api.put("/api/network' },
    { from: /api\.delete\(['"]\/network/g, to: 'api.delete("/api/network' },
    { from: /api\.get\(['"]\/stats/g, to: 'api.get("/api/stats' },
    { from: /api\.post\(['"]\/stats/g, to: 'api.post("/api/stats' },
    { from: /api\.put\(['"]\/stats/g, to: 'api.put("/api/stats' },
    { from: /api\.delete\(['"]\/stats/g, to: 'api.delete("/api/stats' },
    { from: /api\.get\(['"]\/auth/g, to: 'api.get("/api/auth' },
    { from: /api\.post\(['"]\/auth/g, to: 'api.post("/api/auth' },
    { from: /api\.put\(['"]\/auth/g, to: 'api.put("/api/auth' },
    { from: /api\.delete\(['"]\/auth/g, to: 'api.delete("/api/auth' }
  ];
  
  // Apply all patterns
  patterns.forEach(pattern => {
    const newContent = content.replace(pattern.from, pattern.to);
    if (newContent !== content) {
      modified = true;
      content = newContent;
    }
  });
  
  // Save the file if it was modified
  if (modified) {
    console.log(`Fixed API endpoints in: ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main function
function main() {
  console.log('Starting API endpoint fix script...');
  
  // Find all .jsx and .js files in the frontend directory
  const frontendDir = path.join(__dirname, 'my-web-app', 'src');
  const frontendFiles = findFiles(frontendDir);
  
  console.log(`Found ${frontendFiles.length} frontend files to check.`);
  
  // Fix API endpoints in all frontend files
  let fixedCount = 0;
  frontendFiles.forEach(file => {
    if (fixApiEndpoints(file)) {
      fixedCount++;
    }
  });
  
  console.log(`Fixed API endpoints in ${fixedCount} files.`);
  console.log('API endpoint fix script completed successfully!');
}

// Run the main function
main();
