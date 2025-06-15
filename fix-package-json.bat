@echo off
echo ===================================
echo COFFEE LAB - FIX PACKAGE.JSON
echo ===================================
echo.
echo This script will ensure the backend package.json has the required start script for Render deployment.
echo.

cd /d "%~dp0"
node fix-package-json.js
echo.
echo ===================================
echo Process completed!
echo.
echo If you're deploying to Render, make sure to:
echo 1. Push the updated package.json to GitHub
echo 2. Use "node server.js" as the Start Command in Render
echo ===================================
echo.
pause
