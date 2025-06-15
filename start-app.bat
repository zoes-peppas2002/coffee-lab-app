@echo off
echo ===================================
echo COFFEE LAB - START FULL APPLICATION
echo ===================================
echo.
echo Starting backend and frontend servers...
echo.

echo Starting backend server...
start cmd /k "start-backend.bat"

echo Starting frontend server...
start cmd /k "start-frontend.bat"

echo.
echo Both servers are now running in separate windows.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul
