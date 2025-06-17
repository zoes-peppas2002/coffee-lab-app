@echo off
echo ===================================
echo COFFEE LAB - FIX RENDER DEPENDENCIES
echo ===================================
echo.
echo This script will fix dependency issues and static file configuration.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-render-dependencies.js...
node fix-render-dependencies.js

echo.
echo Press any key to exit...
pause > nul