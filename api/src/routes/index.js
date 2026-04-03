const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

const authRoutes = require('./auth');
const mealsRoutes = require('./meals');
const groceryRoutes = require('./grocery');
const tasksRoutes = require('./tasks');
const schedulesRoutes = require('./schedules');

// Health check - public (no auth required)
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth routes - login is public, others protected
router.use('/auth', authRoutes);

// Protected routes - require authentication
router.use('/meals', authMiddleware, mealsRoutes);
router.use('/grocery-items', authMiddleware, groceryRoutes);
router.use('/tasks', authMiddleware, tasksRoutes);
router.use('/schedules', authMiddleware, schedulesRoutes);

module.exports = router;
