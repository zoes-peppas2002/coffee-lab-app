@echo off
echo ===================================
echo COFFEE LAB - DATABASE VIEWER TOOL
echo ===================================
echo.
echo This script will show the contents of the database.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running database-viewer.js...
cd backend
node database-viewer.js
cd ..

echo.
echo Press any key to exit...
pause > nul