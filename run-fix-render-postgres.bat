@echo off
echo =================================================
echo COFFEE LAB - RUN FIX RENDER POSTGRESQL DATABASE
echo =================================================
echo This script will run the fix-render-postgres.js script.
echo.

echo Installing pg package...
call npm install pg

echo.
echo Running fix-render-postgres.js...
node fix-render-postgres.js

echo.
echo Script execution completed!
echo.
pause
