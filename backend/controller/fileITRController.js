const form16model = require("../model/form16model");
const personalDetailModel = require("../model/personalDetailModel");

const uploadForm16Controller = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming userId is sent in the request body
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const base64File = file.buffer.toString("base64"); // Convert file buffer to base64

    // Save to the database
    const userFile = new form16model({
      userId,
      file: base64File,
      fileName: file.originalname,
    });
    await userFile.save();

    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload file" });
  }
};

const updatePersonalDetailController = async (req, res) => {
  const { ...personalDetails } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      // Try to find and update the record if it already exists
      updatedDetail = await personalDetailModel.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: personalDetails },
        { new: true } // Return the updated document
      );
    }

    if (!updatedDetail) {
      // If userId is not provided or doesn't exist, create a new record without the _id field
      const newDetail = new personalDetailModel({ userId, ...personalDetails });
      updatedDetail = await newDetail.save(); // MongoDB will auto-generate the _id
    }

    res.status(200).json({
      message: userId
        ? "Details updated successfully"
        : "Details created successfully",
      data: updatedDetail,
    });
  } catch (error) {
    console.error("Error updating personal details:", error);
    res.status(500).json({ error: "Failed to update personal details" });
  }
};

const getPersonalDetailController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const personalDetails = await personalDetailModel.findOne({ userId });
    if (!personalDetails) {
      return res.status(404).json({ error: "Personal details not found" });
    }
    res.status(200).json(personalDetails); // Return the personal details
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).json({ error: "Failed to fetch personal details" });
  }
};
module.exports = {
  uploadForm16Controller,
  updatePersonalDetailController,
  getPersonalDetailController,
};
