const personalDetailModel = require("../model/personalDetailModel");
const axios = require("axios");
const SUREPASS_API_URL = "https://kyc-api.surepass.io/api/v1/pan/pan";

const getPanNameController = async (req, res) => {
  const { panNumber } = req.body;
  const userId = req.user.id;
  const token = process.env.SUREPASS_TOKEN;

  if (!panNumber) {
    return res.status(400).json({ error: "PAN number is required." });
  }

  try {
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
    const personalDetail = await personalDetailModel.findOneAndUpdate(
      { userId }, // Find by userId
      { firstName, middleName, lastName }, // Update fields
      { new: true, upsert: true } // Return updated document or create if not found
    );

    res.json({ success: true, personalDetail });
  } catch (error) {
    console.error(
      "Error verifying PAN:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to verify PAN. Please try again later.",
      details: error.response?.data,
    });
  }
};

module.exports = getPanNameController;
