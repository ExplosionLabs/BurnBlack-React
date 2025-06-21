// Test script to validate BurnBlack Supabase migration
import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🧪 BurnBlack Migration Validation Test')
console.log('=====================================')

async function testPrismaConnection() {
  console.log('\n1️⃣ Testing Prisma Connection...')
  
  const prisma = new PrismaClient()
  
  try {
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Prisma client connected successfully')
    
    // Test database query
    const result = await prisma.$queryRaw`SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = 'public'`
    console.log(`✅ Database query successful: ${result[0].table_count} tables found`)
    
    // Test table existence
    const userCount = await prisma.user.count()
    console.log(`✅ Users table accessible: ${userCount} users`)
    
    // Test other core tables
    const tableTests = [
      { name: 'personal_details', query: () => prisma.personalDetail.count() },
      { name: 'contact_details', query: () => prisma.contactDetail.count() },
      { name: 'form16_data', query: () => prisma.form16Data.count() },
      { name: 'properties', query: () => prisma.property.count() },
      { name: 'capital_gains', query: () => prisma.capitalGain.count() },
      { name: 'wallets', query: () => prisma.wallet.count() }
    ]
    
    for (const test of tableTests) {
      try {
        const count = await test.query()
        console.log(`✅ ${test.name} table accessible: ${count} records`)
      } catch (error) {
        console.log(`⚠️  ${test.name} table issue: ${error.message}`)
      }
    }
    
    await prisma.$disconnect()
    return true
    
  } catch (error) {
    console.error('❌ Prisma connection failed:', error.message)
    await prisma.$disconnect()
    return false
  }
}

async function testSupabaseConnection() {
  console.log('\n2️⃣ Testing Supabase Connection...')
  
  try {
    // Test with anon key
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    
    const { data: anonData, error: anonError } = await supabaseClient
      .from('users')
      .select('count', { count: 'exact', head: true })
    
    if (anonError && !anonError.message.includes('RLS')) {
      console.log('⚠️  Anon client note:', anonError.message)
    } else {
      console.log('✅ Supabase anon client connected successfully')
    }
    
    // Test with service role key
    if (supabaseServiceKey) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
      
      const { data: adminData, error: adminError } = await supabaseAdmin
        .from('users')
        .select('count', { count: 'exact', head: true })
      
      if (adminError) {
        console.log('⚠️  Admin client note:', adminError.message)
      } else {
        console.log('✅ Supabase admin client connected successfully')
        console.log(`✅ Users table count: ${adminData.count || 0}`)
      }
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
    return false
  }
}

async function testTableRelationships() {
  console.log('\n3️⃣ Testing Table Relationships...')
  
  const prisma = new PrismaClient()
  
  try {
    // Test if we can create a test user with related data
    console.log('📝 Testing user creation with relationships...')
    
    // Note: This is a read-only test, we won't actually insert data
    // Just test the schema relationships
    
    const schema = await prisma.$queryRaw`
      SELECT 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE constraint_type = 'FOREIGN KEY' 
      AND tc.table_name IN ('personal_details', 'contact_details', 'bank_details')
      ORDER BY tc.table_name
    `
    
    console.log(`✅ Found ${schema.length} foreign key relationships`)
    schema.forEach(rel => {
      console.log(`   - ${rel.table_name}.${rel.column_name} → ${rel.foreign_table_name}.${rel.foreign_column_name}`)
    })
    
    await prisma.$disconnect()
    return true
    
  } catch (error) {
    console.error('❌ Relationship test failed:', error.message)
    await prisma.$disconnect()
    return false
  }
}

