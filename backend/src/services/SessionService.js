const Redis = require('ioredis');
const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/apiError');

class SessionService {
  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      db: 0
    });

    this.redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  // Create a new session
  async createSession(userId, userAgent) {
    try {
      // Generate access and refresh tokens
      const accessToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      // Store session in Redis
      const sessionKey = `session:${userId}:${refreshToken}`;
      const sessionData = {
        userId,
        userAgent,
        accessToken,
        refreshToken,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };

      await this.redis.setex(
        sessionKey,
        7 * 24 * 60 * 60, // 7 days in seconds
        JSON.stringify(sessionData)
      );

      return {
        accessToken,
        refreshToken,
        expiresIn: 15 * 60 // 15 minutes in seconds
      };
    } catch (error) {
      throw new ApiError(500, 'Failed to create session');
    }
  }

  // Validate session
  async validateSession(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const sessionKey = `session:${decoded.userId}:${refreshToken}`;
      
      const sessionData = await this.redis.get(sessionKey);
      if (!sessionData) {
        throw new ApiError(401, 'Session not found');
      }

      const session = JSON.parse(sessionData);
      
      // Update last activity
      session.lastActivity = new Date().toISOString();
      await this.redis.setex(
        sessionKey,
        7 * 24 * 60 * 60,
        JSON.stringify(session)
      );

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      return {
        accessToken,
        expiresIn: 15 * 60
      };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError(401, 'Invalid refresh token');
      }
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Refresh token expired');
      }
      throw error;
    }
  }

  // Invalidate session
  async invalidateSession(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const sessionKey = `session:${decoded.userId}:${refreshToken}`;
      await this.redis.del(sessionKey);
    } catch (error) {
      throw new ApiError(401, 'Invalid refresh token');
    }
  }

  // Invalidate all user sessions
  async invalidateAllUserSessions(userId) {
    try {
      const keys = await this.redis.keys(`session:${userId}:*`);
      if (keys.length > 0) {
        await this.redis.del(keys);
      }
    } catch (error) {
      throw new ApiError(500, 'Failed to invalidate sessions');
    }
  }

  // Get active sessions for user
  async getUserSessions(userId) {
    try {
      const keys = await this.redis.keys(`session:${userId}:*`);
      const sessions = await Promise.all(
        keys.map(async (key) => {
          const sessionData = await this.redis.get(key);
          return JSON.parse(sessionData);
        })
      );
      return sessions;
    } catch (error) {
      throw new ApiError(500, 'Failed to get user sessions');
    }
  }

  // Update session activity
  async updateSessionActivity(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const sessionKey = `session:${decoded.userId}:${refreshToken}`;
      
      const sessionData = await this.redis.get(sessionKey);
      if (!sessionData) {
        throw new ApiError(401, 'Session not found');
      }

      const session = JSON.parse(sessionData);
      session.lastActivity = new Date().toISOString();
      
      await this.redis.setex(
        sessionKey,
        7 * 24 * 60 * 60,
        JSON.stringify(session)
      );
    } catch (error) {
      throw new ApiError(401, 'Invalid session');
    }
  }
}

module.exports = new SessionService(); 