@echo off 
echo Starting local development environment... 
 
echo Starting backend server... 
start cmd /k "cd backend && set NODE_ENV=development && node server.js" 
 
echo Starting frontend development server... 
start cmd /k "cd my-web-app && npm run dev" 
 
echo Local development environment started! 
echo Backend: http://localhost:5000 
echo Frontend: http://localhost:5173 
