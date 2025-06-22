const Razorpay = require("razorpay");
const Wallet = require("../model/wallet");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error(
    "Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables."
  );
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get wallet balance and transactions
const getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      wallet = await Wallet.create({ userId: req.user.id });
    }
    res.json(wallet);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};

// Create Razorpay order for adding money
const createAddMoneyOrder = async (req, res) => {
  try {
    const { amount } = req.body;

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
          },
        },
      },
      { new: true, upsert: true }
    );

    res.json({
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};

// Verify payment and update wallet
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Get transaction amount from pending transaction
    const wallet = await Wallet.findOne({
      "transactions.razorpayOrderId": razorpay_order_id,
    });

    const transaction = wallet.transactions.find(
      (t) => t.razorpayOrderId === razorpay_order_id
    );

    // Update transaction status and wallet balance
    await Wallet.findOneAndUpdate(
      {
        userId: req.user.id,
        "transactions.razorpayOrderId": razorpay_order_id,
      },
      {
        $inc: { balance: transaction.amount },
        $set: {
          "transactions.$.status": "completed",
          "transactions.$.razorpayPaymentId": razorpay_payment_id,
        },
      }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWallet,
  createAddMoneyOrder,
  verifyPayment,
};
