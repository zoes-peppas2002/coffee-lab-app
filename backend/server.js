const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require('dotenv').config();

const initDb = require('./init-db');
const usersRoutes = require("./routes/users");
const authRoutes = require('./routes/direct-auth'); // Consolidated auth route
const storeRoutes = require("./routes/stores");
const checklistRoutes = require('./routes/checklists');
const templatesRoutes = require('./routes/templates');
const statsRoutes = require('./routes/stats');
const networkRoutes = require('./routes/network');

// Path to frontend build directory
const FRONTEND_BUILD_PATH = path.join(__dirname, 'frontend-build');

const app = express();
const PORT = process.env.PORT || 5000;

// Επιλογή του κατάλληλου pool ανάλογα με το περιβάλλον
let pool;
if (process.env.NODE_ENV === 'production') {
  // Χρήση PostgreSQL στο Render
  pool = require('./db-pg');
  console.log('Using PostgreSQL database');
} else {
  // Χρήση MySQL τοπικά
  pool = require('./db');
  console.log('Using MySQL database');
}

// Middleware

// Add CORS debugging middleware
app.use((req, res, next) => {
  console.log('CORS origin:', req.headers.origin);
  console.log('CORS method:', req.method);
  console.log('CORS headers:', JSON.stringify(req.headers));
  next();
});

app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://172.20.10.4:5173'],
  credentials: false, // Changed to false to match API settings
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


// Middleware to catch and fix URLs in request paths
app.use((req, res, next) => {
  // Check if the request path contains a URL
  if (req.path.includes('https://') || req.path.includes('http://') || req.path.includes('git.new/')) {
    console.error('Invalid URL in request path:', req.path);
    return res.status(400).json({ error: 'Invalid URL in request path' });
  }
  next();
});



// Middleware to catch and fix invalid route paths
app.use((req, res, next) => {
  // Check if the request URL contains 'https://' or 'http://' in the path
  if (req.path.includes('https://') || req.path.includes('http://')) {
    console.error('Invalid route path detected:', req.path);
    return res.status(400).json({ error: 'Invalid route path' });
  }
  next();
});


// Serve static files
app.use('/static', express.static(path.join(__dirname, 'static'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }
  }
}));

// Special route for PDF files to handle Greek characters
app.get('/static/pdfs/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'static', 'pdfs', filename);
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    fs.createReadStream(filePath).pipe(res);
  } else {
    console.error(`File not found: ${filePath}`);
    res.status(404).send('File not found');
  }
});

// Fallback route for old PDF URLs
app.use('/pdfs/:filename', (req, res) => {
  const filename = req.params.filename;
  res.redirect(`/static/pdfs/${filename}`);
});

// Attach pool to each request (αποφεύγουμε διπλές δηλώσεις)
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Debug route to test login - IMPORTANT: This must be defined BEFORE the API routes
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

