@echo off
echo ===================================
echo COFFEE LAB - FIX ALL ROUTES AND DEPLOY
echo ===================================
echo.
echo This script will fix all route issues and deploy to Render.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Fixing login issues...
call run-direct-fix.bat

echo.
echo Step 2: Fixing path-to-regexp error...
call fix-path-to-regexp-error.bat

echo.
echo Step 3: Fixing route order...
call fix-route-order.bat

echo.
echo Step 4: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 5: Deploying to Render...
call deploy-to-render.bat

echo.
echo All steps completed!
echo.
echo The application has been fixed and deployed to Render.
echo.
echo Press any key to exit...
pause > nul
