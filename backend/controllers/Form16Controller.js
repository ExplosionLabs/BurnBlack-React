const Form16 = require("../models/Form16");
const Form16Data = require("../models/Form16Data");
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Upload Form 16 document
exports.uploadForm16 = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No file uploaded', 400));
  }

  const base64File = req.file.buffer.toString('base64');
  
  const form16 = await Form16.create({
    userId: req.user.id,
    file: base64File,
    fileName: req.file.originalname,
    uploadedAt: new Date()
  });

  res.status(201).json({
    status: 'success',
    data: {
      id: form16._id,
      fileName: form16.fileName,
      uploadedAt: form16.uploadedAt
    }
  });
});

// Get all Form 16 documents for a user
exports.getForm16Documents = catchAsync(async (req, res, next) => {
  const form16s = await Form16.find({ userId: req.user.id })
    .select('-file') // Exclude the base64 file data
    .sort('-uploadedAt');

  res.status(200).json({
    status: 'success',
    results: form16s.length,
    data: form16s
  });
});

// Get a specific Form 16 document
exports.getForm16Document = catchAsync(async (req, res, next) => {
  const form16 = await Form16.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!form16) {
    return next(new AppError('Form 16 document not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: form16
  });
});

// Update Form 16 manual data
exports.updateForm16Data = catchAsync(async (req, res, next) => {
  const form16Data = await Form16Data.findOneAndUpdate(
    { userId: req.user.id },
    req.body,
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: form16Data
  });
});

// Get Form 16 manual data
exports.getForm16Data = catchAsync(async (req, res, next) => {
  const form16Data = await Form16Data.findOne({ userId: req.user.id });

  if (!form16Data) {
    return next(new AppError('Form 16 data not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: form16Data
  });
});

// Delete Form 16 document
exports.deleteForm16Document = catchAsync(async (req, res, next) => {
  const form16 = await Form16.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!form16) {
    return next(new AppError('Form 16 document not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 