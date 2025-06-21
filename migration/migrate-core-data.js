// BurnBlack Data Migration: Core Data Models (Phase 2.2)
// Bank Details, Address Details, and Wallet Migration

import { PrismaClient } from '../node_modules/@prisma/client/index.js'
import mongoose from 'mongoose'
import { DataTransformer, MIGRATION_CONFIG } from './migrate-data.js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

const prisma = new PrismaClient()
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/burnblack'

// Migration Statistics
let migrationStats = {
  totalProcessed: 0,
  successful: 0,
  failed: 0,
  skipped: 0,
  startTime: new Date(),
  errors: []
}

function log(level, message, data = null) {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] ${level}: ${message}`
  console.log(logMessage)
  if (data) console.log(JSON.stringify(data, null, 2))
}

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

// Bank Details Migration
class BankDetailsMigrator {
  static async migrateBankDetails() {
    log('INFO', 'Starting bank details migration...')
    
    try {
      const db = mongoose.connection.db
      const bankDetailsCollection = db.collection('bankdetails')
      
      const bankDetails = await bankDetailsCollection.find({}).toArray()
      log('INFO', `Found ${bankDetails.length} bank detail records to migrate`)
      
      let processed = 0
      let successful = 0
      
      for (const detail of bankDetails) {
        try {
          if (!MIGRATION_CONFIG.dryRun) {
            // Verify user exists
            const userExists = await prisma.user.findUnique({
              where: { id: DataTransformer.objectIdToString(detail.userId) }
            })
            
            if (!userExists) {
              log('ERROR', `User not found for bank detail: ${detail.userId}`)
              migrationStats.failed++
              processed++
              continue
            }
            
            const migratedDetail = await prisma.bankDetail.create({
              data: {
                id: DataTransformer.objectIdToString(detail._id),
                userId: DataTransformer.objectIdToString(detail.userId),
                accountNumber: detail.accountNumber || null,
                ifscCode: detail.ifscCode || null,
                bankName: detail.bankName || null,
                accountType: detail.accountType || null,
                accountHolderName: detail.accountHolderName || null,
                createdAt: DataTransformer.dateToTimestamp(detail.createdAt),
                updatedAt: DataTransformer.dateToTimestamp(detail.updatedAt)
              }
            })
            
            log('DEBUG', `Migrated bank detail for user: ${detail.userId}`)
          }
          
          successful++
          processed++
          
        } catch (error) {
          handleError(error, 'BankDetailsMigration', detail)
          processed++
        }
      }
      
      migrationStats.totalProcessed += processed
      migrationStats.successful += successful
      
      log('INFO', `Bank details migration completed: ${successful}/${processed} successful`)
      return { processed, successful }
      
    } catch (error) {
      log('ERROR', 'Bank details migration failed', { error: error.message })
      throw error
    }
  }
}

// Address Details Migration
class AddressDetailsMigrator {
  static async migrateAddressDetails() {
    log('INFO', 'Starting address details migration...')
    
    try {
      const db = mongoose.connection.db
      const addressDetailsCollection = db.collection('addressdetails')
      
      const addressDetails = await addressDetailsCollection.find({}).toArray()
      log('INFO', `Found ${addressDetails.length} address detail records to migrate`)
      
      let processed = 0
      let successful = 0
      
      for (const detail of addressDetails) {
        try {
          if (!MIGRATION_CONFIG.dryRun) {
            const migratedDetail = await prisma.addressDetail.create({
              data: {
                id: DataTransformer.objectIdToString(detail._id),
                userId: DataTransformer.objectIdToString(detail.userId),
                flatNo: detail.flatNo || null,
                premiseName: detail.premiseName || null,
                road: detail.road || null,
                area: detail.area || null,
                pincode: detail.pincode || null,
                country: detail.country || null,
                state: detail.state || null,
                city: detail.city || null,
                createdAt: DataTransformer.dateToTimestamp(detail.createdAt),
                updatedAt: DataTransformer.dateToTimestamp(detail.updatedAt)
              }
            })
            
            log('DEBUG', `Migrated address detail for user: ${detail.userId}`)
          }
          
          successful++
          processed++
          
        } catch (error) {
          handleError(error, 'AddressDetailsMigration', detail)
          processed++
        }
      }
      
      migrationStats.totalProcessed += processed
      migrationStats.successful += successful
      
      log('INFO', `Address details migration completed: ${successful}/${processed} successful`)
      return { processed, successful }
      
    } catch (error) {
      log('ERROR', 'Address details migration failed', { error: error.message })
      throw error
    }
  }
}

// Wallet Migration
class WalletMigrator {
  static async migrateWallets() {
    log('INFO', 'Starting wallet migration...')
    
    try {
      const db = mongoose.connection.db
      const walletsCollection = db.collection('wallets')
      
      const wallets = await walletsCollection.find({}).toArray()
      log('INFO', `Found ${wallets.length} wallet records to migrate`)
      
      let processed = 0
      let successful = 0
      
      for (const wallet of wallets) {
        try {
          if (!MIGRATION_CONFIG.dryRun) {
            // Create wallet first
            const migratedWallet = await prisma.wallet.create({
              data: {
                id: DataTransformer.objectIdToString(wallet._id),
                userId: DataTransformer.objectIdToString(wallet.userId),
                balance: DataTransformer.decimalValue(wallet.balance) || 0,
                createdAt: DataTransformer.dateToTimestamp(wallet.createdAt),
                updatedAt: DataTransformer.dateToTimestamp(wallet.updatedAt)
              }
            })
            
            // Migrate wallet transactions if they exist
            if (wallet.transactions && Array.isArray(wallet.transactions)) {
              for (const transaction of wallet.transactions) {
                try {
                  await prisma.walletTransaction.create({
                    data: {
                      id: DataTransformer.generateId(),
                      walletId: migratedWallet.id,
                      transactionType: transaction.type === 'credit' ? 'CREDIT' : 'DEBIT',
                      amount: DataTransformer.decimalValue(transaction.amount) || 0,
                      description: transaction.description || null,
                      razorpayPaymentId: transaction.razorpayPaymentId || null,
                      razorpayOrderId: transaction.razorpayOrderId || null,
                      status: transaction.status ? DataTransformer.mapEnum(transaction.status, {
                        'pending': 'PENDING',
                        'completed': 'COMPLETED',
                        'failed': 'FAILED'
                      }) : 'PENDING',
                      timestamp: DataTransformer.dateToTimestamp(transaction.timestamp)
                    }
                  })
                } catch (txError) {
                  log('ERROR', `Failed to migrate transaction for wallet ${wallet._id}:`, txError.message)
                }
              }
              
              log('DEBUG', `Migrated ${wallet.transactions.length} transactions for wallet: ${wallet.userId}`)
            }
            
            log('DEBUG', `Migrated wallet for user: ${wallet.userId}`)
          }
          
          successful++
          processed++
          
        } catch (error) {
          handleError(error, 'WalletMigration', wallet)
          processed++
        }
      }
      
      migrationStats.totalProcessed += processed
      migrationStats.successful += successful
      
      log('INFO', `Wallet migration completed: ${successful}/${processed} successful`)
      return { processed, successful }
      
    } catch (error) {
      log('ERROR', 'Wallet migration failed', { error: error.message })
      throw error
    }
  }
}

// Form 16 Data Migration (Complex)
class Form16DataMigrator {
  static async migrateForm16Data() {
    log('INFO', 'Starting Form 16 data migration...')
    
    try {
      const db = mongoose.connection.db
      const form16Collection = db.collection('form16datas')
      
      const form16Records = await form16Collection.find({}).toArray()
      log('INFO', `Found ${form16Records.length} Form 16 records to migrate`)
      
      let processed = 0
      let successful = 0
      
      for (const record of form16Records) {
        try {
          if (!MIGRATION_CONFIG.dryRun) {
            const migratedRecord = await prisma.form16Data.create({
              data: {
                id: DataTransformer.objectIdToString(record._id),
                userId: DataTransformer.objectIdToString(record.userId),
                employerName: record.employerName || null,
                employerTAN: record.employerTAN || null,
                employerCategory: record.employerCategory || null,
                totalTax: DataTransformer.decimalValue(record.totalTax),
                grossSalary: DataTransformer.decimalValue(record.grossSalary),
                notifiedIncome: DataTransformer.decimalValue(record.notifiedIncome),
                salaryBreakup: DataTransformer.nestedObjectToJson(record.salaryBreakup),
                perquisitesAmount: DataTransformer.decimalValue(record.perquisitesAmount),
                perquisites: DataTransformer.nestedObjectToJson(record.perquisites),
                profitAmount: DataTransformer.decimalValue(record.profitAmount),
                profitsInLieu: DataTransformer.nestedObjectToJson(record.profitsInLieu),
                notifiedCountry: DataTransformer.nestedObjectToJson(record.notifiedCountry),
                notifiedIncomeOtherCountry: DataTransformer.decimalValue(record.notifiedIncomeOtherCountry),
                previousYearIncomeTax: DataTransformer.decimalValue(record.previousYearIncomeTax),
                exemptAllowance: DataTransformer.decimalValue(record.exemptAllowance),
                exemptAllowanceBreakup: DataTransformer.nestedObjectToJson(record.exemptAllowanceBreakup),
                balance: DataTransformer.decimalValue(record.balance),
                standardDeduction: DataTransformer.decimalValue(record.standardDeduction),
                professionalTax: DataTransformer.decimalValue(record.professionalTax),
                reliefUnder89: DataTransformer.decimalValue(record.reliefUnder89),
                incomeClaimed: DataTransformer.decimalValue(record.incomeClaimed),
                address: DataTransformer.nestedObjectToJson(record.address),
                createdAt: DataTransformer.dateToTimestamp(record.createdAt),
                updatedAt: DataTransformer.dateToTimestamp(record.updatedAt)
              }
            })
            
            log('DEBUG', `Migrated Form 16 data for user: ${record.userId}`)
          }
          
          successful++
          processed++
          
        } catch (error) {
          handleError(error, 'Form16DataMigration', record)
          processed++
        }
      }
      
      migrationStats.totalProcessed += processed
      migrationStats.successful += successful
      
      log('INFO', `Form 16 data migration completed: ${successful}/${processed} successful`)
      return { processed, successful }
      
    } catch (error) {
      log('ERROR', 'Form 16 data migration failed', { error: error.message })
      throw error
    }
  }
}

// Core Data Migration Orchestrator
class CoreDataMigrator {
  static async runCoreDataMigration() {
    log('INFO', '🚀 Starting Phase 2.2: Core Data Migration')
    
    try {
      // Connect to databases
      await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      await prisma.$connect()
      
      log('INFO', '📋 Phase 2.2: Migrating core supporting data...')
      
      const results = {
        bankDetails: await BankDetailsMigrator.migrateBankDetails(),
        addressDetails: await AddressDetailsMigrator.migrateAddressDetails(),
        wallets: await WalletMigrator.migrateWallets(),
        form16Data: await Form16DataMigrator.migrateForm16Data()
      }
      
      // Generate migration report
      const report = await this.generateMigrationReport()
      
      log('INFO', '✅ Phase 2.2 completed successfully')
      return {
        phase: '2.2',
        status: 'completed',
        results,
        stats: migrationStats,
        report
      }
      
    } catch (error) {
      log('ERROR', '❌ Phase 2.2 migration failed', { error: error.message })
      throw error
    } finally {
      // Cleanup connections
      await mongoose.disconnect()
      await prisma.$disconnect()
    }
  }
  
  static async generateMigrationReport() {
    const endTime = new Date()
    const duration = endTime - migrationStats.startTime
    
    const report = {
      migration: 'Phase 2.2 - Core Supporting Data',
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
    
    log('INFO', '📊 Core Data Migration Report', report)
    
    // Save report to file
    const reportFile = path.join(__dirname, 'core-data-migration-report.json')
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
  
  CoreDataMigrator.runCoreDataMigration()
    .then(result => {
      console.log('🎉 Core data migration completed successfully!')
      console.log(JSON.stringify(result, null, 2))
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Core data migration failed:', error.message)
      process.exit(1)
    })
}

export { CoreDataMigrator }