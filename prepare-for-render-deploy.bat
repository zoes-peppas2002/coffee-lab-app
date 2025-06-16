@echo off
echo ===================================
echo COFFEE LAB - PREPARE FOR RENDER DEPLOYMENT
echo ===================================
echo.
echo This script will prepare the application for deployment to Render by:
echo 1. Building the frontend
echo 2. Copying the frontend build to the backend
echo 3. Updating the .env files
echo.
echo Press any key to continue...
pause > nul

echo.
echo Building frontend...
cd my-web-app
call npm run build
cd ..

echo.
echo Copying frontend build to backend...
if exist backend\frontend-build rmdir /s /q backend\frontend-build
mkdir backend\frontend-build
xcopy /s /e /y my-web-app\dist\* backend\frontend-build\

echo.
echo Updating .env files...
copy /y backend\.env.production backend\.env

echo.
echo Preparation complete. Press any key to exit...
pause > nul
