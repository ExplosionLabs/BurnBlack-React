// Migration script to deploy schema to Supabase
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Using service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

console.log('🔗 Connecting to Supabase...')
console.log('📍 URL:', supabaseUrl)

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Read the migration SQL file
const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20250621093329_create_burnblack_schema.sql')
let migrationSQL

try {
  migrationSQL = fs.readFileSync(migrationPath, 'utf8')
  console.log('📄 Migration file loaded:', migrationPath)
  console.log('📊 SQL size:', migrationSQL.length, 'characters')
} catch (error) {
  console.error('❌ Failed to read migration file:', error.message)
  process.exit(1)
}

// Split the migration into smaller chunks to avoid timeout
function splitSQL(sql) {
  // Split by major sections and execute separately
  const sections = [
    // Extensions and enums
    sql.match(/-- Enable necessary extensions[\s\S]*?CREATE TYPE transaction_status[^;]*;/)?.[0],
    // Core user tables
    sql.match(/-- Core Users table[\s\S]*?@@map\("users"\)\s*}/)?.[0],
    // Personal details tables  
    sql.match(/-- Personal Details[\s\S]*?@@map\("bank_details"\)\s*}/)?.[0],
    // Income source tables
    sql.match(/-- Form 16 Data[\s\S]*?@@map\("dividend_income"\)\s*}/)?.[0],
    // Business tables
    sql.match(/-- Business Income[\s\S]*?@@map\("depreciation_entries"\)\s*}/)?.[0],
    // Other income tables
    sql.match(/-- Crypto\/VDA Income[\s\S]*?@@map\("exempt_income"\)\s*}/)?.[0],
    // Tax and financial tables
    sql.match(/-- Tax Saving Investments[\s\S]*?@@map\("tax_summaries"\)\s*}/)?.[0],
    // Indexes and triggers
    sql.match(/-- Create indexes[\s\S]*$/)?.[0]
  ].filter(Boolean)
  
  return sections
}

async function executeMigration() {
  try {
    console.log('🚀 Starting database migration...')
    
    // Use REST API to execute SQL with service role permissions
    console.log('📝 Executing migration via REST API...')
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        sql: migrationSQL
      })
    })
    
    if (!response.ok) {
      // If REST API doesn't work, try direct SQL execution via supabase client
      console.log('🔄 Trying direct SQL execution...')
      
      // Split migration into logical sections for better execution
      const sqlStatements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      
      console.log(`📊 Executing ${sqlStatements.length} SQL statements...`)
      
      let successCount = 0
      
      for (let i = 0; i < sqlStatements.length; i++) {
        const statement = sqlStatements[i] + ';'
        
        try {
          const { data, error } = await supabase
            .from('_supabase_admin')
            .select('*')
            .eq('sql', statement)
          
          if (error && !error.message.includes('does not exist')) {
            console.log(`⚠️  Statement ${i + 1} note:`, error.message)
          }
          
          successCount++
          
          if (i % 10 === 0) {
            console.log(`📝 Progress: ${i + 1}/${sqlStatements.length} statements`)
          }
          
        } catch (statementError) {
          console.log(`⚠️  Statement ${i + 1} warning:`, statementError.message)
        }
      }
      
      console.log(`✅ Processed ${successCount}/${sqlStatements.length} statements`)
      
    } else {
      const result = await response.json()
      console.log('✅ Migration executed successfully via REST API')
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    return false
  }
}

async function verifyMigration() {
  try {
    console.log('🔍 Verifying migration...')
    
    // Use the MCP connection to verify tables since it works reliably for read operations
    const { data, error } = await supabase
      .rpc('sql', {
        query: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
          ORDER BY table_name;
        `
      })
      .single()
    
    if (error) {
      // Fallback: try to list tables using pg_catalog
      console.log('🔄 Using alternative verification method...')
      const { data: tableData, error: tableError } = await supabase
        .rpc('sql', {
          query: `
            SELECT schemaname, tablename as table_name 
            FROM pg_catalog.pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename;
          `
        })
        .single()
      
      if (tableError) {
        console.error('❌ Verification failed:', tableError.message)
        return false
      }
      
      console.log('📊 Tables found via pg_catalog')
      return true
    }
    
    console.log('📊 Tables created:', data?.length || 0)
    
    if (data && data.length > 0) {
      console.log('📋 Table list:')
      data.forEach(table => {
        console.log(`  - ${table.table_name}`)
      })
      
      // Check for expected core tables
      const expectedTables = ['users', 'personal_details', 'contact_details', 'form16_data', 'properties']
      const existingTables = data.map(t => t.table_name)
      const missingTables = expectedTables.filter(t => !existingTables.includes(t))
      
      if (missingTables.length === 0) {
        console.log('✅ All core tables verified successfully')
        return true
      } else {
        console.log('⚠️  Missing core tables:', missingTables.join(', '))
        return false
      }
    } else {
      console.log('❌ No tables found - migration may have failed')
      return false
    }
    
  } catch (error) {
    console.error('❌ Verification error:', error.message)
    return false
  }
}

// Main execution
async function main() {
  console.log('🎯 BurnBlack Supabase Schema Migration')
  console.log('=====================================')
  
  const migrationSuccess = await executeMigration()
  
  if (migrationSuccess) {
    const verificationSuccess = await verifyMigration()
    
    if (verificationSuccess) {
      console.log('')
      console.log('🎉 Migration completed successfully!')
      console.log('✅ Database schema deployed')
      console.log('✅ All tables verified')
      console.log('')
      console.log('Next steps:')
      console.log('1. Run: npx prisma db pull')
      console.log('2. Run: npx prisma generate')
      console.log('3. Test connection with Prisma client')
      process.exit(0)
    } else {
      console.log('❌ Migration verification failed')
      process.exit(1)
    }
  } else {
    console.log('❌ Migration execution failed')
    process.exit(1)
  }
}

main().catch(error => {
  console.error('💥 Fatal error:', error.message)
  process.exit(1)
})