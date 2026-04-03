const express = require('express');
const router = express.Router();
const schedulesController = require('../controllers/schedulesController');

router.get('/', schedulesController.getAll);
router.get('/users', schedulesController.getUsers);
router.get('/:id', schedulesController.getById);
router.post('/', schedulesController.create);
router.put('/:id', schedulesController.update);
router.delete('/:id', schedulesController.delete);

module.exports = router;
