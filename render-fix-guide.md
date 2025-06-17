# Coffee Lab Render Deployment Fix Guide

This guide provides a comprehensive approach to fixing deployment issues with the Coffee Lab application on Render.

## Common Issues and Solutions

### 1. Path-to-Regexp Error

**Symptoms:**
```
TypeError: Missing parameter name at 1: https://git.new/pathToRegexpError
```

**Solution:**
Run the path-to-regexp error fix script:
```
fix-path-to-regexp-error.bat
```

This script:
- Scans for invalid route patterns in server.js and templates.js
- Fixes CORS configuration to ensure all origins are properly formatted
- Adds error handling for path-to-regexp errors
- Checks for routes with special characters that might cause issues

For more details, see [fix-path-to-regexp-error.md](fix-path-to-regexp-error.md).

### 2. Login Issues

**Symptoms:**
- Login form redirects back to login page after submitting credentials
- 404 errors when trying to access API endpoints
- 500 errors from the backend when trying to log in

**Solution:**
Run the login fix script:
```
run-direct-fix.bat
```

This script:
- Fixes the isPg variable definition in direct-auth.js
- Updates server.js to include test-login endpoints
- Ensures the FallbackLoginForm.jsx component tries multiple login endpoints

### 3. Environment Configuration

**Symptoms:**
- Application can't connect to the database
- Frontend can't connect to the backend API
- Missing environment variables

**Solution:**
Ensure the correct environment variables are set in Render:

1. `NODE_ENV`: `production`
2. `PORT`: `10000`
3. `DATABASE_URL`: Your PostgreSQL database URL
4. `FRONTEND_URL`: Your frontend URL (if separate from backend)

## Deployment Process

### Step 1: Fix All Issues Locally

Run the all-in-one fix script:
```
fix-all-and-deploy.bat
```

This script:
1. Fixes login issues
2. Fixes path-to-regexp errors
3. Prepares the application for Render deployment
4. Deploys to Render

### Step 2: Verify the Deployment

1. Check the Render logs for any errors
2. Test the login functionality using the admin credentials:
   - Email: zp@coffeelab.gr
   - Password: Zoespeppas2025!
3. Verify that all features are working correctly

### Step 3: Troubleshoot Any Remaining Issues

If you encounter any issues:

1. Check the Render logs for specific error messages
2. Refer to the [Render Troubleshooting Guide](https://render.com/docs/troubleshooting-deploys)
3. Check the GitHub repository for any recent changes that might affect deployment

## Manual Deployment Steps

If you prefer to deploy manually:

1. Fix login issues:
   ```
   run-direct-fix.bat
   ```

2. Fix path-to-regexp errors:
   ```
   fix-path-to-regexp-error.bat
   ```

3. Prepare for Render deployment:
   ```
   prepare-for-render-deploy.bat
   ```

4. Deploy to Render:
   ```
   deploy-to-render.bat
   ```

## Render Configuration

### Web Service Configuration

1. **Service Type**: Web Service
2. **Name**: coffee-lab
3. **Environment**: Node
4. **Build Command**: `npm install`
5. **Start Command**: `node server.js`
6. **Root Directory**: `backend`

### Database Configuration

1. Create a PostgreSQL database in Render
2. Connect it to your web service
3. The `DATABASE_URL` environment variable will be automatically set

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

If you need additional help, please contact the development team.
