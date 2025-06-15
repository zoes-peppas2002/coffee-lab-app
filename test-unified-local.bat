@echo off
echo ===================================
echo COFFEE LAB - TEST UNIFIED DEPLOYMENT
echo ===================================
echo.
echo This will build the frontend and run the unified app locally
echo to test how it will work on Render.
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
node test-unified-deployment.js
