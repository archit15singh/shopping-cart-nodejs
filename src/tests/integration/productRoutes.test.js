import request from 'supertest';
import app from '../../app.js';
import mongoose from 'mongoose';
import Product from '../../models/product.js';

describe('Product Routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: 'Test Product', price: 100, stock: 10 });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'Test Product');
  });

  it('should get all products', async () => {
    const res = await request(app)
      .get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should get a product by ID', async () => {
    const product = new Product({ name: 'Test Product', price: 100, stock: 10 });
    await product.save();

    const res = await request(app)
      .get(`/api/products/${product._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Test Product');
  });

  it('should update a product', async () => {
    const product = new Product({ name: 'Test Product', price: 100, stock: 10 });
    await product.save();

    const res = await request(app)
      .put(`/api/products/${product._id}`)
      .send({ name: 'Updated Product' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Updated Product');
  });

  it('should delete a product', async () => {
    const product = new Product({ name: 'Test Product', price: 100, stock: 10 });
    await product.save();

    const res = await request(app)
      .delete(`/api/products/${product._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Product deleted successfully');
  });

  it('should handle creating a product with invalid data', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ name: '', price: -100, stock: -10 });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 404 for non-existent product', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/products/${nonExistentId}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Product not found');
  });
});
