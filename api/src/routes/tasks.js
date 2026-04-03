const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

router.get('/', tasksController.getAll);
router.get('/date/:date', tasksController.getByDate);
router.get('/:id', tasksController.getById);
router.post('/', tasksController.create);
router.put('/:id', tasksController.update);
router.patch('/:id/cycle-status', tasksController.cycleStatus);
router.delete('/:id', tasksController.delete);

module.exports = router;
