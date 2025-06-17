@echo off
echo ===================================
echo COFFEE LAB - FIX DATABASE URLS
echo ===================================
echo.
echo This script will fix the database URLs for internal and external connections.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-db-urls.js...
node fix-db-urls.js

echo.
echo Press any key to exit...
pause > nul
