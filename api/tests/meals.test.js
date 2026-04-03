const request = require('supertest');
const express = require('express');

// Mock the database
jest.mock('../src/config/database', () => ({
  pool: {
    query: jest.fn(),
    getConnection: jest.fn()
  },
  testConnection: jest.fn().mockResolvedValue(true)
}));

const { pool } = require('../src/config/database');
const mealsRoutes = require('../src/routes/meals');

const app = express();
app.use(express.json());
app.use('/api/meals', mealsRoutes);

describe('Meals API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/meals', () => {
    it('should return all meals', async () => {
      const mockMeals = [
        { id: 1, date: '2024-01-01', meal_name: 'Pizza' },
        { id: 2, date: '2024-01-02', meal_name: 'Pasta' }
      ];
      pool.query.mockResolvedValue([mockMeals]);

      const res = await request(app).get('/api/meals');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMeals);
    });

    it('should return meals for date range', async () => {
      const mockMeals = [{ id: 1, date: '2024-01-01', meal_name: 'Pizza' }];
      pool.query.mockResolvedValue([mockMeals]);

      const res = await request(app)
        .get('/api/meals')
        .query({ start_date: '2024-01-01', end_date: '2024-01-07' });

      expect(res.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('BETWEEN'),
        ['2024-01-01', '2024-01-07']
      );
    });
  });

  describe('POST /api/meals', () => {
    it('should create a new meal', async () => {
      const newMeal = { date: '2024-01-01', meal_name: 'Pizza' };
      const createdMeal = { id: 1, ...newMeal };
      
      pool.query
        .mockResolvedValueOnce([{ insertId: 1 }])
        .mockResolvedValueOnce([[createdMeal]]);

      const res = await request(app)
        .post('/api/meals')
        .send(newMeal);

      expect(res.status).toBe(201);
      expect(res.body.meal_name).toBe('Pizza');
    });

    it('should return 400 if date is missing', async () => {
      const res = await request(app)
        .post('/api/meals')
        .send({ meal_name: 'Pizza' });

      expect(res.status).toBe(400);
    });

    it('should return 400 if meal_name is missing', async () => {
      const res = await request(app)
        .post('/api/meals')
        .send({ date: '2024-01-01' });

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/meals/:id', () => {
    it('should delete a meal', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      const res = await request(app).delete('/api/meals/1');

      expect(res.status).toBe(204);
    });

    it('should return 404 if meal not found', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 0 }]);

      const res = await request(app).delete('/api/meals/999');

      expect(res.status).toBe(404);
    });
  });
});
