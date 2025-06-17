const express = require('express');
const router = express.Router();

// Get the appropriate pool based on environment
let pool;
if (process.env.NODE_ENV === 'production') {
  pool = require("../db-pg");
  console.log('Direct-auth route using PostgreSQL database');
} else {
  pool = require("../db");
  console.log('Direct-auth route using MySQL database');
}

// Helper function to convert MySQL-style queries to PostgreSQL-style
function pgQuery(query, params = []) {
  // Replace ? with $1, $2, etc.
  let pgQuery = query;
  let paramCount = 0;
  pgQuery = pgQuery.replace(/\?/g, () => `$${++paramCount}`);
  
  return { query: pgQuery, params };
}

// Helper function to execute query based on environment
async function executeQuery(query, params = []) {
  try {
    if (process.env.NODE_ENV === 'production') {
      // PostgreSQL query
      const { query: pgSql, params: pgParams } = pgQuery(query, params);
      console.log('Executing PostgreSQL query:', pgSql);
      console.log('With parameters:', pgParams);
      const result = await pool.query(pgSql, pgParams);
      console.log('PostgreSQL query result:', JSON.stringify(result.rows));
      return [result.rows, result.fields];
    } else {
      // MySQL query
      console.log('Executing MySQL query:', query);
      console.log('With parameters:', params);
      const result = await pool.query(query, params);
      console.log('MySQL query result:', JSON.stringify(result[0]));
      return result;
    }
  } catch (error) {
    console.error('Error executing query:', error);
    console.error('Query was:', query);
    console.error('Parameters were:', params);
    console.error('Environment:', process.env.NODE_ENV);
    throw error;
  }
}

/**
 * Consolidated login endpoint that checks database for all users
 * Works with both MySQL (local) and PostgreSQL (production)
 */
router.post('/', async (req, res) => {
  try {
    console.log('DETAILED LOGIN DEBUG - Request received');
    console.log('Request URL:', req.originalUrl);
    console.log('Request method:', req.method);
    console.log('Request path:', req.path);
    console.log('Request query:', JSON.stringify(req.query));
    console.log('Request params:', JSON.stringify(req.params));
    console.log('Request body:', JSON.stringify(req.body));
    console.log('Request headers:', JSON.stringify(req.headers));

    // Determine if we're using PostgreSQL or MySQL
    const isPg = process.env.NODE_ENV === 'production';
    
    console.log('=== EXTENDED DEBUG LOGIN START ===');
    console.log('Request headers:', JSON.stringify(req.headers));
    console.log('Request body (full):', JSON.stringify(req.body));
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API URL:', process.env.VITE_API_URL || 'Not set');
    console.log('Database type:', isPg ? 'PostgreSQL' : 'MySQL');
    console.log('=== EXTENDED DEBUG LOGIN DETAILS ===');

    const { email, password } = req.body;
    
    console.log('=== DEBUG LOGIN START ===');
    console.log('Direct login attempt:', email);
    console.log('Request body:', JSON.stringify(req.body));
    
    // Special case for admin user (hardcoded fallback)
    if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {
      console.log('Admin login successful (hardcoded)');
      console.log('Using hardcoded admin credentials');
      
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
    console.log(`Using ${isPg ? 'PostgreSQL' : 'MySQL'} for login query`);
    
    // Check database for users
    try {
      const query = "SELECT * FROM users WHERE LOWER(TRIM(email)) = ? AND password = ?";
      console.log('Query:', query);
      console.log('Parameters:', [email.trim().toLowerCase(), password]);
      
      const [rows] = await executeQuery(query, [email.trim().toLowerCase(), password]);
      console.log('Query result:', JSON.stringify(rows));
      
      if (rows && rows.length > 0) {
        const user = rows[0];
        console.log('Login successful for:', user.name);
        
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        
        console.log('Returning user data:', JSON.stringify(userData));
        return res.status(200).json(userData);
      } else {
        console.log('Login failed for:', email);
        console.log('No matching user found in database');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      console.error('Error details:', dbError.message);
      console.error('Error stack:', dbError.stack);
      
      // If database check fails, still allow admin login as a last resort
      if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {
        console.log('Admin login successful (fallback after DB error)');
        
        return res.status(200).json({
          id: 1,
          name: 'Admin',
          email: 'zp@coffeelab.gr',
          role: 'admin'
        });
      }
      
      return res.status(500).json({ message: 'Database error during login' });
    }
    
  } catch (error) {
    console.error('Error in direct login:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    console.log('=== DEBUG LOGIN END ===');
    res.status(500).json({ message: 'Server error' });
  }
});

// Also add the /direct-login endpoint for backward compatibility
router.post('/direct-login', async (req, res) => {
  console.log('Received request at /direct-login, redirecting to main handler');
  
  try {
    // Forward to the main handler
    const { email, password } = req.body;
    
    // Special case for admin user (hardcoded fallback)
    if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {
      console.log('Admin login successful (hardcoded from /direct-login)');
      
      // Return success with admin user data
      const adminData = {
        id: 1,
        name: 'Admin',
        email: 'zp@coffeelab.gr',
        role: 'admin'
      };
      
      return res.status(200).json(adminData);
    }
    
    // Check database for users
    try {
      const query = "SELECT * FROM users WHERE LOWER(TRIM(email)) = ? AND password = ?";
      const [rows] = await executeQuery(query, [email.trim().toLowerCase(), password]);
      
      if (rows && rows.length > 0) {
        const user = rows[0];
        
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        
        return res.status(200).json(userData);
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (dbError) {
      console.error('Database error during login:', dbError);
      
      // If database check fails, still allow admin login as a last resort
      if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {
        console.log('Admin login successful (fallback after DB error)');
        
        return res.status(200).json({
          id: 1,
          name: 'Admin',
          email: 'zp@coffeelab.gr',
          role: 'admin'
        });
      }
      
      return res.status(500).json({ message: 'Database error during login' });
    }
  } catch (error) {
    console.error('Error in direct login (direct-login endpoint):', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;