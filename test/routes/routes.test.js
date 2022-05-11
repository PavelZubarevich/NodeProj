const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');

const { adminRouter, productRouter, categoryRouter } = require('../../src/routes');
const { updateTokens, verifyAdminMiddleware } = require('../../src/helpers');
const { generateTokens } = require('../../src/helpers');
const { MongoCategory, MongoProduct } = require('../../src/models');
const { dbConnect, dbDisconnect, mongoInit } = require('../handlers');

const app = express();

app.use(express.json());
app.use('/admin', updateTokens, verifyAdminMiddleware, adminRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use((err, req, res, next) => {
  if (err.name.toLocaleLowerCase().includes('token')) {
    err.statusCode = 401;
  }

  res.status(err.statusCode || 500).format({
    text: function () {
      res.send(err.stack);
    }
  });
});

describe('testing admin routes', () => {
  let uri;
  let mongo;
  let productId;

  beforeAll(async () => {
    [mongo, uri] = await mongoInit();
    await dbConnect(uri);
  });

  afterAll(async () => {
    await dbDisconnect(mongo);
  });

  describe('Test add product method', () => {
    it('POST /products - success', async () => {
      const body = {
        displayName: 'name',
        price: 1
      };
      const { accessToken } = generateTokens('1', 'admin');

      const response = await request(app)
        .post('/admin/products')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        displayName: expect.any(String),
        createdAt: expect.any(String),
        categoryId: expect.any(Array),
        price: expect.any(Number)
      });
    });

    it('POST /admin/products - token required', async () => {
      const body = {
        displayName: 'name',
        price: 1
      };
      const response = await request(app).post('/admin/products').send(body);
      expect(response.statusCode).toBe(401);
    });

    it('POST /admin/products - admins only', async () => {
      const body = {
        displayName: 'name',
        price: 1
      };

      const { accessToken } = generateTokens('1', 'buyer');
      const response = await request(app)
        .post('/admin/products')
        .send(body)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(403);
    });
  });

  describe('Test get product by id method', () => {
    beforeAll(() => {
      productId = new mongoose.Types.ObjectId();
    });

    it('GET /products/:id - success', async () => {
      const { accessToken } = generateTokens('1', 'admin');

      await MongoProduct.create({
        _id: productId,
        displayName: 'getTest',
        price: 12
      });

      const response = await request(app)
        .get(`/admin/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        displayName: expect.any(String),
        createdAt: expect.any(String),
        categoryId: expect.any(Array),
        price: expect.any(Number)
      });
    });

    it('GET /admin/products/:id - token required', async () => {
      const response = await request(app).get('/admin/products/1');
      expect(response.statusCode).toBe(401);
    });

    it('GET /admin/products/:id - admins only', async () => {
      const { accessToken } = generateTokens('1', 'buyer');
      const response = await request(app).get('/admin/products/1').set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(403);
    });

    it('GET /admin/products/:id - should return product does not exist err', async () => {
      const { accessToken } = generateTokens('1', 'admin');

      const response = await request(app)
        .get('/admin/products/6242efa661a153abae8eb7bb')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('Test path product by id method', () => {
    beforeAll(() => {
      productId = new mongoose.Types.ObjectId();
    });

    it('Path /products/:id - success', async () => {
      const body = {
        displayName: 'getTestPathxNew',
        price: 1
      };
      const { accessToken } = generateTokens('1', 'admin');

      await MongoProduct.create({
        _id: productId,
        displayName: 'getTestPathx',
        price: 12
      });

      const response = await request(app)
        .patch(`/admin/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        displayName: expect.any(String),
        createdAt: expect.any(String),
        categoryId: expect.any(Array),
        price: expect.any(Number)
      });
    });

    it('PATCH /admin/products/:id - token required', async () => {
      const response = await request(app).patch('/admin/products/1');
      expect(response.statusCode).toBe(401);
    });

    it('PATCH /admin/products/:id - admins only', async () => {
      const { accessToken } = generateTokens('1', 'buyer');
      const response = await request(app).patch('/admin/products/1').set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(403);
    });
  });

  describe('Test delete product by id method', () => {
    beforeAll(() => {
      productId = new mongoose.Types.ObjectId();
    });

    it('DELETE /products/:id - success', async () => {
      const { accessToken } = generateTokens('1', 'admin');

      await MongoProduct.create({
        _id: productId,
        displayName: 'deleteTest',
        price: 12
      });

      const response = await request(app)
        .delete(`/admin/products/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        displayName: expect.any(String),
        createdAt: expect.any(String),
        categoryId: expect.any(Array),
        price: expect.any(Number)
      });
    });

    it('DELETE /admin/products/:id - token required', async () => {
      const response = await request(app).delete('/admin/products/1');
      expect(response.statusCode).toBe(401);
    });

    it('DELETE /admin/products/:id - admins only', async () => {
      const { accessToken } = generateTokens('1', 'buyer');
      const response = await request(app).delete('/admin/products/1').set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(403);
    });

    it('DELETE /admin/products/:id - should return product does not exist err', async () => {
      const { accessToken } = generateTokens('1', 'admin');

      const response = await request(app)
        .delete('/admin/products/6242efa661a153abae8eb7bb')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(404);
    });
  });

  describe('Test add category method', () => {
    it('POST /admin/categories - success', async () => {
      const body = {
        displayName: 'categoryAdd'
      };
      const { accessToken } = generateTokens('1', 'admin');

      const response = await request(app)
        .post('/admin/categories')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        displayName: expect.any(String),
        createdAt: expect.any(String)
      });
    });

    it('POST /admin/categories - token required', async () => {
      const response = await request(app).post('/admin/categories');
      expect(response.statusCode).toBe(401);
    });

    it('POST /admin/categories - admins only', async () => {
      const { accessToken } = generateTokens('1', 'buyer');
      const response = await request(app).post('/admin/categories').set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(403);
    });
  });

  describe('Test path category by id method', () => {
    beforeAll(() => {
      productId = new mongoose.Types.ObjectId();
    });

    it('PATCH /admin/categories/:id - success', async () => {
      const body = {
        displayName: 'patchCategoryNew'
      };
      const { accessToken } = generateTokens('1', 'admin');

      await MongoCategory.create({
        _id: productId,
        displayName: 'patchCategory'
      });

      const response = await request(app)
        .patch(`/admin/categories/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        displayName: expect.any(String),
        createdAt: expect.any(String)
      });
    });

    it('PATCH /admin/categories/:id - token required', async () => {
      const response = await request(app).patch('/admin/categories/1');
      expect(response.statusCode).toBe(401);
    });

    it('PATCH /admin/categories/:id - admins only', async () => {
      const { accessToken } = generateTokens('1', 'buyer');
      const response = await request(app).patch('/admin/categories/1').set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(403);
    });
  });

  describe('Test delete category by id method', () => {
    beforeAll(() => {
      productId = new mongoose.Types.ObjectId();
    });

    it('DELETE /admin/categories/:id - success', async () => {
      const { accessToken } = generateTokens('1', 'admin');

      await MongoCategory.create({
        _id: productId,
        displayName: 'deleteTest'
      });

      const response = await request(app)
        .delete(`/admin/categories/${productId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject({
        displayName: expect.any(String),
        createdAt: expect.any(String)
      });
    });

    it('DELETE /admin/categories/:id - token required', async () => {
      const response = await request(app).delete('/admin/categories/1');
      expect(response.statusCode).toBe(401);
    });

    it('DELETE /admin/categories/:id - admins only', async () => {
      const { accessToken } = generateTokens('1', 'buyer');
      const response = await request(app).delete('/admin/categories/1').set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(403);
    });

    it('DELETE /admin/categories/:id - should return category does not exist err', async () => {
      const { accessToken } = generateTokens('1', 'admin');

      const response = await request(app)
        .delete('/admin/categories/6242efa661a153abae8eb7bb')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(404);
    });
  });
});
