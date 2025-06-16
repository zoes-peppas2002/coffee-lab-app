@echo off
echo ===================================
echo COFFEE LAB - FIX AND DEPLOY ALL
echo ===================================
echo.
echo This script will run all the steps to fix the login issues and deploy the application to Render.
echo.
echo Steps:
echo 1. Fix login issues
echo 2. Test locally
echo 3. Prepare for Render deployment
echo 4. Upload to GitHub
echo 5. Deploy to Render
echo.
echo Press any key to continue...
pause > nul

echo.
echo Step 1: Fixing login issues...
call fix-login-issue.bat

echo.
echo Step 2: Testing locally...
echo.
echo Do you want to test the application locally? (y/n)
set /p test_locally=
if /i "%test_locally%"=="y" (
  call run-fixed-app.bat
  
  echo.
  echo Did the application work correctly? (y/n)
  set /p app_works=
  if /i "%app_works%"=="n" (
    echo.
    echo Please fix any issues before continuing.
    echo.
    echo Press any key to exit...
    pause > nul
    exit /b
  )
)

echo.
echo Step 3: Preparing for Render deployment...
call prepare-for-render-deploy.bat

echo.
echo Step 4: Uploading to GitHub...
call upload-to-github.bat

echo.
echo Step 5: Deploying to Render...
call deploy-to-render.bat

echo.
echo All steps completed successfully!
echo.
echo Press any key to exit...
pause > nul
