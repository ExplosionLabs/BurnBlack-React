const ProfitLoss = require("../models/ProfitLoss");
const BalanceSheet = require("../models/BalanceSheet");
const Depreciation = require("../models/Depreciation");
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Profit & Loss Management
exports.updateProfitLoss = catchAsync(async (req, res, next) => {
  const profitLoss = await ProfitLoss.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: profitLoss
  });
});

exports.getProfitLoss = catchAsync(async (req, res, next) => {
  const profitLoss = await ProfitLoss.findOne({ userId: req.user.id });

  if (!profitLoss) {
    return next(new AppError('Profit & Loss statement not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: profitLoss
  });
});

// Balance Sheet Management
exports.updateBalanceSheet = catchAsync(async (req, res, next) => {
  const balanceSheet = await BalanceSheet.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: balanceSheet
  });
});

exports.getBalanceSheet = catchAsync(async (req, res, next) => {
  const balanceSheet = await BalanceSheet.findOne({ userId: req.user.id });

  if (!balanceSheet) {
    return next(new AppError('Balance sheet not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: balanceSheet
  });
});

// Depreciation Management
exports.createDepreciation = catchAsync(async (req, res, next) => {
  const depreciation = await Depreciation.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: depreciation
  });
});

exports.getDepreciation = catchAsync(async (req, res, next) => {
  const depreciations = await Depreciation.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: depreciations.length,
    data: depreciations
  });
});

exports.updateDepreciation = catchAsync(async (req, res, next) => {
  const depreciation = await Depreciation.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!depreciation) {
    return next(new AppError('Depreciation record not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: depreciation
  });
});

exports.deleteDepreciation = catchAsync(async (req, res, next) => {
  const depreciation = await Depreciation.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!depreciation) {
    return next(new AppError('Depreciation record not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 