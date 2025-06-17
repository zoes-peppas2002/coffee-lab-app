@echo off
echo ===================================
echo COFFEE LAB - FIX ROUTE ORDER
echo ===================================
echo.
echo This script will fix route order and path-to-regexp errors.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-route-order.js...
node fix-route-order.js

echo.
echo Press any key to exit...
pause > nul