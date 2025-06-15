# Coffee Lab Management System

A comprehensive management system for Coffee Lab stores, featuring user management, checklist templates, and store performance tracking.

## Overview

This application consists of:

1. **Backend**: Node.js server with Express
2. **Frontend**: React application built with Vite
3. **Database**: MySQL (local) and PostgreSQL (production)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (for local development)
- Git

### Setup

1. Clone this repository
2. Use one of the batch files for easy setup:
   ```
   .\start-app.bat
   ```
   This will start both the backend and frontend servers in separate windows.

3. Alternatively, you can run the setup script:
   ```
   node setup-and-run.js
   ```
   Choose option 1 for full setup (clean, install dependencies, initialize database, start application)

## Features

- **User Management**: Admin, Area Manager, and Coffee Specialist roles
- **Checklist Templates**: Create and manage store inspection templates
- **Store Management**: Track store performance and compliance
- **PDF Generation**: Generate PDF reports of completed checklists
- **Statistics**: View performance metrics and trends

## Local Development

The application uses:
- MySQL for local development
- React with Vite for the frontend
- Node.js with Express for the backend

### Batch Files for Easy Development

We've created several batch files to make development easier:

- **start-backend.bat**: Starts only the backend server
- **start-frontend.bat**: Starts only the frontend server
- **start-app.bat**: Starts both backend and frontend servers in separate windows
- **prepare-for-render-deploy.bat**: Prepares the application for deployment to Render
- **deploy-to-render.bat**: Prepares and deploys the application to Render

For a complete list of available batch files and their descriptions, see the `BATCH_FILES_README.md` file.

## Deployment

### Local Deployment
For local deployment, use one of these options:

1. Run the start-app.bat file:
   ```
   .\start-app.bat
   ```

2. Or use the setup script:
   ```
   node setup-and-run.js
   ```

### Production Deployment (Render.com)
For production deployment to Render.com, you can now use the unified deployment approach:

1. Use the deploy-to-render.bat file:
   ```
   .\deploy-to-render.bat
   ```
   This will prepare the application for deployment and guide you through the process.

2. Alternatively, build the unified application:
   ```
   node setup-and-run.js
   ```
   Then select option 6: "Build unified app for Render"

3. See the `render-deployment-guide.md` for detailed instructions on deploying to Render.

## Login Credentials

Default admin user:
- Email: zp@coffeelab.gr
- Password: Zoespeppas2025!

## Troubleshooting

If you encounter any issues:
1. Check the console logs for errors
2. Verify database connection settings
3. Ensure all dependencies are installed
4. Try running the fix-all-and-deploy.bat file to fix common issues:
   ```
   .\fix-all-and-deploy.bat
   ```
5. See the troubleshooting section in the deployment guide

## Recent Fixes

We've made several improvements to the application:

1. **Fixed route order issues**: Corrected the order of routes in the templates.js file to prevent path-to-regexp errors
2. **Improved deployment process**: Created new batch files for easier deployment to Render
3. **Enhanced development workflow**: Added new batch files for starting the application locally
4. **Fixed login issues**: Ensured the login form works correctly with both MySQL and PostgreSQL databases

## License

Proprietary - Coffee Lab © 2025
