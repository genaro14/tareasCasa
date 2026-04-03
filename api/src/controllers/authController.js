const UserModel = require('../models/UserModel');
const { generateToken } = require('../middleware/auth');

const authController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const user = await UserModel.validatePassword(username, password);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const token = generateToken(user);
      
      res.json({
        token,
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  },

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      if (newPassword.length < 4) {
        return res.status(400).json({ error: 'New password must be at least 4 characters' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const validPassword = await UserModel.validatePassword(user.username, currentPassword);
      if (!validPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      await UserModel.updatePassword(userId, newPassword);
      
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  },

  async me(req, res) {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user info' });
    }
  }
};

module.exports = authController;
