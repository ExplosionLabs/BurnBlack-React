const Otpmodel = require("../model/Otpmodel");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const registerController = async (req, res) => {
  const { name, phone, email, password } = req.body;

  // Check if all fields are provided
  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Create JWT token

    res.status(201).json({
      user: { name: user.name, phone: user.phone, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const sendOtpPhone = async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

  try {
    // Save OTP to database
    await Otpmodel.create({
      type: "phone",
      identifier: phoneNumber,
      otp: otp,
    });

    // Log OTP for testing (replace with actual SMS service)
    console.log("Phone OTP:", otp);

    res.status(200).json({ message: "OTP sent to phone number" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};
const sendOtpEmail = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

  try {
    // Save OTP to database
    await Otpmodel.create({
      type: "email",
      identifier: email,
      otp: otp,
    });

    // Log OTP for testing (replace with actual email service)
    console.log("Email OTP:", otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  const { otp, type, identifier } = req.body;

  try {
    // Find OTP in the database
    const otpRecord = await Otpmodel.findOne({ type, identifier });

    console.log("otp record");
    if (!otpRecord) {
      return res
        .status(400)
        .json({ error: `OTP verified. Proceed to register.` });
    }

    // Check if OTP matches
    if (otpRecord.otp === otp) {
      // Delete OTP after successful verification
      await Otpmodel.deleteOne({ _id: otpRecord._id });

      return res
        .status(200)
        .json({ message: `OTP verified. Proceed to register.` });
    } else {
      return res.status(400).json({ error: "Invalid OTP." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to verify OTP." });
  }
};

module.exports = { registerController, sendOtpEmail, sendOtpPhone, verifyOtp };
