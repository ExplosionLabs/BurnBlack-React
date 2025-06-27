const Property = require("../models/Property");
const RentalProperty = require("../models/RentalProperty");
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Property Management
exports.createProperty = catchAsync(async (req, res, next) => {
  const property = await Property.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: property
  });
});

exports.getProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!property) {
    return next(new AppError('Property not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: property
  });
});

exports.getAllProperties = catchAsync(async (req, res, next) => {
  const properties = await Property.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: properties.length,
    data: properties
  });
});

exports.updateProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!property) {
    return next(new AppError('Property not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: property
  });
});

exports.deleteProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!property) {
    return next(new AppError('Property not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Rental Property Management
exports.createRentalProperty = catchAsync(async (req, res, next) => {
  const rentalProperty = await RentalProperty.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: rentalProperty
  });
});

exports.getRentalProperty = catchAsync(async (req, res, next) => {
  const rentalProperty = await RentalProperty.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!rentalProperty) {
    return next(new AppError('Rental property not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: rentalProperty
  });
});

exports.getAllRentalProperties = catchAsync(async (req, res, next) => {
  const rentalProperties = await RentalProperty.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: rentalProperties.length,
    data: rentalProperties
  });
});

exports.updateRentalProperty = catchAsync(async (req, res, next) => {
  const rentalProperty = await RentalProperty.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!rentalProperty) {
    return next(new AppError('Rental property not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: rentalProperty
  });
});

exports.deleteRentalProperty = catchAsync(async (req, res, next) => {
  const rentalProperty = await RentalProperty.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!rentalProperty) {
    return next(new AppError('Rental property not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 