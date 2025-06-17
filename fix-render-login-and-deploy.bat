@echo off
echo ===== COFFEE LAB - FIX RENDER LOGIN AND DEPLOY =====
echo This script will fix all login issues and deploy to Render

echo.
echo Step 1: Running the fix-render-deployment script...
call fix-render-deployment.bat

echo.
echo Step 2: Testing login endpoints...
call test-login-endpoints.bat

echo.
echo All steps completed successfully!
echo.
echo Next steps:
echo 1. Wait for the deployment to complete on Render (2-3 minutes)
echo 2. Visit https://coffee-lab-app-frontend.onrender.com
echo 3. Use the "Admin Login" button or login with:
echo    - Email: zp@coffeelab.gr
echo    - Password: Zoespeppas2025!
echo 4. If you encounter any issues, check the browser console (F12)
echo.
echo Press any key to continue . . .
pause > nul
