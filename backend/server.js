const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Import the Express app
const app = require('./app');

// Database connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/burnblack')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 BurnBlack Backend Server running on port ${PORT}`);
  console.log(`📱 Admin Portal: http://localhost:${PORT}/admin`);
  console.log(`📋 API Base: http://localhost:${PORT}/api`);
}); 