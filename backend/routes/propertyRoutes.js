const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  postProperty,
  getProperty,
  getAllProperties,
  postRental,
  getRental,
  getAllRentals
} = require('../controllers/PropertyController');

// Property Routes
router.post('/property', authMiddleware, postProperty);
router.get('/property/:propertyIndex', authMiddleware, getProperty);
router.get('/properties', authMiddleware, getAllProperties);

// Rental Property Routes
router.post('/rental', authMiddleware, postRental);
router.get('/rental/:propertyIndex', authMiddleware, getRental);
router.get('/rentals', authMiddleware, getAllRentals);

module.exports = router; 