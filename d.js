const swaggerOptions = {
  swagger: "2.0",
  definition: {
    openapi: "3.0.0", // Specify OpenAPI version
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
  },
  apis: ["./routes/*.js"],
  tags: [
    {
      name: "Authentication",
      description: "Everything about register, login, and sign in.",
    },
    {
      name: "Users",
      description: "Operations related to users",
    },
  ],
  paths: {
    "/users/register": {
      post: {
        tags: ["Authentication"],
        summary: "Register a new user",
        description: "Register a new user with provided details",
        consumes: ["application/json"],
        produces: ["application/json"],
        requestBody: {
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
        consumes: ["application/json"],
        produces: ["application/json"],
        requestBody: {
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
          201: {
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
        consumes: ["application/json"],
        produces: ["application/json"],
        requestBody: {
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
          201: {
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
        consumes: ["application/json"],
        produces: ["application/json"],
        requestBody: {
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
          201: {
            description: "Password has been reset",
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
        produces: ["application/json"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          201: {
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
        produces: ["application/json"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          201: {
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
        description: "Fetch a specific user details with user ID",
        produces: ["application/json"],
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
          201: {
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
