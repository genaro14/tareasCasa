const request = require('supertest');
const express = require('express');

jest.mock('../src/config/database', () => ({
  pool: {
    query: jest.fn(),
    getConnection: jest.fn()
  },
  testConnection: jest.fn().mockResolvedValue(true)
}));

const { pool } = require('../src/config/database');
const groceryRoutes = require('../src/routes/grocery');

const app = express();
app.use(express.json());
app.use('/api/grocery-items', groceryRoutes);

describe('Grocery API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/grocery-items', () => {
    it('should return all grocery items', async () => {
      const mockItems = [
        { id: 1, name: 'Milk', is_active: true },
        { id: 2, name: 'Bread', is_active: true }
      ];
      pool.query.mockResolvedValue([mockItems]);

      const res = await request(app).get('/api/grocery-items');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockItems);
    });

    it('should return only active items when active_only=true', async () => {
      const mockItems = [{ id: 1, name: 'Milk', is_active: true }];
      pool.query.mockResolvedValue([mockItems]);

      const res = await request(app)
        .get('/api/grocery-items')
        .query({ active_only: 'true' });

      expect(res.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('is_active = TRUE')
      );
    });
  });

  describe('POST /api/grocery-items', () => {
    it('should create a new grocery item', async () => {
      const newItem = { name: 'Eggs' };
      const createdItem = { id: 1, name: 'Eggs', is_active: true };
      
      pool.query
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ insertId: 1 }])
        .mockResolvedValueOnce([[createdItem]]);

      const res = await request(app)
        .post('/api/grocery-items')
        .send(newItem);

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Eggs');
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/api/grocery-items')
        .send({});

      expect(res.status).toBe(400);
    });

    it('should return 409 if item already exists', async () => {
      pool.query.mockResolvedValueOnce([[{ id: 1, name: 'Milk' }]]);

      const res = await request(app)
        .post('/api/grocery-items')
        .send({ name: 'Milk' });

      expect(res.status).toBe(409);
    });
  });

  describe('PATCH /api/grocery-items/:id/toggle', () => {
    it('should toggle item active status', async () => {
      const toggledItem = { id: 1, name: 'Milk', is_active: false };
      pool.query
        .mockResolvedValueOnce([{ affectedRows: 1 }])
        .mockResolvedValueOnce([[toggledItem]]);

      const res = await request(app).patch('/api/grocery-items/1/toggle');

      expect(res.status).toBe(200);
      expect(res.body.is_active).toBe(false);
    });
  });

  describe('DELETE /api/grocery-items/:id', () => {
    it('should delete a grocery item', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      const res = await request(app).delete('/api/grocery-items/1');

      expect(res.status).toBe(204);
    });

    it('should return 404 if item not found', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 0 }]);

      const res = await request(app).delete('/api/grocery-items/999');

      expect(res.status).toBe(404);
    });
  });
});
