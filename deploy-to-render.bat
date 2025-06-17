@echo off
echo =================================================
echo COFFEE LAB - DEPLOY TO RENDER
echo =================================================
echo This script will help you deploy the application to Render.
echo.

echo Before proceeding, make sure you have:
echo 1. Created a Render account
echo 2. Created a PostgreSQL database on Render
echo 3. Created a Web Service for the backend on Render
echo 4. Created a Static Site for the frontend on Render
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause > nul

echo.
echo Step 1: Updating environment variables...
echo.
echo Please enter your Render PostgreSQL database URL:
set /p DATABASE_URL=DATABASE_URL: 

echo.
echo Updating backend/.env.production...
echo DATABASE_URL=%DATABASE_URL% > backend\.env.production
echo NODE_ENV=production >> backend\.env.production
echo PORT=10000 >> backend\.env.production

echo.
echo Updating my-web-app/.env.production...
echo VITE_API_URL=https://coffee-lab-app.onrender.com > my-web-app\.env.production

echo.
echo Environment variables updated!
echo.
echo Step 2: Preparing for deployment...
echo.
echo Please make sure your code is committed to a Git repository.
echo Render will deploy from your Git repository.
echo.
echo For the backend service on Render, use these settings:
echo - Build Command: npm install
echo - Start Command: node server.js
echo.
echo For the frontend static site on Render, use these settings:
echo - Build Command: npm install && npm run build
echo - Publish Directory: dist
echo.
echo Also, make sure to set the following environment variables on Render:
echo - For backend: DATABASE_URL, NODE_ENV=production, PORT=10000
echo - For frontend: VITE_API_URL=https://coffee-lab-app.onrender.com
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 3: Testing local build...
echo.
echo Building frontend...
cd my-web-app
call npm run build
cd ..

echo.
echo Local build completed!
echo.
echo You are now ready to deploy to Render.
echo.
echo 1. Push your code to your Git repository
echo 2. Connect your Git repository to Render
echo 3. Deploy your backend service and frontend static site
echo.
echo Press any key to exit...
pause > nul
