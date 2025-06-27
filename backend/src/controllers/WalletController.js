const Razorpay = require("razorpay");
const Wallet = require("../models/Wallet");
const crypto = require("crypto");
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Initialize Razorpay
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error(
    "Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables."
  );
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get wallet balance and transactions
exports.getWallet = catchAsync(async (req, res, next) => {
  let wallet = await Wallet.findOne({ userId: req.user.id });
  
  if (!wallet) {
    wallet = await Wallet.create({ userId: req.user.id });
  }

  res.status(200).json({
    status: 'success',
    data: wallet
  });
});

// Create Razorpay order for adding money
exports.createAddMoneyOrder = catchAsync(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return next(new AppError('Please provide a valid amount', 400));
  }

  const options = {
    amount: amount * 100, // Razorpay expects amount in paise
    currency: "INR",
    receipt: `wlt_${Math.random().toString(36).substring(2, 10)}`,
  };

  const order = await razorpay.orders.create(options);

  // Create a pending transaction
  const wallet = await Wallet.findOneAndUpdate(
    { userId: req.user.id },
    {
      $push: {
        transactions: {
          type: "credit",
          amount,
          razorpayOrderId: order.id,
          status: "pending",
          description: "Wallet top-up",
          timestamp: new Date()
        },
      },
    },
    { new: true, upsert: true }
  );

  res.status(201).json({
    status: 'success',
    data: {
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    }
  });
});

// Verify payment and update wallet
exports.verifyPayment = catchAsync(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new AppError('Missing payment verification details', 400));
  }

  // Verify signature
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (razorpay_signature !== expectedSign) {
    return next(new AppError('Invalid payment signature', 400));
  }

  // Get transaction amount from pending transaction
  const wallet = await Wallet.findOne({
    "transactions.razorpayOrderId": razorpay_order_id,
  });

  if (!wallet) {
    return next(new AppError('No pending transaction found', 404));
  }

  const transaction = wallet.transactions.find(
    (t) => t.razorpayOrderId === razorpay_order_id
  );

  if (!transaction) {
    return next(new AppError('Transaction not found', 404));
  }

  // Update transaction status and wallet balance
  const updatedWallet = await Wallet.findOneAndUpdate(
    {
      userId: req.user.id,
      "transactions.razorpayOrderId": razorpay_order_id,
    },
    {
      $inc: { balance: transaction.amount },
      $set: {
        "transactions.$.status": "completed",
        "transactions.$.razorpayPaymentId": razorpay_payment_id,
        "transactions.$.completedAt": new Date()
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    data: updatedWallet
  });
}); 