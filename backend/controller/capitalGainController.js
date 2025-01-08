const bondDebenture = require("../model/StockGainAssets/bondDebenture");
const ForeignAssest = require("../model/StockGainAssets/ForeignAssest");
const GoldForm = require("../model/StockGainAssets/goldAssets");
const LandForm = require("../model/StockGainAssets/landBuildModel");
const LongShortModel = require("../model/StockGainAssets/LongShortModel");
const stockMututalassest = require("../model/StockGainAssets/stockMututalassest");
const stockRsuData = require("../model/StockGainAssets/stockRsuData");

const postStockMutualControler = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("reqb did", req.body);
    const capitalGain = new stockMututalassest({
      userId,
      ...req.body,
    });

    await capitalGain.save();
    res.status(201).json({ message: "Capital Gain data saved successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getStockMututalData = async (req, res) => {
  const { assetType } = req.query;
  const userId = req.user.id; // Assuming user is authenticated

  try {
    const capitalGainData = await stockMututalassest.find({
      userId,
    });

    if (capitalGainData) {
      return res.status(200).json(capitalGainData);
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
const getAllMututalData = async (req, res) => {
  const userId = req.user.id; // Assuming user is authenticated

  try {
    const capitalGainData = await stockMututalassest.find({
      userId: userId,
    });

    if (capitalGainData) {
      return res.status(200).json(capitalGainData);
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

const updateStockMutualData = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    const { stockMutualId } = req.params;
    // Find the user's existing data and update it
    const existingData = await stockMututalassest.findOneAndUpdate(
      { userId, _id: stockMutualId },
      updatedData,
      { new: true }
    );

    if (existingData) {
      return res
        .status(200)
        .json({ message: "Capital Gain data updated successfully!" });
    } else {
      return res.status(404).json({ message: "No data found to update" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postForeignAssestControler = async (req, res) => {
  try {
    const userId = req.user.id;
    const foreignAssest = new ForeignAssest({
      userId,
      ...req.body,
    });

    await foreignAssest.save();
    res
      .status(201)
      .json({ message: "Foreign Assest data saved successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getForeignAssetsData = async (req, res) => {
  const userId = req.user.id;
  try {
    const foreignAssestData = await ForeignAssest.find({
      userId,
    });

    if (foreignAssestData) {
      return res.status(200).json(foreignAssestData);
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

const updateForeignAssestData = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    const { foreignId } = req.params;
    // Find the user's existing data and update it
    const existingData = await ForeignAssest.findOneAndUpdate(
      { _id: foreignId, userId: userId },
      updatedData,
      { new: true }
    );

    if (existingData) {
      return res
        .status(200)
        .json({ message: "Foreign Assest data updated successfully!" });
    } else {
      return res.status(404).json({ message: "No data found to update" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postLandFormController = async (req, res) => {
  try {
    const userId = req.user.id; // Get the userId from the request (assumes authentication middleware is in place)

    // Create a new instance of the LandForm model
    const newLandForm = new LandForm({
      ...req.body, // This spreads the incoming request body into the model
      userId, // Set the createdBy field with the userId
    });

    // Save the new land form data to the database
    const savedLandForm = await newLandForm.save();

    // Respond with the saved data
    res.status(201).json({
      message: "Land form created successfully",
      data: savedLandForm,
    });
  } catch (error) {
    console.error("Error saving land form:", error);
    res.status(500).json({
      message: "Error saving land form data",
      error: error.message,
    });
  }
};

const getLandFormData = async (req, res) => {
  const userId = req.user.id;
  try {
    const landFormData = await LandForm.find({
      userId,
    });

    if (landFormData) {
      return res.status(200).json(landFormData);
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

const updateLandFormAssestData = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    const { landId } = req.params;
    // Find the user's existing data and update it
    const existingData = await LandForm.findOneAndUpdate(
      { _id: landId, userId },
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

const postStockRsuAssestControler = async (req, res) => {
  try {
    const userId = req.user.id;
    const stockRsuAssest = new stockRsuData({
      userId,
      ...req.body,
    });

    await stockRsuAssest.save();
    res.status(201).json({ message: "Data saved successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getStockRsuAssetsData = async (req, res) => {
  const userId = req.user.id;
  try {
    const stockRsuAssestData = await stockRsuData.find({
      userId,
    });

    if (stockRsuAssestData) {
      return res.status(200).json(stockRsuAssestData);
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

const updateStockRsuAssestData = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    const { stockRsuId } = req.params;
    // Find the user's existing data and update it
    const existingData = await stockRsuData.findOneAndUpdate(
      { _id: stockRsuId, userId },
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
const postBondDebentureAssestControler = async (req, res) => {
  try {
    const userId = req.user.id;
    const bondDebentureAssest = new bondDebenture({
      userId,
      ...req.body,
    });

    await bondDebentureAssest.save();
    res.status(201).json({ message: "Data saved successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getBondDebentureAssetsData = async (req, res) => {
  const userId = req.user.id;
  try {
    const bondDebentureAssestData = await bondDebenture.find({
      userId,
    });

    if (bondDebentureAssestData) {
      return res.status(200).json(bondDebentureAssestData);
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

const updateBondDebentureAssestData = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    const { bondId } = req.params;
    // Find the user's existing data and update it
    const existingData = await bondDebenture.findOneAndUpdate(
      { _id: bondId, userId },
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

const postLongShortAssestControler = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're using authentication middleware
    const { shortTermDetails, longTermDetails } = req.body;

    // Save the data in the database
    const newCapitalGain = new LongShortModel({
      userId,
      shortTermDetails,
      longTermDetails,
    });

    await newCapitalGain.save();

    res.status(201).json({ message: "Data saved successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getShortLongAssetsData = async (req, res) => {
  const userId = req.user.id;
  try {
    const longShortAssestData = await LongShortModel.findOne({
      userId,
    });

    if (longShortAssestData) {
      return res.status(200).json(longShortAssestData);
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

const updateLongShortData = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    // Find the user's existing data and update it
    const existingData = await LongShortModel.findOneAndUpdate(
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

const postGoldAssestControler = async (req, res) => {
  try {
    const userId = req.user.id;
    const goldFormAssest = new GoldForm({
      userId,
      ...req.body,
    });

    await goldFormAssest.save();
    res.status(201).json({ message: "Data saved successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getGoldAssetsData = async (req, res) => {
  const userId = req.user.id;
  try {
    const goldFormAssestData = await GoldForm.find({
      userId,
    });

    if (goldFormAssestData) {
      return res.status(200).json(goldFormAssestData);
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

const updateGoldFormAssestData = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    const { goldId } = req.params;
    // Find the user's existing data and update it
    const existingData = await GoldForm.findOneAndUpdate(
      { _id: goldId, userId },
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
  postStockMutualControler,
  getStockMututalData,
  updateStockMutualData,
  postForeignAssestControler,
  getForeignAssetsData,
  updateForeignAssestData,
  postLandFormController,
  getLandFormData,
  updateLandFormAssestData,
  postStockRsuAssestControler,
  getStockRsuAssetsData,
  updateStockRsuAssestData,
  postBondDebentureAssestControler,
  getBondDebentureAssetsData,
  updateBondDebentureAssestData,
  postLongShortAssestControler,
  getShortLongAssetsData,
  updateLongShortData,
  postGoldAssestControler,
  getGoldAssetsData,
  updateGoldFormAssestData,
  getAllMututalData,
};
