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
2. Run the setup script:
   ```
   node setup-and-run.js
   ```
3. Choose option 1 for full setup (clean, install dependencies, initialize database, start application)

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

## Deployment

### Local Deployment
For local deployment, use the setup script:
```
node setup-and-run.js
```

### Production Deployment (Render.com)
For production deployment to Render.com, you can now use the unified deployment approach:

1. Build the unified application:
   ```
   node setup-and-run.js
   ```
   Then select option 6: "Build unified app for Render"

2. This will prepare a single deployable package that includes both frontend and backend.

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
4. See the troubleshooting section in the deployment guide

## License

Proprietary - Coffee Lab © 2025
