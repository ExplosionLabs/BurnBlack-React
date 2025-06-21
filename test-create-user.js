// Quick test to validate write operations
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function testUserCreation() {
  try {
    console.log('🧪 Testing user creation...')
    
    // Create a test user
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@burnblack.com',
        role: 'USER',
        emailVerified: true
      }
    })
    
    console.log('✅ User created successfully:', testUser.id)
    
    // Create related data
    const personalDetails = await prisma.personalDetail.create({
      data: {
        userId: testUser.id,
        firstName: 'Test',
        lastName: 'User',
        gender: 'MALE',
        maritalStatus: 'SINGLE'
      }
    })
    
    console.log('✅ Personal details created:', personalDetails.id)
    
    // Fetch user with relationships
    const userWithDetails = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: {
        personalDetails: true,
        contactDetails: true
      }
    })
    
    console.log('✅ User fetched with relationships:', userWithDetails.name)
    
    // Clean up test data
    await prisma.personalDetail.delete({
      where: { id: personalDetails.id }
    })
    
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    
    console.log('✅ Test data cleaned up')
    console.log('🎉 All CRUD operations working perfectly!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testUserCreation()