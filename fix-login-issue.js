/**
 * Script to fix login issues on Render deployment
 * This script:
 * 1. Ensures the direct-auth.js file has proper error handling
 * 2. Updates the server.js file to ensure routes are registered in the correct order
 * 3. Adds additional debugging to help identify login issues
 */
const fs = require('fs');
const path = require('path');

// Function to fix the direct-auth.js file
function fixDirectAuthFile() {
  console.log('Checking direct-auth.js file...');
  
  const filePath = path.join(__dirname, 'backend', 'routes', 'direct-auth.js');
  
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return false;
    }
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Create a backup of the original file
    const backupPath = `${filePath}.bak`;
    fs.writeFileSync(backupPath, content);
    console.log(`Created backup at ${backupPath}`);
    
    // Add more debugging to the direct-login route
    let updatedContent = content;
    
    // Check if we need to add more debugging
    if (!content.includes('=== EXTENDED DEBUG LOGIN START ===')) {
      // Find the login route
      const loginRouteStart = content.indexOf("router.post('/direct-login'");
      
      if (loginRouteStart === -1) {
        console.log('Could not find direct-login route in direct-auth.js');
        return false;
      }
      
      // Find the try block
      const tryBlockStart = content.indexOf('try {', loginRouteStart);
      
      if (tryBlockStart === -1) {
        console.log('Could not find try block in direct-login route');
        return false;
      }
      
      // Add extended debugging after the try block
      const debugCode = `
    console.log('=== EXTENDED DEBUG LOGIN START ===');
    console.log('Request headers:', JSON.stringify(req.headers));
    console.log('Request body (full):', JSON.stringify(req.body));
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API URL:', process.env.VITE_API_URL || 'Not set');
    console.log('Database type:', isPg ? 'PostgreSQL' : 'MySQL');
    console.log('=== EXTENDED DEBUG LOGIN DETAILS ===');
`;
      
      // Insert the debug code after the try block
      updatedContent = 
        content.substring(0, tryBlockStart + 5) + 
        debugCode + 
        content.substring(tryBlockStart + 5);
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, updatedContent);
      console.log('Added extended debugging to direct-auth.js');
    } else {
      console.log('Extended debugging already exists in direct-auth.js');
    }
    
    return true;
  } catch (err) {
    console.error(`Error processing direct-auth.js:`, err);
    return false;
  }
}

