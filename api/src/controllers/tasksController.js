const TaskModel = require('../models/TaskModel');

const tasksController = {
  async getAll(req, res) {
    try {
      const { start_date, end_date, pending_only } = req.query;
      let tasks;
      
      if (pending_only === 'true') {
        tasks = await TaskModel.findPending();
      } else if (start_date && end_date) {
        tasks = await TaskModel.findByDateRange(start_date, end_date);
      } else {
        tasks = await TaskModel.findAll();
      }
      
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  },

  async getById(req, res) {
    try {
      const task = await TaskModel.findById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  },

  async getByDate(req, res) {
    try {
      const tasks = await TaskModel.findByDate(req.params.date);
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks by date:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  },

  async create(req, res) {
    try {
      const { task_name, due_date, status } = req.body;
      
      if (!task_name || !due_date) {
        return res.status(400).json({ error: 'Task name and due date are required' });
      }
      
      const task = await TaskModel.create({ task_name, due_date, status });
      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  },

  async update(req, res) {
    try {
      const { task_name, due_date, status } = req.body;
      const task = await TaskModel.update(req.params.id, { task_name, due_date, status });
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  },

  async cycleStatus(req, res) {
    try {
      const task = await TaskModel.cycleStatus(req.params.id);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json(task);
    } catch (error) {
      console.error('Error cycling task status:', error);
      res.status(500).json({ error: 'Failed to cycle task status' });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await TaskModel.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }
};

module.exports = tasksController;
