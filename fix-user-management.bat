@echo off
echo ===================================
echo COFFEE LAB - FIX USER MANAGEMENT
echo ===================================
echo.
echo This script will fix issues with user management in the database.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-user-management.js...
node fix-user-management.js

echo.
echo Press any key to exit...
pause > nul
