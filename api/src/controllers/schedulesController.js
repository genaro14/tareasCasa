const ScheduleModel = require('../models/ScheduleModel');

const schedulesController = {
  async getAll(req, res) {
    try {
      const { day } = req.query;
      let schedules;
      
      if (day) {
        schedules = await ScheduleModel.findByDay(day);
      } else {
        schedules = await ScheduleModel.findAll();
      }
      
      res.json(schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      res.status(500).json({ error: 'Failed to fetch schedules' });
    }
  },

  async getById(req, res) {
    try {
      const schedule = await ScheduleModel.findById(req.params.id);
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      res.json(schedule);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      res.status(500).json({ error: 'Failed to fetch schedule' });
    }
  },

  async getUsers(req, res) {
    try {
      const users = await ScheduleModel.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },

  async create(req, res) {
    try {
      const { title, day_of_week, schedule_date, start_time, end_time, is_recurring = true, user_ids } = req.body;
      
      if (!title || !start_time || !end_time) {
        return res.status(400).json({ error: 'Title, start time and end time are required' });
      }
      
      if (is_recurring && !day_of_week) {
        return res.status(400).json({ error: 'Day of week is required for recurring schedules' });
      }
      
      if (!is_recurring && !schedule_date) {
        return res.status(400).json({ error: 'Date is required for non-recurring schedules' });
      }
      
      const schedule = await ScheduleModel.create({ title, day_of_week, schedule_date, start_time, end_time, is_recurring, user_ids });
      res.status(201).json(schedule);
    } catch (error) {
      console.error('Error creating schedule:', error);
      res.status(500).json({ error: 'Failed to create schedule' });
    }
  },

  async update(req, res) {
    try {
      const { title, day_of_week, schedule_date, start_time, end_time, is_recurring, user_ids } = req.body;
      const schedule = await ScheduleModel.update(req.params.id, { title, day_of_week, schedule_date, start_time, end_time, is_recurring, user_ids });
      
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      
      res.json(schedule);
    } catch (error) {
      console.error('Error updating schedule:', error);
      res.status(500).json({ error: 'Failed to update schedule' });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await ScheduleModel.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      res.status(500).json({ error: 'Failed to delete schedule' });
    }
  }
};

module.exports = schedulesController;
