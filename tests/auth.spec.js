const request = require("supertest");
const app = require("../server");
const db = require("../models");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils");

beforeEach(async () => {
  await db.sequelize.sync({ force: true });
});

afterAll(async () => {
  await db.sequelize.close();
});

describe("Token Generation", () => {
  it("should generate a token with correct user details and expiration time", () => {
    const user = {
      userId: "this-is-a-user",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    };

    const token = generateToken(user);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded).toHaveProperty("userId", user.userId);
    expect(decoded).toHaveProperty("firstName", user.firstName);
    expect(decoded).toHaveProperty("lastName", user.lastName);
    expect(decoded).toHaveProperty("email", user.email);

    expect(decoded.exp).toBeLessThanOrEqual(
      Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
    );
  });
});

describe("Auth API", () => {
  it("should register user successfully with default organisation", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "090333893333",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.user).toHaveProperty("firstName", "John");
    expect(res.body.data).toHaveProperty("accessToken");
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Registration unsuccessful");
  });

  it("should fail if there’s duplicate email", async () => {
    await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    const res = await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "0987654321",
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
  });

  it("should log the user in successfully", async () => {
    await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    const res = await request(app).post("/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("accessToken");
  });

  it("should fail if credentials are incorrect", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "john.doe@example.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("message", "Authentication failed");
  });
});

describe("User API", () => {
  let accessToken;

  beforeEach(async () => {
    await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    const loggedIn = await request(app).post("/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });

    accessToken = loggedIn.body.data.accessToken;
  });

  it("should fetch user", async () => {
    const loggedIn = await request(app).post("/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });

    const res = await request(app)
      .get("/api/users/" + loggedIn.body.data.user.userId)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("firstName", "John");
  });

  it("should return 403 if trying to fetch user from another organisation", async () => {
    await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      password: "password123",
    });

    const loggedInJane = await request(app).post("/auth/login").send({
      email: "jane.smith@example.com",
      password: "password123",
    });

    const res = await request(app)
      .get("/api/users/" + loggedInJane.body.data.user.userId)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty(
      "message",
      "You are not authorized to access this user."
    );
  });
});

describe("Organisation API", () => {
  let accessToken;

  beforeEach(async () => {
    await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    const loggedIn = await request(app).post("/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });

    accessToken = loggedIn.body.data.accessToken;
  });

  it("should add user to organisation", async () => {
    const orgRes = await request(app)
      .post("/api/organisations")
      .send({
        name: "New Organisation",
      })
      .set("Authorization", `Bearer ${accessToken}`);

    const userRes = await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
      phone: "039000000",
    });

    const addUserRes = await request(app)
      .post(`/api/organisations/${orgRes.body.data.orgId}/users`)
      .send({ userId: userRes.body.data.user.userId })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(addUserRes.statusCode).toEqual(201);
    expect(addUserRes.body).toHaveProperty(
      "message",
      "User added to organisation successfully"
    );
  });

  it("should return 201 if trying to add user to another organisation", async () => {
    const orgRes = await request(app)
      .post("/api/organisations")
      .send({
        name: "Another Organisation",
      })
      .set("Authorization", `Bearer ${accessToken}`);

    const userRes = await request(app).post("/auth/register").send({
      firstName: "Jake",
      lastName: "Doe",
      email: "jake.doe@example.com",
      password: "password123",
    });

    const addUserRes = await request(app)
      .post(`/api/organisations/${orgRes.body.data.orgId}/users`)
      .send({ userId: userRes.body.data.user.userId })
      .set("Authorization", `Bearer ${accessToken}`);

    expect(addUserRes.statusCode).toEqual(201);
    expect(addUserRes.body).toHaveProperty(
      "message",
      "User added to organisation successfully"
    );
  });
});

describe("Organisation Access Control", () => {
  let userToken, otherUserToken, organisationId;

  beforeEach(async () => {
    // Register and log in the first user
    await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: "john.doe@example.com",
      password: "password123",
    });

    userToken = loginRes.body.data.accessToken;

    // Register and log in the second user
    await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane.doe@example.com",
      password: "password123",
    });

    const otherLoginRes = await request(app).post("/auth/login").send({
      email: "jane.doe@example.com",
      password: "password123",
    });

    otherUserToken = otherLoginRes.body.data.accessToken;

    // Create an organisation for the first user
    const orgRes = await request(app)
      .post("/api/organisations")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "John's Organisation",
      });

    organisationId = orgRes.body.data.orgId;
  });

  it("should not allow users to access data from other organisations", async () => {
    const res = await request(app)
      .get(`/api/organisations/${organisationId}`)
      .set("Authorization", `Bearer ${otherUserToken}`);

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual(
      "You are not authorized to access this organisation."
    );
  });
});
