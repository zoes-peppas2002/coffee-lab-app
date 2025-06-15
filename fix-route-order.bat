@echo off
echo ===================================
echo COFFEE LAB - FIX ROUTE ORDER
echo ===================================
echo.
echo This script will check and fix route order issues in all route files.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running fix-route-order.js...
node fix-route-order.js

echo.
echo ===================================
echo Process completed!
echo.
echo Next steps:
echo 1. Check the console output for any issues
echo 2. Run "node backend/server.js" to test the server locally
echo 3. If everything works, push the changes to GitHub
echo 4. Deploy to Render
echo ===================================
echo.
pause
