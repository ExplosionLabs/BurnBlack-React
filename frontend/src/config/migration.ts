// src/config/migration.ts
// Frontend migration configuration for gradual Prisma integration

// Migration feature flags
export const MIGRATION_CONFIG = {
  // API Layer Migration
  USE_PRISMA_AUTH_API: import.meta.env.VITE_USE_PRISMA_AUTH_API === 'true' || false,
  USE_PRISMA_USER_API: import.meta.env.VITE_USE_PRISMA_USER_API === 'true' || false,
  USE_PRISMA_DATA_API: import.meta.env.VITE_USE_PRISMA_DATA_API === 'true' || false,
  
  // State Management Migration
  USE_PRISMA_USER_STORE: import.meta.env.VITE_USE_PRISMA_USER_STORE === 'true' || false,
  USE_PRISMA_AUTH_CONTEXT: import.meta.env.VITE_USE_PRISMA_AUTH_CONTEXT === 'true' || false,
  
  // Component Migration
  USE_PRISMA_AUTH_COMPONENTS: import.meta.env.VITE_USE_PRISMA_AUTH_COMPONENTS === 'true' || false,
  USE_PRISMA_PROFILE_COMPONENTS: import.meta.env.VITE_USE_PRISMA_PROFILE_COMPONENTS === 'true' || false,
  
  // Overall Migration Mode
  MIGRATION_MODE: import.meta.env.VITE_MIGRATION_MODE || 'MONGODB', // MONGODB, PRISMA, DUAL
  
  // Debug Settings
  ENABLE_MIGRATION_LOGS: import.meta.env.VITE_ENABLE_MIGRATION_LOGS === 'true' || false,
  SHOW_DATA_FORMAT_WARNINGS: import.meta.env.VITE_SHOW_DATA_FORMAT_WARNINGS === 'true' || false,
};

// API Service Factory
export class ApiServiceFactory {
  static getAuthAPI() {
    if (MIGRATION_CONFIG.USE_PRISMA_AUTH_API || MIGRATION_CONFIG.MIGRATION_MODE === 'PRISMA') {
      return import('../api/authApiPrisma');
    } else {
      return import('../api/userApi');
    }
  }
  
  static getUserAPI() {
    if (MIGRATION_CONFIG.USE_PRISMA_USER_API || MIGRATION_CONFIG.MIGRATION_MODE === 'PRISMA') {
      return import('../api/authApiPrisma');
    } else {
      return import('../api/userApi');
    }
  }
}

// Store Service Factory
export class StoreServiceFactory {
  static getUserSlice() {
    if (MIGRATION_CONFIG.USE_PRISMA_USER_STORE || MIGRATION_CONFIG.MIGRATION_MODE === 'PRISMA') {
      return import('../stores/userSlicePrisma');
    } else {
      return import('../stores/userSlice');
    }
  }
}

// Context Service Factory
export class ContextServiceFactory {
  static getAuthContext() {
    if (MIGRATION_CONFIG.USE_PRISMA_AUTH_CONTEXT || MIGRATION_CONFIG.MIGRATION_MODE === 'PRISMA') {
      return import('../contexts/AuthContextPrisma');
    } else {
      return import('../contexts/AuthContext');
    }
  }
}

// Data Format Utilities
export class DataFormatUtils {
  // Convert MongoDB user to Prisma format
  static convertUserToPrisma(mongoUser: any) {
    if (MIGRATION_CONFIG.SHOW_DATA_FORMAT_WARNINGS && mongoUser._id) {
      console.warn('Converting MongoDB user format to Prisma format:', mongoUser);
    }
    
    return {
      id: mongoUser._id || mongoUser.id,
      name: mongoUser.name,
      email: mongoUser.email,
      phone: mongoUser.phone,
      role: mongoUser.role === 'admin' ? 'ADMIN' : 'USER',
      emailVerified: mongoUser.emailVerified || false,
      createdAt: mongoUser.createdAt,
      updatedAt: mongoUser.updatedAt
    };
  }
  
  // Convert Prisma user to MongoDB format (for backward compatibility)
  static convertUserToMongo(prismaUser: any) {
    if (MIGRATION_CONFIG.SHOW_DATA_FORMAT_WARNINGS && prismaUser.id) {
      console.warn('Converting Prisma user format to MongoDB format:', prismaUser);
    }
    
    return {
      _id: prismaUser.id || prismaUser._id,
      name: prismaUser.name,
      email: prismaUser.email,
      phone: prismaUser.phone,
      role: prismaUser.role === 'ADMIN' ? 'admin' : 'user',
      emailVerified: prismaUser.emailVerified || false,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt
    };
  }
  
  // Detect data format
  static detectUserFormat(user: any): 'MONGODB' | 'PRISMA' | 'UNKNOWN' {
    if (user._id && typeof user._id === 'string' && user._id.length === 24) {
      return 'MONGODB';
    } else if (user.id && typeof user.id === 'string' && user.id.startsWith('c')) {
      return 'PRISMA';
    } else {
      return 'UNKNOWN';
    }
  }
  
  // Normalize user data to current format
  static normalizeUser(user: any) {
    const format = this.detectUserFormat(user);
    
    if (MIGRATION_CONFIG.MIGRATION_MODE === 'PRISMA' && format === 'MONGODB') {
      return this.convertUserToPrisma(user);
    } else if (MIGRATION_CONFIG.MIGRATION_MODE === 'MONGODB' && format === 'PRISMA') {
      return this.convertUserToMongo(user);
    }
    
    return user;
  }
}

// Migration Logger
export class MigrationLogger {
  static log(message: string, data?: any) {
    if (MIGRATION_CONFIG.ENABLE_MIGRATION_LOGS) {
      console.log(`[MIGRATION] ${message}`, data || '');
    }
  }
  
  static warn(message: string, data?: any) {
    if (MIGRATION_CONFIG.ENABLE_MIGRATION_LOGS) {
      console.warn(`[MIGRATION WARNING] ${message}`, data || '');
    }
  }
  
  static error(message: string, error?: any) {
    if (MIGRATION_CONFIG.ENABLE_MIGRATION_LOGS) {
      console.error(`[MIGRATION ERROR] ${message}`, error || '');
    }
  }
}

// Environment Check
export const checkMigrationEnvironment = () => {
  const warnings = [];
  
  if (MIGRATION_CONFIG.MIGRATION_MODE === 'DUAL') {
    warnings.push('Running in DUAL mode - both MongoDB and Prisma APIs active');
  }
  
  if (!import.meta.env.VITE_BACKEND_URL) {
    warnings.push('VITE_BACKEND_URL not configured');
  }
  
  if (MIGRATION_CONFIG.USE_PRISMA_AUTH_API && !import.meta.env.VITE_USE_PRISMA_AUTH_API) {
    warnings.push('Prisma Auth API enabled in code but not in environment');
  }
  
  warnings.forEach(warning => MigrationLogger.warn(warning));
  
  return warnings.length === 0;
};

// Export migration status
export const getMigrationStatus = () => {
  return {
    mode: MIGRATION_CONFIG.MIGRATION_MODE,
    prismaAuthAPI: MIGRATION_CONFIG.USE_PRISMA_AUTH_API,
    prismaUserStore: MIGRATION_CONFIG.USE_PRISMA_USER_STORE,
    prismaAuthContext: MIGRATION_CONFIG.USE_PRISMA_AUTH_CONTEXT,
    isFullyMigrated: MIGRATION_CONFIG.MIGRATION_MODE === 'PRISMA',
    warnings: checkMigrationEnvironment()
  };
};

export default MIGRATION_CONFIG;