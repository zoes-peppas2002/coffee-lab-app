# Coffee Lab Render Deployment Guide

This guide outlines the steps to deploy the Coffee Lab web application to Render.

## Prerequisites

1. A Render account
2. A GitHub repository with the Coffee Lab application code
3. The application code should be fixed and ready for deployment

## Deployment Steps

### 1. Fix Login Issues

Before deploying, make sure the login issues are fixed by running:

```
fix-login-issue.bat
```

This will:
- Fix the isPg variable definition in direct-auth.js
- Update the server.js file to include the test-login endpoint
- Update the FallbackLoginForm.jsx file to make the correct API calls

### 2. Prepare for Render Deployment

Run the following command to prepare the application for deployment:

```
prepare-for-render-deploy.bat
```

This will:
- Build the frontend
- Copy the frontend build to the backend
- Copy the production environment files

### 3. Deploy to Render

Run the following command to deploy the application to Render:

```
deploy-to-render.bat
```

This will:
- Commit the changes to GitHub
- Push the changes to the repository
- Trigger the automatic deployment on Render

Alternatively, you can run all steps at once using:

```
fix-and-deploy-all.bat
```

## Render Configuration

### Web Service Configuration

1. **Service Type**: Web Service
2. **Name**: coffee-lab
3. **Environment**: Node
4. **Build Command**: `npm install`
5. **Start Command**: `node server.js`
6. **Root Directory**: `backend`

### Environment Variables

Make sure the following environment variables are set in the Render dashboard:

- `NODE_ENV`: `production`
- `PORT`: `10000`
- `DATABASE_URL`: Your PostgreSQL database URL

### Database Configuration

1. Create a PostgreSQL database in Render
2. Connect it to your web service
3. The `DATABASE_URL` environment variable will be automatically set

## Troubleshooting

If you encounter any issues with the deployment:

1. Check the Render logs for any errors
2. Verify that the environment variables are set correctly
3. Make sure the database is properly connected
4. Check that the frontend build was correctly copied to the backend
5. Verify that the isPg variable is correctly defined in direct-auth.js
6. Check that the test-login endpoint is correctly defined in server.js
7. Verify that the FallbackLoginForm.jsx file is making the correct API calls

## Testing the Deployment

After the deployment is complete, you can test the login functionality using:

```
test-render-login.bat
```

This will test the login functionality on the deployed application.
