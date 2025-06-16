const fs = require('fs');
const path = require('path');

// Function to fix route order issues in all route files
async function fixAllRouteFiles() {
  console.log('🔍 Checking all route files for route order issues...');
  
  const routesDir = path.join(__dirname, 'backend', 'routes');
  
  try {
    // Check if the routes directory exists
    if (!fs.existsSync(routesDir)) {
      console.error(`❌ Routes directory not found: ${routesDir}`);
      return false;
    }
    
    // Get all route files
    const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));
    console.log(`Found ${routeFiles.length} route files to check`);
    
    let fixedFiles = 0;
    
    for (const file of routeFiles) {
      const filePath = path.join(routesDir, file);
      console.log(`Checking ${file}...`);
      
      // Read the file
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Look for route definitions
      const routeRegex = /router\.(get|post|put|delete)\s*\(\s*["']([^"']+)["']/g;
      const routes = [];
      let match;
      
      while ((match = routeRegex.exec(content)) !== null) {
        const [fullMatch, method, route] = match;
        const index = match.index;
        routes.push({ method, route, index, fullMatch });
      }
      
      // Check for route order issues
      const paramRoutes = routes.filter(r => r.route.includes(':'));
      const staticRoutes = routes.filter(r => !r.route.includes(':') && r.route !== '/');
      const rootRoutes = routes.filter(r => r.route === '/');
      
      // Group routes by method
      const routesByMethod = {};
      routes.forEach(r => {
        if (!routesByMethod[r.method]) routesByMethod[r.method] = [];
        routesByMethod[r.method].push(r);
      });
      
      let hasIssues = false;
      let fixedContent = content;
      
      // Check each method group for order issues
      for (const method in routesByMethod) {
        const methodRoutes = routesByMethod[method];
        
        // Sort routes by specificity (root, static, param)
        methodRoutes.sort((a, b) => {
          if (a.route === '/' && b.route !== '/') return -1;
          if (a.route !== '/' && b.route === '/') return 1;
          if (!a.route.includes(':') && b.route.includes(':')) return -1;
          if (a.route.includes(':') && !b.route.includes(':')) return 1;
          return 0;
        });
        
        // Check if the current order is different from the sorted order
        for (let i = 0; i < methodRoutes.length; i++) {
          const currentRoute = methodRoutes[i];
          const sortedRoute = methodRoutes.find(r => r.route === currentRoute.route);
          
          if (currentRoute.index !== sortedRoute.index) {
            hasIssues = true;
            break;
          }
        }
      }
      
      if (hasIssues) {
        console.log(`⚠️ Route order issue detected in ${file}`);
        
        // Create a backup of the original file
        const backupPath = `${filePath}.bak`;
        fs.writeFileSync(backupPath, content);
        console.log(`Created backup at ${backupPath}`);
        
        // Fix the route order
        // This is a simplified approach - for a real fix, we would need to parse the file more carefully
        // and reorder the route definitions while preserving the rest of the code
        
        // For now, let's just check for the most common issue: parameterized routes before static routes
        for (const method in routesByMethod) {
          const methodRoutes = routesByMethod[method].sort((a, b) => {
            if (a.route === '/' && b.route !== '/') return -1;
            if (a.route !== '/' && b.route === '/') return 1;
            if (!a.route.includes(':') && b.route.includes(':')) return -1;
            if (a.route.includes(':') && !b.route.includes(':')) return 1;
            return 0;
          });
          
          // Find cases where a parameterized route comes before a static route
          for (let i = 0; i < methodRoutes.length - 1; i++) {
            const currentRoute = methodRoutes[i];
            const nextRoute = methodRoutes[i + 1];
            
            if (currentRoute.route.includes(':') && !nextRoute.route.includes(':')) {
              console.log(`Found issue: ${currentRoute.route} is defined before ${nextRoute.route}`);
              
              // Find the route handler for the static route
              const staticRouteStart = fixedContent.indexOf(nextRoute.fullMatch);
              let staticRouteEnd = fixedContent.indexOf('});', staticRouteStart);
              staticRouteEnd = fixedContent.indexOf('\n', staticRouteEnd) + 1;
              
              if (staticRouteStart === -1 || staticRouteEnd === 0) {
                console.log(`Could not find the static route handler for ${nextRoute.route}`);
                continue;
              }
              
              // Find the route handler for the parameterized route
              const paramRouteStart = fixedContent.indexOf(currentRoute.fullMatch);
              let paramRouteEnd = fixedContent.indexOf('});', paramRouteStart);
              paramRouteEnd = fixedContent.indexOf('\n', paramRouteEnd) + 1;
              
              if (paramRouteStart === -1 || paramRouteEnd === 0) {
                console.log(`Could not find the parameterized route handler for ${currentRoute.route}`);
                continue;
              }
              
              // Extract the route handlers
              const staticRouteHandler = fixedContent.substring(staticRouteStart, staticRouteEnd);
              const paramRouteHandler = fixedContent.substring(paramRouteStart, paramRouteEnd);
              
              // Remove the static route handler from its current position
              fixedContent = 
                fixedContent.substring(0, staticRouteStart) + 
                fixedContent.substring(staticRouteEnd);
              
              // Insert the static route handler before the parameterized route
              const newParamRouteStart = fixedContent.indexOf(currentRoute.fullMatch);
              fixedContent = 
                fixedContent.substring(0, newParamRouteStart) + 
                staticRouteHandler + 
                fixedContent.substring(newParamRouteStart);
              
              console.log(`Reordered routes: ${nextRoute.route} now comes before ${currentRoute.route}`);
            }
          }
        }
        
        // Write the fixed content back to the file
        fs.writeFileSync(filePath, fixedContent);
        console.log(`✅ Fixed route order in ${file}`);
        fixedFiles++;
      } else {
        console.log(`✓ Route order is already correct in ${file}`);
      }
    }
    
    if (fixedFiles > 0) {
      console.log(`✅ Successfully fixed ${fixedFiles} files`);
      return true;
    } else {
      console.log('ℹ️ No changes were made to any files');
      return false;
    }
  } catch (err) {
    console.error(`❌ Error processing route files:`, err);
    return false;
  }
}

// Run the function
fixAllRouteFiles().then(fixed => {
  if (fixed) {
    console.log('✅ Successfully fixed route order issues');
  } else {
    console.log('ℹ️ No route order issues were found or fixed');
  }
}).catch(err => {
  console.error('❌ Error:', err);
});
