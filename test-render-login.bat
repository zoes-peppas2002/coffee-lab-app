@echo off
echo ===================================
echo COFFEE LAB - TEST RENDER LOGIN
echo ===================================
echo.
echo This script will test the login functionality on Render.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Testing login on Render...
node test-render-login.js

echo.
echo Test completed. Press any key to exit...
pause > nul
