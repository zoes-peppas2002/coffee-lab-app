# Coffee Lab Checklist Application

This application is designed for Coffee Lab to manage checklists for stores. It consists of a React frontend and a Node.js backend with MySQL (local) and PostgreSQL (production) database support.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Running Locally](#running-locally)
- [Deploying to Render](#deploying-to-render)
- [Troubleshooting](#troubleshooting)
- [User Roles](#user-roles)

## Overview

The Coffee Lab Checklist Application allows:
- Admin users to manage users, stores, and checklist templates
- Area Managers to create checklists for stores
- Coffee Specialists to view checklists for their assigned stores

The application uses:
- Frontend: React with Vite
- Backend: Node.js with Express
- Database: MySQL (local) and PostgreSQL (production)

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL (for local development)
- Git

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd coffee-lab-checklist
   ```

2. Run the installation script:
   ```
   install-dependencies.bat
   ```

3. Fix any issues with the application:
   ```
   fix-everything.bat
   ```

## Running Locally

To run the application locally:

```
run-local.bat
```

This will start:
- Backend server at http://localhost:5000
- Frontend development server at http://localhost:5173

### Default Admin User

- Email: zp@coffeelab.gr
- Password: Zoespeppas2025!

## Deploying to Render

To deploy the application to Render:

1. Create a Render account at https://render.com
2. Create a PostgreSQL database on Render
3. Create a Web Service for the backend on Render
4. Create a Static Site for the frontend on Render
5. Run the deployment script:
   ```
   deploy-to-render.bat
   ```

### Render Configuration

#### Backend Web Service

- Build Command: `npm install`
- Start Command: `node server.js`
- Environment Variables:
  - `DATABASE_URL`: Your Render PostgreSQL database URL
  - `NODE_ENV`: `production`
  - `PORT`: `10000`

#### Frontend Static Site

- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment Variables:
  - `VITE_API_URL`: Your backend service URL (e.g., https://coffee-lab-app.onrender.com)

## Troubleshooting

If you encounter issues:

1. Check the logs in the terminal
2. Make sure all dependencies are installed
3. Verify database connection settings
4. Run the fix scripts:
   - `fix-step-by-step.bat`: Fixes login and routes issues
   - `run-fix-render-postgres.bat`: Fixes PostgreSQL database issues
   - `run-migrate-data.bat`: Migrates data from local MySQL to Render PostgreSQL
   - `fix-everything.bat`: Runs all fix scripts in the correct order

## User Roles

The application supports three user roles:

### Admin
- Manage users (create, edit, delete)
- Manage stores (create, assign users)
- Manage checklist templates
- View all checklists

### Area Manager
- Create checklists for assigned stores
- View checklists for assigned stores

### Coffee Specialist
- View checklists for assigned stores

## File Structure

```
coffee-lab-checklist/
├── backend/                  # Node.js backend
│   ├── routes/               # API routes
│   ├── static/               # Static files (images, PDFs)
│   └── server.js             # Main server file
├── my-web-app/               # React frontend
│   ├── public/               # Public assets
│   └── src/                  # Source code
│       ├── components/       # React components
│       └── utils/            # Utility functions
├── install-dependencies.bat  # Script to install dependencies
├── run-local.bat             # Script to run locally
├── fix-everything.bat        # Script to fix all issues
└── deploy-to-render.bat      # Script to deploy to Render
