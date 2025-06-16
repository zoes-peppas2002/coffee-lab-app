@echo off
echo ===== FIXING ROUTE ORDER ISSUES =====
node fix-all-routes.js

echo ===== PREPARING FOR RENDER DEPLOYMENT =====
call prepare-for-render-deploy.bat

echo ===== DEPLOYING TO RENDER =====
call deploy-to-render.bat

echo ===== PROCESS COMPLETED =====
echo Please check the Render dashboard to verify the deployment.
echo Visit: https://dashboard.render.com
echo.
echo Remember to select "Clear build cache & deploy" for a clean deployment.
pause
