const addressDetail = require("../model/addressDetail");
const balanceSheet = require("../model/Professionalncome/balanceSheet");
const bankDetail = require("../model/bankDetail");
const BussinessIncome = require("../model/Professionalncome/BussinessIncome");
const contactDetail = require("../model/contactDetail");
const dividentIncome = require("../model/dividentIncome");
const FinanceParticular = require("../model/FinanceParticular");
const form16model = require("../model/form16model");
const IncomeInterest = require("../model/IncomeInterest");
const personalDetailModel = require("../model/personalDetailModel");
const ProfAndBussinessIncome = require("../model/Professionalncome/ProfAndBussinessIncome");
const ProfessionalIncome = require("../model/Professionalncome/ProfessionalIncome");
const profitLoss = require("../model/Professionalncome/profitLoss");
const Property = require("../model/propertyModel");
const RentalProperty = require("../model/rentalModel");
const CryptoIncome = require("../model/CryptoIncome/CryptoIncome");
const deprectationData = require("../model/Professionalncome/deprectationData");

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
      netTaxableIncome,
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
          netTaxableIncome,
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
      netTaxableIncome,
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
          netTaxableIncome,
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

    console.log("dividend Income", dividendIncome);

    // Calculate totalAmount, ensuring amounts are treated as numbers
    const totalAmount = dividendIncome.reduce(
      (sum, income) => sum + Number(income.amount || 0),
      0
    );

    // Upsert (update or insert) data for the user
    await dividentIncome.findOneAndUpdate(
      { userId },
      { userId, dividendIncome, totalAmount },
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

    res.status(200).json({ success: true, data: dividentData });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching data.", error });
  }
};

