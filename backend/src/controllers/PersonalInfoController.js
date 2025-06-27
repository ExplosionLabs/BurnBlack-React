const PersonalDetail = require("../models/PersonalDetail");
const ContactDetail = require("../models/ContactDetail");
const AddressDetail = require("../models/AddressDetail");
const BankDetail = require("../models/BankDetail");
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Personal Details
exports.updatePersonalDetails = catchAsync(async (req, res, next) => {
  const personalDetails = await PersonalDetail.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: personalDetails
  });
});

exports.getPersonalDetails = catchAsync(async (req, res, next) => {
  const personalDetails = await PersonalDetail.findOne({ userId: req.user.id });

  if (!personalDetails) {
    return next(new AppError('Personal details not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: personalDetails
  });
});

// Contact Details
exports.updateContactDetails = catchAsync(async (req, res, next) => {
  const contactDetails = await ContactDetail.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: contactDetails
  });
});

exports.getContactDetails = catchAsync(async (req, res, next) => {
  const contactDetails = await ContactDetail.findOne({ userId: req.user.id });

  if (!contactDetails) {
    return next(new AppError('Contact details not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: contactDetails
  });
});

// Address Details
exports.updateAddressDetails = catchAsync(async (req, res, next) => {
  const addressDetails = await AddressDetail.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: addressDetails
  });
});

exports.getAddressDetails = catchAsync(async (req, res, next) => {
  const addressDetails = await AddressDetail.findOne({ userId: req.user.id });

  if (!addressDetails) {
    return next(new AppError('Address details not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: addressDetails
  });
});

// Bank Details
exports.updateBankDetails = catchAsync(async (req, res, next) => {
  const { bankDetails } = req.body;

  if (!Array.isArray(bankDetails)) {
    return next(new AppError('Bank details must be an array', 400));
  }

  const bankDetailDoc = await BankDetail.findOneAndUpdate(
    { userId: req.user.id },
    { bankDetails },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: bankDetailDoc
  });
});

exports.getBankDetails = catchAsync(async (req, res, next) => {
  const bankDetails = await BankDetail.findOne({ userId: req.user.id });

  if (!bankDetails) {
    return next(new AppError('Bank details not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: bankDetails
  });
}); 