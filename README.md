# Angular Node Authentication System

A complete full-stack authentication system built with **Angular (Frontend)** and **Node.js + Express + MongoDB (Backend)**.

This project implements secure user authentication with JWT, password hashing, email-based password reset, and protected routes.

---

## Project Overview

This project demonstrates a production-level authentication workflow including:

* User registration
* User login
* JWT authentication
* Password hashing
* Forgot password email flow
* Reset password functionality
* Angular frontend integration
* Protected routes using Auth Guard
* Secure token storage
* Mailtrap email testing

---

## Tech Stack

### Frontend

* @angular/core ^21.0.0
* TypeScript
* Angular Router
* Bootstrap 5.3.8
* HTTP Client
* Functional Auth Guard
* Angular SSR

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (jsonwebtoken)
* bcryptjs
* Nodemailer
* Crypto
* cors
* dotenv
* Mailtrap (email testing)

---

## Features

### Register API

* Create new user account
* Password hashing using bcrypt
* Email uniqueness validation
* JWT token returned after registration

### Login API

* Verify email and password
* Generate JWT token
* Secure authentication flow

### JWT Authentication

* Token-based authentication
* Protected routes
* Authorization header validation

### Password Hashing

* Passwords stored securely
* bcrypt hashing with salt
* No plain-text passwords

### Forgot Password Flow

* User requests password reset
* Secure reset token generated
* Email sent with reset link
* Email tested using Mailtrap

### Reset Password API

* Token verification
* Token expiration handling
* Update password securely

### Angular Frontend Integration

* Login form
* Register form
* Dashboard page
* API integration
* Error handling

### Auth Guard Protection

* Angular functional auth guard
* Prevent unauthorized route access
* Redirect to login if not authenticated

### Token Storage

* JWT stored in localStorage
* Token attached to protected requests
* Logout clears token

---

## Project Structure

```
project-root/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── .env
│
└── auth-frontend/
    └── Angular 21 application
```

---

## Installation Guide

### 1. Clone Repository

```
git clone https://github.com/jisan3s/angular-node-auth-system.git
cd angular-node-auth-system
```

---

## Backend Setup

### Install Dependencies

```
cd backend
npm install
```

### Create `.env` File

```
PORT=5001
MONGO_URI=mongodb://localhost:27017/authSystem
JWT_SECRET=your_secret_key

MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password
```

---

## Mailtrap Email Testing Setup

This project uses Mailtrap to test email functionality during development.

### Steps:

1. Create account at https://mailtrap.io
2. Create a new inbox
3. Copy SMTP credentials
4. Add credentials to `.env`
5. All password reset emails will appear in Mailtrap inbox instead of real email

Mailtrap helps test email flows safely without sending real emails.

---

## Start Backend

```
npm run dev
```

Server runs on:

```
http://localhost:5001
```

---

## Frontend Setup

```
cd auth-frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:4200
```

---

## API Endpoints

### Register
`POST /api/auth/register` (name, email, password)

### Login
`POST /api/auth/login` (email, password)

### Forgot Password
`POST /api/auth/forgot-password` (email) - Sends a 6-digit reset code.

### Verify Reset Code
`POST /api/auth/verify-code` (email, code)

### Reset Password
`POST /api/auth/reset-password` (email, code, newPassword)

### Get All Users (Protected)
`GET /api/users/` (Requires JWT in Authorization header)

### Delete User (Protected)
`DELETE /api/users/:id` (Requires JWT, users can only delete their own account)

---

## Security Best Practices Implemented

* Password hashing with bcrypt
* JWT token authentication
* Protected routes
* Token expiration
* Secure password reset tokens
* Environment variable configuration
* Authorization header validation

---

## Future Improvements

* Role-based authorization (Admin/User)
* Refresh token system
* Email verification
* Rate limiting
* OAuth login (Google, Facebook)
* Two-factor authentication

---

## Author

Full-stack authentication system built for learning and production-ready implementation.