@echo off
echo ===================================
echo COFFEE LAB - INSTALL POSTGRESQL PACKAGE
echo ===================================
echo.
echo This script will install the pg package required for PostgreSQL connections.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Running install-pg-package.js...
node install-pg-package.js

echo.
echo Press any key to exit...
pause > nul