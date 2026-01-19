# User Activity Management System

A web application for viewing and managing user profiles and activity timelines, built with Angular and Node.js, connected to an AWS PostgreSQL database.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Using the Application](#using-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

---

## Overview

The User Activity Management System provides a clean interface to:
- View all users from the database
- Search users by email, username, or first name
- View detailed activity timelines for each user, including:
  - Joined groups
  - Applied to groups
  - Created invites
  - Redeemed invites
  - Expressions
  - User posts

---

## Features

### 🏠 Home Page
- Welcome page with system overview

### 👥 All Users Page
- Display all users from the database
- Search functionality (email, username, first name)
- Quick access to view each user's timeline
- Displays user profiles with key information

### 📅 User Timeline Page
- Comprehensive activity timeline for each user
- 6 types of activities:
  - **Joined Group** - When user joins a group
  - **Applied to Group** - Group applications with status
  - **Created Invite** - Invites created by the user
  - **Redeemed Invite** - Invites redeemed by the user
  - **Expression** - User expressions (can exist without groups)
  - **User Post** - Posts created by the user
- Chronological display with timestamps
- Color-coded activity types
- Group information (when applicable)

---

## Technology Stack

- **Frontend:** Angular 15
- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL (AWS RDS)
- **API Communication:** RESTful API with CORS enabled
- **Styling:** Custom CSS with Font Awesome icons

---

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Access to PostgreSQL Database** (AWS RDS credentials required)

---

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd User-Interface-for-Group-Activity
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Angular framework and CLI
- Express.js
- CORS middleware
- pg (PostgreSQL client for Node.js)
- Angular Material
- Other dependencies listed in `package.json`

**Note:** This may take a few minutes depending on your internet connection.

---

## Configuration

### Database Connection Setup

You need to configure the backend to connect to your PostgreSQL database.

**Open `server/connection.js` and update the database credentials:**

```javascript
const pool = new Pool({
  host: 'YOUR_DATABASE_HOST',           // e.g., '3.20.185.35' or AWS RDS endpoint
  port: 5432,
  database: 'YOUR_DATABASE_NAME',       // e.g., 'wander_app'
  user: 'YOUR_DATABASE_USERNAME',       // e.g., 'danny'
  password: 'YOUR_DATABASE_PASSWORD',   // Your database password
  ssl: {
    rejectUnauthorized: false           // Required for AWS RDS
  },
  connectionTimeoutMillis: 10000,
});
```

**Important:** 
- Replace the placeholder values with your actual database credentials
- Keep the `ssl` configuration for AWS RDS connections
- Do NOT commit your credentials to version control

### Database Schema Required

Your PostgreSQL database should have the following tables:
- `users` - User profiles
- `groups` - Group information
- `group_members` - Group membership records
- `group_applications` - Application records
- `group_invite_codes` - Invite codes created
- `group_invite_redemptions` - Invite redemption records
- `expressions` - User expressions
- `user_post` - User posts

---

## Running the Application

You need to run **two separate processes**: the backend server and the frontend application.

### Step 1: Start the Backend Server

**First, kill any existing process on port 3000:**

```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null
```

**Then start the backend server:**

```bash
node server/connection.js
```

**Expected output:**
```
🚀 Server listening on port 3000
📊 Using REAL AWS DATABASE

✅ Connected to AWS PostgreSQL database
Database: wander_app
Host: your-database-host
```

**Keep this terminal running.** The backend API is now available at `http://localhost:3000`

---

### Step 2: Start the Frontend Application

**Open a new terminal window** (keep the backend running).

**First, kill any existing process on port 4200:**

```bash
lsof -ti:4200 | xargs kill -9 2>/dev/null
```

**Then start the Angular development server:**

```bash
npm start
```

**If prompted "Port 4200 is already in use. Would you like to use a different port?"**
- Type `No`
- Run the kill command above again
- Then run `npm start` again

**Expected output:**
```
** Angular Live Development Server is listening on localhost:4200 **

✔ Compiled successfully.
```

**Keep this terminal running as well.**

---

### Step 3: Open the Application in Your Browser

Navigate to:

```
http://localhost:4200
```

The application should now be running!

---

## Using the Application

### Navigation

The application has three main pages accessible from the top navigation bar:

1. **🏠 Home** - Landing page
2. **👥 All Users** - Browse and search users
3. **📅 User Timeline** - View user activity timelines

### Viewing All Users

1. Click **"All Users"** in the navigation
2. Users are displayed with their key information
3. Use the search fields to filter by:
   - Email
   - Username
   - First Name
4. Click **"View Timeline"** on any user card to see their activity

### Viewing a User's Timeline

1. From the All Users page, click **"View Timeline"** on a user card
   - OR -
2. Go to the **"User Timeline"** page and search by email/username/first name

The timeline displays all activities chronologically:
- **Green** = Joined Group
- **Blue** = Applied to Group
- **Orange** = Created Invite
- **Purple** = Redeemed Invite
- **Cyan** = Expression
- **Pink** = User Post

Each activity shows:
- Activity type and role
- Timestamp
- Associated group information (if applicable)
- Activity-specific details (status, invite codes, content, etc.)

---

## Stopping and Restarting the Application

### To Stop the Servers

**In each terminal window, press:**
```
Ctrl + C
```

This will gracefully stop the server in that terminal.

### To Restart the Application

**Terminal 1 (Backend):**
```bash
# Kill any existing process (optional but recommended)
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Start backend
node server/connection.js
```

**Terminal 2 (Frontend):**
```bash
# Kill any existing process (optional but recommended)
lsof -ti:4200 | xargs kill -9 2>/dev/null

# Start frontend
npm start
```

**Quick Restart Command (both servers):**
```bash
# Kill both ports and restart
lsof -ti:3000 | xargs kill -9 2>/dev/null; lsof -ti:4200 | xargs kill -9 2>/dev/null
```

Then start each server in separate terminals as shown above.

---

## Project Structure

```
User-Interface-for-Group-Activity/
├── server/
│   ├── connection.js              # Main backend server (AWS PostgreSQL)
│   ├── connection-with-mock.js    # Backup server with mock data
│   └── mock-data.js               # Mock data definitions
├── src/
│   ├── app/
│   │   ├── home/                  # Home page component
│   │   ├── users/                 # Users list component
│   │   │   ├── users.component.ts
│   │   │   ├── users.component.html
│   │   │   ├── users.component.css
│   │   │   └── users.ts           # User interface/model
│   │   ├── timeline/              # Timeline component
│   │   │   ├── timeline.component.ts
│   │   │   ├── timeline.component.html
│   │   │   ├── timeline.component.css
│   │   │   └── timeline.ts        # Timeline interfaces
│   │   ├── app-routing.module.ts  # Route definitions
│   │   ├── app.component.ts       # Root component
│   │   ├── app.component.html     # Navigation bar
│   │   └── app.module.ts          # App module declarations
│   ├── assets/                    # Static assets
│   ├── styles.css                 # Global styles
│   └── index.html                 # HTML entry point
├── angular.json                   # Angular configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # This file
```

---

## API Endpoints

The backend server provides the following RESTful API endpoints:

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/search?query=...&type=...` | Search users by email, username, or first_name |
| GET | `/users/:userId/timeline` | Get timeline for specific user by ID |
| GET | `/users/timeline/search?email=...&username=...&first_name=...` | Search user timeline |

### Example Requests

**Get all users:**
```bash
curl http://localhost:3000/users
```

**Search users by email:**
```bash
curl http://localhost:3000/users/search?query=example@email.com&type=email
```

**Get user timeline:**
```bash
curl http://localhost:3000/users/user_123abc/timeline
```

---

## Troubleshooting

### Port Already in Use

**Problem:** You see "Port 3000 is already in use" or "Port 4200 is already in use"

**Solution:**

**For port 3000 (backend):**
```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null
node server/connection.js
```

**For port 4200 (frontend):**
```bash
lsof -ti:4200 | xargs kill -9 2>/dev/null
npm start
```

**To check what's using a port:**
```bash
lsof -i:3000  # Check port 3000
lsof -i:4200  # Check port 4200
```

### Database Connection Error

**Error:** `Database connection failed` or `ENOTFOUND`

**Solutions:**
1. Verify your database host is accessible
2. Check your database credentials in `server/connection.js`
3. Ensure your IP address is whitelisted in AWS Security Groups
4. Verify the database is running
5. Test connection using DBeaver or another database client

### Cannot Find Module Error

**Error:** `Cannot find module 'express'` or similar

**Solution:**
```bash
npm install
```

This will reinstall all dependencies.

### Angular Compilation Errors

**Error:** TypeScript compilation errors

**Solution:**
1. Make sure all dependencies are installed: `npm install`
2. Clear the Angular cache: `rm -rf node_modules/.cache`
3. Restart the Angular dev server

### CORS Issues

If you see CORS errors in the browser console, ensure:
- The backend server is running on port 3000
- CORS is enabled in `server/connection.js` (it should be by default)

---

## Development Notes

### Mock Data Server

If you cannot connect to the real database, a mock data server is available:

```bash
node server/connection-with-mock.js
```

This provides the same API endpoints but uses mock data from `server/mock-data.js`.

### Environment

- **Backend runs on:** `http://localhost:3000`
- **Frontend runs on:** `http://localhost:4200`
- **Database:** AWS PostgreSQL (configured in `server/connection.js`)

### Browser Compatibility

Tested and working on:
- Chrome (recommended)
- Firefox
- Safari
- Edge

---

## Support

If you encounter any issues not covered in the troubleshooting section:

1. Check that both servers are running (backend and frontend)
2. Check the browser console for errors (F12)
3. Check the terminal outputs for both servers
4. Verify your database connection settings

---

## License

This project was created for educational purposes.
