@echo off
echo =================================================
echo COFFEE LAB - COMMIT ALL CHANGES
echo =================================================
echo This script will add all files to Git and commit the changes.
echo.

echo Checking if Git is installed...
where git >nul 2>nul
if %errorlevel% neq 0 (
  echo ERROR: Git is not installed or not in the PATH.
  echo Please install Git from https://git-scm.com/
  pause
  exit /b 1
)

echo Adding all files to Git...
git add .

echo.
echo Committing changes...
git commit -m "Clean up application and fix database compatibility issues"

echo.
echo Changes committed successfully!
echo.
echo To push the changes to the remote repository, run:
echo git push
echo.
pause
