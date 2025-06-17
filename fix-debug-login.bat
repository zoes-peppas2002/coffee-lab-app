@echo off
echo ===== COFFEE LAB - DEBUG LOGIN FIX =====
echo This script will add extensive debugging and a direct admin login button

echo.
echo Step 1: Running the fix script...
node fix-debug-login.js

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
git commit -m "Add enhanced debugging and direct admin login"

echo.
echo Step 5: Deploying to Render...
git push

echo.
echo All steps completed successfully!
echo Please wait a few minutes for the deployment to complete, then test the login.
echo.
echo Press any key to continue . . .
pause > nul
