const request = require("supertest");
const app = require("../server");

describe("Auth API", () => {
  it("should register user successfully with default organization", async () => {
    const res = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
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
      phone: "",
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty("errors");
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
