const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

class UserModel {
  static async findAll() {
    const [rows] = await pool.query('SELECT id, username, created_at, updated_at FROM users');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT id, username, created_at, updated_at FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(username) = LOWER(?)', [username]);
    return rows[0];
  }

  static async create(data) {
    const { username, password } = data;
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, password_hash]
    );
    return this.findById(result.insertId);
  }

  static async updatePassword(id, newPassword) {
    const password_hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, id]);
    return this.findById(id);
  }

  static async validatePassword(username, password) {
    const user = await this.findByUsername(username);
    if (!user) return null;
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return null;
    
    return { id: user.id, username: user.username };
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = UserModel;
