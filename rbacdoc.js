const swaggerOptions = {
  openapi: "3.0.0",
  info: {
    title: "Role Based Access Control API",
    version: "1.0.0",
    description: "This API demonstrates the access control of users",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  apis: ["./routes/*.js"],
  paths: {
    "/users/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        description: "Register a new user with provided details",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                  firstName: {
                    type: "string",
                  },
                  lastName: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                  },
                  role: {
                    type: "string",
                    enum: ["admin", "user"],
                  },
                  profilePicture: {
                    type: "string",
                  },
                  bio: {
                    type: "string",
                  },
                  address: {
                    type: "string",
                  },
                  phoneNumber: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered successfully",
          },
          400: {
            description: "Bad request, missing required fields or invalid data",
          },
        },
      },
    },
    "/users/login": {
      post: {
        tags: ["Authentication"],
        summary: "Login",
        description: "Authenticate and login a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                  password: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
          },
          401: {
            description: "Unauthorized, invalid credentials",
          },
        },
      },
    },
    "/users/forget-password": {
      post: {
        tags: ["Authentication"],
        summary: "Forget password",
        description: "User enters their email to get the reset password link",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Reset password mail sent successfully",
          },
          401: {
            description: "Error: Failed to reset password",
          },
        },
      },
    },
    "/users/reset-password": {
      post: {
        tags: ["Authentication"],
        summary: "Reset password",
        description: "User resets their password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  password: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password reset successfully",
          },
          401: {
            description: "Error: Failed to reset password",
          },
        },
      },
    },
    "/users/": {
      get: {
        tags: ["Users"],
        summary: "Get All Users",
        description: "Admin gets all users",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Users fetched successfully",
          },
          401: {
            description: "Unauthorized, invalid credentials",
          },
        },
      },
    },
    "/users/current": {
      get: {
        tags: ["Users"],
        summary: "Get current user",
        description: "Fetch current user details",
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "User fetched successfully",
          },
          401: {
            description: "Unauthorized, invalid credentials",
          },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get a user",
        description: "Fetch a specific user details with user Id",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "User fetched successfully",
          },
          401: {
            description: "Unauthorized, invalid credentials",
          },
        },
      },
      patch: {
        tags: ["Users"],
        summary: "Update a user",
        description: "Update a specific user with the user Id",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        requestBody: {
          description: "User object that needs to be updated",
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: {
                    type: "string",
                  },
                  lastName: {
                    type: "string",
                  },
                  role: {
                    type: "string",
                    enum: ["admin", "user"],
                  },
                  profilePicture: {
                    type: "string",
                  },
                  bio: {
                    type: "string",
                  },
                  address: {
                    type: "string",
                  },
                  phoneNumber: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "User fetched successfully",
          },
          401: {
            description: "Unauthorized, invalid credentials",
          },
        },
      },
      delete: {
        tags: ["Users"],
        summary: "Delete a user",
        description: "Delete a specific user with the user Id",
        parameters: [
          {
            name: "id",
            in: "path",
            description: "User ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "User fetched successfully",
          },
          401: {
            description: "Unauthorized, invalid credentials",
          },
        },
      },
    },
  },
};

module.exports = swaggerOptions;
