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

module.exports = {
  postStockMutualControler,
  getStockMututalData,
  updateStockMutualData,
};
