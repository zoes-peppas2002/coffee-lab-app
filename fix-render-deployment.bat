@echo off
echo ===== COFFEE LAB - RENDER DEPLOYMENT FIX =====
echo This script will fix deployment issues on Render

echo.
echo Step 1: Running the fix script...
node fix-render-deployment.js

echo.
echo Step 2: Building the frontend...
cd my-web-app
call npm run build
cd ..

echo.
echo Step 3: Copying frontend build to backend...
xcopy /E /Y my-web-app\dist\* backend\frontend-build\

echo.
echo Step 4: Committing changes...
git add .
git commit -m "Fix Render deployment issues"

echo.
echo Step 5: Deploying to Render...
git push

echo.
echo All steps completed successfully!
echo Please wait a few minutes for the deployment to complete, then test the login.
echo.
echo Press any key to continue . . .
pause > nul
