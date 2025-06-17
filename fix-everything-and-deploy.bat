@echo off
echo ===================================
echo COFFEE LAB - FIX EVERYTHING AND DEPLOY
echo ===================================
echo.
echo This script will fix all issues and deploy to Render.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Installing PostgreSQL package...
call install-pg-package.bat

echo.
echo Step 2: Creating and populating database...
call create-and-populate-db.bat

echo.
echo Step 3: Fixing scripts...
call fix-scripts.bat

echo.
echo Step 4: Fixing database connection...
call fix-db-connection.bat

echo.
echo Step 5: Fixing all database issues...
call fix-all-database-issues.bat

echo.
echo Step 6: Fixing dependencies...
call fix-render-dependencies.bat

echo.
echo Step 7: Fixing path-to-regexp error...
call fix-path-to-regexp-error.bat

echo.
echo Step 8: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 9: Deploying to Render...
call deploy-to-render.bat

echo.
echo All steps completed!
echo.
echo The application has been fixed and deployed to Render.
echo.
echo Press any key to exit...
pause > nul