// Routes
app.use("/api/direct-auth", authRoutes); // Direct auth route first
app.use("/api/auth", authRoutes); // Then regular auth route
app.use("/api/users", usersRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/templates", templatesRoutes);
app.use("/api/checklists", checklistRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/network", networkRoutes);

// Also add the test-login endpoint with the /api prefix for compatibility
app.post("/api/test-login", (req, res) => {
  console.log('=== API TEST LOGIN ENDPOINT ===');
  console.log('Request body:', JSON.stringify(req.body));
  console.log('Headers:', JSON.stringify(req.headers));
  
  const { email, password } = req.body;
  
  // Special case for admin user (hardcoded fallback)
  if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {
    console.log('Admin login successful (API test endpoint)');
    
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

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  console.log('Serving frontend static files from:', FRONTEND_BUILD_PATH);
  
  // Serve static files from the frontend build directory
  app.use(express.static(FRONTEND_BUILD_PATH));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api') || req.path.startsWith('/static')) {
      return next();
    }
    
    res.sendFile(path.join(FRONTEND_BUILD_PATH, 'index.html'));
  });
} else {
  // In development, just show API is working
  app.get("/", (req, res) => {
    res.send("✅ Backend API working!");
  });
}

// Initialize database
initDb().then(() => {
  console.log('Database initialized successfully');
}).catch(err => {
  console.error('Failed to initialize database:', err);
});


// Add error handling for path-to-regexp errors
process.on('uncaughtException', (err) => {
  if (err.message && err.message.includes('Missing parameter name')) {
    console.error('Path-to-regexp error detected. This is likely caused by an invalid route path.');
    console.error('Error details:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Log all registered routes for debugging
    console.log('Registered routes:');
    app._router.stack.forEach(middleware => {
      if (middleware.route) {
        // Routes registered directly on the app
        console.log(`- ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
      } else if (middleware.name === 'router') {
        // Router middleware
        middleware.handle.stack.forEach(handler => {
          if (handler.route) {
            console.log(`- ${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${handler.route.path}`);
          }
        });
      }
    });
  } else {
    // For other uncaught exceptions, log and exit
    console.error('Uncaught exception:', err);
  }
});


// Add error handling for path-to-regexp errors
process.on('uncaughtException', (err) => {
  if (err.message && err.message.includes('Missing parameter name')) {
    console.error('Path-to-regexp error detected. This is likely caused by an invalid route path.');
    console.error('Error details:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Log all registered routes for debugging
    console.log('Registered routes:');
    app._router.stack.forEach(middleware => {
      if (middleware.route) {
        // Routes registered directly on the app
        console.log(`- ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
      } else if (middleware.name === 'router') {
        // Router middleware
        middleware.handle.stack.forEach(handler => {
          if (handler.route) {
            console.log(`- ${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${handler.route.path}`);
          }
        });
      }
    });
  } else {
    // For other uncaught exceptions, log and exit
    console.error('Uncaught exception:', err);
  }
});


// Add error handling for path-to-regexp errors
process.on('uncaughtException', (err) => {
  if (err.message && err.message.includes('Missing parameter name')) {
    console.error('Path-to-regexp error detected. This is likely caused by an invalid route path.');
    console.error('Error details:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Log all registered routes for debugging
    console.log('Registered routes:');
    app._router.stack.forEach(middleware => {
      if (middleware.route) {
        // Routes registered directly on the app
        console.log(`- ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
      } else if (middleware.name === 'router') {
        // Router middleware
        middleware.handle.stack.forEach(handler => {
          if (handler.route) {
            console.log(`- ${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${handler.route.path}`);
          }
        });
      }
    });
  } else {
    // For other uncaught exceptions, log and exit
    console.error('Uncaught exception:', err);
  }
});


// Add error handling for path-to-regexp errors
process.on('uncaughtException', (err) => {
  if (err.message && err.message.includes('Missing parameter name')) {
    console.error('Path-to-regexp error detected. This is likely caused by an invalid route path.');
    console.error('Error details:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Log all registered routes for debugging
    console.log('Registered routes:');
    app._router.stack.forEach(middleware => {
      if (middleware.route) {
        // Routes registered directly on the app
        console.log(`- ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
      } else if (middleware.name === 'router') {
        // Router middleware
        middleware.handle.stack.forEach(handler => {
          if (handler.route) {
            console.log(`- ${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${handler.route.path}`);
          }
        });
      }
    });
  } else {
    // For other uncaught exceptions, log and exit
    console.error('Uncaught exception:', err);
  }
});


// Add error handling for path-to-regexp errors
process.on('uncaughtException', (err) => {
  if (err.message && err.message.includes('Missing parameter name')) {
    console.error('Path-to-regexp error detected. This is likely caused by an invalid route path.');
    console.error('Error details:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Log all registered routes for debugging
    console.log('Registered routes:');
    app._router.stack.forEach(middleware => {
      if (middleware.route) {
        // Routes registered directly on the app
        console.log(`- ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
      } else if (middleware.name === 'router') {
        // Router middleware
        middleware.handle.stack.forEach(handler => {
          if (handler.route) {
            console.log(`- ${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${handler.route.path}`);
          }
        });
      }
    });
  } else {
    // For other uncaught exceptions, log and exit
    console.error('Uncaught exception:', err);
  }
});


// Add error handling for path-to-regexp errors
process.on('uncaughtException', (err) => {
  if (err.message && err.message.includes('Missing parameter name')) {
    console.error('Path-to-regexp error detected. This is likely caused by an invalid route path.');
    console.error('Error details:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Log all registered routes for debugging
    console.log('Registered routes:');
    app._router.stack.forEach(middleware => {
      if (middleware.route) {
        // Routes registered directly on the app
        console.log(`- ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
      } else if (middleware.name === 'router') {
        // Router middleware
        middleware.handle.stack.forEach(handler => {
          if (handler.route) {
            console.log(`- ${Object.keys(handler.route.methods).join(', ').toUpperCase()} ${handler.route.path}`);
          }
        });
      }
    });
  } else {
    // For other uncaught exceptions, log and exit
    console.error('Uncaught exception:', err);
  }
});

app.listen(PORT, () => {
  const isDev = process.env.NODE_ENV === 'development';
  console.log(`🚀 Server running on ${isDev ? `http://localhost:${PORT}` : `port ${PORT}`}`);
});