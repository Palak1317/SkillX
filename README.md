SkillX – Peer-to-Peer Skill Exchange Platform:

SkillX is a web-based skill exchange marketplace where users can teach what they know and learn what they love, using a token-based exchange model instead of money.
Built using React + Vite, Node.js + Express, and MySQL.

Features:
User Authentication (JWT)
Skill Marketplace
Peer-to-Peer Session Booking
Chat System
Wallet & Token Management
Admin Dashboard
Responsive UI

Tech Stack:
Frontend: React + Vite
Backend: Node.js + Express
Database: MySQL
Auth: JWT (JSON Web Tokens)
API: REST API architecture

Project Setup Guide

Prerequisites
Make sure you have the following installed:
Node.js (v18+)
MySQL Server
Git

Backend Setup

*Navigate to backend folder
cd backend
*Install dependencies
npm install
*Create a .env file
Inside /backend, create:
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=skillx
JWT_SECRET=your_jwt_secret
*Run backend
node server.js
Your backend is now running at:
http://localhost:5000

Frontend Setup

*Navigate to frontend folder
cd frontend
*Install dependencies
npm install
*Create .env file in /frontend
VITE_API_URL=http://localhost:5000
*Start frontend
npm run dev
Frontend will run at:
http://localhost:5173

Environment Variables Summary

Component	Variable	Description

Backend	PORT	API port
Backend	DB_HOST	DB host
Backend	DB_USER	DB username
Backend	DB_PASSWORD	DB password
Backend	DB_NAME	Database name
Backend	JWT_SECRET	Secret key for authentication
Frontend	VITE_API_URL	Backend API URL

Folder Structure

SkillX/
│── backend/
│   ├── server.js
│   ├── controllers/
│   ├── routes/
│   ├── models/
│── frontend/
│   ├── index.html
│   ├── src/
│── README.md

Sample Test Users

email: test1@gmail.com
password: 123456

---

2. Technical Design Document (TDD)

You can save this as TECHNICAL_DESIGN.md
SkillX – Technical Design Document

1. System Architecture
SkillX follows a 3-layer architecture:

1) Presentation Layer (Frontend)
Framework: React + Vite
Handles UI rendering, API calls, routing
Communicates with backend using Axios

2) Application Layer (Backend)
Framework: Node.js + Express
Responsibilities:
Authentication
Skill marketplace logic
Token wallet operations
Admin operations
Business rules

3) Data Layer (Database)
MySQL relational database
Stores:
Users
Skills
Sessions
Wallets
Transactions
Reviews

2. Architecture Diagram (Text Version)

[React Frontend]
                |
          (Axios Calls)
                |
        [Node.js + Express]
                |
        (SQL Queries / ORM)
                |
             [MySQL DB]


3. Key Modules
Authentication Module
JWT-based

Middleware-protected routes
Skill Marketplace Module
Fetch skills
Add/Remove skills
Search and filter

Booking Module
Book learning sessions
Cancel sessions
View schedule

Wallet Module
Earn tokens by teaching
Spend tokens to learn

Chat Module
Real-time messaging (future enhancement)

4. Database Schema Summary

Users Table
id | name | email | password | tokens | created_at

Skills Table
id | user_id | skill_name | level

Sessions Table
id | teacher_id | learner_id | skill_id | date | status

Wallet Transactions
id | user_id | amount | type | timestamp

---

3. Sample Data / Test Cases

Save as: TEST_CASES.md

---

Sample Test Case 1 – User Registration

Field	Value

Name	Palak
Email	palak@gmail.com
Password	123456

Expected Output:
✔ User created successfully
✔ Token returned
✔ Stored in database

---

Test Case 2 – Login

Input:
email: palak@gmail.com
password: 123456

Expected:
Login success
Valid JWT returned

---

Test Case 3 – Add Skill

Input:
skill: "Python"
level: "Intermediate"

Expected:
Skill added to user profile

---

Test Case 4 – Book Session

Input:
teacher_id: 4
learner_id: 2
date: 2025-01-10

Expected:
Session created
Token deducted

---

Test Case 5 – Wallet Transaction

Input:
type: earn
amount: 10

Expected:
Tokens added to wallet

---

4. LICENSE File (MIT License)

Save as: LICENSE


MIT License
Copyright (c) 2025 SkillX
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software...
[standard MIT license text continues]
