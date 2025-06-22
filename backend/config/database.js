// Database Configuration and Migration Switch
// This allows gradual migration from MongoDB to PostgreSQL

const config = {
  // Database Migration Feature Flags
  USE_PRISMA_FOR_USERS: process.env.USE_PRISMA_FOR_USERS === 'true' || false,
  USE_PRISMA_FOR_PERSONAL_DETAILS: process.env.USE_PRISMA_FOR_PERSONAL_DETAILS === 'true' || false,
  USE_PRISMA_FOR_CONTACT_DETAILS: process.env.USE_PRISMA_FOR_CONTACT_DETAILS === 'true' || false,
  USE_PRISMA_FOR_WALLETS: process.env.USE_PRISMA_FOR_WALLETS === 'true' || false,
  USE_PRISMA_FOR_BANK_DETAILS: process.env.USE_PRISMA_FOR_BANK_DETAILS === 'true' || false,
  
  // Migration Mode
  MIGRATION_MODE: process.env.MIGRATION_MODE || 'MONGODB', // MONGODB, PRISMA, DUAL
  
  // Database Connections
  MONGODB_URI: process.env.MONGO_URL,
  POSTGRES_URI: process.env.SUPABASE_DATABASE_URL,
  
  // Performance Settings
  ENABLE_QUERY_LOGGING: process.env.NODE_ENV === 'development',
  ENABLE_PERFORMANCE_MONITORING: process.env.ENABLE_PERFORMANCE_MONITORING === 'true'
};

// Database Service Factory
class DatabaseServiceFactory {
  static getUserService() {
    if (config.USE_PRISMA_FOR_USERS || config.MIGRATION_MODE === 'PRISMA') {
      return require('../services/UserServicePrisma');
    } else {
      return require('../services/UserService');
    }
  }
  
  static getAuthMiddleware() {
    if (config.USE_PRISMA_FOR_USERS || config.MIGRATION_MODE === 'PRISMA') {
      return require('../middleware/authMiddlewarePrisma');
    } else {
      return require('../middleware/authMiddleware');
    }
  }
  
  static getAuthController() {
    if (config.USE_PRISMA_FOR_USERS || config.MIGRATION_MODE === 'PRISMA') {
      return require('../controllers/AuthControllerPrisma');
    } else {
      return require('../controllers/AuthController');
    }
  }
}

module.exports = {
  config,
  DatabaseServiceFactory
};