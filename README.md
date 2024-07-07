Here's a sample README file for your project:

---

# User Authentication & Organisation API

This API provides endpoints for user registration, authentication, and organization management. It is built using Node.js, Express, and Sequelize for PostgreSQL.

## Table of Contents

- [User Authentication & Organisation API](#user-authentication--organisation-api)
  - [Table of Contents](#table-of-contents)
  - [Setup](#setup)
    - [Environment Variables](#environment-variables)
  - [Endpoints](#endpoints)
    - [User Registration](#user-registration)
    - [User Login](#user-login)
    - [Get User](#get-user)
    - [Get All Users](#get-all-users)
    - [Get All User Organisations](#get-all-user-organisations)
    - [Get Single Organisation](#get-single-organisation)
    - [Create Organisation](#create-organisation)
    - [Add User to Organisation](#add-user-to-organisation)
  - [Responses](#responses)
    - [Successful Response](#successful-response)
    - [Error Response](#error-response)
  - [Unit Tests](#unit-tests)

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Setup your PostgreSQL database and update the environment variables in the `.env` file.
4. Start the server: `npm start`.

### Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
LOCAL_DB_NAME=your_database_name
LOCAL_DB_USER=your_database_user
LOCAL_DB_PASSWORD=your_database_password
LOCAL_DB_HOST=your_database_host
JWT_SECRET=your_jwt_secret
```

## Endpoints

### User Registration

- **Endpoint**: `POST /auth/register`
- **Description**: Registers a new user and creates a default organization.
- **Request Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "password": "string",
    "phone": "string"
  }
  ```

### User Login

- **Endpoint**: `POST /auth/login`
- **Description**: Logs in a user.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Get User

- **Endpoint**: `GET /api/users/:id`
- **Description**: Retrieves a user's record.
- **Protected**: Yes (Requires JWT token)

### Get All Users

- **Endpoint**: `GET /api/users`
- **Description**: Retrieves all users in the same organisation the user belongs to.
- **Protected**: Yes (Requires JWT token)

### Get All User Organisations

- **Endpoint**: `GET /api/organisations`
- **Description**: Retrieves all organizations the user belongs to.
- **Protected**: Yes (Requires JWT token)

### Get Single Organisation

- **Endpoint**: `GET /api/organisations/:orgId`
- **Description**: Retrieves a single organization record.
- **Protected**: Yes (Requires JWT token)

### Create Organisation

- **Endpoint**: `POST /api/organisations`
- **Description**: Creates a new organization.
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
- **Protected**: Yes (Requires JWT token)

### Add User to Organisation

- **Endpoint**: `POST /api/organisations/:orgId/users`
- **Description**: Adds a user to an organization.
- **Request Body**:
  ```json
  {
    "userId": "string"
  }
  ```
- **Protected**: Yes (Requires JWT token)

## Responses

### Successful Response

All successful responses will have the following structure:

```json
{
  "status": "success",
  "message": "string",
  "data": {}
}
```

### Error Response

All error responses will have the following structure:

```json
{
  "status": "Bad Request",
  "message": "string",
  "statusCode": 400
}
```

## Unit Tests

`npm run test`

1. **Token Generation**: Ensure token expires at the correct time and correct user details are found in the token.
2. **User Registration**: Test successful user registration, validation errors, and database constraints.
3. **User Login**: Test successful login and failure on invalid credentials.
4. **Organisation Access**: Ensure users can't see data from organizations they don't have access to.

---
