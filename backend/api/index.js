require('dotenv').config();
const express = require('express');
const connectDB = require('../database/db');
const { 
  corsMiddleware, 
  rateLimiter, 
  securityHeaders, 
  helmetMiddleware 
} = require('../middleware/security');

// Import routes
const authRoute = require("../routes/authRoute");
const fileITRRoute = require("../routes/fileITRRoute");
const capitalGainRoute = require("../routes/capitalGainRoute");
const taxSavingRoute = require("../routes/taxSavingRoute");
const calculateIncomeRoute = require("../routes/calculateIncomeRoute");
const verificationApiRoute = require("../routes/verificationApiRoute");
const adminRoute = require("../routes/adminRoute");
const walletRoute = require("../routes/walletRoutes");
const itrRoute = require("../routes/itrRoutes");
const emailVerificationRoute = require('../routes/emailVerificationRoute');

const app = express();

// Connect to MongoDB
connectDB();

// Apply security middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(rateLimiter);
app.use(securityHeaders);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get('/', (req, res) => {
  res.send('black burn backend running');
});

// API routes with version prefix
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/email-verification", emailVerificationRoute);
app.use("/api/v1/fillDetail", fileITRRoute);
app.use("/api/v1/capitalGain", capitalGainRoute);
app.use("/api/v1/taxSaving", taxSavingRoute);
app.use("/api/v1/calculateIncome", calculateIncomeRoute);
app.use("/api/v1/verificationApi", verificationApiRoute);
app.use("/api/v1/adminApi", adminRoute);
app.use("/api/v1/wallet", walletRoute);
app.use("/api/v1/itr", itrRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
