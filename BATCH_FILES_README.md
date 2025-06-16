# Coffee Lab Batch Files

This document outlines the batch files created to help manage the Coffee Lab web application.

## Setup and Installation

1. **install-dependencies.bat**
   - Installs all dependencies for both the backend and frontend
   - Usage: `install-dependencies.bat`

2. **init-database.bat**
   - Initializes the database for the application
   - Usage: `init-database.bat`

3. **setup-local-environment.bat**
   - Sets up the local environment by installing dependencies, initializing the database, and running the application
   - Usage: `setup-local-environment.bat`

## Running the Application

1. **run-app.bat**
   - Runs the application locally
   - Usage: `run-app.bat`

2. **run-fixed-app.bat**
   - Runs the fixed application locally
   - Usage: `run-fixed-app.bat`

## Testing

1. **test-login.bat**
   - Tests the login functionality locally
   - Usage: `test-login.bat`

2. **test-render-login.bat**
   - Tests the login functionality on Render
   - Usage: `test-render-login.bat`

3. **run-all-tests.bat**
   - Runs all tests
   - Usage: `run-all-tests.bat`

## Fixing Issues

1. **fix-login-issue.bat**
   - Fixes the login issues by updating the necessary files
   - Usage: `fix-login-issue.bat`

## Deployment

1. **prepare-for-render-deploy.bat**
   - Prepares the application for deployment to Render
   - Usage: `prepare-for-render-deploy.bat`

2. **deploy-to-render.bat**
   - Deploys the application to Render
   - Usage: `deploy-to-render.bat`

3. **fix-and-deploy-all.bat**
   - Fixes the login issues, prepares for Render deployment, and deploys to Render
   - Usage: `fix-and-deploy-all.bat`

## Documentation

1. **CLEANUP_README.md**
   - Documentation of the changes made and the steps to fix the login issues

2. **changes-summary.md**
   - Summary of the changes made to fix the login issues

3. **render-deployment-guide.md**
   - Guide for deploying the application to Render

4. **BATCH_FILES_README.md**
   - This file, documenting the batch files created

## Usage Flow

1. **Setup and Installation**
   - Run `setup-local-environment.bat` to set up the local environment

2. **Fixing Issues**
   - Run `fix-login-issue.bat` to fix the login issues

3. **Testing**
   - Run `test-login.bat` to test the login functionality locally
   - Run `test-render-login.bat` to test the login functionality on Render
   - Run `run-all-tests.bat` to run all tests

4. **Deployment**
   - Run `prepare-for-render-deploy.bat` to prepare for deployment
   - Run `deploy-to-render.bat` to deploy to Render
   - Run `fix-and-deploy-all.bat` to fix issues and deploy in one go
