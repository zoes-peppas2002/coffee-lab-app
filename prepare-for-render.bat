@echo off
echo ===================================
echo COFFEE LAB - PREPARE FOR RENDER
echo ===================================
echo.
echo This will build the unified app for Render deployment.
echo.
echo After running this script, you can deploy the backend folder
echo to Render following the instructions in render-deployment-guide.md
echo.
echo Press any key to continue...
pause > nul

cd /d "%~dp0"
node build-unified-app.js
echo.
echo ===================================
echo Build completed!
echo.
echo Next steps:
echo 1. Push your code to GitHub
echo 2. Follow the instructions in render-deployment-guide.md
echo ===================================
echo.
pause
