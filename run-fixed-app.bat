@echo off
echo ===================================
echo COFFEE LAB - RUN FIXED APP
echo ===================================
echo.
echo This script will run the fixed application locally.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Starting backend server...
start cmd /k "cd backend && npm start"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting frontend...
start cmd /k "cd my-web-app && npm run dev"

echo.
echo Application started. Press any key to exit...
pause > nul
