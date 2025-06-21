const GSTData = require("../models/GSTData");
const PersonalDetail = require("../models/PersonalDetail");
const axios = require("axios");
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const SUREPASS_API_URL = "https://kyc-api.surepass.io/api/v1/pan/pan";
const SUREPASS_API_URL_GSTIN = "https://kyc-api.surepass.io/api/v1/corporate/gstin-advanced";

// Verify PAN and update personal details
exports.verifyPan = catchAsync(async (req, res, next) => {
  const { panNumber } = req.body;
  const userId = req.user.id;
  const token = process.env.SUREPASS_TOKEN;

  if (!panNumber) {
    return next(new AppError('PAN number is required', 400));
  }

  // Make API request to SurePass
  const response = await axios.post(
    SUREPASS_API_URL,
    { id_number: panNumber },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const fullName = response.data.data.full_name;

  // Split full name into parts
  const [firstName, middleName = "", lastName = ""] = fullName.split(" ");

  // Update or create the PersonalDetail record
  const personalDetail = await PersonalDetail.findOneAndUpdate(
    { userId },
    { firstName, middleName, lastName },
    { new: true, upsert: true }
  );

  res.status(200).json({
    status: 'success',
    data: personalDetail
  });
});

// Verify GSTIN and store data
exports.verifyGstin = catchAsync(async (req, res, next) => {
  const { gstin } = req.body;
  const token = process.env.SUREPASS_TOKEN;

  if (!gstin) {
    return next(new AppError('GSTIN number is required', 400));
  }

  // Check if GSTIN already exists in the database
  const existingData = await GSTData.findOne({ gstin });
  if (existingData) {
    return res.status(200).json({
      status: 'success',
      data: existingData,
      message: 'GSTIN already exists in the database'
    });
  }

  // Make API request to SurePass
  const response = await axios.post(
    SUREPASS_API_URL_GSTIN,
    { id_number: gstin },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = response.data.data;

  // Save the fetched data to the database
  const gstData = await GSTData.create(data);

  res.status(201).json({
    status: 'success',
    data: gstData
  });
});

// Get all GST data
exports.getAllGstData = catchAsync(async (req, res, next) => {
  const gstData = await GSTData.find();

  res.status(200).json({
    status: 'success',
    results: gstData.length,
    data: gstData
  });
}); 