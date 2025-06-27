const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const { errorHandler } = require('./src/middleware/errorMiddleware');
const { notFoundHandler } = require('./src/middleware/notFoundMiddleware');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const personalDetailRoutes = require('./src/routes/personalDetailRoutes');
const contactDetailRoutes = require('./src/routes/contactDetailRoutes');
const bankDetailRoutes = require('./src/routes/bankDetailRoutes');
const taxRoutes = require('./src/routes/taxRoutes');
const incomeRoutes = require('./src/routes/incomeRoutes');
const personalInfoRoutes = require('./src/routes/personalInfoRoutes');
const form16Routes = require('./src/routes/form16Routes');
const propertyRoutes = require('./src/routes/propertyRoutes');
const assetRoutes = require('./src/routes/assetRoutes');
const businessRoutes = require('./src/routes/businessRoutes');
const otherIncomeRoutes = require('./src/routes/otherIncomeRoutes');
const itrRoutes = require('./src/routes/itrRoutesMongoDB');
const documentRoutes = require('./src/routes/documentRoutes');
const adminITRRoutes = require('./src/routes/adminITRRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/personal-details', personalDetailRoutes);
app.use('/api/contact-details', contactDetailRoutes);
app.use('/api/bank-details', bankDetailRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/personal', personalInfoRoutes);
app.use('/api/form16', form16Routes);
app.use('/api/property', propertyRoutes);
app.use('/api/asset', assetRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/other-income', otherIncomeRoutes);
app.use('/api/itr', itrRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/admin', adminITRRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app; 