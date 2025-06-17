@echo off
echo =================================================
echo COFFEE LAB - FIX EVERYTHING
echo =================================================
echo This script will run all the fix scripts in the correct order.
echo.

echo Step 1: Installing dependencies...
call install-dependencies.bat

echo.
echo Step 2: Fixing step by step...
call fix-step-by-step.bat

echo.
echo Step 3: Fixing Render PostgreSQL database...
call run-fix-render-postgres.bat

echo.
echo Step 4: Migrating data to Render PostgreSQL...
call run-migrate-data.bat

echo.
echo All fixes have been applied!
echo.
echo You can now run the application locally with:
echo   run-local.bat
echo.
echo Or deploy to Render with:
echo   deploy-to-render.bat
echo.
pause