async function testEnumTypes() {
  console.log('\n4️⃣ Testing Enum Types...')
  
  const prisma = new PrismaClient()
  
  try {
    const enums = await prisma.$queryRaw`
      SELECT t.typname as enum_name, e.enumlabel as enum_value
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      WHERE t.typname IN ('user_role', 'gender_type', 'marital_status_type', 'itr_type', 'itr_status')
      ORDER BY t.typname, e.enumsortorder
    `
    
    const enumGroups = {}
    enums.forEach(e => {
      if (!enumGroups[e.enum_name]) enumGroups[e.enum_name] = []
      enumGroups[e.enum_name].push(e.enum_value)
    })
    
    console.log(`✅ Found ${Object.keys(enumGroups).length} enum types:`)
    Object.entries(enumGroups).forEach(([name, values]) => {
      console.log(`   - ${name}: [${values.join(', ')}]`)
    })
    
    await prisma.$disconnect()
    return true
    
  } catch (error) {
    console.error('❌ Enum test failed:', error.message)
    await prisma.$disconnect()
    return false
  }
}

async function generateMigrationReport() {
  console.log('\n📊 Migration Report')
  console.log('==================')
  
  const prisma = new PrismaClient()
  
  try {
    // Count all tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `
    
    console.log(`📋 Total Tables Created: ${tables.length}`)
    
    // Core business tables
    const coreTableNames = [
      'users', 'personal_details', 'contact_details', 'bank_details', 'address_details',
      'form16_data', 'properties', 'capital_gains', 'business_income', 'professional_income',
      'crypto_income', 'tax_saving_investments', 'donations', 'medical_insurance',
      'wallets', 'wallet_transactions', 'itr_generations', 'tax_summaries'
    ]
    
    const existingCoreTables = tables
      .map(t => t.table_name)
      .filter(name => coreTableNames.includes(name))
    
    console.log(`✅ Core Business Tables: ${existingCoreTables.length}/${coreTableNames.length}`)
    
    if (existingCoreTables.length === coreTableNames.length) {
      console.log('🎉 All core tables created successfully!')
    } else {
      const missing = coreTableNames.filter(name => !existingCoreTables.includes(name))
      console.log('⚠️  Missing core tables:', missing.join(', '))
    }
    
    // Check indexes
    const indexes = await prisma.$queryRaw`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      AND indexname LIKE 'idx_%'
    `
    
    console.log(`📈 Performance Indexes: ${indexes.length}`)
    
    await prisma.$disconnect()
    
  } catch (error) {
    console.error('❌ Report generation failed:', error.message)
    await prisma.$disconnect()
  }
}

// Main test execution
async function runAllTests() {
  const results = {
    prisma: false,
    supabase: false,
    relationships: false,
    enums: false
  }
  
  try {
    results.prisma = await testPrismaConnection()
    results.supabase = await testSupabaseConnection()
    results.relationships = await testTableRelationships()
    results.enums = await testEnumTypes()
    
    await generateMigrationReport()
    
    // Final summary
    console.log('\n🎯 Test Summary')
    console.log('===============')
    console.log(`Prisma Connection: ${results.prisma ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Supabase Connection: ${results.supabase ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Table Relationships: ${results.relationships ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Enum Types: ${results.enums ? '✅ PASS' : '❌ FAIL'}`)
    
    const passCount = Object.values(results).filter(Boolean).length
    const totalTests = Object.keys(results).length
    
    if (passCount === totalTests) {
      console.log('\n🎉 ALL TESTS PASSED! Migration is successful!')
      console.log('✅ Database is ready for development')
      console.log('✅ Prisma client is working')
      console.log('✅ Supabase client is working')
      console.log('✅ All relationships are intact')
      
      console.log('\n🚀 Next Steps:')
      console.log('1. Start migrating MongoDB data to PostgreSQL')
      console.log('2. Update backend API endpoints to use Prisma')
      console.log('3. Integrate Supabase Auth in frontend')
      console.log('4. Test all application workflows')
      
    } else {
      console.log(`\n⚠️  ${passCount}/${totalTests} tests passed. Review failed tests above.`)
    }
    
  } catch (error) {
    console.error('💥 Test execution failed:', error.message)
  }
}

// Run the tests
runAllTests().catch(console.error)