const express = require("express");
const passport = require("passport");
const { register, login, me } = require("./auth.controller");

const router = express.Router();

router.post("/register", register);

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);

router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  me
);

module.exports = router;

/*
===============================================
AUTHENTICATION MODULE - API TESTING GUIDE
===============================================

------------------------------------------
1. REGISTER USER
------------------------------------------
Method: POST
Endpoint: /api/auth/register
Role: Public (No authentication required)
Purpose: Register new user (Admin/Staff)

Sample Request Body:
{
  "name": "Ahmed Ali",
  "email": "ahmed.ali@example.com",
  "password": "Ahmed@123",
  "role": "ADMIN"
}

Sample Response (Success - 201):
{
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ahmed Ali",
    "email": "ahmed.ali@example.com",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}

How to Test in Postman:
1. Select POST method
2. URL: http://localhost:3000/api/auth/register
3. Go to Body > raw > JSON
4. Paste the sample request body
5. Click Send
6. You should get 201 status with user details

------------------------------------------
2. LOGIN USER
------------------------------------------
Method: POST
Endpoint: /api/auth/login
Role: Public (No authentication required)
Purpose: Login and get JWT token

Sample Request Body:
{
  "email": "ahmed.ali@example.com",
  "password": "Ahmed@123"
}

Sample Response (Success - 200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ahmed Ali",
    "email": "ahmed.ali@example.com",
    "role": "ADMIN"
  }
}

How to Test in Postman:
1. Select POST method
2. URL: http://localhost:3000/api/auth/login
3. Go to Body > raw > JSON
4. Paste the sample request body
5. Click Send
6. Copy the token from response
7. Save this token for other API requests

------------------------------------------
3. GET LOGGED-IN USER INFO
------------------------------------------
Method: GET
Endpoint: /api/auth/me
Role: ADMIN, STAFF (Requires authentication)
Purpose: Get current logged-in user details

Headers Required:
Authorization: Bearer YOUR_JWT_TOKEN

Sample Response (Success - 200):
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Ahmed Ali",
  "email": "ahmed.ali@example.com",
  "role": "ADMIN",
  "isActive": true
}

How to Test in Postman:
1. Select GET method
2. URL: http://localhost:3000/api/auth/me
3. Go to Headers tab
4. Add key: Authorization
5. Add value: Bearer YOUR_JWT_TOKEN
6. Click Send

------------------------------------------
ADDITIONAL TEST DATA (Pakistani Context)
------------------------------------------

Admin User:
{
  "name": "Usman Ahmed",
  "email": "usman.ahmed@erp.com",
  "password": "Admin@2024",
  "role": "ADMIN"
}

Staff User:
{
  "name": "Fatima Khan",
  "email": "fatima.khan@erp.com",
  "password": "Staff@123",
  "role": "STAFF"
}

Manager User:
{
  "name": "Ali Hassan",
  "email": "ali.hassan@erp.com",
  "password": "Manager@123",
  "role": "MANAGER"
}
*/