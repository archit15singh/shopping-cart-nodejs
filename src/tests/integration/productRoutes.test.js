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
});
