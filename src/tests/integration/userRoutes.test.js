import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";

describe("User Routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ username: "testuser", password: "password" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  it("should login a user", async () => {
    await request(app)
      .post("/api/users/register")
      .send({ username: "testuser", password: "password" });

    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser", password: "password" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should return 400 for invalid login credentials", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "invaliduser", password: "invalidpassword" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid credentials");
  });

  it("should return 400 for missing fields during registration", async () => {
    const res = await request(app)
      .post("/api/users/register")
      .send({ username: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
