@echo off
echo =================================================
echo COFFEE LAB - DEPLOY TO RENDER
echo =================================================
echo This script will prepare and deploy the application to Render.
echo.

echo Checking if Git is installed...
where git >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Git is not installed or not in the PATH.
  echo Please install Git from https://git-scm.com/
  pause
  exit /b 1
)

echo Setting up for production deployment...
echo.
echo Updating environment variables...
echo NODE_ENV=production > backend\.env.tmp
echo DATABASE_URL=postgresql://coffee_lab_user:jz5x00jzGHaKyrqDWehqfsCu6vRb688b@dpg-d18qgkruibrs73duejs0-a.frankfurt-postgres.render.com/coffee_lab_db_dldc >> backend\.env.tmp
echo PORT=10000 >> backend\.env.tmp
move /y backend\.env.tmp backend\.env

echo.
echo Building frontend for production...
cd my-web-app
call npm run build
cd ..

echo.
echo Copying frontend build to backend...
if not exist backend\frontend-build mkdir backend\frontend-build
xcopy /E /Y my-web-app\dist\* backend\frontend-build\

echo.
echo Committing changes to Git...
git add .
git commit -m "Prepare for Render deployment"

echo.
echo Pushing to GitHub...
git push

echo.
echo =================================================
echo DEPLOYMENT INSTRUCTIONS
echo =================================================
echo 1. Go to your Render dashboard: https://dashboard.render.com/
echo 2. Select your web service
echo 3. Click "Manual Deploy" and select "Deploy latest commit"
echo 4. Wait for the deployment to complete
echo.
echo Your application will be available at:
echo https://coffee-lab-app.onrender.com
echo.
pause
