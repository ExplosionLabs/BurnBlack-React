const ExemptIncome = require("../models/ExemptIncome");
const AgriculturalIncome = require("../models/AgriculturalIncome");
const BusinessFund = require("../models/BusinessFund");
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Exempt Income Management
exports.createExemptIncome = catchAsync(async (req, res, next) => {
  const exemptIncome = await ExemptIncome.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: exemptIncome
  });
});

exports.getExemptIncome = catchAsync(async (req, res, next) => {
  const exemptIncomes = await ExemptIncome.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: exemptIncomes.length,
    data: exemptIncomes
  });
});

exports.updateExemptIncome = catchAsync(async (req, res, next) => {
  const exemptIncome = await ExemptIncome.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!exemptIncome) {
    return next(new AppError('Exempt income record not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: exemptIncome
  });
});

exports.deleteExemptIncome = catchAsync(async (req, res, next) => {
  const exemptIncome = await ExemptIncome.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!exemptIncome) {
    return next(new AppError('Exempt income record not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Agricultural Income Management
exports.createAgriculturalIncome = catchAsync(async (req, res, next) => {
  const agriculturalIncome = await AgriculturalIncome.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: agriculturalIncome
  });
});

exports.getAgriculturalIncome = catchAsync(async (req, res, next) => {
  const agriculturalIncomes = await AgriculturalIncome.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: agriculturalIncomes.length,
    data: agriculturalIncomes
  });
});

exports.updateAgriculturalIncome = catchAsync(async (req, res, next) => {
  const agriculturalIncome = await AgriculturalIncome.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!agriculturalIncome) {
    return next(new AppError('Agricultural income record not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: agriculturalIncome
  });
});

exports.deleteAgriculturalIncome = catchAsync(async (req, res, next) => {
  const agriculturalIncome = await AgriculturalIncome.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!agriculturalIncome) {
    return next(new AppError('Agricultural income record not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Business Fund Management
exports.createBusinessFund = catchAsync(async (req, res, next) => {
  const businessFund = await BusinessFund.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: businessFund
  });
});

exports.getBusinessFund = catchAsync(async (req, res, next) => {
  const businessFunds = await BusinessFund.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: businessFunds.length,
    data: businessFunds
  });
});

exports.updateBusinessFund = catchAsync(async (req, res, next) => {
  const businessFund = await BusinessFund.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!businessFund) {
    return next(new AppError('Business fund record not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: businessFund
  });
});

exports.deleteBusinessFund = catchAsync(async (req, res, next) => {
  const businessFund = await BusinessFund.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!businessFund) {
    return next(new AppError('Business fund record not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 