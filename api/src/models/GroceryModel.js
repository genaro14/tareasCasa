const { pool } = require('../config/database');

class GroceryModel {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM grocery_items ORDER BY name');
    return rows;
  }

  static async findActive() {
    const [rows] = await pool.query('SELECT * FROM grocery_items WHERE is_active = TRUE ORDER BY name');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM grocery_items WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByName(name) {
    const [rows] = await pool.query('SELECT * FROM grocery_items WHERE name = ?', [name]);
    return rows[0];
  }

  static async create(data) {
    const { name, is_active = true } = data;
    const [result] = await pool.query(
      'INSERT INTO grocery_items (name, is_active) VALUES (?, ?)',
      [name, is_active]
    );
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const { name, is_active } = data;
    const updates = [];
    const values = [];
    
    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }
    
    if (updates.length === 0) return this.findById(id);
    
    values.push(id);
    await pool.query(`UPDATE grocery_items SET ${updates.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async toggleActive(id) {
    await pool.query('UPDATE grocery_items SET is_active = NOT is_active WHERE id = ?', [id]);
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM grocery_items WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = GroceryModel;
