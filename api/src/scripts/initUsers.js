const bcrypt = require('bcrypt');
const { pool, testConnection } = require('../config/database');

const DEFAULT_PASSWORD = 'changeme';

const initUsers = async () => {
  try {
    await testConnection();
    
    const users = ['gena', 'chechu', 'anabella'];
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    
    for (const username of users) {
      const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
      
      if (existing.length === 0) {
        await pool.query(
          'INSERT INTO users (username, password_hash) VALUES (?, ?)',
          [username, passwordHash]
        );
        console.log(`Created user: ${username}`);
      } else {
        // Update password to default if user exists
        await pool.query(
          'UPDATE users SET password_hash = ? WHERE username = ?',
          [passwordHash, username]
        );
        console.log(`Reset password for user: ${username}`);
      }
    }
    
    console.log(`\nUsers initialized with default password: "${DEFAULT_PASSWORD}"`);
    console.log('Please change passwords after first login!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize users:', error);
    process.exit(1);
  }
};

initUsers();