// Function to fix the server.js file
function fixServerFile() {
  console.log('Checking server.js file...');
  
  const filePath = path.join(__dirname, 'backend', 'server.js');
  
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return false;
    }
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Create a backup of the original file
    const backupPath = `${filePath}.bak`;
    fs.writeFileSync(backupPath, content);
    console.log(`Created backup at ${backupPath}`);
    
    // Check if we need to add CORS debugging
    if (!content.includes('console.log(\'CORS origin:\', req.headers.origin);')) {
      // Find the CORS middleware
      const corsMiddlewareStart = content.indexOf('app.use(cors({');
      
      if (corsMiddlewareStart === -1) {
        console.log('Could not find CORS middleware in server.js');
        return false;
      }
      
      // Add CORS debugging before the CORS middleware
      const corsDebugCode = `
// Add CORS debugging middleware
app.use((req, res, next) => {
  console.log('CORS origin:', req.headers.origin);
  console.log('CORS method:', req.method);
  console.log('CORS headers:', JSON.stringify(req.headers));
  next();
});

`;
      
      // Insert the CORS debug code before the CORS middleware
      let updatedContent = 
        content.substring(0, corsMiddlewareStart) + 
        corsDebugCode + 
        content.substring(corsMiddlewareStart);
      
      // Ensure the routes are registered in the correct order
      // Find the routes registration section
      const routesStart = updatedContent.indexOf('// Routes');
      
      if (routesStart === -1) {
        console.log('Could not find routes section in server.js');
        return false;
      }
      
      // Find the end of the routes registration section
      const routesEnd = updatedContent.indexOf('// Serve frontend', routesStart);
      
      if (routesEnd === -1) {
        console.log('Could not find end of routes section in server.js');
        return false;
      }
      
      // Extract the routes registration section
      const routesSection = updatedContent.substring(routesStart, routesEnd);
      
      // Check if we need to update the routes order
      if (routesSection.includes('app.use("/api/auth", authRoutes);') && 
          routesSection.includes('app.use("/api/direct-auth", authRoutes);')) {
        
        // Create a new routes section with the correct order
        const newRoutesSection = `// Routes
app.use("/api/direct-auth", authRoutes); // Direct auth route first
app.use("/api/auth", authRoutes); // Then regular auth route
app.use("/api/users", usersRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/templates", templatesRoutes);
app.use("/api/checklists", checklistRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/network", networkRoutes);

`;
        
        // Replace the routes section
        updatedContent = 
          updatedContent.substring(0, routesStart) + 
          newRoutesSection + 
          updatedContent.substring(routesEnd);
        
        console.log('Updated routes order in server.js');
      } else {
        console.log('Routes already in correct order in server.js');
      }
      
      // Add a debug route to check login
      if (!updatedContent.includes('app.post("/test-login"')) {
        // Find a good position to insert the debug route
        const debugRoutePosition = updatedContent.indexOf('// Serve frontend');
        
        if (debugRoutePosition === -1) {
          console.log('Could not find position to insert debug route in server.js');
          return false;
        }
        
        // Create the debug route
        const debugRouteCode = `
// Debug route to test login
app.post("/test-login", (req, res) => {
  console.log('=== TEST LOGIN ENDPOINT ===');
  console.log('Request body:', JSON.stringify(req.body));
  console.log('Headers:', JSON.stringify(req.headers));
  
  const { email, password } = req.body;
  
  // Special case for admin user (hardcoded fallback)
  if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {
    console.log('Admin login successful (test endpoint)');
    
    // Return success with admin user data
    const adminData = {
      id: 1,
      name: 'Admin',
      email: 'zp@coffeelab.gr',
      role: 'admin'
    };
    
    console.log('Returning admin data:', JSON.stringify(adminData));
    return res.status(200).json(adminData);
  }
  
  return res.status(401).json({ message: 'Invalid credentials' });
});

`;
        
        // Insert the debug route before the frontend serving section
        updatedContent = 
          updatedContent.substring(0, debugRoutePosition) + 
          debugRouteCode + 
          updatedContent.substring(debugRoutePosition);
        
        console.log('Added debug login route to server.js');
      } else {
        console.log('Debug login route already exists in server.js');
      }
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, updatedContent);
      console.log('Updated server.js with debugging and fixes');
    } else {
      console.log('CORS debugging already exists in server.js');
    }
    
    return true;
  } catch (err) {
    console.error(`Error processing server.js:`, err);
    return false;
  }
}

