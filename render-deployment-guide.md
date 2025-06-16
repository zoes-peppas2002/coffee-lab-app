# Coffee Lab - Render Deployment Guide

This guide provides detailed instructions for deploying the Coffee Lab application to Render.

## Prerequisites

Before you begin, make sure you have:

1. Fixed the login issues using the `fix-login-issue.bat` script
2. Prepared the application for deployment using the `prepare-for-render-deploy.bat` script
3. Uploaded the changes to GitHub using the `upload-to-github.bat` script
4. Created a Render account at [render.com](https://render.com)

## Step 1: Create a PostgreSQL Database

1. Log in to your Render account
2. Click on the "New +" button in the top right corner
3. Select "PostgreSQL" from the dropdown menu
4. Fill in the following details:
   - **Name**: `coffee-lab-db` (or any name you prefer)
   - **Database**: `coffee_lab_db`
   - **User**: `coffee_lab_user`
   - **Region**: Select the region closest to you (e.g., "Frankfurt EU Central")
   - **PostgreSQL Version**: 14
   - **Instance Type**: Free (or select a paid plan if you need more resources)
5. Click on the "Create Database" button
6. Wait for the database to be created (this may take a few minutes)
7. Once created, click on the database to view its details
8. Copy the **Internal Database URL** - you'll need this for the next step

## Step 2: Create a Web Service

1. Click on the "New +" button in the top right corner
2. Select "Web Service" from the dropdown menu
3. Click on "Build and deploy from a Git repository"
4. Connect your GitHub account if you haven't already
5. Select the repository where you uploaded the Coffee Lab application
6. Fill in the following details:
   - **Name**: `coffee-lab-app` (or any name you prefer)
   - **Region**: Select the same region as your database
   - **Branch**: `main` (or the branch you pushed to)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free (or select a paid plan if you need more resources)
7. In the "Environment Variables" section, click on "Add Environment Variable" and add the following:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DATABASE_URL`: Paste the Internal Database URL you copied in Step 1

8. Click on the "Create Web Service" button

## Step 3: Monitor the Deployment

1. You'll be redirected to the web service dashboard
2. Click on the "Logs" tab to monitor the deployment process
3. Wait for the deployment to complete (this may take a few minutes)
4. Once the deployment is complete, you'll see a message indicating that the server is running

## Step 4: Test the Application

1. Click on the URL provided by Render (e.g., `https://coffee-lab-app.onrender.com`)
2. You should see the login page
3. Log in with the following credentials:
   - Email: `zp@coffeelab.gr`
   - Password: `Zoespeppas2025!`
4. If the login is successful, you should be redirected to the admin dashboard

## Troubleshooting

If you encounter any issues during the deployment process, check the following:

### Login Issues

If you're still experiencing login issues:

1. Check the logs in the Render dashboard for any error messages
2. Make sure the `DATABASE_URL` environment variable is set correctly
3. Try using the fallback login component by clicking the "Admin Login" button

### Database Issues

If you're having issues with the database:

1. Make sure the database is running (check the status in the Render dashboard)
2. Verify that the `DATABASE_URL` environment variable is set correctly
3. Check if the database tables have been created (you can use the Render dashboard to connect to the database and run SQL queries)

### Deployment Issues

If the deployment fails:

1. Check the logs in the Render dashboard for any error messages
2. Make sure the `package.json` file has the correct start script
3. Verify that the root directory is set to `backend`
4. Make sure the Node.js version is compatible (Render uses Node.js 14 by default)

## Next Steps

Once the application is deployed and working correctly, you may want to:

1. Add custom domain (if you have a paid plan)
2. Set up automatic deployments from GitHub
3. Configure SSL certificates (Render provides free SSL certificates)
4. Set up monitoring and alerts

For more information, refer to the [Render documentation](https://render.com/docs).
