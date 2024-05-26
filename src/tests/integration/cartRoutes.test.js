import request from "supertest";
import app from "../../app.js";
import mongoose from "mongoose";
import Cart from "../../models/cart.js";
import User from "../../models/user.js";
import Product from "../../models/product.js";
import jwt from "jsonwebtoken";

describe("Cart Routes", () => {
  let user, token, product, cart;

  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    user = await User.create({ username: "testuser", password: "password" });
    token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    product = await Product.create({
      name: "Test Product",
      price: 100,
      stock: 10,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    cart = await Cart.create({ userId: user._id, products: [{ productId: product._id, quantity: 2 }] });
  });

  afterEach(async () => {
    await Cart.deleteMany({});
  });

  it("should create a new cart", async () => {
    await Cart.deleteMany({});
    const res = await request(app)
      .post("/api/cart")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toHaveProperty("userId");
    expect(res.body.products).toEqual([]);
  });

  it("should add a product to the cart", async () => {
    const res = await request(app)
      .post("/api/cart/product")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: product._id, quantity: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body.products).toHaveLength(1);
    expect(res.body.products[0]).toHaveProperty(
      "productId",
      product._id.toString(),
    );
    expect(res.body.products[0]).toHaveProperty("quantity", 1);
  });

  it("should remove a product from the cart", async () => {
    await Cart.updateOne(
      { _id: cart._id },
      { $push: { products: { productId: product._id, quantity: 1 } } },
    );

    const res = await request(app)
      .delete("/api/cart/product")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: product._id });

    expect(res.statusCode).toBe(200);
    expect(res.body.products).toHaveLength(0);
  });

  it("should update the quantity of a product in the cart", async () => {
    const res = await request(app)
      .put("/api/cart/product")
      .set("Authorization", `Bearer ${token}`)
      .send({ productId: product._id, quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.products[0]).toHaveProperty("quantity", 5);
  });

  it("should get the cart summary", async () => {
    const res = await request(app)
      .get("/api/cart/summary")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("itemCount", 2);
    expect(res.body).toHaveProperty("totalPrice", 200);
  });

  it("should empty the cart", async () => {
    const res = await request(app)
      .delete("/api/cart")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Cart emptied successfully");
  });

  it("should apply a discount code", async () => {
    const res = await request(app)
      .post("/api/cart/discount")
      .set("Authorization", `Bearer ${token}`)
      .send({ code: "DISCOUNT10" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("discountApplied", true);
    expect(res.body).toHaveProperty("totalPrice", 180);
  });

  it("should save the cart", async () => {
    const res = await request(app)
      .post("/api/cart/save")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Cart saved successfully");
  });

  it("should retrieve the saved cart", async () => {
    await request(app)
      .post("/api/cart/save")
      .set("Authorization", `Bearer ${token}`);

    const res = await request(app)
      .get("/api/cart/retrieve")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.cart.products).toHaveLength(2);
  });
});