const deleteDividendIncomeController = async (req, res) => {
  try {
    const { dividendIncome } = req.body;
    const userId = req.user.id;
    if (!userId || !dividendIncome) {
      return res
        .status(400)
        .json({ error: "User ID and dividend data are required." });
    }

    // Remove the specific record for the user
    const result = await dividentIncome.findOneAndUpdate(
      { userId },
      { $pull: { dividendIncome: dividendIncome } },
      { new: true } // Returns the updated document
    );

    if (!result) {
      return res
        .status(404)
        .json({ error: "Dividend record not found for the user." });
    }

    res
      .status(200)
      .json({ message: "Dividend record deleted successfully.", data: result });
  } catch (error) {
    console.error("Error deleting dividend record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteAllDividendIncomeController = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Remove all records for the user
    const result = await dividentIncome.findOneAndUpdate(
      { userId },
      { $set: { dividendIncome: [] } }, // Clears the 'dividends' array
      { new: true } // Returns the updated document
    );

    if (!result) {
      return res
        .status(404)
        .json({ error: "User not found or no dividend data exists." });
    }

    res.status(200).json({
      message: "All dividend records deleted successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting dividend record:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProfessionalIncomeController = async (req, res) => {
  const { ...professionalIncome } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      // Try to find and update the record if it already exists
      updatedDetail = await ProfessionalIncome.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: professionalIncome },
        { new: true } // Return the updated document
      );
    }

    if (!updatedDetail) {
      // If userId is not provided or doesn't exist, create a new record without the _id field
      const newDetail = new ProfessionalIncome({
        userId,
        ...professionalIncome,
      });
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

const getProfessionalDataController = async (req, res) => {
  try {
    const userId = req.user.id;

    const incomeData = await ProfessionalIncome.findOne({ userId });

    if (!incomeData) {
      return res
        .status(404)
        .json({ success: false, message: "Property data not found." });
    }

    res.status(200).json({ success: true, data: incomeData });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching data.", error });
  }
};
const updateBussinessIncomeController = async (req, res) => {
  const { ...bussinessIncome } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      // Try to find and update the record if it already exists
      updatedDetail = await BussinessIncome.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: bussinessIncome },
        { new: true } // Return the updated document
      );
    }

    if (!updatedDetail) {
      // If userId is not provided or doesn't exist, create a new record without the _id field
      const newDetail = new BussinessIncome({
        userId,
        ...bussinessIncome,
      });
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

const getBussinessIncomeController = async (req, res) => {
  try {
    const userId = req.user.id;

    const incomeData = await BussinessIncome.findOne({ userId });

    if (!incomeData) {
      return res
        .status(404)
        .json({ success: false, message: "Property data not found." });
    }

    res.status(200).json({ success: true, data: incomeData });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching data.", error });
  }
};

const getAllInterestController = async (req, res) => {
  const userId = req.user.id;
  try {
    // Query the database to get the data for the specified user and type

    const data = await IncomeInterest.find({ userId });

    if (data) {
      res.status(200).json({ success: true, data: data });
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

const updateProfandBussinessIncomeController = async (req, res) => {
  const { ...bussinessIncome } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      // Try to find and update the record if it already exists
      updatedDetail = await ProfAndBussinessIncome.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: bussinessIncome },
        { new: true } // Return the updated document
      );
    }

    if (!updatedDetail) {
      // If userId is not provided or doesn't exist, create a new record without the _id field
      const newDetail = new ProfAndBussinessIncome({
        userId,
        ...bussinessIncome,
      });
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

const getProfandBussinessIncomeController = async (req, res) => {
  try {
    const userId = req.user.id;

    const incomeData = await ProfAndBussinessIncome.findOne({ userId });

    if (!incomeData) {
      return res
        .status(404)
        .json({ success: false, message: "Property data not found." });
    }

    res.status(200).json({ success: true, data: incomeData });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching data.", error });
  }
};
const updateFinanceParticularController = async (req, res) => {
  const { ...financeParticular } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      // Try to find and update the record if it already exists
      updatedDetail = await FinanceParticular.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: financeParticular },
        { new: true } // Return the updated document
      );
    }

    if (!updatedDetail) {
      // If userId is not provided or doesn't exist, create a new record without the _id field
      const newDetail = new FinanceParticular({
        userId,
        ...financeParticular,
      });
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

const getFinanceParticularController = async (req, res) => {
  try {
    const userId = req.user.id;

    const financeData = await FinanceParticular.findOne({ userId });

    if (!financeData) {
      return res
        .status(404)
        .json({ success: false, message: "Property data not found." });
    }

    res.status(200).json({ success: true, data: financeData });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching data.", error });
  }
};
const updateProfitLossController = async (req, res) => {
  const { ...profitLossData } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      // Try to find and update the record if it already exists
      updatedDetail = await profitLoss.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: profitLossData },
        { new: true } // Return the updated document
      );
    }

    if (!updatedDetail) {
      // If userId is not provided or doesn't exist, create a new record without the _id field
      const newDetail = new profitLoss({
        userId,
        ...profitLossData,
      });
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

const getProfitLossController = async (req, res) => {
  try {
    const userId = req.user.id;

    const profitLossData = await profitLoss.findOne({ userId });

    if (!profitLossData) {
      return res
        .status(404)
        .json({ success: false, message: "Property data not found." });
    }

    res.status(200).json({ success: true, data: profitLossData });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching data.", error });
  }
};
const updateBalanceSheetController = async (req, res) => {
  const { ...balanceSheetData } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      // Try to find and update the record if it already exists
      updatedDetail = await balanceSheet.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: balanceSheetData },
        { new: true } // Return the updated document
      );
    }

    if (!updatedDetail) {
      // If userId is not provided or doesn't exist, create a new record without the _id field
      const newDetail = new balanceSheet({
        userId,
        ...balanceSheetData,
      });
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

const getBalanceSheetController = async (req, res) => {
  try {
    const userId = req.user.id;

    const balanceSheetData = await balanceSheet.findOne({ userId });

    if (!balanceSheetData) {
      return res
        .status(404)
        .json({ success: false, message: "Property data not found." });
    }

    res.status(200).json({ success: true, data: balanceSheetData });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching data.", error });
  }
};

const postCrytoDataController = async (req, res) => {
  try {
    const userId = req.user.id;
    const cryptoAssest = new CryptoIncome({
      userId,
      ...req.body,
    });

    await cryptoAssest.save();
    res.status(201).json({ message: "Data saved successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCryptoDataController = async (req, res) => {
  const userId = req.user.id;
  try {
    const cryptoAssestData = await CryptoIncome.find({
      userId,
    });

    if (cryptoAssestData) {
      return res.status(200).json(cryptoAssestData);
    } else {
      return res
        .status(404)
        .json({ message: "No data found for the given asset type." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error, please try again later." });
  }
};

const updateCryptoAssestData = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    // Find the user's existing data and update it
    const existingData = await CryptoIncome.findOneAndUpdate(
      { userId },
      updatedData,
      { new: true }
    );

    if (existingData) {
      return res.status(200).json({ message: "Data updated successfully!" });
    } else {
      return res.status(404).json({ message: "No data found to update" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateNFTAssestData = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    // Find the user's existing data and update it
    const existingData = await CryptoIncome.findOneAndUpdate(
      { userId, assetSubType: updatedData.assetSubType },
      updatedData,
      { new: true }
    );

    if (existingData) {
      return res.status(200).json({ message: "Data updated successfully!" });
    } else {
      return res.status(404).json({ message: "No data found to update" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postDeprectationController = async (req, res) => {
  try {
    const userId = req.user.id;
    const deprectationAssest = new deprectationData({
      userId,
      ...req.body,
    });

    await deprectationAssest.save();
    res.status(201).json({ message: "Data saved successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getDeprectationController = async (req, res) => {
  const userId = req.user.id;
  try {
    const deprecationAssestData = await deprectationData.findOne({
      userId,
    });

    if (deprecationAssestData) {
      return res.status(200).json(deprecationAssestData);
    } else {
      return res
        .status(404)
        .json({ message: "No data found for the given asset type." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error, please try again later." });
  }
};

const updateDeprectationData = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    // Find the user's existing data and update it
    const existingData = await deprectationData.findOneAndUpdate(
      { userId },
      updatedData,
      { new: true }
    );

    if (existingData) {
      return res.status(200).json({ message: "Data updated successfully!" });
    } else {
      return res.status(404).json({ message: "No data found to update" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  updateProfessionalIncomeController,
  getProfessionalDataController,
  updateBussinessIncomeController,
  getBussinessIncomeController,
  getAllInterestController,
  updateProfandBussinessIncomeController,
  getProfandBussinessIncomeController,
  updateFinanceParticularController,
  getFinanceParticularController,
  updateProfitLossController,
  getProfitLossController,
  updateBalanceSheetController,
  getBalanceSheetController,
  deleteDividendIncomeController,
  deleteAllDividendIncomeController,
  postCrytoDataController,
  getCryptoDataController,
  updateCryptoAssestData,
  updateNFTAssestData,
  postDeprectationController,
  getDeprectationController,
  updateDeprectationData,
};
