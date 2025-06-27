const User = require("../models/User");
const TaxSummary = require("../models/TaxSummary");
const Wallet = require("../models/Wallet");
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Get all users with their tax and wallet information
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({}, "-password");
  
  const usersWithInfo = await Promise.all(
    users.map(async (user) => {
      const [taxSummary, wallet] = await Promise.all([
        TaxSummary.findOne({ userId: user._id }),
        Wallet.findOne({ userId: user._id })
      ]);

      return {
        ...user.toObject(),
        itrType: taxSummary?.itrType || 'Not Filed',
        walletBalance: wallet?.balance || 0,
        lastLogin: user.lastLogin || 'Never',
        createdAt: user.createdAt,
        emailVerified: user.emailVerified || false
      };
    })
  );

  res.status(200).json({
    status: 'success',
    results: usersWithInfo.length,
    data: usersWithInfo
  });
});

// Get user statistics
exports.getUserStats = catchAsync(async (req, res, next) => {
  const [totalUsers, verifiedUsers, activeUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ emailVerified: true }),
    User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })
  ]);

  const [totalTaxFilings, totalWalletBalance] = await Promise.all([
    TaxSummary.countDocuments(),
    Wallet.aggregate([
      { $group: { _id: null, total: { $sum: "$balance" } } }
    ])
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      totalUsers,
      verifiedUsers,
      activeUsers,
      totalTaxFilings,
      totalWalletBalance: totalWalletBalance[0]?.total || 0,
      verificationRate: (verifiedUsers / totalUsers * 100).toFixed(2) + '%',
      activeUserRate: (activeUsers / totalUsers * 100).toFixed(2) + '%'
    }
  });
}); 