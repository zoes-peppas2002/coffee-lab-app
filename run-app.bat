@echo off
echo ===================================
echo COFFEE LAB - QUICK START
echo ===================================
echo.
echo Starting backend and frontend servers...
echo.
echo Press Ctrl+C to stop both servers
echo.

cd /d "%~dp0"
node setup-and-run.js 5
