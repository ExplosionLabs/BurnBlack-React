const CryptoIncome = require("../models/CryptoIncome");
const NFTAsset = require("../models/NFTAsset");
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Crypto Asset Management
exports.createCryptoAsset = catchAsync(async (req, res, next) => {
  const cryptoAsset = await CryptoIncome.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: cryptoAsset
  });
});

exports.getCryptoAssets = catchAsync(async (req, res, next) => {
  const cryptoAssets = await CryptoIncome.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: cryptoAssets.length,
    data: cryptoAssets
  });
});

exports.updateCryptoAsset = catchAsync(async (req, res, next) => {
  const cryptoAsset = await CryptoIncome.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!cryptoAsset) {
    return next(new AppError('Crypto asset not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: cryptoAsset
  });
});

exports.deleteCryptoAsset = catchAsync(async (req, res, next) => {
  const cryptoAsset = await CryptoIncome.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!cryptoAsset) {
    return next(new AppError('Crypto asset not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// NFT Asset Management
exports.createNFTAsset = catchAsync(async (req, res, next) => {
  const nftAsset = await NFTAsset.create({
    userId: req.user.id,
    ...req.body
  });

  res.status(201).json({
    status: 'success',
    data: nftAsset
  });
});

exports.getNFTAssets = catchAsync(async (req, res, next) => {
  const nftAssets = await NFTAsset.find({ userId: req.user.id });

  res.status(200).json({
    status: 'success',
    results: nftAssets.length,
    data: nftAssets
  });
});

exports.updateNFTAsset = catchAsync(async (req, res, next) => {
  const nftAsset = await NFTAsset.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!nftAsset) {
    return next(new AppError('NFT asset not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: nftAsset
  });
});

exports.deleteNFTAsset = catchAsync(async (req, res, next) => {
  const nftAsset = await NFTAsset.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!nftAsset) {
    return next(new AppError('NFT asset not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
}); 