const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes  
const authRoutes = require('./routes/authRoutesPrisma');
const taxRoutes = require('./routes/taxRoutes');
const personalDetailRoutes = require('./routes/personalDetailRoutes');
const contactDetailRoutes = require('./routes/contactDetailRoutes');
const bankDetailRoutes = require('./routes/bankDetailRoutes');
const walletRoutes = require('./routes/walletRoutes');
const documentRoutes = require('./routes/documentRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/personal', personalDetailRoutes);
app.use('/api/contact', contactDetailRoutes);
app.use('/api/bank', bankDetailRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/documents', documentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 