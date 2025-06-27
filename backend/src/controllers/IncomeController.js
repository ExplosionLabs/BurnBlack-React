const InterestIncome = require("../models/InterestIncome");
const DividendIncome = require("../models/DividendIncome");
const ProfessionalIncome = require("../models/ProfessionalIncome");
const BusinessIncome = require("../models/BusinessIncome");
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Interest Income
exports.createInterestIncome = catchAsync(async (req, res, next) => {
  const interestIncome = await InterestIncome.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: interestIncome
  });
});

exports.getInterestIncome = catchAsync(async (req, res, next) => {
  const interestIncomes = await InterestIncome.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: interestIncomes.length,
    data: interestIncomes
  });
});

exports.updateInterestIncome = catchAsync(async (req, res, next) => {
  const interestIncome = await InterestIncome.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!interestIncome) {
    return next(new AppError('Interest income record not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: interestIncome
  });
});

// Dividend Income
exports.createDividendIncome = catchAsync(async (req, res, next) => {
  const dividendIncome = await DividendIncome.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: dividendIncome
  });
});

exports.getDividendIncome = catchAsync(async (req, res, next) => {
  const dividendIncomes = await DividendIncome.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: dividendIncomes.length,
    data: dividendIncomes
  });
});

exports.updateDividendIncome = catchAsync(async (req, res, next) => {
  const dividendIncome = await DividendIncome.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!dividendIncome) {
    return next(new AppError('Dividend income record not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: dividendIncome
  });
});

exports.deleteDividendIncome = catchAsync(async (req, res, next) => {
  const dividendIncome = await DividendIncome.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!dividendIncome) {
    return next(new AppError('Dividend income record not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Professional Income
exports.updateProfessionalIncome = catchAsync(async (req, res, next) => {
  const professionalIncome = await ProfessionalIncome.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: professionalIncome
  });
});

exports.getProfessionalIncome = catchAsync(async (req, res, next) => {
  const professionalIncome = await ProfessionalIncome.findOne({ userId: req.user.id });

  if (!professionalIncome) {
    return next(new AppError('Professional income record not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: professionalIncome
  });
});

// Business Income
exports.updateBusinessIncome = catchAsync(async (req, res, next) => {
  const businessIncome = await BusinessIncome.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: businessIncome
  });
});

exports.getBusinessIncome = catchAsync(async (req, res, next) => {
  const businessIncome = await BusinessIncome.findOne({ userId: req.user.id });

  if (!businessIncome) {
    return next(new AppError('Business income record not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: businessIncome
  });
}); 