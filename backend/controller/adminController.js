const User = require("../model/User");
const TaxSummary = require("../model/taxSumarry");
const Wallet = require("../model/wallet");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    const usersWithInfo = await Promise.all(
      users.map(async (user) => {
        const taxSummary = await TaxSummary.findOne({ userId: user._id });
        const wallet = await Wallet.findOne({ userId: user._id });
        return {
          ...user.toObject(),
          itrType: taxSummary?.itrType || 'Not Filed',
          walletBalance: wallet?.balance || 0
        };
      })
    );
    res.status(200).json(usersWithInfo);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getAllUsers };
