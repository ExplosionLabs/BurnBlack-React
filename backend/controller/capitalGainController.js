const ForeignAssest = require("../model/ForeignAssest");
const LandForm = require("../model/landBuildModel");
const stockMututalassest = require("../model/stockMututalassest");

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
    const capitalGainData = await stockMututalassest.findOne({
      assetType,
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

const updateStockMutualData = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    // Find the user's existing data and update it
    const existingData = await stockMututalassest.findOneAndUpdate(
      { userId, assetType: updatedData.assetType },
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
    const foreignAssestData = await ForeignAssest.findOne({
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

    // Find the user's existing data and update it
    const existingData = await ForeignAssest.findOneAndUpdate(
      { userId },
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
    const landFormData = await LandForm.findOne({
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

    // Find the user's existing data and update it
    const existingData = await LandForm.findOneAndUpdate(
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
  postStockMutualControler,
  getStockMututalData,
  updateStockMutualData,
  postForeignAssestControler,
  getForeignAssetsData,
  updateForeignAssestData,
  postLandFormController,
  getLandFormData,
  updateLandFormAssestData,
};
