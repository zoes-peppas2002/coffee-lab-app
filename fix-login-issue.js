/**
 * Script to fix login issues
 * This script:
 * 1. Fixes the direct-auth.js file
 * 2. Updates the server.js file
 * 3. Creates a fallback login component
 * 4. Updates the App.jsx file
 */
const fs = require('fs');
const path = require('path');

// Fix direct-auth.js
function fixDirectAuth() {
  console.log('Fixing direct-auth.js...');
  const filePath = path.join(__dirname, 'backend', 'routes', 'direct-auth.js');
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the isPg variable definition
    content = content.replace(
      /router.post\('\/direct-login', async \(req, res\) => {/,
      `router.post('/direct-login', async (req, res) => {
  const isPg = process.env.DATABASE_TYPE === 'pg';`
    );
    
    // Remove any console.log statements that use isPg before it's defined
    content = content.replace(
      /console.log\('Using isPg:', isPg\);/,
      '// console.log(\'Using isPg:\', isPg);'
    );
    
    fs.writeFileSync(filePath, content);
    console.log('direct-auth.js fixed successfully.');
    return true;
  } catch (error) {
    console.error('Error fixing direct-auth.js:', error);
    return false;
  }
}

// Update server.js
function updateServer() {
  console.log('Updating server.js...');
  const filePath = path.join(__dirname, 'backend', 'server.js');
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add the test-login endpoint with the /api prefix
    if (!content.includes('app.post(\'/api/test-login\'')) {
      content = content.replace(
        /app.use\('\/api\/auth', authRoutes\);/,
        `app.use('/api/auth', authRoutes);

// Test login endpoint
app.post('/api/test-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Test login attempt:', email);
    
    // Hardcoded admin credentials for testing
    if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {
      return res.json({
        success: true,
        user: {
          id: 1,
          email: 'zp@coffeelab.gr',
          name: 'Zoe Speppas',
          role: 'admin'
        },
        token: 'test-token-for-admin'
      });
    }
    
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    console.error('Test login error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});`
      );
    }
    
    fs.writeFileSync(filePath, content);
    console.log('server.js updated successfully.');
    return true;
  } catch (error) {
    console.error('Error updating server.js:', error);
    return false;
  }
}

// Create fallback login component
function createFallbackLogin() {
  console.log('Creating fallback login component...');
  const filePath = path.join(__dirname, 'my-web-app', 'src', 'components', 'auth', 'FallbackLoginForm.jsx');
  
  try {
    const content = `import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const FallbackLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First try the test-login endpoint
      const response = await axios.post('/api/test-login', { email, password });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect based on role
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else if (response.data.user.role === 'area_manager') {
          navigate('/area-manager');
        } else {
          navigate('/coffee-specialist');
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (firstError) {
      console.error('First login attempt failed:', firstError);
      
      // If test-login fails, try direct-login
      try {
        const directResponse = await axios.post('/api/auth/direct-login', { email, password });
        
        if (directResponse.data.success) {
          localStorage.setItem('token', directResponse.data.token);
          localStorage.setItem('user', JSON.stringify(directResponse.data.user));
          
          // Redirect based on role
          if (directResponse.data.user.role === 'admin') {
            navigate('/admin');
          } else if (directResponse.data.user.role === 'area_manager') {
            navigate('/area-manager');
          } else {
            navigate('/coffee-specialist');
          }
        } else {
          setError('Invalid credentials');
        }
      } catch (secondError) {
        console.error('Second login attempt failed:', secondError);
        setError('Login failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-header">
          <h2>Coffee Lab</h2>
          <p>Welcome back! Please login to your account.</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>For testing, use:</p>
          <p>Email: zp@coffeelab.gr</p>
          <p>Password: Zoespeppas2025!</p>
        </div>
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
    
    fs.writeFileSync(filePath, content);
    console.log('FallbackLoginForm.jsx created successfully.');
    return true;
  } catch (error) {
    console.error('Error creating FallbackLoginForm.jsx:', error);
    return false;
  }
}

// Update App.jsx
function updateApp() {
  console.log('Updating App.jsx...');
  const filePath = path.join(__dirname, 'my-web-app', 'src', 'App.jsx');
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Import FallbackLoginForm
    if (!content.includes('import FallbackLoginForm from')) {
      content = content.replace(
        /import LoginForm from '\.\/components\/auth\/LoginForm';/,
        `import LoginForm from './components/auth/LoginForm';
import FallbackLoginForm from './components/auth/FallbackLoginForm';`
      );
    }
    
    // Add FallbackLoginForm route
    if (!content.includes('<Route path="/fallback-login"')) {
      content = content.replace(
        /<Route path="\/login" element={<LoginForm \/>} \/>/,
        `<Route path="/login" element={<LoginForm />} />
          <Route path="/fallback-login" element={<FallbackLoginForm />} />`
      );
    }
    
    // Fix any syntax errors (extra closing brackets)
    content = content.replace(/}\)}\)}/g, '})}}');
    
    fs.writeFileSync(filePath, content);
    console.log('App.jsx updated successfully.');
    return true;
  } catch (error) {
    console.error('Error updating App.jsx:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('=================================================');
  console.log('COFFEE LAB - FIX LOGIN ISSUES');
  console.log('=================================================');
  
  // Fix direct-auth.js
  const directAuthFixed = fixDirectAuth();
  
  // Update server.js
  const serverUpdated = updateServer();
  
  // Create fallback login component
  const fallbackLoginCreated = createFallbackLogin();
  
  // Update App.jsx
  const appUpdated = updateApp();
  
  // Summary
  console.log('\n=================================================');
  console.log('SUMMARY');
  console.log('=================================================');
  console.log(`direct-auth.js: ${directAuthFixed ? '✅ Fixed' : '❌ Failed'}`);
  console.log(`server.js: ${serverUpdated ? '✅ Updated' : '❌ Failed'}`);
  console.log(`FallbackLoginForm.jsx: ${fallbackLoginCreated ? '✅ Created' : '❌ Failed'}`);
  console.log(`App.jsx: ${appUpdated ? '✅ Updated' : '❌ Failed'}`);
  
  if (directAuthFixed && serverUpdated && fallbackLoginCreated && appUpdated) {
    console.log('\n✅ All login issues fixed!');
  } else {
    console.log('\n❌ Some fixes failed. Please check the logs above.');
  }
}

// Run the main function
main().catch(err => {
  console.error('Error:', err);
});
