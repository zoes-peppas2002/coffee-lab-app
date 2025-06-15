const fs = require('fs');
const path = require('path');

// Function to fix route order in a file
async function fixRouteOrder(filePath) {
  console.log(`Checking file: ${filePath}`);
  
  try {
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file has route definitions
    if (!content.includes('router.get(') && !content.includes('router.post(')) {
      console.log(`  No routes found in ${filePath}`);
      return false;
    }
    
    console.log(`  Found routes in ${filePath}`);
    
    // Check for route order issues
    const hasRootRoute = content.includes('router.get("/",');
    const hasParamRoute = content.includes('router.get("/:');
    
    if (hasRootRoute && hasParamRoute) {
      // Check if root route is defined after param route
      const rootRouteIndex = content.indexOf('router.get("/",');
      const paramRouteIndex = content.indexOf('router.get("/:');
      
      if (rootRouteIndex > paramRouteIndex) {
        console.log(`  ⚠️ Route order issue detected in ${filePath}`);
        console.log(`  Root route (/) is defined after parameter route (/:id)`);
        
        // Create a backup of the original file
        const backupPath = `${filePath}.bak`;
        fs.writeFileSync(backupPath, content);
        console.log(`  Created backup at ${backupPath}`);
        
        // Extract the root route definition
        const routeStartIndex = content.indexOf('router.get("/",', paramRouteIndex);
        let routeEndIndex = content.indexOf('});', routeStartIndex);
        routeEndIndex = content.indexOf('\n', routeEndIndex) + 1;
        
        const rootRouteDefinition = content.substring(routeStartIndex, routeEndIndex);
        
        // Remove the root route from its current position
        const contentWithoutRootRoute = 
          content.substring(0, routeStartIndex) + 
          content.substring(routeEndIndex);
        
        // Find a good position to insert the root route (before any param routes)
        const insertPosition = contentWithoutRootRoute.indexOf('router.get("/:');
        
        // Insert the root route before the param route
        const fixedContent = 
          contentWithoutRootRoute.substring(0, insertPosition) + 
          rootRouteDefinition + 
          contentWithoutRootRoute.substring(insertPosition);
        
        // Write the fixed content back to the file
        fs.writeFileSync(filePath, fixedContent);
        console.log(`  ✅ Fixed route order in ${filePath}`);
        return true;
      } else {
        console.log(`  ✓ Route order is correct in ${filePath}`);
      }
    } else {
      console.log(`  ✓ No route order issues detected in ${filePath}`);
    }
    
    return false;
  } catch (err) {
    console.error(`  ❌ Error processing ${filePath}:`, err);
    return false;
  }
}

// Main function to process all route files
async function main() {
  console.log('🔍 Checking route files for order issues...');
  
  const routesDir = path.join(__dirname, 'backend', 'routes');
  
  try {
    // Get all .js files in the routes directory
    const files = fs.readdirSync(routesDir)
      .filter(file => file.endsWith('.js'))
      .map(file => path.join(routesDir, file));
    
    console.log(`Found ${files.length} route files`);
    
    // Process each file
    let fixedCount = 0;
    for (const file of files) {
      const fixed = await fixRouteOrder(file);
      if (fixed) fixedCount++;
    }
    
    if (fixedCount > 0) {
      console.log(`\n✅ Fixed route order issues in ${fixedCount} files`);
    } else {
      console.log('\n✅ No route order issues found');
    }
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

// Run the main function
main();
