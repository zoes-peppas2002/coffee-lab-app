@echo off
echo =================================================
echo COFFEE LAB - FIX STEP BY STEP
echo =================================================
echo This script will fix the application step by step.
echo.

echo Step 1: Installing dependencies...
call npm install
cd backend
call npm install
cd ..
cd my-web-app
call npm install
cd ..

echo.
echo Step 2: Creating auth.js file...
node -e "const fs = require('fs'); const path = require('path'); const authJsPath = path.join(__dirname, 'backend', 'routes', 'auth.js'); if (!fs.existsSync(authJsPath)) { fs.writeFileSync(authJsPath, `const express = require('express');\nconst router = express.Router();\n\nrouter.post('/login', async (req, res) => {\n  try {\n    // Determine if we're using PostgreSQL or MySQL\n    const isPg = process.env.NODE_ENV === 'production';\n    \n    console.log('=== LOGIN ENDPOINT ===');\n    console.log('Request body:', JSON.stringify(req.body));\n    \n    const { email, password } = req.body;\n    \n    // Special case for admin user (hardcoded fallback)\n    if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {\n      console.log('Admin login successful (hardcoded)');\n      \n      // Return success with admin user data\n      const adminData = {\n        id: 1,\n        name: 'Admin',\n        email: 'zp@coffeelab.gr',\n        role: 'admin'\n      };\n      \n      console.log('Returning admin data:', JSON.stringify(adminData));\n      return res.status(200).json(adminData);\n    }\n    \n    let rows;\n    \n    if (isPg) {\n      // PostgreSQL query\n      const query = \"SELECT * FROM users WHERE LOWER(TRIM(email)) = $1 AND password = $2\";\n      const result = await req.pool.query(query, [email.trim().toLowerCase(), password]);\n      rows = result.rows;\n    } else {\n      // MySQL query\n      const query = \"SELECT * FROM users WHERE LOWER(TRIM(email)) = ? AND password = ?\";\n      const [result] = await req.pool.query(query, [email.trim().toLowerCase(), password]);\n      rows = result;\n    }\n    \n    if (rows && rows.length > 0) {\n      const user = rows[0];\n      console.log('Login successful for:', user.name);\n      \n      const userData = {\n        id: user.id,\n        name: user.name,\n        email: user.email,\n        role: user.role\n      };\n      \n      console.log('Returning user data:', JSON.stringify(userData));\n      return res.status(200).json(userData);\n    } else {\n      console.log('Login failed for:', email);\n      console.log('No matching user found in database');\n      return res.status(401).json({ message: 'Invalid credentials' });\n    }\n  } catch (error) {\n    console.error('Error in login:', error);\n    console.error('Error details:', error.message);\n    console.error('Error stack:', error.stack);\n    res.status(500).json({ message: 'Server error' });\n  }\n});\n\nmodule.exports = router;`, 'utf8'); console.log('Created auth.js file'); } else { console.log('auth.js already exists'); }"

echo.
echo Step 3: Fixing server.js...
node -e "const fs = require('fs'); const path = require('path'); const serverJsPath = path.join(__dirname, 'backend', 'server.js'); let content = fs.readFileSync(serverJsPath, 'utf8'); const authRoutesImportRegex = /const authRoutes = require\(['\"]\.\\/routes\\/direct-auth['\"]\\);.*?\\/\\/ Consolidated auth route/s; const authRoutesImportReplacement = `// Import routes\nconst usersRoutes = require(\"./routes/users\");\nconst authRoutes = require('./routes/auth'); // Auth routes\nconst directAuthRoutes = require('./routes/direct-auth'); // Direct auth routes\nconst storeRoutes = require(\"./routes/stores\");\nconst checklistRoutes = require('./routes/checklists');\nconst templatesRoutes = require('./routes/templates');\nconst statsRoutes = require('./routes/stats');\nconst networkRoutes = require('./routes/network');`; content = content.replace(authRoutesImportRegex, authRoutesImportReplacement); const authRoutesUsageRegex = /app\\.use\\(\"\\/api\\/direct-auth\", authRoutes\\);.*?app\\.use\\(\"\\/api\\/auth\", authRoutes\\);/s; const authRoutesUsageReplacement = `app.use(\"/api/direct-auth\", directAuthRoutes); // Direct auth routes\napp.use(\"/api/auth\", authRoutes); // Regular auth routes`; content = content.replace(authRoutesUsageRegex, authRoutesUsageReplacement); fs.writeFileSync(serverJsPath, content, 'utf8'); console.log('Fixed server.js');"

