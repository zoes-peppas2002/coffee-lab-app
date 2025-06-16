# Coffee Lab Web Application

A web application for managing coffee shop checklists and quality control.

## Overview

The Coffee Lab web application is designed to help coffee shop managers and specialists manage quality control checklists for coffee shops. It includes features for creating and managing checklists, viewing statistics, and managing users and stores.

## Project Structure

- **Backend**: Node.js server with Express.js
  - Located in the `backend` directory
  - Uses PostgreSQL for database storage
  - Provides RESTful API endpoints for the frontend

- **Frontend**: React.js application
  - Located in the `my-web-app` directory
  - Built with Vite
  - Uses React Router for navigation
  - Uses Axios for API calls

## Setup and Installation

1. **Clone the repository**

2. **Install dependencies**
   ```
   install-dependencies.bat
   ```

3. **Initialize the database**
   ```
   init-database.bat
   ```

4. **Set up the local environment**
   ```
   setup-local-environment.bat
   ```

## Running the Application

1. **Run the application locally**
   ```
   run-app.bat
   ```

2. **Run the fixed application locally**
   ```
   run-fixed-app.bat
   ```

## Testing

1. **Test the login functionality locally**
   ```
   test-login.bat
   ```

2. **Test the login functionality on Render**
   ```
   test-render-login.bat
   ```

3. **Run all tests**
   ```
   run-all-tests.bat
   ```

## Deployment

1. **Prepare for Render deployment**
   ```
   prepare-for-render-deploy.bat
   ```

2. **Deploy to Render**
   ```
   deploy-to-render.bat
   ```

3. **Fix issues and deploy in one go**
   ```
   fix-and-deploy-all.bat
   ```

## Documentation

1. **CLEANUP_README.md**
   - Documentation of the changes made and the steps to fix the login issues

2. **changes-summary.md**
   - Summary of the changes made to fix the login issues

3. **render-deployment-guide.md**
   - Guide for deploying the application to Render

4. **BATCH_FILES_README.md**
   - Documentation of the batch files created

## Login Credentials

For testing purposes, you can use the following hardcoded admin credentials:

- Email: zp@coffeelab.gr
- Password: Zoespeppas2025!

## Troubleshooting

If you encounter any issues:

1. Check the console logs for errors
2. Ensure all dependencies are installed
3. Verify that the database connection is working
4. Check that the API endpoints are correctly configured
5. Ensure that the frontend is correctly built and copied to the backend
6. Verify that the .env files are correctly configured
7. Check that the GitHub repository is correctly set up
8. Verify that Render is correctly configured to deploy from GitHub
