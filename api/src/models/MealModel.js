const { pool } = require('../config/database');

class MealModel {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM meals ORDER BY date DESC, meal_type');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM meals WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByDate(date) {
    const [rows] = await pool.query('SELECT * FROM meals WHERE date = ? ORDER BY meal_type', [date]);
    return rows;
  }

  static async findByDateAndType(date, meal_type) {
    const [rows] = await pool.query('SELECT * FROM meals WHERE date = ? AND meal_type = ?', [date, meal_type]);
    return rows[0];
  }

  static async findByDateRange(startDate, endDate) {
    const [rows] = await pool.query(
      'SELECT * FROM meals WHERE date BETWEEN ? AND ? ORDER BY date, meal_type',
      [startDate, endDate]
    );
    return rows;
  }

  static async create(data) {
    const { date, meal_type = 'almuerzo', meal_name } = data;
    const [result] = await pool.query(
      'INSERT INTO meals (date, meal_type, meal_name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE meal_name = VALUES(meal_name)',
      [date, meal_type, meal_name]
    );
    return this.findByDateAndType(date, meal_type);
  }

  static async update(id, data) {
    const { date, meal_type, meal_name } = data;
    const updates = [];
    const values = [];
    
    if (date) { updates.push('date = ?'); values.push(date); }
    if (meal_type) { updates.push('meal_type = ?'); values.push(meal_type); }
    if (meal_name) { updates.push('meal_name = ?'); values.push(meal_name); }
    
    if (updates.length === 0) return this.findById(id);
    
    values.push(id);
    await pool.query(`UPDATE meals SET ${updates.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM meals WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async deleteByDateAndType(date, meal_type) {
    const [result] = await pool.query('DELETE FROM meals WHERE date = ? AND meal_type = ?', [date, meal_type]);
    return result.affectedRows > 0;
  }
}

module.exports = MealModel;
