@echo off
echo ===================================
echo COFFEE LAB - FIX LOGIN ISSUES
echo ===================================
echo.
echo This script will fix login issues by:
echo 1. Fixing the direct-auth.js file
echo 2. Updating the server.js file
echo 3. Creating a fallback login component
echo 4. Updating the App.jsx file
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-login-issue.js...
node fix-login-issue.js

echo.
echo Script completed. Press any key to exit...
pause > nul
