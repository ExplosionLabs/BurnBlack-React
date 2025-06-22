const BondDebenture = require("../models/StockGainAssets/BondDebenture");
const ForeignAsset = require("../models/StockGainAssets/ForeignAsset");
const GoldAsset = require("../models/StockGainAssets/GoldAsset");
const LandAsset = require("../models/StockGainAssets/LandAsset");
const LongShortAsset = require("../models/StockGainAssets/LongShortAsset");
const StockMutualAsset = require("../models/StockGainAssets/StockMutualAsset");
const StockRsuAsset = require("../models/StockGainAssets/StockRsuAsset");
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Stock & Mutual Fund Assets
exports.createStockMutualAsset = catchAsync(async (req, res, next) => {
  const capitalGain = await StockMutualAsset.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: capitalGain
  });
});

exports.getStockMutualAssets = catchAsync(async (req, res, next) => {
  const { assetType } = req.query;
  const filter = { userId: req.user.id };
  if (assetType) filter.assetType = assetType;

  const assets = await StockMutualAsset.find(filter);

  res.status(200).json({
    status: 'success',
    results: assets.length,
    data: assets
  });
});

exports.updateStockMutualAsset = catchAsync(async (req, res, next) => {
  const { stockMutualId } = req.params;
  
  const asset = await StockMutualAsset.findOneAndUpdate(
    { _id: stockMutualId, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!asset) {
    return next(new AppError('No asset found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: asset
  });
});

// Foreign Assets
exports.createForeignAsset = catchAsync(async (req, res, next) => {
  const foreignAsset = await ForeignAsset.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: foreignAsset
  });
});

exports.getForeignAssets = catchAsync(async (req, res, next) => {
  const assets = await ForeignAsset.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: assets.length,
    data: assets
  });
});

exports.updateForeignAsset = catchAsync(async (req, res, next) => {
  const { foreignId } = req.params;
  
  const asset = await ForeignAsset.findOneAndUpdate(
    { _id: foreignId, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!asset) {
    return next(new AppError('No asset found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: asset
  });
});

// Land & Building Assets
exports.createLandAsset = catchAsync(async (req, res, next) => {
  const landAsset = await LandAsset.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: landAsset
  });
});

exports.getLandAssets = catchAsync(async (req, res, next) => {
  const assets = await LandAsset.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: assets.length,
    data: assets
  });
});

exports.updateLandAsset = catchAsync(async (req, res, next) => {
  const { landId } = req.params;
  
  const asset = await LandAsset.findOneAndUpdate(
    { _id: landId, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!asset) {
    return next(new AppError('No asset found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: asset
  });
});

// Stock RSU Assets
exports.createStockRsuAsset = catchAsync(async (req, res, next) => {
  const stockRsuAsset = await StockRsuAsset.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: stockRsuAsset
  });
});

exports.getStockRsuAssets = catchAsync(async (req, res, next) => {
  const assets = await StockRsuAsset.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: assets.length,
    data: assets
  });
});

exports.updateStockRsuAsset = catchAsync(async (req, res, next) => {
  const { stockRsuId } = req.params;
  
  const asset = await StockRsuAsset.findOneAndUpdate(
    { _id: stockRsuId, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!asset) {
    return next(new AppError('No asset found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: asset
  });
});

// Bond & Debenture Assets
exports.createBondDebentureAsset = catchAsync(async (req, res, next) => {
  const bondDebentureAsset = await BondDebenture.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: bondDebentureAsset
  });
});

exports.getBondDebentureAssets = catchAsync(async (req, res, next) => {
  const assets = await BondDebenture.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: assets.length,
    data: assets
  });
});

exports.updateBondDebentureAsset = catchAsync(async (req, res, next) => {
  const { bondDebentureId } = req.params;
  
  const asset = await BondDebenture.findOneAndUpdate(
    { _id: bondDebentureId, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!asset) {
    return next(new AppError('No asset found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: asset
  });
});

// Long/Short Term Assets
exports.createLongShortAsset = catchAsync(async (req, res, next) => {
  const longShortAsset = await LongShortAsset.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: longShortAsset
  });
});

exports.getLongShortAssets = catchAsync(async (req, res, next) => {
  const assets = await LongShortAsset.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: assets.length,
    data: assets
  });
});

exports.updateLongShortAsset = catchAsync(async (req, res, next) => {
  const { longShortId } = req.params;
  
  const asset = await LongShortAsset.findOneAndUpdate(
    { _id: longShortId, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!asset) {
    return next(new AppError('No asset found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: asset
  });
});

// Gold Assets
exports.createGoldAsset = catchAsync(async (req, res, next) => {
  const goldAsset = await GoldAsset.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: goldAsset
  });
});

exports.getGoldAssets = catchAsync(async (req, res, next) => {
  const assets = await GoldAsset.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: assets.length,
    data: assets
  });
});

exports.updateGoldAsset = catchAsync(async (req, res, next) => {
  const { goldId } = req.params;
  
  const asset = await GoldAsset.findOneAndUpdate(
    { _id: goldId, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!asset) {
    return next(new AppError('No asset found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: asset
  });
}); 