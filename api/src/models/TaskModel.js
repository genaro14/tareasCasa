const { pool } = require('../config/database');

class TaskModel {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM household_tasks ORDER BY due_date, status');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM household_tasks WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByDate(date) {
    const [rows] = await pool.query(
      'SELECT * FROM household_tasks WHERE due_date = ? ORDER BY status, task_name',
      [date]
    );
    return rows;
  }

  static async findByDateRange(startDate, endDate) {
    const [rows] = await pool.query(
      'SELECT * FROM household_tasks WHERE due_date BETWEEN ? AND ? ORDER BY due_date, status',
      [startDate, endDate]
    );
    return rows;
  }

  static async findPending() {
    const [rows] = await pool.query(
      "SELECT * FROM household_tasks WHERE status = 'pendiente' ORDER BY due_date"
    );
    return rows;
  }

  static async create(data) {
    const { task_name, due_date, status = 'pendiente' } = data;
    const [result] = await pool.query(
      'INSERT INTO household_tasks (task_name, due_date, status) VALUES (?, ?, ?)',
      [task_name, due_date, status]
    );
    return this.findById(result.insertId);
  }

  static async update(id, data) {
    const { task_name, due_date, status } = data;
    const updates = [];
    const values = [];
    
    if (task_name !== undefined) { updates.push('task_name = ?'); values.push(task_name); }
    if (due_date !== undefined) { updates.push('due_date = ?'); values.push(due_date); }
    if (status !== undefined) { updates.push('status = ?'); values.push(status); }
    
    if (updates.length === 0) return this.findById(id);
    
    values.push(id);
    await pool.query(`UPDATE household_tasks SET ${updates.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async cycleStatus(id) {
    // Cycle: pendiente -> hecho -> bloqueado -> pendiente
    const task = await this.findById(id);
    if (!task) return null;
    
    const statusCycle = {
      'pendiente': 'hecho',
      'hecho': 'bloqueado',
      'bloqueado': 'pendiente'
    };
    const newStatus = statusCycle[task.status] || 'pendiente';
    
    await pool.query('UPDATE household_tasks SET status = ? WHERE id = ?', [newStatus, id]);
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM household_tasks WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = TaskModel;
