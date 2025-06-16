# Render Deployment Guide

This guide outlines the steps to deploy the Coffee Lab web application to Render.

## Prerequisites

1. A Render account
2. A GitHub repository with the application code
3. The application code should be structured as follows:
   - Backend code in the `backend` directory
   - Frontend code in the `my-web-app` directory

## Steps

### 1. Prepare the Application

Run the `prepare-for-render-deploy.bat` file to prepare the application for deployment:

```
prepare-for-render-deploy.bat
```

This will:
- Build the frontend
- Copy the frontend build to the backend
- Update the .env files

### 2. Push to GitHub

Run the `deploy-to-render.bat` file to push the changes to GitHub:

```
deploy-to-render.bat
```

This will:
- Commit the changes to GitHub
- Push the changes to GitHub
- Trigger a deployment on Render

### 3. Configure Render

If you haven't already configured Render, follow these steps:

1. Log in to your Render account
2. Click on "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service as follows:
   - Name: `coffee-lab-app` (or any name you prefer)
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend` (since the frontend is built and copied to the backend)
5. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (or any port you prefer)
   - `DATABASE_URL`: Your PostgreSQL database URL
   - `JWT_SECRET`: Your JWT secret
6. Click on "Create Web Service"

### 4. Verify Deployment

Once the deployment is complete, you can verify it by:

1. Checking the Render logs for any errors
2. Visiting the deployed application URL
3. Testing the login functionality with the following credentials:
   - Email: zp@coffeelab.gr
   - Password: Zoespeppas2025!

## Troubleshooting

If you encounter any issues:

1. Check the Render logs for errors
2. Verify that the environment variables are correctly set
3. Ensure that the database is correctly configured
4. Check that the frontend build is correctly copied to the backend
5. Verify that the .env files are correctly configured
6. Check that the GitHub repository is correctly set up
7. Ensure that Render is correctly configured to deploy from GitHub

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [PostgreSQL on Render](https://render.com/docs/databases)
