@echo off
echo =================================================
echo COFFEE LAB - COMMIT SUMMARY UPDATE
echo =================================================
echo This script will commit and push the updated login-fix-summary.md file to GitHub.
echo.

echo Step 1: Committing changes...
git add login-fix-summary.md
git commit -m "Update login-fix-summary.md with email constraint fix details"
if %ERRORLEVEL% NEQ 0 (
  echo Error committing changes!
  pause
  exit /b 1
)

echo.
echo Step 2: Pushing changes to GitHub...
git push
if %ERRORLEVEL% NEQ 0 (
  echo Error pushing changes to GitHub!
  pause
  exit /b 1
)

echo.
echo All steps completed successfully!
echo.

pause
