const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  // User Registration
  async registerUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create new user
      const user = new User({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword,
        role: userData.role || 'user'
      });

      await user.save();

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        user: this.sanitizeUser(user),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // User Login
  async loginUser(email, password) {
    try {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        user: this.sanitizeUser(user),
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Get User Profile
  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return this.sanitizeUser(user);
    } catch (error) {
      throw error;
    }
  }

  // Update User Profile
  async updateUserProfile(userId, updateData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update allowed fields
      const allowedUpdates = ['name', 'phone'];
      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          user[key] = updateData[key];
        }
      });

      await user.save();
      return this.sanitizeUser(user);
    } catch (error) {
      throw error;
    }
  }

  // Change Password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  // Helper Methods
  generateToken(user) {
    return jwt.sign(
      { 
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  sanitizeUser(user) {
    const sanitized = user.toObject();
    delete sanitized.password;
    return sanitized;
  }
}

module.exports = new UserService(); 