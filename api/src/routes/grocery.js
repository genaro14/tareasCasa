const express = require('express');
const router = express.Router();
const groceryController = require('../controllers/groceryController');

router.get('/', groceryController.getAll);
router.get('/:id', groceryController.getById);
router.post('/', groceryController.create);
router.put('/:id', groceryController.update);
router.patch('/:id/toggle', groceryController.toggleActive);
router.delete('/:id', groceryController.delete);

module.exports = router;
