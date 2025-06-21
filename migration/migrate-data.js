// BurnBlack Data Migration: MongoDB to PostgreSQL
// Phase 2: Comprehensive Data Migration System

import { PrismaClient } from '../node_modules/@prisma/client/index.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') })

// Initialize clients
const prisma = new PrismaClient()

// MongoDB Models (import the existing models)
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/burnblack'

// Migration Configuration
const MIGRATION_CONFIG = {
  batchSize: 100,
  dryRun: false, // Set to true for testing
  continueOnError: true,
  logLevel: 'INFO', // INFO, DEBUG, ERROR
  backupEnabled: true
}

// Migration Statistics
let migrationStats = {
  totalProcessed: 0,
  successful: 0,
  failed: 0,
  skipped: 0,
  startTime: new Date(),
  errors: []
}

// Logging utility
function log(level, message, data = null) {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] ${level}: ${message}`
  
  console.log(logMessage)
  if (data) console.log(JSON.stringify(data, null, 2))
  
  // Write to log file
  const logFile = path.join(__dirname, 'migration.log')
  fs.appendFileSync(logFile, logMessage + (data ? '\\n' + JSON.stringify(data, null, 2) : '') + '\\n')
}

// Error handling utility
function handleError(error, context, record = null) {
  migrationStats.failed++
  migrationStats.errors.push({
    context,
    error: error.message,
    record: record ? record._id || record.id : null,
    timestamp: new Date()
  })
  
  log('ERROR', `Migration error in ${context}: ${error.message}`, record)
  
  if (!MIGRATION_CONFIG.continueOnError) {
    throw error
  }
}

// Data transformation utilities
class DataTransformer {
  // Convert MongoDB ObjectId to string for PostgreSQL
  static objectIdToString(objectId) {
    return objectId ? objectId.toString() : null
  }

  // Convert MongoDB date to PostgreSQL timestamp
  static dateToTimestamp(date) {
    return date instanceof Date ? date : (date ? new Date(date) : null)
  }

  // Convert MongoDB nested object to JSON
  static nestedObjectToJson(obj) {
    if (!obj) return null
    return typeof obj === 'object' ? obj : JSON.parse(obj)
  }

  // Handle decimal conversion for financial fields
  static decimalValue(value) {
    if (!value) return null
    const num = parseFloat(value)
    return isNaN(num) ? null : num
  }

  // Convert MongoDB enum to PostgreSQL enum
  static mapEnum(value, enumMapping) {
    if (!value) return null
    return enumMapping[value.toUpperCase()] || enumMapping[value] || value
  }

  // Generate UUID for new records (using cuid for compatibility)
  static generateId() {
    return 'c' + Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9)
  }
}

// MongoDB Connection Manager
class MongoDBConnection {
  static async connect() {
    try {
      await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      log('INFO', 'Connected to MongoDB successfully')
      return true
    } catch (error) {
      log('ERROR', 'Failed to connect to MongoDB', { error: error.message })
      throw error
    }
  }

  static async disconnect() {
    try {
      await mongoose.disconnect()
      log('INFO', 'Disconnected from MongoDB')
    } catch (error) {
      log('ERROR', 'Error disconnecting from MongoDB', { error: error.message })
    }
  }
}

// User Migration (Phase 1 - Safest)
class UserMigrator {
  static async migrateUsers() {
    log('INFO', 'Starting user migration...')
    
    try {
      // Connect directly to MongoDB collection
      const db = mongoose.connection.db
      const usersCollection = db.collection('users')
      
      const users = await usersCollection.find({}).toArray()
      log('INFO', `Found ${users.length} users to migrate`)
      
      let processed = 0
      let successful = 0
      
      for (const user of users) {
        try {
          if (!MIGRATION_CONFIG.dryRun) {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
              where: { email: user.email }
            })
            
            if (existingUser) {
              log('INFO', `User already exists: ${user.email}`)
              migrationStats.skipped++
              continue
            }
            
            const migratedUser = await prisma.user.create({
              data: {
                id: DataTransformer.objectIdToString(user._id),
                name: user.name || '',
                phone: user.phone || null,
                email: user.email,
                password: user.password || null,
                role: user.role === 'admin' ? 'ADMIN' : 'USER',
                emailVerified: Boolean(user.emailVerified),
                emailVerificationDate: DataTransformer.dateToTimestamp(user.emailVerificationDate),
                lastVerificationEmailSent: DataTransformer.dateToTimestamp(user.lastVerificationEmailSent),
                createdAt: DataTransformer.dateToTimestamp(user.createdAt),
                updatedAt: DataTransformer.dateToTimestamp(user.updatedAt)
              }
            })
            
            log('DEBUG', `Migrated user: ${migratedUser.email}`)
          }
          
          successful++
          processed++
          
        } catch (error) {
          handleError(error, 'UserMigration', user)
          processed++
        }
      }
      
      migrationStats.totalProcessed += processed
      migrationStats.successful += successful
      
      log('INFO', `User migration completed: ${successful}/${processed} successful`)
      return { processed, successful }
      
    } catch (error) {
      log('ERROR', 'User migration failed', { error: error.message })
      throw error
    }
  }
}

// Personal Details Migration
class PersonalDetailsMigrator {
  static async migratePersonalDetails() {
    log('INFO', 'Starting personal details migration...')
    
    try {
      const db = mongoose.connection.db
      const personalDetailsCollection = db.collection('personaldetails')
      
      const personalDetails = await personalDetailsCollection.find({}).toArray()
      log('INFO', `Found ${personalDetails.length} personal detail records to migrate`)
      
      let processed = 0
      let successful = 0
      
      for (const detail of personalDetails) {
        try {
          if (!MIGRATION_CONFIG.dryRun) {
            // Verify user exists
            const userExists = await prisma.user.findUnique({
              where: { id: DataTransformer.objectIdToString(detail.userId) }
            })
            
            if (!userExists) {
              log('ERROR', `User not found for personal detail: ${detail.userId}`)
              migrationStats.failed++
              processed++
              continue
            }
            
            const migratedDetail = await prisma.personalDetail.create({
              data: {
                id: DataTransformer.objectIdToString(detail._id),
                userId: DataTransformer.objectIdToString(detail.userId),
                firstName: detail.firstName || null,
                middleName: detail.middleName || null,
                lastName: detail.lastName || null,
                dob: DataTransformer.dateToTimestamp(detail.dob),
                gender: detail.gender ? DataTransformer.mapEnum(detail.gender, {
                  'MALE': 'MALE',
                  'FEMALE': 'FEMALE',
                  'OTHER': 'OTHER'
                }) : null,
                maritalStatus: detail.maritalStatus ? DataTransformer.mapEnum(detail.maritalStatus, {
                  'SINGLE': 'SINGLE',
                  'MARRIED': 'MARRIED',
                  'DIVORCED': 'DIVORCED',
                  'WIDOWED': 'WIDOWED'
                }) : null,
                createdAt: DataTransformer.dateToTimestamp(detail.createdAt),
                updatedAt: DataTransformer.dateToTimestamp(detail.updatedAt)
              }
            })
            
            log('DEBUG', `Migrated personal detail for user: ${detail.userId}`)
          }
          
          successful++
          processed++
          
        } catch (error) {
          handleError(error, 'PersonalDetailsMigration', detail)
          processed++
        }
      }
      
      migrationStats.totalProcessed += processed
      migrationStats.successful += successful
      
      log('INFO', `Personal details migration completed: ${successful}/${processed} successful`)
      return { processed, successful }
      
    } catch (error) {
      log('ERROR', 'Personal details migration failed', { error: error.message })
      throw error
    }
  }
}

// Contact Details Migration
class ContactDetailsMigrator {
  static async migrateContactDetails() {
    log('INFO', 'Starting contact details migration...')
    
    try {
      const db = mongoose.connection.db
      const contactDetailsCollection = db.collection('contactdetails')
      
      const contactDetails = await contactDetailsCollection.find({}).toArray()
      log('INFO', `Found ${contactDetails.length} contact detail records to migrate`)
      
      let processed = 0
      let successful = 0
      
      for (const detail of contactDetails) {
        try {
          if (!MIGRATION_CONFIG.dryRun) {
            const migratedDetail = await prisma.contactDetail.create({
              data: {
                id: DataTransformer.objectIdToString(detail._id),
                userId: DataTransformer.objectIdToString(detail.userId),
                email: detail.email || null,
                phone: detail.phone || null,
                panNumber: detail.panNumber || null,
                aadharNumber: detail.aadharNumber || null,
                alternativeEmail: detail.alternativeEmail || null,
                alternativePhone: detail.alternativePhone || null,
                createdAt: DataTransformer.dateToTimestamp(detail.createdAt),
                updatedAt: DataTransformer.dateToTimestamp(detail.updatedAt)
              }
            })
            
            log('DEBUG', `Migrated contact detail for user: ${detail.userId}`)
          }
          
          successful++
          processed++
          
        } catch (error) {
          handleError(error, 'ContactDetailsMigration', detail)
          processed++
        }
      }
      
      migrationStats.totalProcessed += processed
      migrationStats.successful += successful
      
      log('INFO', `Contact details migration completed: ${successful}/${processed} successful`)
      return { processed, successful }
      
    } catch (error) {
      log('ERROR', 'Contact details migration failed', { error: error.message })
      throw error
    }
  }
}

// Main Migration Orchestrator
class MigrationOrchestrator {
  static async runPhase2Migration() {
    log('INFO', '🚀 Starting Phase 2: MongoDB to PostgreSQL Data Migration')
    log('INFO', `Configuration: ${JSON.stringify(MIGRATION_CONFIG)}`)
    
    try {
      // Connect to databases
      await MongoDBConnection.connect()
      await prisma.$connect()
      
      // Phase 2.1: Core User Data (Safest)
      log('INFO', '📋 Phase 2.1: Migrating core user data...')
      
      const userResult = await UserMigrator.migrateUsers()
      const personalResult = await PersonalDetailsMigrator.migratePersonalDetails()
      const contactResult = await ContactDetailsMigrator.migrateContactDetails()
      
      // Generate migration report
      await this.generateMigrationReport()
      
      log('INFO', '✅ Phase 2.1 completed successfully')
      return {
        phase: '2.1',
        status: 'completed',
        results: {
          users: userResult,
          personalDetails: personalResult,
          contactDetails: contactResult
        },
        stats: migrationStats
      }
      
    } catch (error) {
      log('ERROR', '❌ Phase 2 migration failed', { error: error.message })
      throw error
    } finally {
      // Cleanup connections
      await MongoDBConnection.disconnect()
      await prisma.$disconnect()
    }
  }
  
  static async generateMigrationReport() {
    const endTime = new Date()
    const duration = endTime - migrationStats.startTime
    
    const report = {
      migration: 'Phase 2.1 - Core User Data',
      startTime: migrationStats.startTime,
      endTime: endTime,
      duration: `${Math.round(duration / 1000)}s`,
      statistics: {
        totalProcessed: migrationStats.totalProcessed,
        successful: migrationStats.successful,
        failed: migrationStats.failed,
        skipped: migrationStats.skipped,
        successRate: `${((migrationStats.successful / migrationStats.totalProcessed) * 100).toFixed(2)}%`
      },
      errors: migrationStats.errors
    }
    
    log('INFO', '📊 Migration Report', report)
    
    // Save report to file
    const reportFile = path.join(__dirname, 'migration-report.json')
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2))
    
    return report
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  
  if (args.includes('--dry-run')) {
    MIGRATION_CONFIG.dryRun = true
    console.log('🧪 Running in DRY RUN mode')
  }
  
  if (args.includes('--continue-on-error')) {
    MIGRATION_CONFIG.continueOnError = true
    console.log('⚠️  Continuing on errors enabled')
  }
  
  MigrationOrchestrator.runPhase2Migration()
    .then(result => {
      console.log('🎉 Migration completed successfully!')
      console.log(JSON.stringify(result, null, 2))
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Migration failed:', error.message)
      process.exit(1)
    })
}

export { MigrationOrchestrator, DataTransformer, MIGRATION_CONFIG }