const MealModel = require('../models/MealModel');

const mealsController = {
  async getAll(req, res) {
    try {
      const { start_date, end_date } = req.query;
      let meals;
      
      if (start_date && end_date) {
        meals = await MealModel.findByDateRange(start_date, end_date);
      } else {
        meals = await MealModel.findAll();
      }
      
      res.json(meals);
    } catch (error) {
      console.error('Error fetching meals:', error);
      res.status(500).json({ error: 'Failed to fetch meals' });
    }
  },

  async getById(req, res) {
    try {
      const meal = await MealModel.findById(req.params.id);
      if (!meal) {
        return res.status(404).json({ error: 'Meal not found' });
      }
      res.json(meal);
    } catch (error) {
      console.error('Error fetching meal:', error);
      res.status(500).json({ error: 'Failed to fetch meal' });
    }
  },

  async getByDate(req, res) {
    try {
      const meals = await MealModel.findByDate(req.params.date);
      res.json(meals);
    } catch (error) {
      console.error('Error fetching meals by date:', error);
      res.status(500).json({ error: 'Failed to fetch meals' });
    }
  },

  async create(req, res) {
    try {
      const { date, meal_type, meal_name } = req.body;
      
      if (!date || !meal_name) {
        return res.status(400).json({ error: 'Date and meal_name are required' });
      }
      
      const meal = await MealModel.create({ date, meal_type, meal_name });
      res.status(201).json(meal);
    } catch (error) {
      console.error('Error creating meal:', error);
      res.status(500).json({ error: 'Failed to create meal' });
    }
  },

  async update(req, res) {
    try {
      const { date, meal_type, meal_name } = req.body;
      const meal = await MealModel.update(req.params.id, { date, meal_type, meal_name });
      
      if (!meal) {
        return res.status(404).json({ error: 'Meal not found' });
      }
      
      res.json(meal);
    } catch (error) {
      console.error('Error updating meal:', error);
      res.status(500).json({ error: 'Failed to update meal' });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await MealModel.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Meal not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting meal:', error);
      res.status(500).json({ error: 'Failed to delete meal' });
    }
  },

  async deleteByDateAndType(req, res) {
    try {
      const { date, type } = req.params;
      const deleted = await MealModel.deleteByDateAndType(date, type);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Meal not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting meal:', error);
      res.status(500).json({ error: 'Failed to delete meal' });
    }
  }
};

module.exports = mealsController;
