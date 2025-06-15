const fs = require('fs');
const path = require('path');

// Function to fix the templates.js file
async function fixTemplatesFile() {
  console.log('🔍 Checking templates.js for route order issues...');
  
  const filePath = path.join(__dirname, 'backend', 'routes', 'templates.js');
  
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      return false;
    }
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for the problematic route patterns
    const rootRoutePattern = 'router.get("/", async (req, res)';
    const paramRoutePattern = 'router.get("/:id", async (req, res)';
    
    if (!content.includes(rootRoutePattern)) {
      console.log(`❌ Root route not found in templates.js`);
      return false;
    }
    
    if (!content.includes(paramRoutePattern)) {
      console.log(`❌ Parameter route not found in templates.js`);
      return false;
    }
    
    // Extract the root route definition
    const rootRouteStartIndex = content.indexOf(rootRoutePattern);
    let rootRouteEndIndex = content.indexOf('});', rootRouteStartIndex);
    rootRouteEndIndex = content.indexOf('\n', rootRouteEndIndex) + 1;
    
    // Extract the param route definition
    const paramRouteStartIndex = content.indexOf(paramRoutePattern);
    let paramRouteEndIndex = content.indexOf('});', paramRouteStartIndex);
    paramRouteEndIndex = content.indexOf('\n', paramRouteEndIndex) + 1;
    
    // Check if root route is defined after param route
    if (rootRouteStartIndex > paramRouteStartIndex) {
      console.log(`⚠️ Route order issue detected in templates.js`);
      console.log(`Root route (/) is defined after parameter route (/:id)`);
      
      // Create a backup of the original file
      const backupPath = `${filePath}.bak`;
      fs.writeFileSync(backupPath, content);
      console.log(`Created backup at ${backupPath}`);
      
      const rootRouteDefinition = content.substring(rootRouteStartIndex, rootRouteEndIndex);
      
      // Remove the root route from its current position
      const contentWithoutRootRoute = 
        content.substring(0, rootRouteStartIndex) + 
        content.substring(rootRouteEndIndex);
      
      // Insert the root route before the param route
      const fixedContent = 
        contentWithoutRootRoute.substring(0, paramRouteStartIndex) + 
        rootRouteDefinition + 
        contentWithoutRootRoute.substring(paramRouteStartIndex);
      
      // Write the fixed content back to the file
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✅ Fixed route order in templates.js`);
      return true;
    } else {
      console.log(`✓ Route order is already correct in templates.js`);
      return false;
    }
  } catch (err) {
    console.error(`❌ Error processing templates.js:`, err);
    return false;
  }
}

// Run the function
fixTemplatesFile().then(fixed => {
  if (fixed) {
    console.log('✅ Successfully fixed templates.js');
  } else {
    console.log('ℹ️ No changes were made to templates.js');
  }
}).catch(err => {
  console.error('❌ Error:', err);
});
