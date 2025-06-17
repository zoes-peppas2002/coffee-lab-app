@echo off
echo ===================================
echo COFFEE LAB - USE RENDER POSTGRESQL DATABASE
echo ===================================
echo.
echo This script will configure the application to use the Render PostgreSQL database.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Setting NODE_ENV to production in backend/.env...
echo NODE_ENV=production > backend/.env.tmp
echo DATABASE_URL=postgresql://coffee_lab_user:JZBtkeHcgpITKIKBJj6Dw7M4eAIMgh2r@dpg-d17f1iemcj7s73d4rhb0-a.frankfurt-postgres.render.com/coffee_lab_db_lyf9 >> backend/.env.tmp
echo PORT=5000 >> backend/.env.tmp
move /y backend\.env.tmp backend\.env

echo.
echo Step 2: Setting VITE_API_URL to /api in my-web-app/.env.development...
echo # API URL for local development > my-web-app/.env.development.tmp
echo VITE_API_URL=http://localhost:5000 >> my-web-app/.env.development.tmp
echo. >> my-web-app/.env.development.tmp
echo # Frontend URL for CORS >> my-web-app/.env.development.tmp
echo FRONTEND_URL=http://localhost:5173 >> my-web-app/.env.development.tmp
echo. >> my-web-app/.env.development.tmp
echo # Environment >> my-web-app/.env.development.tmp
echo VITE_NODE_ENV=development >> my-web-app/.env.development.tmp
move /y my-web-app\.env.development.tmp my-web-app\.env.development

echo.
echo Configuration completed!
echo.
echo The application is now configured to use the Render PostgreSQL database.
echo.
echo You can now run the application locally with:
echo run-local-test.bat
echo.
echo Press any key to exit...
pause > nul
