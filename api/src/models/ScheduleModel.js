const { pool } = require('../config/database');

class ScheduleModel {
  static async findAll() {
    const [rows] = await pool.query(`
      SELECT s.*, GROUP_CONCAT(u.id) as user_ids, GROUP_CONCAT(u.username) as usernames, GROUP_CONCAT(u.color) as colors
      FROM schedules s
      LEFT JOIN schedule_users su ON s.id = su.schedule_id
      LEFT JOIN users u ON su.user_id = u.id
      GROUP BY s.id
      ORDER BY s.is_recurring DESC, s.schedule_date, FIELD(s.day_of_week, 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'), s.start_time
    `);
    return rows.map(this.parseSchedule);
  }

  static async findById(id) {
    const [rows] = await pool.query(`
      SELECT s.*, GROUP_CONCAT(u.id) as user_ids, GROUP_CONCAT(u.username) as usernames, GROUP_CONCAT(u.color) as colors
      FROM schedules s
      LEFT JOIN schedule_users su ON s.id = su.schedule_id
      LEFT JOIN users u ON su.user_id = u.id
      WHERE s.id = ?
      GROUP BY s.id
    `, [id]);
    return rows[0] ? this.parseSchedule(rows[0]) : null;
  }

  static async findByDay(dayOfWeek) {
    const [rows] = await pool.query(`
      SELECT s.*, GROUP_CONCAT(u.id) as user_ids, GROUP_CONCAT(u.username) as usernames, GROUP_CONCAT(u.color) as colors
      FROM schedules s
      LEFT JOIN schedule_users su ON s.id = su.schedule_id
      LEFT JOIN users u ON su.user_id = u.id
      WHERE s.day_of_week = ? AND s.is_recurring = TRUE
      GROUP BY s.id
      ORDER BY s.start_time
    `, [dayOfWeek]);
    return rows.map(this.parseSchedule);
  }

  static async findByDate(date) {
    const [rows] = await pool.query(`
      SELECT s.*, GROUP_CONCAT(u.id) as user_ids, GROUP_CONCAT(u.username) as usernames, GROUP_CONCAT(u.color) as colors
      FROM schedules s
      LEFT JOIN schedule_users su ON s.id = su.schedule_id
      LEFT JOIN users u ON su.user_id = u.id
      WHERE s.schedule_date = ? AND s.is_recurring = FALSE
      GROUP BY s.id
      ORDER BY s.start_time
    `, [date]);
    return rows.map(this.parseSchedule);
  }

  static async findByDateRange(startDate, endDate) {
    const [rows] = await pool.query(`
      SELECT s.*, GROUP_CONCAT(u.id) as user_ids, GROUP_CONCAT(u.username) as usernames, GROUP_CONCAT(u.color) as colors
      FROM schedules s
      LEFT JOIN schedule_users su ON s.id = su.schedule_id
      LEFT JOIN users u ON su.user_id = u.id
      WHERE (s.is_recurring = TRUE) OR (s.schedule_date BETWEEN ? AND ?)
      GROUP BY s.id
      ORDER BY s.start_time
    `, [startDate, endDate]);
    return rows.map(this.parseSchedule);
  }

  static async create(data) {
    const { title, day_of_week, schedule_date, start_time, end_time, is_recurring = true, user_ids = [] } = data;
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const [result] = await connection.query(
        'INSERT INTO schedules (title, day_of_week, schedule_date, start_time, end_time, is_recurring) VALUES (?, ?, ?, ?, ?, ?)',
        [title, is_recurring ? day_of_week : null, is_recurring ? null : schedule_date, start_time, end_time, is_recurring]
      );
      
      const scheduleId = result.insertId;
      
      if (user_ids.length > 0) {
        const values = user_ids.map(userId => [scheduleId, userId]);
        await connection.query(
          'INSERT INTO schedule_users (schedule_id, user_id) VALUES ?',
          [values]
        );
      }
      
      await connection.commit();
      return this.findById(scheduleId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update(id, data) {
    const { title, day_of_week, schedule_date, start_time, end_time, is_recurring, user_ids } = data;
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const updates = [];
      const values = [];
      
      if (title !== undefined) { updates.push('title = ?'); values.push(title); }
      if (is_recurring !== undefined) {
        updates.push('is_recurring = ?'); values.push(is_recurring);
        if (is_recurring) {
          updates.push('schedule_date = NULL');
          if (day_of_week !== undefined) { updates.push('day_of_week = ?'); values.push(day_of_week); }
        } else {
          updates.push('day_of_week = NULL');
          if (schedule_date !== undefined) { updates.push('schedule_date = ?'); values.push(schedule_date); }
        }
      } else {
        if (day_of_week !== undefined) { updates.push('day_of_week = ?'); values.push(day_of_week); }
        if (schedule_date !== undefined) { updates.push('schedule_date = ?'); values.push(schedule_date); }
      }
      if (start_time !== undefined) { updates.push('start_time = ?'); values.push(start_time); }
      if (end_time !== undefined) { updates.push('end_time = ?'); values.push(end_time); }
      
      if (updates.length > 0) {
        values.push(id);
        await connection.query(`UPDATE schedules SET ${updates.join(', ')} WHERE id = ?`, values);
      }
      
      if (user_ids !== undefined) {
        await connection.query('DELETE FROM schedule_users WHERE schedule_id = ?', [id]);
        if (user_ids.length > 0) {
          const userValues = user_ids.map(userId => [id, userId]);
          await connection.query(
            'INSERT INTO schedule_users (schedule_id, user_id) VALUES ?',
            [userValues]
          );
        }
      }
      
      await connection.commit();
      return this.findById(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM schedules WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async getAllUsers() {
    const [rows] = await pool.query('SELECT id, username, color FROM users ORDER BY username');
    return rows;
  }

  static parseSchedule(row) {
    return {
      id: row.id,
      title: row.title,
      day_of_week: row.day_of_week,
      schedule_date: row.schedule_date ? row.schedule_date.toISOString().split('T')[0] : null,
      start_time: row.start_time,
      end_time: row.end_time,
      is_recurring: !!row.is_recurring,
      users: row.user_ids ? row.user_ids.split(',').map((id, i) => ({
        id: parseInt(id),
        username: row.usernames.split(',')[i],
        color: row.colors.split(',')[i]
      })) : [],
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
}

module.exports = ScheduleModel;
