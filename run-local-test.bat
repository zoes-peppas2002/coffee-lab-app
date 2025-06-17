@echo off
echo ===================================
echo COFFEE LAB - RUN LOCAL TEST
echo ===================================
echo.
echo This script will run the backend and frontend locally for testing.
echo.
echo Do you want to use the local MySQL database or the Render PostgreSQL database?
echo 1. Local MySQL database (recommended for local testing)
echo 2. Render PostgreSQL database
echo.
set /p choice=Enter your choice (1 or 2): 

if "%choice%"=="1" (
  echo.
  echo Configuring to use local MySQL database...
  call use-local-mysql.bat
) else if "%choice%"=="2" (
  echo.
  echo Configuring to use Render PostgreSQL database...
  call use-render-postgres.bat
) else (
  echo.
  echo Invalid choice. Using local MySQL database by default...
  call use-local-mysql.bat
)

echo.
echo Step 1: Starting the backend server...
start cmd /k "cd backend && npm start"

echo.
echo Step 2: Starting the frontend development server...
start cmd /k "cd my-web-app && npm run dev"

echo.
echo Both servers are now running!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo You can now test the login functionality with the following credentials:
echo.
echo Admin User:
echo Email: zp@coffeelab.gr
echo Password: Zoespeppas2025!
echo.
echo Press any key to exit...
pause > nul
