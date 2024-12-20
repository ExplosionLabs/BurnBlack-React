const TaxSavingInvestment = require("../model/TaxSaving/TaxSavingDeduction/TaxSavingInvestment");

const posttaxInvestmentController = async (req, res) => {
  const { ...taxInvestDetails } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      updatedDetail = await TaxSavingInvestment.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: taxInvestDetails },
        { new: true }
      );
    }

    if (!updatedDetail) {
      const newDetail = new TaxSavingInvestment({
        userId,
        ...taxInvestDetails,
      });
      updatedDetail = await newDetail.save();
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

const getTaxInvestmentController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const taxDetails = await TaxSavingInvestment.findOne({ userId });
    if (!taxDetails) {
      return res.status(404).json({ error: "details not found" });
    }
    res.status(200).json(taxDetails);
  } catch (error) {
    console.error("Error fetching  details:", error);
    res.status(500).json({ error: "Failed to fetch details" });
  }
};
module.exports = { posttaxInvestmentController, getTaxInvestmentController };
