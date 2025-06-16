# Coffee Lab Web App Cleanup Guide

This guide will help you clean up the Coffee Lab web application, fix login issues, and deploy it to Render.

## Problem Description

The web application has duplicate files and login issues on Render. After entering credentials in the login form, it redirects back to the login form without logging in.

## Solution

We've created several scripts to help you clean up the application, fix the login issues, and deploy it to Render:

1. `fix-login-issue.bat` - Fixes the login issues by adding debugging, creating a fallback login component, and updating the server.js file.
2. `run-fixed-app.bat` - Runs the application locally after the fixes have been applied.
3. `test-login.bat` - Tests the login functionality locally.
4. `prepare-for-render-deploy.bat` - Prepares the application for deployment to Render.
5. `upload-to-github.bat` - Uploads the changes to GitHub.
6. `deploy-to-render.bat` - Guides you through the process of deploying the application to Render.
7. `test-render-login.bat` - Tests the login functionality on Render.
8. `fix-and-deploy-all.bat` - Runs all the steps in sequence.

## Step-by-Step Instructions

### 1. Fix Login Issues

1. Double-click on `fix-login-issue.bat` to run the script.
2. The script will:
   - Add debugging to the direct-auth.js file
   - Update the server.js file to ensure routes are registered in the correct order
   - Create a fallback login component
   - Update the App.jsx file to use the fallback login component

### 2. Test Locally

1. Double-click on `run-fixed-app.bat` to run the application locally.
2. Open http://localhost:5173 in your browser.
3. Try logging in with the following credentials:
   - Email: `zp@coffeelab.gr`
   - Password: `Zoespeppas2025!`
4. If the login is successful, you should be redirected to the admin dashboard.
5. Alternatively, you can use the `test-login.bat` script to test the login functionality directly from the command line.

### 3. Prepare for Render Deployment

1. Double-click on `prepare-for-render-deploy.bat` to prepare the application for deployment to Render.
2. The script will:
   - Fix the package.json file
   - Build the frontend
   - Copy the frontend build to the backend
   - Create production environment files

### 4. Upload to GitHub

1. Double-click on `upload-to-github.bat` to upload the changes to GitHub.
2. Follow the prompts to:
   - Enter a commit message
   - Configure a remote repository (if needed)
   - Push the changes to GitHub

### 5. Deploy to Render

1. Double-click on `deploy-to-render.bat` to deploy the application to Render.
2. Follow the instructions in the Render deployment guide to:
   - Create a PostgreSQL database
   - Create a web service
   - Configure environment variables
   - Deploy the application
3. After deploying, use the `test-render-login.bat` script to test the login functionality on Render.

### 6. All-in-One Solution

If you prefer to run all the steps in sequence, you can use the `fix-and-deploy-all.bat` script. This script will:

1. Fix the login issues
2. Test the application locally (if you choose to)
3. Prepare the application for deployment to Render
4. Upload the changes to GitHub
5. Guide you through the process of deploying the application to Render

## Troubleshooting

If you encounter any issues during the process, check the following:

1. **Login Issues**: Make sure the fallback login component is being used. You can check this by looking at the URL in your browser. If it's using the fallback login component, the URL should be `/login`.

2. **Deployment Issues**: Make sure the package.json file has the correct start script. You can check this by opening the backend/package.json file and ensuring it has the following:
   ```json
   "scripts": {
     "start": "node server.js"
   }
   ```

3. **Database Issues**: Make sure the DATABASE_URL environment variable is set correctly in Render. You can check this by going to the Render dashboard, selecting your web service, and checking the environment variables.

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

## Contact

If you need further assistance, please contact the developer at zp@coffeelab.gr.