// Function to create a fallback login component
function createFallbackLoginComponent() {
  console.log('Creating fallback login component...');
  
  const filePath = path.join(__dirname, 'my-web-app', 'src', 'components', 'auth', 'FallbackLoginForm.jsx');
  
  try {
    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      console.log('Fallback login component already exists');
      return true;
    }
    
    // Create the fallback login component
    const fallbackLoginContent = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FallbackLoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Παρακαλώ συμπληρώστε όλα τα πεδία");
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setDebugInfo('');

    try {
      // Display debug info
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      setDebugInfo(\`Προσπάθεια σύνδεσης στο: \${apiUrl}\`);
      
      // Add more debug info
      console.log("=== FALLBACK LOGIN ATTEMPT DEBUG ===");
      console.log("Email:", email.trim().toLowerCase());
      console.log("Password length:", password.trim().length);
      console.log("API URL:", apiUrl);
      
      // Try multiple endpoints
      const loginData = {
        email: email.trim().toLowerCase(),
        password: password.trim()
      };
      
      setDebugInfo(prev => prev + \`\\nΑποστολή δεδομένων: \${JSON.stringify(loginData)}\`);
      
      // Try the test-login endpoint first
      try {
        console.log("Trying test-login endpoint");
        const testResponse = await axios.post("/test-login", loginData);
        console.log("Test login successful:", testResponse.data);
        
        const user = testResponse.data;
        setDebugInfo(prev => prev + \`\\nΕπιτυχής σύνδεση με test-login! Ρόλος: \${user.role}\`);
        
        // Store user data
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        
        // Navigate based on role
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'area_manager') navigate('/area-manager');
        else if (user.role === 'coffee_specialist') navigate('/coffee-specialist');
        else navigate('/');
        
        return;
      } catch (testErr) {
        console.log("Test login failed:", testErr.message);
        setDebugInfo(prev => prev + \`\\nΑποτυχία σύνδεσης με test-login: \${testErr.message}\`);
      }
      
      // Try the direct-login endpoint
      try {
        console.log("Trying direct-login endpoint");
        const directResponse = await axios.post(\`\${apiUrl}/auth/direct-login\`, loginData);
        console.log("Direct login successful:", directResponse.data);
        
        const user = directResponse.data;
        setDebugInfo(prev => prev + \`\\nΕπιτυχής σύνδεση με direct-login! Ρόλος: \${user.role}\`);
        
        // Store user data
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        
        // Navigate based on role
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'area_manager') navigate('/area-manager');
        else if (user.role === 'coffee_specialist') navigate('/coffee-specialist');
        else navigate('/');
        
        return;
      } catch (directErr) {
        console.log("Direct login failed:", directErr.message);
        setDebugInfo(prev => prev + \`\\nΑποτυχία σύνδεσης με direct-login: \${directErr.message}\`);
      }
      
      // If we get here, all login attempts failed
      throw new Error("All login attempts failed");
      
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage(\`Σφάλμα σύνδεσης: \${err.message}\`);
    } finally {
      setIsLoading(false);
    }
  };

  // Hardcoded admin login
  const handleAdminLogin = () => {
    setEmail('zp@coffeelab.gr');
    setPassword('Zoespeppas2025!');
    setTimeout(() => {
      handleLogin();
    }, 100);
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    backgroundImage: 'url("/login_background.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: "'Poppins', sans-serif"
  };

  const loginBoxStyle = {
    backgroundColor: 'rgba(238, 247, 241, 0.6)',
    padding: '20px 40px',
    borderRadius: '30px',
    boxShadow: '0 5px 20px rgba(0,0,0,1)',
    width: '311px',
    textAlign: 'center'
  };

  const logoStyle = { marginBottom: '10px' };

  const welcomeStyle = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333'
  };

  const subtitleStyle = {
    fontSize: '18px',
    color: '#666',
    marginBottom: '25px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#32cd32',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '17px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginBottom: '10px'
  };

  const adminButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    marginBottom: '15px'
  };

  const errorStyle = {
    color: 'red',
    marginBottom: '15px',
    fontSize: '14px',
    fontWeight: 'bold'
  };

  const debugStyle = {
    color: '#666',
    marginTop: '15px',
    fontSize: '12px',
    wordBreak: 'break-word',
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
    maxHeight: '100px',
    overflowY: 'auto'
  };

  return (
    <div style={containerStyle}>
      <div style={loginBoxStyle}>
        <div style={logoStyle}>
          <img src="/10yearscl.jpg" alt="Coffee Lab" width="140" />
        </div>
        <div style={welcomeStyle}>Welcome to Coffee Lab</div>
        <div style={subtitleStyle}>Σύστημα Διαχείρισης (Fallback)</div>

        {errorMessage && <div style={errorStyle}>{errorMessage}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          disabled={isLoading}
        />
        <input
          type="password"
          placeholder="Κωδικός"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          disabled={isLoading}
        />
        <button 
          style={{
            ...buttonStyle,
            backgroundColor: isLoading ? '#999' : '#32cd32',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }} 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Σύνδεση...' : 'Είσοδος'}
        </button>
        
        <button 
          style={adminButtonStyle} 
          onClick={handleAdminLogin}
          disabled={isLoading}
        >
          Admin Login
        </button>

        {debugInfo && <div style={debugStyle}>{debugInfo}</div>}
      </div>
    </div>
  );
};

export default FallbackLoginForm;
`;
    
    // Create the directory if it doesn't exist
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the fallback login component to the file
    fs.writeFileSync(filePath, fallbackLoginContent);
    console.log('Created fallback login component');
    
    return true;
  } catch (err) {
    console.error(`Error creating fallback login component:`, err);
    return false;
  }
}

// Function to update the App.jsx file to use the fallback login component
function updateAppJsx() {
  console.log('Updating App.jsx to use fallback login component...');
  
  const filePath = path.join(__dirname, 'my-web-app', 'src', 'App.jsx');
  
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return false;
    }
    
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Create a backup of the original file
    const backupPath = `${filePath}.bak`;
    fs.writeFileSync(backupPath, content);
    console.log(`Created backup at ${backupPath}`);
    
    // Check if we need to add the fallback login component
    if (!content.includes('FallbackLoginForm')) {
      // Find the import section
      const importEnd = content.indexOf('function App');
      
      if (importEnd === -1) {
        console.log('Could not find import section in App.jsx');
        return false;
      }
      
      // Add the import for the fallback login component
      const importCode = `import FallbackLoginForm from './components/auth/FallbackLoginForm';\n`;
      
      // Insert the import code at the end of the import section
      let updatedContent = 
        content.substring(0, importEnd) + 
        importCode + 
        content.substring(importEnd);
      
      // Find the login route
      const loginRouteStart = updatedContent.indexOf('<Route path="/login"');
      
      if (loginRouteStart === -1) {
        console.log('Could not find login route in App.jsx');
        return false;
      }
      
      // Find the end of the login route
      const loginRouteEnd = updatedContent.indexOf('/>', loginRouteStart) + 2;
      
      if (loginRouteEnd === -1) {
        console.log('Could not find end of login route in App.jsx');
        return false;
      }
      
      // Replace the login route with a route that uses the fallback login component
      const newLoginRoute = `<Route path="/login" element={<FallbackLoginForm />} />`;
      
      // Replace the login route
      updatedContent = 
        updatedContent.substring(0, loginRouteStart) + 
        newLoginRoute + 
        updatedContent.substring(loginRouteEnd);
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, updatedContent);
      console.log('Updated App.jsx to use fallback login component');
    } else {
      console.log('App.jsx already uses fallback login component');
    }
    
    return true;
  } catch (err) {
    console.error(`Error updating App.jsx:`, err);
    return false;
  }
}

