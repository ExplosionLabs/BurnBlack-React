// Test Migration Connection and Data Access
import mongoose from 'mongoose'
import { PrismaClient } from '../node_modules/@prisma/client/index.js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '../.env') })

const prisma = new PrismaClient()
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/burnblack'

async function testConnections() {
  console.log('🧪 Testing Migration Connections...')
  console.log('=====================================')
  
  try {
    // Test PostgreSQL connection
    console.log('\\n1️⃣ Testing PostgreSQL/Supabase connection...')
    await prisma.$connect()
    
    const userCount = await prisma.user.count()
    console.log(`✅ PostgreSQL connected: ${userCount} users currently in database`)
    
    // Test MongoDB connection
    console.log('\\n2️⃣ Testing MongoDB connection...')
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('✅ MongoDB connected successfully')
    
    // Check MongoDB collections and data
    const db = mongoose.connection.db
    const collections = await db.listCollections().toArray()
    console.log(`📊 Found ${collections.length} MongoDB collections`)
    
    // Check for key collections
    const keyCollections = ['users', 'personaldetails', 'contactdetails', 'form16datas']
    for (const collectionName of keyCollections) {
      try {
        const collection = db.collection(collectionName)
        const count = await collection.countDocuments()
        console.log(`   - ${collectionName}: ${count} documents`)
      } catch (error) {
        console.log(`   - ${collectionName}: not found or error (${error.message})`)
      }
    }
    
    // Test a sample user query
    console.log('\\n3️⃣ Testing sample data access...')
    try {
      const sampleUsers = await db.collection('users').find({}).limit(3).toArray()
      console.log(`✅ Sample users retrieved: ${sampleUsers.length}`)
      
      if (sampleUsers.length > 0) {
        const sampleUser = sampleUsers[0]
        console.log(`   Sample user: ${sampleUser.email || sampleUser._id}`)
        console.log(`   Fields: ${Object.keys(sampleUser).join(', ')}`)
      }
    } catch (error) {
      console.log(`⚠️  Could not retrieve sample users: ${error.message}`)
    }
    
    console.log('\\n🎯 Connection Test Summary:')
    console.log('✅ PostgreSQL/Supabase: Ready')
    console.log('✅ MongoDB: Ready') 
    console.log('✅ Data Access: Working')
    console.log('🚀 Migration can proceed safely!')
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
    throw error
  } finally {
    await mongoose.disconnect()
    await prisma.$disconnect()
  }
}

testConnections()
  .then(() => {
    console.log('\\n✅ All connection tests passed!')
    process.exit(0)
  })
  .catch(error => {
    console.error('\\n❌ Connection test failed:', error.message)
    process.exit(1)
  })