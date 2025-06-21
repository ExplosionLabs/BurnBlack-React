const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const { errorHandler } = require('./middleware/errorMiddleware');
const { notFoundHandler } = require('./middleware/notFoundMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const personalDetailRoutes = require('./routes/personalDetailRoutes');
const contactDetailRoutes = require('./routes/contactDetailRoutes');
const bankDetailRoutes = require('./routes/bankDetailRoutes');
const taxRoutes = require('./routes/taxRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const personalInfoRoutes = require('./routes/personalInfoRoutes');
const form16Routes = require('./routes/form16Routes');
const propertyRoutes = require('./routes/propertyRoutes');
const assetRoutes = require('./routes/assetRoutes');
const businessRoutes = require('./routes/businessRoutes');
const otherIncomeRoutes = require('./routes/otherIncomeRoutes');
const itrRoutes = require('./routes/itrRoutes');
const documentRoutes = require('./routes/documentRoutes');

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

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app; 