const addressDetail = require("../model/addressDetail");
const bankDetail = require("../model/bankDetail");
const contactDetail = require("../model/contactDetail");
const dividentIncome = require("../model/dividentIncome");
const form16model = require("../model/form16model");
const IncomeInterest = require("../model/IncomeInterest");
const personalDetailModel = require("../model/personalDetailModel");
const Property = require("../model/propertyModel");
const RentalProperty = require("../model/rentalModel");

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

const updateContactDetailController = async (req, res) => {
  const { ...personalDetails } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      // Try to find and update the record if it already exists
      updatedDetail = await contactDetail.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: personalDetails },
        { new: true } // Return the updated document
      );
    }

    if (!updatedDetail) {
      // If userId is not provided or doesn't exist, create a new record without the _id field
      const newDetail = new contactDetail({ userId, ...personalDetails });
      updatedDetail = await newDetail.save(); // MongoDB will auto-generate the _id
    }

    res.status(200).json({
      message: userId
        ? "Details updated successfully"
        : "Details created successfully",
      data: updatedDetail,
    });
  } catch (error) {
    console.error("Error updating contact details:", error);
    res.status(500).json({ error: "Failed to update contact details" });
  }
};

const getContactDetailController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const personalDetails = await contactDetail.findOne({ userId });
    if (!personalDetails) {
      return res.status(404).json({ error: "Contact details not found" });
    }
    res.status(200).json(personalDetails); // Return the personal details
  } catch (error) {
    console.error("Error fetching contact details:", error);
    res.status(500).json({ error: "Failed to fetch contact details" });
  }
};

const updateAddressDetailController = async (req, res) => {
  const { ...addressDetails } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      // Try to find and update the record if it already exists
      updatedDetail = await addressDetail.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: addressDetails },
        { new: true } // Return the updated document
      );
    }

    if (!updatedDetail) {
      // If userId is not provided or doesn't exist, create a new record without the _id field
      const newDetail = new addressDetail({ userId, ...addressDetails });
      updatedDetail = await newDetail.save(); // MongoDB will auto-generate the _id
    }

    res.status(200).json({
      message: userId
        ? "Details updated successfully"
        : "Details created successfully",
      data: updatedDetail,
    });
  } catch (error) {
    console.error("Error updating contact details:", error);
    res.status(500).json({ error: "Failed to update contact details" });
  }
};

const getAddressDetailController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const personalDetails = await addressDetail.findOne({ userId });
    if (!personalDetails) {
      return res.status(404).json({ error: "Address details not found" });
    }
    res.status(200).json(personalDetails); // Return the personal details
  } catch (error) {
    console.error("Error fetching contact details:", error);
    res.status(500).json({ error: "Failed to fetch contact details" });
  }
};

const updateBankDetailsController = async (req, res) => {
  const userId = req.user.id; // Assume authentication middleware adds `user` to `req`
  const { bankDetails } = req.body;

  try {
    let userBankDetails = await bankDetail.findOne({ userId });

    if (userBankDetails) {
      // Update existing bank details
      userBankDetails.bankDetails = bankDetails;
      await userBankDetails.save();
    } else {
      // Create new record
      userBankDetails = new bankDetail({ userId, bankDetails });
      await userBankDetails.save();
    }

    res.status(200).json({ message: "Bank details updated successfully." });
  } catch (error) {
    console.error("Error updating bank details:", error);
    res.status(500).json({ error: "Failed to update bank details." });
  }
};

const getBankDetailsController = async (req, res) => {
  const userId = req.user.id;

  try {
    const bankDetails = await bankDetail.findOne({ userId });

    if (!bankDetails) {
      return res.status(404).json({ message: "No bank details found." });
    }

    res.status(200).json({
      message: "Bank details fetched successfully.",
      data: bankDetails,
    });
  } catch (error) {
    console.error("Error fetching bank details:", error);
    res.status(500).json({ error: "Failed to fetch bank details." });
  }
};

