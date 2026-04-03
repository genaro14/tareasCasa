const express = require('express');
const router = express.Router();
const mealsController = require('../controllers/mealsController');

/**
 * @swagger
 * /meals:
 *   get:
 *     summary: Get all meals
 *     tags: [Meals]
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for range filter
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for range filter
 *     responses:
 *       200:
 *         description: List of meals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meal'
 *   post:
 *     summary: Create a new meal
 *     tags: [Meals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MealRequest'
 *     responses:
 *       201:
 *         description: Meal created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Meal'
 *       400:
 *         description: Invalid request
 */
router.get('/', mealsController.getAll);
router.post('/', mealsController.create);

/**
 * @swagger
 * /meals/date/{date}:
 *   get:
 *     summary: Get meals by date (returns array with almuerzo, merienda and cena)
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Meals for date
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Meal'
 */
router.get('/date/:date', mealsController.getByDate);

/**
 * @swagger
 * /meals/date/{date}/{type}:
 *   delete:
 *     summary: Delete meal by date and type
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [almuerzo, merienda, cena]
 *     responses:
 *       204:
 *         description: Meal deleted
 *       404:
 *         description: Meal not found
 */
router.delete('/date/:date/:type', mealsController.deleteByDateAndType);

/**
 * @swagger
 * /meals/{id}:
 *   get:
 *     summary: Get meal by ID
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Meal found
 *       404:
 *         description: Meal not found
 *   put:
 *     summary: Update meal
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MealRequest'
 *     responses:
 *       200:
 *         description: Meal updated
 *       404:
 *         description: Meal not found
 *   delete:
 *     summary: Delete meal by ID
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Meal deleted
 *       404:
 *         description: Meal not found
 */
router.get('/:id', mealsController.getById);
router.put('/:id', mealsController.update);
router.delete('/:id', mealsController.delete);

module.exports = router;
