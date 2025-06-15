@echo off
echo ===================================
echo COFFEE LAB - UPLOAD TO GITHUB
echo ===================================
echo.
echo This script will help you upload your code to GitHub.
echo.
echo Before continuing, make sure you have:
echo 1. Created a GitHub account
echo 2. Created a new repository on GitHub
echo 3. Installed Git on your computer
echo.
echo Press any key to continue...
pause > nul

set /p github_username=Enter your GitHub username: 
set /p repo_name=Enter your repository name (e.g., coffee-lab-app): 

echo.
echo Initializing Git repository...
git init

echo.
echo Adding all files to Git...
git add .

echo.
echo Committing changes...
git commit -m "Initial commit"

echo.
echo Setting up main branch...
git branch -M main

echo.
echo Adding remote repository...
git remote add origin https://github.com/%github_username%/%repo_name%.git

echo.
echo Pushing code to GitHub...
git push -u origin main

echo.
echo ===================================
echo Process completed!
echo.
echo If you see any errors, please make sure:
echo 1. Git is installed correctly
echo 2. You have the correct GitHub username and repository name
echo 3. You have created the repository on GitHub
echo.
echo Next steps:
echo 1. Follow the instructions in render-deployment-steps.md to deploy to Render
echo ===================================
echo.
pause
