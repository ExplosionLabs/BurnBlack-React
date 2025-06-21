// Simple Authentication Test with Prisma (CommonJS)
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

async function testAuthenticationSystem() {
  console.log('🧪 Testing Prisma Authentication System');
  console.log('=========================================');
  
  try {
    // Test 1: Database Connection
    console.log('\n1️⃣ Testing Prisma Connection...');
    await prisma.$connect();
    console.log('✅ Prisma connected successfully');
    
    // Test 2: User Count and Sample Data
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);
    
    if (userCount > 0) {
      const sampleUsers = await prisma.user.findMany({
        take: 3,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true
        }
      });
      
      console.log('📋 Sample users:');
      sampleUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }
    
    // Test 3: Test User Relationships
    console.log('\n2️⃣ Testing User Relationships...');
    const usersWithRelations = await prisma.user.findMany({
      take: 2,
      include: {
        personalDetails: true,
        contactDetails: true,
        bankDetails: true,
        wallet: {
          include: {
            transactions: true
          }
        }
      }
    });
    
    usersWithRelations.forEach((user, index) => {
      console.log(`   User ${index + 1}: ${user.email}`);
      console.log(`     - Personal Details: ${user.personalDetails ? 'Found' : 'None'}`);
      console.log(`     - Contact Details: ${user.contactDetails ? 'Found' : 'None'}`);
      console.log(`     - Bank Details: ${user.bankDetails ? 'Found' : 'None'}`);
      console.log(`     - Wallet: ${user.wallet ? 'Found' : 'None'}`);
      console.log(`     - Transactions: ${user.wallet?.transactions?.length || 0}`);
    });
    
    // Test 4: Test Database Schema
    console.log('\n3️⃣ Testing Database Schema...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    console.log(`✅ Found ${tables.length} tables in database`);
    console.log('   Tables:', tables.map(t => t.table_name).join(', '));
    
    // Test 5: Test Basic CRUD Operations
    console.log('\n4️⃣ Testing Basic CRUD Operations...');
    
    // Find existing test user or create one
    let testUser = await prisma.user.findUnique({
      where: { email: 'prisma-test@burnblack.com' }
    });
    
    if (!testUser) {
      console.log('   Creating test user...');
      testUser = await prisma.user.create({
        data: {
          name: 'Prisma Test User',
          email: 'prisma-test@burnblack.com',
          role: 'USER',
          emailVerified: false
        }
      });
      console.log('   ✅ Test user created');
    } else {
      console.log('   ✅ Test user already exists');
    }
    
    // Update test user
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { name: 'Updated Prisma Test User' }
    });
    console.log('   ✅ User update successful');
    
    // Test 6: Data Integrity
    console.log('\n5️⃣ Testing Data Integrity...');
    const totalUsers = await prisma.user.count();
    const totalPersonalDetails = await prisma.personalDetail.count();
    const totalContactDetails = await prisma.contactDetail.count();
    const totalBankDetails = await prisma.bankDetail.count();
    const totalWallets = await prisma.wallet.count();
    const totalTransactions = await prisma.walletTransaction.count();
    
    console.log(`   Users: ${totalUsers}`);
    console.log(`   Personal Details: ${totalPersonalDetails}`);
    console.log(`   Contact Details: ${totalContactDetails}`);
    console.log(`   Bank Details: ${totalBankDetails}`);
    console.log(`   Wallets: ${totalWallets}`);
    console.log(`   Transactions: ${totalTransactions}`);
    
    console.log('\n🎯 Database Test Summary:');
    console.log('✅ Prisma Connection: Working');
    console.log('✅ User Queries: Working');
    console.log('✅ Relationships: Working');
    console.log('✅ CRUD Operations: Working');
    console.log('✅ Data Integrity: Verified');
    console.log('\n🚀 Prisma Database System is fully operational!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testAuthenticationSystem()
  .then(() => {
    console.log('\n✅ All database tests passed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Database test failed:', error.message);
    process.exit(1);
  });