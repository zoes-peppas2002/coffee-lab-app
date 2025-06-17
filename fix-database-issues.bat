@echo off
echo ===================================
echo COFFEE LAB - FIX DATABASE ISSUES
echo ===================================
echo.
echo This script will fix database issues for Render deployment.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-database-issues.js...
node fix-database-issues.js

echo.
echo Press any key to exit...
pause > nul