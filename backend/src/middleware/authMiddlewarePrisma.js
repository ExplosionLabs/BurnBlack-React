const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { ApiError } = require('../utils/apiError');

const prisma = new PrismaClient();

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user using Prisma
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
        // Exclude password field
      }
    });

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    // Check if user account is active (you can add isActive field to schema if needed)
    // For now, we assume all users are active

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Token expired'));
    } else {
      next(error);
    }
  }
};

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
};

// Admin role checker
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return next(new ApiError(403, 'Admin access required'));
  }
  next();
};

// Email verification checker
const requireEmailVerification = (req, res, next) => {
  if (!req.user.emailVerified) {
    return next(new ApiError(403, 'Email verification required'));
  }
  next();
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    req.user = user;
    next();
  } catch (error) {
    // If token is invalid, continue without user
    req.user = null;
    next();
  }
};

module.exports = {
  verifyToken,
  checkRole,
  requireAdmin,
  requireEmailVerification,
  optionalAuth
};