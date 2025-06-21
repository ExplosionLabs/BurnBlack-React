import mongoose from 'mongoose';
// @ts-ignore
const bcrypt = require('bcryptjs');
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const testUsers = [
  {
    email: 'admin@test.com',
    password: 'Admin@123',
    role: 'admin',
    name: 'Test Admin',
    isActive: true,
  },
  {
    email: 'user@test.com',
    password: 'User@123',
    role: 'user',
    name: 'Test User',
    isActive: true,
  },
];

async function createTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/burnblack');
    console.log('Connected to MongoDB');

    // Clear existing test users
    await User.deleteMany({
      email: { $in: testUsers.map(user => user.email) }
    });
    console.log('Cleared existing test users');

    // Create new test users
    for (const user of testUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await User.create({
        ...user,
        password: hashedPassword,
      });
      console.log(`Created ${user.role} user: ${user.email}`);
    }

    console.log('\nTest users created successfully!');
    console.log('\nTest Credentials:');
    console.log('----------------');
    console.log('Admin User:');
    console.log('Email: admin@test.com');
    console.log('Password: Admin@123');
    console.log('\nRegular User:');
    console.log('Email: user@test.com');
    console.log('Password: User@123');
    console.log('\nNote: These are test credentials. Please change them in production.');

  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the script
createTestUsers(); 