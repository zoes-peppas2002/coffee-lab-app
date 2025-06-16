@echo off
echo ===================================
echo COFFEE LAB - UPLOAD TO GITHUB
echo ===================================
echo.
echo This script will guide you through the process of uploading the changes to GitHub.
echo.
echo Press any key to continue...
pause > nul

echo.
echo Checking if Git is installed...
where git >nul 2>nul
if %errorlevel% neq 0 (
  echo Git is not installed or not in the PATH.
  echo Please install Git from https://git-scm.com/downloads
  echo.
  echo Press any key to exit...
  pause > nul
  exit /b
)

echo Git is installed.
echo.

echo Checking if this is a Git repository...
if not exist .git (
  echo This is not a Git repository.
  echo Initializing Git repository...
  git init
  if %errorlevel% neq 0 (
    echo Failed to initialize Git repository.
    echo.
    echo Press any key to exit...
    pause > nul
    exit /b
  )
  echo Git repository initialized.
) else (
  echo This is already a Git repository.
)
echo.

echo Checking Git status...
git status
echo.

echo Adding all files to Git...
git add .
if %errorlevel% neq 0 (
  echo Failed to add files to Git.
  echo.
  echo Press any key to exit...
  pause > nul
  exit /b
)
echo Files added to Git.
echo.

set /p commit_message=Enter a commit message (e.g., "Fix login issues"): 
echo.

echo Committing changes...
git commit -m "%commit_message%"
if %errorlevel% neq 0 (
  echo Failed to commit changes.
  echo.
  echo Press any key to exit...
  pause > nul
  exit /b
)
echo Changes committed.
echo.

echo Checking if remote repository is configured...
git remote -v
if %errorlevel% neq 0 (
  echo Failed to check remote repository.
  echo.
  echo Press any key to exit...
  pause > nul
  exit /b
)

set /p configure_remote=Do you need to configure a remote repository? (y/n): 
if /i "%configure_remote%"=="y" (
  set /p remote_url=Enter the remote repository URL (e.g., https://github.com/username/repo.git): 
  echo.
  
  echo Configuring remote repository...
  git remote add origin %remote_url%
  if %errorlevel% neq 0 (
    echo Failed to configure remote repository.
    echo.
    echo Press any key to exit...
    pause > nul
    exit /b
  )
  echo Remote repository configured.
  echo.
)

echo Pushing changes to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
  echo Failed to push changes to GitHub.
  echo.
  echo If this is a new repository, you may need to create the main branch first:
  echo git branch -M main
  echo git push -u origin main
  echo.
  echo Press any key to try creating the main branch...
  pause > nul
  
  git branch -M main
  git push -u origin main
  if %errorlevel% neq 0 (
    echo Failed to push changes to GitHub.
    echo.
    echo Press any key to exit...
    pause > nul
    exit /b
  )
)
echo Changes pushed to GitHub.
echo.

echo Upload to GitHub completed successfully!
echo.
echo Next steps:
echo 1. Deploy to Render using the deploy-to-render.bat script
echo.
echo Press any key to exit...
pause > nul
