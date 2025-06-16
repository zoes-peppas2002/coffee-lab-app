@echo off
echo ===================================
echo COFFEE LAB - FIX LOGIN ISSUES
echo ===================================
echo.
echo This script will fix login issues on Render deployment.
echo.
echo Press any key to continue...
pause > nul

node fix-login-issue.js

echo.
echo Script completed. Press any key to exit...
pause > nul
