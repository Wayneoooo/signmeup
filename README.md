# SignMeUp

A web application for teams to manage event participation and volunteer allocation.


## Description

SignMeUp is a web-based application designed to support teams that require a structured and efficient way to manage event participation and volunteer allocation. While the primary focus is on volunteer-based teams, the application is flexible enough to be used in any team setting where responsibilities need to be assigned.

The platform serves both team leaders and team members. Team leaders can create, update and delete events with minimal effort, while team members can view events and confirm their availability with a single action. All updates (including event modifications or cancellations) are communicated immediately to relevant users. This reduces the need for manual coordination and minimises communication overhead, resulting in more efficient planning and improved reliability.

## Features

- **Accounts and authentication:** registration and login with bcrypt-hashed passwords and JWT-based sessions
- **Role-based access:** regular users and admins; admin-only routes are protected on the server, and roles are re-checked against the database on every request
- **Admin dashboard:** create, update and delete events, and manage user roles
- **Volunteer view:** browse events, sign up or withdraw, and see all your sign-ups in one place
- **Email notifications** (via Resend): welcome email on registration, plus confirmations when you sign up for or withdraw from an event

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js (v18+), Express |
| Database | PostgreSQL with Prisma ORM |
| Auth | JWT, bcrypt |
| Email | Resend API |

## Getting started

### Prerequisites

- Node.js v18 or newer and npm
- A running PostgreSQL instance
- A [Resend](https://resend.com) API key (for email notifications)

### 1. Clone the repository

```bash
git clone https://github.com/Wayneoooo/signmeup
cd signmeup
```

### 2. Set up the backend

```bash
cd sign-me-up-backend
npm install
```

Create a `.env` file in `sign-me-up-backend/`:

```
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@127.0.0.1:5432/signmeup?schema=public"
JWT_SECRET=YOUR_RANDOM_SECRET
RESEND_API_KEY=YOUR_RESEND_API_KEY
```

Then create the database tables and start the server:

```bash
npx prisma db push
npm run dev
```

The backend runs on http://localhost:3000.

### 3. Set up the frontend

In a second terminal:

```bash
cd sign-me-up
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Project structure

```
signmeup/
├── sign-me-up/            # React frontend (pages: Events, EventDetails, Dashboard, AdminDashboard, …)
└── sign-me-up-backend/    # Express API (routes: auth, events, profile), Prisma schema, email templates
```
