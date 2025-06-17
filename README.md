# Coffee Lab Web Application

This repository contains the Coffee Lab web application, which consists of a React frontend and a Node.js backend.

## Project Structure

- `backend/`: Node.js backend with Express
- `my-web-app/`: React frontend built with Vite
- Various utility scripts for setup, testing, and deployment

## Database Connection

The application uses PostgreSQL in production (Render) and can use MySQL locally. The database connection details are stored in:

- `backend/db-pg.js`: PostgreSQL connection for production
- `backend/.env.production`: Environment variables for production
- `backend/.env`: Environment variables for development

## Available Scripts

### Setup and Testing

- `install-dependencies.bat`: Installs all required dependencies for the application
- `test-updated-db-connection.bat`: Tests the database connection with the updated credentials
- `fix-users-table.bat`: Fixes the users table schema by adding missing columns
- `create-and-populate-db.bat`: Creates and populates the database with the necessary tables and data
- `run-local-test.bat`: Runs the backend and frontend locally for testing
- `fix-everything.bat`: Runs all the above scripts in sequence to fix all issues

### Deployment

- `deploy-to-render.bat`: Deploys the application to Render

## Running Locally

1. Install all dependencies:
   ```
   install-dependencies.bat
   ```

2. Run the database connection test:
   ```
   test-updated-db-connection.bat
   ```

3. Fix the users table schema:
   ```
   fix-users-table.bat
   ```

4. Create and populate the database:
   ```
   create-and-populate-db.bat
   ```

5. Run the application locally:
   ```
   run-local-test.bat
   ```

Alternatively, you can run all the above steps in sequence with:
```
fix-everything.bat
```

4. Open your browser and navigate to:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

5. Login with the default admin credentials:
   - Email: zp@coffeelab.gr
   - Password: Zoespeppas2025!

## Deploying to Render

1. Make sure all your changes are committed to the local repository.

2. Run the deployment script:
   ```
   deploy-to-render.bat
   ```

3. Wait for the deployment to complete. It may take a few minutes for the changes to take effect.

4. Access your application at the Render URL.

## Troubleshooting

### Database Connection Issues

If you're experiencing database connection issues, check the following:

1. Verify the database credentials in:
   - `backend/db-pg.js`
   - `backend/.env.production`
   - `backend/.env`

2. Run the database connection test:
   ```
   test-updated-db-connection.bat
   ```

3. Check if the database server is running and accessible.

4. If there are issues with the users table schema, run:
   ```
   fix-users-table.bat
   ```
   This will add any missing columns to the users table.

### Login Issues

If you're having trouble logging in, try the following:

1. Use the hardcoded admin credentials:
   - Email: zp@coffeelab.gr
   - Password: Zoespeppas2025!

2. Check the browser console for any error messages.

3. Verify that the backend API is running and accessible.

4. Check the API URL in the frontend environment variables:
   - Development: `my-web-app/.env.development`
   - Production: `my-web-app/.env.production`

## Recent Updates

- Fixed database connection issues by updating the hostname and password
- Created scripts for testing the database connection and running the application locally
- Added deployment script for Render