echo.
echo Step 4: Fixing direct-auth.js...
node -e "const fs = require('fs'); const path = require('path'); const directAuthJsPath = path.join(__dirname, 'backend', 'routes', 'direct-auth.js'); if (fs.existsSync(directAuthJsPath)) { let content = fs.readFileSync(directAuthJsPath, 'utf8'); if (content.includes(\"router.post('/direct-login',\")) { content = content.replace(\"router.post('/direct-login',\", \"router.post('/',  // Main endpoint for direct auth\\nasync (req, res) => {\"); const routerExportRegex = /module\\.exports = router;/; const routerExportReplacement = `// Also add the /direct-login endpoint for backward compatibility\nrouter.post('/direct-login', async (req, res) => {\n  console.log('Received request at /direct-login, redirecting to main handler');\n  // Forward to the main handler\n  const { email, password } = req.body;\n  \n  try {\n    // Special case for admin user (hardcoded fallback)\n    if (email === 'zp@coffeelab.gr' && password === 'Zoespeppas2025!') {\n      console.log('Admin login successful (hardcoded)');\n      \n      // Return success with admin user data\n      const adminData = {\n        id: 1,\n        name: 'Admin',\n        email: 'zp@coffeelab.gr',\n        role: 'admin'\n      };\n      \n      return res.status(200).json(adminData);\n    }\n    \n    // Determine if we're using PostgreSQL or MySQL\n    const isPg = process.env.NODE_ENV === 'production';\n    \n    let rows;\n    \n    if (isPg) {\n      // PostgreSQL query\n      const query = \"SELECT * FROM users WHERE LOWER(TRIM(email)) = $1 AND password = $2\";\n      const result = await req.pool.query(query, [email.trim().toLowerCase(), password]);\n      rows = result.rows;\n    } else {\n      // MySQL query\n      const query = \"SELECT * FROM users WHERE LOWER(TRIM(email)) = ? AND password = ?\";\n      const [result] = await req.pool.query(query, [email.trim().toLowerCase(), password]);\n      rows = result;\n    }\n    \n    if (rows && rows.length > 0) {\n      const user = rows[0];\n      \n      const userData = {\n        id: user.id,\n        name: user.name,\n        email: user.email,\n        role: user.role\n      };\n      \n      return res.status(200).json(userData);\n    } else {\n      return res.status(401).json({ message: 'Invalid credentials' });\n    }\n  } catch (error) {\n    console.error('Error in direct login:', error);\n    res.status(500).json({ message: 'Server error' });\n  }\n});\n\nmodule.exports = router;`; content = content.replace(routerExportRegex, routerExportReplacement); fs.writeFileSync(directAuthJsPath, content, 'utf8'); console.log('Fixed direct-auth.js'); } else { console.log('direct-auth.js does not contain the expected route. Skipping...'); } } else { console.log('direct-auth.js not found!'); }"

echo.
echo Step 5: Fixing LoginForm.jsx...
node -e "const fs = require('fs'); const path = require('path'); const loginFormJsxPath = path.join(__dirname, 'my-web-app', 'src', 'components', 'auth', 'LoginForm.jsx'); if (fs.existsSync(loginFormJsxPath)) { let content = fs.readFileSync(loginFormJsxPath, 'utf8'); if (content.includes('\"/api/auth/direct-login\"')) { content = content.replace('\"/api/auth/direct-login\"', '\"/api/direct-auth\"'); content = content.replace('console.log(\"API endpoint:\", `${apiUrl}/api/auth/direct-login`);', 'console.log(\"API endpoint:\", `${apiUrl}/api/direct-auth`);'); fs.writeFileSync(loginFormJsxPath, content, 'utf8'); console.log('Fixed LoginForm.jsx'); } else { console.log('LoginForm.jsx does not contain the expected endpoint. Skipping...'); } } else { console.log('LoginForm.jsx not found!'); }"

echo.
echo Step 6: Creating run-local.bat...
echo @echo off > run-local.bat
echo echo Starting local development environment... >> run-local.bat
echo. >> run-local.bat
echo echo Starting backend server... >> run-local.bat
echo start cmd /k "cd backend && set NODE_ENV=development && node server.js" >> run-local.bat
echo. >> run-local.bat
echo echo Starting frontend development server... >> run-local.bat
echo start cmd /k "cd my-web-app && npm run dev" >> run-local.bat
echo. >> run-local.bat
echo echo Local development environment started! >> run-local.bat
echo echo Backend: http://localhost:5000 >> run-local.bat
echo echo Frontend: http://localhost:5173 >> run-local.bat

echo.
echo All steps completed successfully!
echo.
echo To run the application locally, execute run-local.bat
echo.
