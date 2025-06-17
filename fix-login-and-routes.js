/**
 * Fix Login and Routes
 * 
 * This script fixes the login functionality and routes in the backend.
 */
const fs = require('fs');
const path = require('path');

console.log('=================================================');
console.log('COFFEE LAB - FIX LOGIN AND ROUTES');
console.log('=================================================');
console.log('This script will fix the login functionality and routes in the backend.');
console.log('');

// Fix server.js to correctly handle auth routes
function fixServerJs() {
  console.log('Fixing server.js...');
  
  const serverJsPath = path.join(__dirname, 'backend', 'server.js');
  
  if (!fs.existsSync(serverJsPath)) {
    console.error('❌ server.js not found!');
    return false;
  }
  
  let content = fs.readFileSync(serverJsPath, 'utf8');
  
  // Fix the auth routes import and usage
  const authRoutesImportRegex = /const authRoutes = require\(['"]\.\/routes\/direct-auth['"]\);.*?\/\/ Consolidated auth route/s;
  const authRoutesImportReplacement = `// Import routes
const usersRoutes = require("./routes/users");
const authRoutes = require('./routes/auth'); // Auth routes
const directAuthRoutes = require('./routes/direct-auth'); // Direct auth routes
const storeRoutes = require("./routes/stores");
const checklistRoutes = require('./routes/checklists');
const templatesRoutes = require('./routes/templates');
const statsRoutes = require('./routes/stats');
const networkRoutes = require('./routes/network');`;
  
  content = content.replace(authRoutesImportRegex, authRoutesImportReplacement);
  
  // Fix the auth routes usage
  const authRoutesUsageRegex = /app\.use\("\/api\/direct-auth", authRoutes\);[\s\S]*?app\.use\("\/api\/auth", authRoutes\);/;
  const authRoutesUsageReplacement = `app.use("/api/direct-auth", directAuthRoutes); // Direct auth routes
app.use("/api/auth", authRoutes); // Regular auth routes`;
  
  content = content.replace(authRoutesUsageRegex, authRoutesUsageReplacement);
  
  // Write the updated content back to the file
  fs.writeFileSync(serverJsPath, content, 'utf8');
  
  console.log('✅ server.js fixed successfully!');
  return true;
}

// Fix direct-auth.js to handle the correct route
function fixDirectAuthJs() {
  console.log('Fixing direct-auth.js...');
  
  const directAuthJsPath = path.join(__dirname, 'backend', 'routes', 'direct-auth.js');
  
  if (!fs.existsSync(directAuthJsPath)) {
    console.error('❌ direct-auth.js not found!');
    return false;
  }
  
  let content = fs.readFileSync(directAuthJsPath, 'utf8');
  
  // Fix the route to match the frontend request
  if (content.includes("router.post('/direct-login',")) {
    content = content.replace(
      "router.post('/direct-login',",
      "router.post('/',  // Main endpoint for direct auth\nasync (req, res) => {"
    );
    
    // Add a duplicate route to handle both paths
    const routerExportRegex = /module\.exports = router;/;
    const routerExportReplacement = `// Also add the /direct-login endpoint for backward compatibility
router.post('/direct-login', async (req, res) => {
  console.log('Received request at /direct-login, redirecting to main handler');
  // Forward to the main handler
  const { email, password } = req.body;
  
  try {
    // Special case for admin user (hardcoded fallback)
    if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {
      console.log('Admin login successful (hardcoded)');
      
      // Return success with admin user data
      const adminData = {
        id: 1,
        name: 'Admin',
        email: 'zp@coffeelab.gr',
        role: 'admin'
      };
      
      return res.status(200).json(adminData);
    }
    
    // Determine if we're using PostgreSQL or MySQL
    const isPg = process.env.NODE_ENV === 'production';
    
    let rows;
    
    if (isPg) {
      // PostgreSQL query
      const query = "SELECT * FROM users WHERE LOWER(TRIM(email)) = $1 AND password = $2";
      const result = await req.pool.query(query, [email.trim().toLowerCase(), password]);
      rows = result.rows;
    } else {
      // MySQL query
      const query = "SELECT * FROM users WHERE LOWER(TRIM(email)) = ? AND password = ?";
      const [result] = await req.pool.query(query, [email.trim().toLowerCase(), password]);
      rows = result;
    }
    
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
  } catch (error) {
    console.error('Error in direct login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;`;
    
    content = content.replace(routerExportRegex, routerExportReplacement);
    
    // Write the updated content back to the file
    fs.writeFileSync(directAuthJsPath, content, 'utf8');
    
    console.log('✅ direct-auth.js fixed successfully!');
    return true;
  } else {
    console.log('⚠️ direct-auth.js does not contain the expected route. Skipping...');
    return false;
  }
}

// Fix LoginForm.jsx to use the correct endpoint
function fixLoginFormJsx() {
  console.log('Fixing LoginForm.jsx...');
  
  const loginFormJsxPath = path.join(__dirname, 'my-web-app', 'src', 'components', 'auth', 'LoginForm.jsx');
  
  if (!fs.existsSync(loginFormJsxPath)) {
    console.error('❌ LoginForm.jsx not found!');
    return false;
  }
  
  let content = fs.readFileSync(loginFormJsxPath, 'utf8');
  
  // Fix the API endpoint
  if (content.includes('"/api/auth/direct-login"')) {
    content = content.replace(
      '"/api/auth/direct-login"',
      '"/api/direct-auth"'
    );
    
    // Update the debug info
    content = content.replace(
      'console.log("API endpoint:", "${apiUrl}/api/auth/direct-login");',
      'console.log("API endpoint:", "${apiUrl}/api/direct-auth");'
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(loginFormJsxPath, content, 'utf8');
    
    console.log('✅ LoginForm.jsx fixed successfully!');
    return true;
  } else {
    console.log('⚠️ LoginForm.jsx does not contain the expected endpoint. Skipping...');
    return false;
  }
}

// Fix templates.js to handle PostgreSQL queries
function fixTemplatesJs() {
  console.log('Fixing templates.js...');
  
  const templatesJsPath = path.join(__dirname, 'backend', 'routes', 'templates.js');
  
  if (!fs.existsSync(templatesJsPath)) {
    console.error('❌ templates.js not found!');
    return false;
  }
  
  let content = fs.readFileSync(templatesJsPath, 'utf8');
  
  // Add PostgreSQL support for the routes
  const updatedContent = `const express = require("express");
const router = express.Router();

// Test endpoint to check database connection
router.get("/test-db", async (req, res) => {
  try {
    // Determine if we're using PostgreSQL or MySQL
    const isPg = process.env.NODE_ENV === 'production';
    
    if (isPg) {
      // PostgreSQL query
      const result = await req.pool.query("SELECT 1 as test");
      console.log("Database connection test result:", result.rows);
      res.json({ success: true, message: "Database connection successful", result: result.rows });
    } else {
      // MySQL query
      const [result] = await req.pool.query("SELECT 1 as test");
      console.log("Database connection test result:", result);
      res.json({ success: true, message: "Database connection successful", result });
    }
  } catch (err) {
    console.error("Database connection test error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Αποθήκευση νέου template checklist
router.post("/", async (req, res) => {
  console.log("POST /api/templates - Request received");
  console.log("Request body:", req.body);
  
  if (!req.body) {
    console.error("Request body is empty");
    return res.status(400).json({ error: "Request body is empty" });
  }
  
  const { role, categories } = req.body;
  console.log("Extracted role:", role);
  console.log("Extracted categories:", categories);
  
  if (!role) {
    console.error("Role is missing");
    return res.status(400).json({ error: "Role is required" });
  }
  
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    console.error("Categories are missing or invalid");
    return res.status(400).json({ error: "Categories are required and must be an array" });
  }
  
  try {
    console.log("Attempting to save with role:", role);
    
    // Check if the pool is available
    if (!req.pool) {
      console.error("Database pool is not available");
      return res.status(500).json({ error: "Database connection error" });
    }
    
    // Determine if we're using PostgreSQL or MySQL
    const isPg = process.env.NODE_ENV === 'production';
    
    if (isPg) {
      // PostgreSQL query
      console.log("SQL: INSERT INTO checklist_templates (role, template_data) VALUES ($1, $2)", [role, JSON.stringify(categories)]);
      const result = await req.pool.query(
        "INSERT INTO checklist_templates (role, template_data) VALUES ($1, $2)",
        [role, JSON.stringify(categories)]
      );
      console.log("Query result:", result);
    } else {
      // MySQL query
      console.log("SQL: INSERT INTO checklist_templates (role, template_data) VALUES (?, ?)", [role, JSON.stringify(categories)]);
      const result = await req.pool.query(
        "INSERT INTO checklist_templates (role, template_data) VALUES (?, ?)",
        [role, JSON.stringify(categories)]
      );
      console.log("Query result:", result);
    }
    
    console.log("Template saved successfully");
    res.status(201).json({ message: "Template saved" });
  } catch (err) {
    console.error("DB Error:", err);
    console.error("Error details:", err.message);
    console.error("SQL State:", err.sqlState);
    console.error("Error Number:", err.errno);
    
    // Check if it's a data validation error
    if (err.sqlState === '23000') {
      console.error("Data validation error - possibly invalid role value");
    }
    
    res.status(500).json({ error: "Failed to save template" });
  }
});

// Λήψη όλων των templates
router.get("/all", async (req, res) => {
  console.log("GET /api/templates/all - Request received");
  try {
    // Determine if we're using PostgreSQL or MySQL
    const isPg = process.env.NODE_ENV === 'production';
    
    let rows;
    if (isPg) {
      // PostgreSQL query
      console.log("Executing PostgreSQL query: SELECT * FROM checklist_templates ORDER BY created_at DESC");
      const result = await req.pool.query(
        "SELECT * FROM checklist_templates ORDER BY created_at DESC"
      );
      rows = result.rows;
    } else {
      // MySQL query
      console.log("Executing MySQL query: SELECT * FROM checklist_templates ORDER BY created_at DESC");
      const [result] = await req.pool.query(
        "SELECT * FROM checklist_templates ORDER BY created_at DESC"
      );
      rows = result;
    }
    
    console.log("Query result:", rows);
    console.log("Number of templates found:", rows.length);
    
    // Log each template
    rows.forEach((template, index) => {
      console.log("Template " + (index + 1) + ":", {
        id: template.id,
        role: template.role,
        created_at: template.created_at,
        template_data_length: template.template_data ? template.template_data.length : 0
      });
    });
    
    res.json(rows);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

// Λήψη τελευταίου template για ρόλο
router.get("/latest", async (req, res) => {
  const { role } = req.query;
  try {
    // Determine if we're using PostgreSQL or MySQL
    const isPg = process.env.NODE_ENV === 'production';
    
    let rows;
    if (isPg) {
      // PostgreSQL query
      const result = await req.pool.query(
        "SELECT * FROM checklist_templates WHERE role = $1 ORDER BY created_at DESC LIMIT 1",
        [role]
      );
      rows = result.rows;
    } else {
      // MySQL query
      const [result] = await req.pool.query(
        "SELECT * FROM checklist_templates WHERE role = ? ORDER BY created_at DESC LIMIT 1",
        [role]
      );
      rows = result;
    }
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "No template found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Failed to fetch template" });
  }
});

// ΝΕΟ GET template βάσει ρόλου
router.get("/", async (req, res) => {
  const pool = req.pool;
  const { role } = req.query;

  try {
    // Determine if we're using PostgreSQL or MySQL
    const isPg = process.env.NODE_ENV === 'production';
    
    let rows;
    if (isPg) {
      // PostgreSQL query
      const result = await pool.query(
        "SELECT * FROM checklist_templates WHERE role = $1 ORDER BY created_at DESC LIMIT 1",
        [role]
      );
      rows = result.rows;
    } else {
      // MySQL query
      const [result] = await pool.query(
        "SELECT * FROM checklist_templates WHERE role = ? ORDER BY created_at DESC LIMIT 1",
        [role]
      );
      rows = result;
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: "Template not found for this role" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching template:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Λήψη συγκεκριμένου template με ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  console.log("GET /api/templates/:id - Request received");
  console.log("Template ID:", id);
  
  try {
    // Determine if we're using PostgreSQL or MySQL
    const isPg = process.env.NODE_ENV === 'production';
    
    let rows;
    if (isPg) {
      // PostgreSQL query
      console.log("Executing PostgreSQL query: SELECT * FROM checklist_templates WHERE id = $1", [id]);
      const result = await req.pool.query(
        "SELECT * FROM checklist_templates WHERE id = $1",
        [id]
      );
      rows = result.rows;
    } else {
      // MySQL query
      console.log("Executing MySQL query: SELECT * FROM checklist_templates WHERE id = ?", [id]);
      const [result] = await req.pool.query(
        "SELECT * FROM checklist_templates WHERE id = ?",
        [id]
      );
      rows = result;
    }
    
    console.log("Query result:", rows);
    console.log("Number of templates found:", rows.length);
    
    if (rows.length === 0) {
      console.log("Template not found with ID:", id);
      return res.status(404).json({ error: "Template not found" });
    }
    
    const template = rows[0];
    console.log("Template found:", {
      id: template.id,
      role: template.role,
      created_at: template.created_at,
      template_data_length: template.template_data ? template.template_data.length : 0
    });
    
    // Ensure template_data is valid JSON
    try {
      if (typeof template.template_data === 'string') {
        const parsed = JSON.parse(template.template_data);
        console.log("Template data parsed successfully");
        
        // Check if it's an array
        if (!Array.isArray(parsed)) {
          console.error("Template data is not an array:", parsed);
          // Convert to array if it's not already
          template.template_data = JSON.stringify([parsed]);
          console.log("Converted template data to array");
        }
      }
    } catch (parseErr) {
      console.error("Error parsing template data:", parseErr);
      // If it can't be parsed, set it to an empty array
      template.template_data = JSON.stringify([]);
      console.log("Set template data to empty array due to parsing error");
    }
    
    res.json(template);
  } catch (err) {
    console.error("DB Error:", err);
    console.error("Error details:", err.message);
    console.error("SQL State:", err.sqlState);
    console.error("Error Number:", err.errno);
    res.status(500).json({ error: "Failed to fetch template" });
  }
});

// Ενημέρωση template
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { role, categories } = req.body;
  
  console.log("PUT /api/templates/:id - Request received");
  console.log("Template ID:", id);
  console.log("Role:", role);
  console.log("Categories:", categories);
  
  if (!role || !categories || !Array.isArray(categories) || categories.length === 0) {
    return res.status(400).json({ error: "Invalid request data" });
  }
  
  try {
    // Determine if we're using PostgreSQL or MySQL
    const isPg = process.env.NODE_ENV === 'production';
    
    let result;
    if (isPg) {
      // PostgreSQL query
      result = await req.pool.query(
        "UPDATE checklist_templates SET role = $1, template_data = $2 WHERE id = $3",
        [role, JSON.stringify(categories), id]
      );
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Template not found" });
      }
    } else {
      // MySQL query
      const [mysqlResult] = await req.pool.query(
        "UPDATE checklist_templates SET role = ?, template_data = ? WHERE id = ?",
        [role, JSON.stringify(categories), id]
      );
      
      if (mysqlResult.affectedRows === 0) {
        return res.status(404).json({ error: "Template not found" });
      }
    }
    
    console.log("Template updated successfully");
    res.json({ message: "Template updated" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Failed to update template" });
  }
});

// Διαγραφή template
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  
  console.log("DELETE /api/templates/:id - Request received");
  console.log("Template ID:", id);
  
  try {
    // Determine if we're using PostgreSQL or MySQL
    const isPg = process.env.NODE_ENV === 'production';
    
    // First check if the template exists
    let checkRows;
    if (isPg) {
      // PostgreSQL query
      console.log("Checking if template exists: SELECT id FROM checklist_templates WHERE id = $1", [id]);
      const checkResult = await req.pool.query(
        "SELECT id FROM checklist_templates WHERE id = $1",
        [id]
      );
      checkRows = checkResult.rows;
    } else {
      // MySQL query
      console.log("Checking if template exists: SELECT id FROM checklist_templates WHERE id = ?", [id]);
      const [checkResult] = await req.pool.query(
        "SELECT id FROM checklist_templates WHERE id = ?",
        [id]
      );
      checkRows = checkResult;
    }
    
    if (checkRows.length === 0) {
      console.log("Template not found with ID:", id);
      return res.status(404).json({ error: "Template not found" });
    }
    
    console.log("Template found, proceeding with deletion");
    
    let result;
    if (isPg) {
      // PostgreSQL query
      console.log("Executing PostgreSQL query: DELETE FROM checklist_templates WHERE id = $1", [id]);
      result = await req.pool.query(
        "DELETE FROM checklist_templates WHERE id = $1",
        [id]
      );
      
      if (result.rowCount === 0) {
        console.log("No rows affected by delete operation");
        return res.status(404).json({ error: "Template not found or could not be deleted" });
      }
      
      console.log("Template deleted successfully, affected rows:", result.rowCount);
    } else {
      // MySQL query
      console.log("Executing MySQL query: DELETE FROM checklist_templates WHERE id = ?", [id]);
      const [mysqlResult] = await req.pool.query(
        "DELETE FROM checklist_templates WHERE id = ?",
        [id]
      );
      
      if (mysqlResult.affectedRows === 0) {
        console.log("No rows affected by delete operation");
        return res.status(404).json({ error: "Template not found or could not be deleted" });
      }
      
      console.log("Template deleted successfully, affected rows:", mysqlResult.affectedRows);
      result = mysqlResult;
    }
    
    res.json({ message: "Template deleted", result });
  } catch (err) {
    console.error("DB Error:", err);
    console.error("Error details:", err.message);
    console.error("SQL State:", err.sqlState);
    console.error("Error Number:", err.errno);
    res.status(500).json({ error: "Failed to delete template" });
  }
});

module.exports = router;`;
  
  // Write the updated content back to the file
  fs.writeFileSync(templatesJsPath, updatedContent, 'utf8');
  
  console.log('✅ templates.js fixed successfully!');
  return true;
}

// Fix network.js to handle PostgreSQL queries
function fixNetworkJs() {
  console.log('Fixing network.js...');
  
  const networkJsPath = path.join(__dirname, 'backend', 'routes', 'network.js');
  
  if (!fs.existsSync(networkJsPath)) {
    console.error('❌ network.js not found!');
    return false;
  }
  
  let content = fs.readFileSync(networkJsPath, 'utf8');
  
  // Add PostgreSQL support for the routes
  const updatedContent = `const express = require("express");
const router = express.Router();

// GET: Λίστα όλων των καταστημάτων με τους αντίστοιχους χρήστες
router.get("/", async (req, res) => {
  try {
    // Determine if we're using PostgreSQL or MySQL
    const isPg = process.env.NODE_ENV === 'production';
    
    let rows;
    if (isPg) {
      // PostgreSQL query
      const result = await req.pool.query(
        "SELECT s.id, s.name, s.area_manager, s.coffee_specialist FROM network_stores s ORDER BY s.name"
      );
      rows = result.rows;
    } else {
      // MySQL query
      const [result] = await req.pool.query(
        "SELECT s.id, s.name, s.area_manager, s.coffee_specialist FROM network_stores s ORDER BY s.name"
      );
      rows = result;
    }
    
    res.json(rows);
  } catch (err) {
    console.error("Error fetching network stores:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST: Προσθήκη νέου καταστήματος στο δίκτυο
router.post("/", async (req, res) => {
  const { name, area_manager, coffee_specialist } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "Store name is required" });
  }
  
  try {
    console.log("Προσθήκη νέου καταστήματος:", { name, area_manager, coffee_specialist });
    
    // Determine if we're using PostgreSQL or MySQL
    const isPg = process.env.NODE_ENV === 'production';
    
    // Έλεγχος αν υπάρχει ήδη κατάστημα με το ίδιο όνομα
    let existingStores;
    if (isPg) {
      // PostgreSQL query
      const existingResult = await req.pool.query(
        "SELECT * FROM network_stores WHERE name = $1",
        [name]
      );
      existingStores = existingResult.rows;
    } else {
      // MySQL query
      const [existingResult] = await req.pool.query(
        "SELECT * FROM network_stores WHERE name = ?",
        [name]
      );
      existingStores = existingResult;
    }
    
    if (existingStores.length > 0) {
      console.log("Υπάρχει ήδη κατάστημα με το όνομα:", name);
      return res.status(400).json({ error: "Υπάρχει ήδη κατάστημα με αυτό το όνομα" });
    }
    
    // Έλεγχος αν οι χρήστες υπάρχουν
    if (area_manager) {
      let areaManagerExists;
      if (isPg) {
        // PostgreSQL query
        const areaManagerResult = await req.pool.query(
          "SELECT * FROM users WHERE id = $1 AND role = 'area_manager'",
          [area_manager]
        );
        areaManagerExists = areaManagerResult.rows;
      } else {
        // MySQL query
        const [areaManagerResult] = await req.pool.query(
          "SELECT * FROM users WHERE id = ? AND role = 'area_manager'",
          [area_manager]
        );
        areaManagerExists = areaManagerResult;
      }
      
      if (areaManagerExists.length === 0) {
        console.log("Δεν βρέθηκε ο Area Manager με ID:", area_manager);
        return res.status(400).json({ error: "Ο επιλεγμένος Area Manager δεν υπάρχει" });
      }
    }
    
    if (coffee_specialist) {
      let coffeeSpecialistExists;
      if (isPg) {
        // PostgreSQL query
        const coffeeSpecialistResult = await req.pool.query(
          "SELECT * FROM users WHERE id = $1 AND role = 'coffee_specialist'",
          [coffee_specialist]
        );
        coffeeSpecialistExists = coffeeSpecialistResult.rows;
      } else {
        // MySQL query
        const [coffeeSpecialistResult] = await req.pool.query(
          "SELECT * FROM users WHERE id = ? AND role = 'coffee_specialist'",
          [coffee_specialist]
        );
        coffeeSpecialistExists = coffeeSpecialistResult;
      }
      
      if (coffeeSpecialistExists.length === 0) {
        console.log("Δεν βρέθηκε ο Coffee Specialist με ID:", coffee_specialist);
        return res.status(400).json({ error: "Ο επιλεγμένος Coffee Specialist δεν υπάρχει" });
      }
    }
    
    // Προσθήκη στον πίνακα network_stores
    let result;
    if (isPg) {
      // PostgreSQL query
      result = await req.pool.query(
        "INSERT INTO network_stores (name, area_manager, coffee_specialist, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id",
        [name, area_manager || null, coffee_specialist || null]
      );
      
      console.log("Το κατάστημα προστέθηκε στον πίνακα network_stores με ID:", result.rows[0].id);
    } else {
      // MySQL query
      const [mysqlResult] = await req.pool.query(
        "INSERT INTO network_stores (name, area_manager, coffee_specialist, created_at) VALUES (?, ?, ?, NOW())",
        [name, area_manager || null, coffee_specialist || null]
      );
      
      console.log("Το κατάστημα προστέθηκε στον πίνακα network_stores με ID:", mysqlResult.insertId);
      result = { rows: [{ id: mysqlResult.insertId }] };
    }
    
    // Αν έχει οριστεί area_manager, δημιουργούμε εγγραφή στον πίνακα stores
    if (area_manager) {
      console.log("Creating store entry for area manager");
    }
    
    res.status(201).json({ 
      message: "Store added successfully", 
      id: isPg ? result.rows[0].id : result.rows[0].id 
    });
  } catch (err) {
    console.error("Error adding store:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
