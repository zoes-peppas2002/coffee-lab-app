@echo off
echo ===================================
echo COFFEE LAB - FIX PATH-TO-REGEXP ERROR
echo ===================================
echo.
echo This script will fix the path-to-regexp error for Render deployment.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-path-to-regexp-error.js...
node fix-path-to-regexp-error.js

echo.
echo Press any key to exit...
pause > nul