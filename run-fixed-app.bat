@echo off
echo ===================================
echo COFFEE LAB - RUN FIXED APPLICATION
echo ===================================
echo.
echo This script will run the application locally after the fixes have been applied.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Starting backend and frontend servers...
echo.

echo Starting backend server...
start cmd /k "cd backend && node server.js"

echo Starting frontend server...
start cmd /k "cd my-web-app && npm run dev"

echo.
echo Both servers are now running in separate windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo You can now test the application by opening http://localhost:5173 in your browser.
echo.
echo Press any key to close this window...
pause > nul