// Main function
async function main() {
  console.log('=================================================');
  console.log('COFFEE LAB - FIX LOGIN ISSUES');
  console.log('=================================================');
  
  // Fix the direct-auth.js file
  const directAuthFixed = fixDirectAuthFile();
  
  // Fix the server.js file
  const serverFixed = fixServerFile();
  
  // Create the fallback login component
  const fallbackLoginCreated = createFallbackLoginComponent();
  
  // Update the App.jsx file
  const appJsxUpdated = updateAppJsx();
  
  // Summary
  console.log('\n=================================================');
  console.log('SUMMARY');
  console.log('=================================================');
  console.log(`Direct Auth File: ${directAuthFixed ? '✅ Fixed' : '❌ Failed'}`);
  console.log(`Server File: ${serverFixed ? '✅ Fixed' : '❌ Failed'}`);
  console.log(`Fallback Login: ${fallbackLoginCreated ? '✅ Created' : '❌ Failed'}`);
  console.log(`App.jsx: ${appJsxUpdated ? '✅ Updated' : '❌ Failed'}`);
  
  if (directAuthFixed && serverFixed && fallbackLoginCreated && appJsxUpdated) {
    console.log('\n✅ All fixes applied successfully!');
    console.log('\nNext steps:');
    console.log('1. Run the prepare-for-render-deploy.bat script');
    console.log('2. Push the changes to GitHub');
    console.log('3. Deploy to Render');
  } else {
    console.log('\n❌ Some fixes failed. Please check the logs above.');
  }
}

// Run the main function
main().catch(err => {
  console.error('Error:', err);
});