const postInterestController = async (req, res) => {
  try {
    const { type, data } = req.body;
    const userId = req.user.id;

    // Validate type
    if (
      ![
        "Savings Bank",
        "Fixed Deposits",
        "P2P Investments",
        "Bond Investments",
        "Provident Fund",
        "Income Tax Refund",
        "Other Interest Income",
      ].includes(type)
    ) {
      return res.status(400).json({ error: "Invalid type" });
    }

    // Upsert: Update if exists, insert if not
    await IncomeInterest.findOneAndUpdate(
      { userId, type },
      { $set: { data } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Data saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save data" });
  }
};
const getInterestController = async (req, res) => {
  const { type } = req.params; // User ID and Type passed in query parameters
  const userId = req.user.id;
  try {
    // Query the database to get the data for the specified user and type

    const decodedType = decodeURIComponent(type);
    const data = await IncomeInterest.findOne({ userId, type: decodedType });

    if (data) {
      res.status(200).json({ success: true, data: data.data });
    } else {
      res.status(404).json({
        success: false,
        message: "No data found for the specified user and type",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const postPropertyDataController = async (req, res) => {
  try {
    const {
      propertyType,
      houseAddress,
      ownerDetails,
      taxSavings,
      rentalIncomeDetails,
    } = req.body;

    const userId = req.user.id;

    // Find an existing entry for the user and update or create a new one
    const property = await Property.findOneAndUpdate(
      { userId }, // Filter by userId
      {
        $set: {
          propertyType,
          houseAddress,
          ownerDetails,
          taxSavings,
          rentalIncomeDetails,
        },
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create a new document if one doesn't exist
      }
    );

    res.status(200).json({
      success: true,
      message: "Data saved or updated successfully.",
      property,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error saving data.", error });
  }
};

const getPropertyDataController = async (req, res) => {
  try {
    const userId = req.user.id;

    const property = await Property.findOne({ userId });

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property data not found." });
    }

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching data.", error });
  }
};
const postRentalDataController = async (req, res) => {
  try {
    const {
      houseAddress,
      ownerDetails,
      taxSavings,
      rentalIncomeDetails,
      tentatDetails,
    } = req.body;

    const userId = req.user.id;

    // Find an existing entry for the user and update or create a new one
    const rentProperty = await RentalProperty.findOneAndUpdate(
      { userId }, // Filter by userId
      {
        $set: {
          houseAddress,
          ownerDetails,
          taxSavings,
          rentalIncomeDetails,
          tentatDetails,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Data saved or updated successfully.",
      rentProperty,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error saving data.", error });
  }
};

const getRentalDataController = async (req, res) => {
  try {
    const userId = req.user.id;

    const rentProperty = await RentalProperty.findOne({ userId });

    if (!rentProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Property data not found." });
    }

    res.status(200).json({ success: true, data: rentProperty });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching data.", error });
  }
};

const postDividendIncomeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dividendIncome } = req.body;

    // Upsert (update or insert) data for the user
    await dividentIncome.findOneAndUpdate(
      { userId },
      { userId, dividendIncome },
      { upsert: true, new: true }
    );
    res.status(200).send("Data saved successfully!");
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Error saving data");
  }
};

const getDividendIncomeController = async (req, res) => {
  try {
    const userId = req.user.id;

    const dividentData = await dividentIncome.findOne({ userId });

    if (!dividentData) {
      return res
        .status(404)
        .json({ success: false, message: "Property data not found." });
    }

    res.status(200).json({ success: true, data: dividentData.dividendIncome });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching data.", error });
  }
};
module.exports = {
  uploadForm16Controller,
  updatePersonalDetailController,
  getPersonalDetailController,
  updateContactDetailController,
  getContactDetailController,
  updateAddressDetailController,
  getAddressDetailController,
  updateBankDetailsController,
  getBankDetailsController,
  postInterestController,
  getInterestController,
  postPropertyDataController,
  getPropertyDataController,
  postRentalDataController,
  getRentalDataController,
  postDividendIncomeController,
  getDividendIncomeController,
};
