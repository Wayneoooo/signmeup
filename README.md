# Welcome to Signmeup
Signmeup is a simple web volunteer signup application.

## Description

Signmeup is a web-based application designed to support teams that require a structured and efficient way to manage event participation and volunteer allocation. While the primary focus is on volunteer-based teams, the application is flexible enough to be used in any team setting where responsibilities need to be assigned. The platform serves both team leaders and team members. Team leaders can create, update, and delete events with minimal effort, while team members can view events and confirm their availability with a single action. All updates(including event modifications or cancellations) are communicated immediately to relevant users. This reduces the need for manual coordination and minimizes communication overhead, resulting in more efficient planning and improved reliability.

## Getting Started

### Prerequisites
npm
Frontend: React, Vite & TailwindCSS
Backend:Node.js (v18 or newer) + Express.js
Database: PostgreSQL with Prisma ORM
Authentication: JWT

### Installing
 **1. Clone the repository**
 git clone https://github.com/Wayneoooo/signmeup
cd signmeup

**2. Install backend dependancies**
cd sign-me-up-backend
npm install

**3. Install frontend dependancies**
cd sign-me-up
npm run dev

**4. Setting up envrionment variables**
In the root of your backend folder, firstly make sure a .env file exists. If not create one with the following information (if it exists verify or fill in your information)

DATABASE_URL="postgresql://**YOURUSERNAME***:**YOURPASSWORD**@127.0.0.1:5432/signmeup?schema=public" (verify that your database is running on port 5432 and adjust accordingly)
JWT_SECRET=**YOUR KEY**
RESEND_API_KEY= **YOUR RESEND API**

### Executing program
Push the database using : "npx prisma db push"
Start the backend server. Ensure you are in the root folder of the backend then use "npm run dev"
Start the frontend server. Ensure you are in the root folder of the frontend then use "npm run dev"
The frontend should run on http://localhost:5173 and the backend on http://localhost:3000
Navigate to the frontend URL on you web browser of choice 
Have fun!
