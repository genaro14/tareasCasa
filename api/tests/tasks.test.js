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
const tasksRoutes = require('../src/routes/tasks');

const app = express();
app.use(express.json());
app.use('/api/tasks', tasksRoutes);

describe('Tasks API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [
        { id: 1, task_name: 'Clean kitchen', due_date: '2024-01-01', is_completed: false },
        { id: 2, task_name: 'Buy groceries', due_date: '2024-01-02', is_completed: true }
      ];
      pool.query.mockResolvedValue([mockTasks]);

      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTasks);
    });

    it('should return only pending tasks when pending_only=true', async () => {
      const mockTasks = [{ id: 1, task_name: 'Clean kitchen', due_date: '2024-01-01', is_completed: false }];
      pool.query.mockResolvedValue([mockTasks]);

      const res = await request(app)
        .get('/api/tasks')
        .query({ pending_only: 'true' });

      expect(res.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('is_completed = FALSE')
      );
    });

    it('should return tasks for date range', async () => {
      const mockTasks = [{ id: 1, task_name: 'Clean kitchen', due_date: '2024-01-01', is_completed: false }];
      pool.query.mockResolvedValue([mockTasks]);

      const res = await request(app)
        .get('/api/tasks')
        .query({ start_date: '2024-01-01', end_date: '2024-01-07' });

      expect(res.status).toBe(200);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('BETWEEN'),
        ['2024-01-01', '2024-01-07']
      );
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = { task_name: 'Clean kitchen', due_date: '2024-01-01' };
      const createdTask = { id: 1, ...newTask, is_completed: false };
      
      pool.query
        .mockResolvedValueOnce([{ insertId: 1 }])
        .mockResolvedValueOnce([[createdTask]]);

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(res.status).toBe(201);
      expect(res.body.task_name).toBe('Clean kitchen');
    });

    it('should return 400 if task_name is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ due_date: '2024-01-01' });

      expect(res.status).toBe(400);
    });

    it('should return 400 if due_date is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ task_name: 'Clean kitchen' });

      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/tasks/:id/toggle', () => {
    it('should toggle task completion', async () => {
      const toggledTask = { id: 1, task_name: 'Clean kitchen', due_date: '2024-01-01', is_completed: true };
      pool.query
        .mockResolvedValueOnce([{ affectedRows: 1 }])
        .mockResolvedValueOnce([[toggledTask]]);

      const res = await request(app).patch('/api/tasks/1/toggle');

      expect(res.status).toBe(200);
      expect(res.body.is_completed).toBe(true);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      const res = await request(app).delete('/api/tasks/1');

      expect(res.status).toBe(204);
    });

    it('should return 404 if task not found', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 0 }]);

      const res = await request(app).delete('/api/tasks/999');

      expect(res.status).toBe(404);
    });
  });
});
