const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

class UserServicePrisma {
  // User Registration
  async registerUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });
      
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create new user
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone || null,
          password: hashedPassword,
          role: userData.role === 'admin' ? 'ADMIN' : 'USER',
          emailVerified: false
        }
      });

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
      const user = await prisma.user.findUnique({
        where: { email }
      });
      
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
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          personalDetails: true,
          contactDetails: true,
          bankDetails: true,
          wallet: {
            include: {
              transactions: true
            }
          }
        }
      });

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
      // Hash password if provided
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      // Convert role to enum format
      if (updateData.role) {
        updateData.role = updateData.role === 'admin' ? 'ADMIN' : 'USER';
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        include: {
          personalDetails: true,
          contactDetails: true
        }
      });

      return this.sanitizeUser(user);
    } catch (error) {
      throw error;
    }
  }

  // Find User by ID
  async findUserById(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          personalDetails: true,
          contactDetails: true
        }
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Find User by Email
  async findUserByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Generate JWT Token
  generateToken(user) {
    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  // Sanitize User (remove sensitive data)
  sanitizeUser(user) {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  // Google OAuth Registration/Login
  async handleGoogleAuth(googleUser) {
    try {
      // Check if user exists
      let user = await prisma.user.findUnique({
        where: { email: googleUser.email }
      });

      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            name: googleUser.name,
            email: googleUser.email,
            emailVerified: true,
            role: 'USER',
            // No password for Google OAuth users
            password: null
          }
        });
      } else {
        // Update existing user
        user = await prisma.user.update({
          where: { email: googleUser.email },
          data: {
            emailVerified: true,
            name: googleUser.name // Update name if changed
          }
        });
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

  // Update User Email Verification Status
  async verifyUserEmail(userId) {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true }
      });

      return this.sanitizeUser(user);
    } catch (error) {
      throw error;
    }
  }

  // Get All Users (Admin only)
  async getAllUsers(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const users = await prisma.user.findMany({
        skip,
        take: limit,
        include: {
          personalDetails: true,
          contactDetails: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      const total = await prisma.user.count();

      return {
        users: users.map(user => this.sanitizeUser(user)),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete User (Admin only)
  async deleteUser(userId) {
    try {
      // Use transaction to ensure data consistency
      const result = await prisma.$transaction(async (tx) => {
        // Delete related records first
        await tx.personalDetail.deleteMany({
          where: { userId }
        });
        
        await tx.contactDetail.deleteMany({
          where: { userId }
        });
        
        await tx.bankDetail.deleteMany({
          where: { userId }
        });

        // Delete wallet transactions first, then wallets
        const wallets = await tx.wallet.findMany({
          where: { userId }
        });
        
        for (const wallet of wallets) {
          await tx.walletTransaction.deleteMany({
            where: { walletId: wallet.id }
          });
        }
        
        await tx.wallet.deleteMany({
          where: { userId }
        });

        // Finally delete the user
        const deletedUser = await tx.user.delete({
          where: { id: userId }
        });

        return deletedUser;
      });

      return this.sanitizeUser(result);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserServicePrisma();