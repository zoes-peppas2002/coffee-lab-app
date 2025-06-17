@echo off
echo =================================================
echo COFFEE LAB - COMMIT ALL CHANGES
echo =================================================
echo This script will commit all changes to the Git repository.
echo.

echo Please enter a commit message:
set /p COMMIT_MESSAGE=Commit message: 

echo.
echo Adding all files to Git...
git add .

echo.
echo Committing changes...
git commit -m "%COMMIT_MESSAGE%"

echo.
echo Pushing changes to remote repository...
git push

echo.
echo All changes have been committed and pushed!
echo.
pause
