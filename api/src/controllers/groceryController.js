const GroceryModel = require('../models/GroceryModel');

const groceryController = {
  async getAll(req, res) {
    try {
      const { active_only } = req.query;
      let items;
      
      if (active_only === 'true') {
        items = await GroceryModel.findActive();
      } else {
        items = await GroceryModel.findAll();
      }
      
      res.json(items);
    } catch (error) {
      console.error('Error fetching grocery items:', error);
      res.status(500).json({ error: 'Failed to fetch grocery items' });
    }
  },

  async getById(req, res) {
    try {
      const item = await GroceryModel.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Grocery item not found' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error fetching grocery item:', error);
      res.status(500).json({ error: 'Failed to fetch grocery item' });
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const existing = await GroceryModel.findByName(name);
      if (existing) {
        return res.status(409).json({ error: 'Grocery item with this name already exists' });
      }
      
      const item = await GroceryModel.create({ name });
      res.status(201).json(item);
    } catch (error) {
      console.error('Error creating grocery item:', error);
      res.status(500).json({ error: 'Failed to create grocery item' });
    }
  },

  async update(req, res) {
    try {
      const { name, is_active } = req.body;
      const item = await GroceryModel.update(req.params.id, { name, is_active });
      
      if (!item) {
        return res.status(404).json({ error: 'Grocery item not found' });
      }
      
      res.json(item);
    } catch (error) {
      console.error('Error updating grocery item:', error);
      res.status(500).json({ error: 'Failed to update grocery item' });
    }
  },

  async toggleActive(req, res) {
    try {
      const item = await GroceryModel.toggleActive(req.params.id);
      
      if (!item) {
        return res.status(404).json({ error: 'Grocery item not found' });
      }
      
      res.json(item);
    } catch (error) {
      console.error('Error toggling grocery item:', error);
      res.status(500).json({ error: 'Failed to toggle grocery item' });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await GroceryModel.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Grocery item not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting grocery item:', error);
      res.status(500).json({ error: 'Failed to delete grocery item' });
    }
  }
};

module.exports = groceryController;
