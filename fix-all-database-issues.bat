@echo off
echo ===================================
echo COFFEE LAB - FIX ALL DATABASE ISSUES
echo ===================================
echo.
echo This script will fix all database issues for Render deployment.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-all-database-issues.js...
node fix-all-database-issues.js

echo.
echo Press any key to exit...
pause > nul