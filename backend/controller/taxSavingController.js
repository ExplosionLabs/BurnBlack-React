const TaxSavingInvestment = require("../model/TaxSaving/TaxSavingDeduction/TaxSavingInvestment");
const Donation80G = require("../model/TaxSaving/TaxSavingDeduction/Donation/80GDonation");
const RuralDonation80GG = require("../model/TaxSaving/TaxSavingDeduction/Donation/RuralDonation80GG");
const PoliticalContribution = require("../model/TaxSaving/TaxSavingDeduction/Donation/PoliticalContribution");
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

const post80GDonationController = async (req, res) => {
  const { ...donationDetails } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      updatedDetail = await Donation80G.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: donationDetails },
        { new: true }
      );
    }

    if (!updatedDetail) {
      const newDetail = new Donation80G({
        userId,
        ...donationDetails,
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

const get80GDonationController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const donationDetails = await Donation80G.findOne({ userId });
    if (!donationDetails) {
      return res.status(404).json({ error: "Personal details not found" });
    }
    res.status(200).json(donationDetails); // Return the personal details
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).json({ error: "Failed to fetch personal details" });
  }
};
const postRuralGDonationController = async (req, res) => {
  const { ...donationDetails } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      updatedDetail = await RuralDonation80GG.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: donationDetails },
        { new: true }
      );
    }

    if (!updatedDetail) {
      const newDetail = new RuralDonation80GG({
        userId,
        ...donationDetails,
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

const getRuralDonationController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const donationDetails = await RuralDonation80GG.findOne({ userId });
    if (!donationDetails) {
      return res.status(404).json({ error: "Personal details not found" });
    }
    res.status(200).json(donationDetails); // Return the personal details
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).json({ error: "Failed to fetch personal details" });
  }
};
const postContriPartyController = async (req, res) => {
  const { ...donationDetails } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      updatedDetail = await PoliticalContribution.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: donationDetails },
        { new: true }
      );
    }

    if (!updatedDetail) {
      const newDetail = new PoliticalContribution({
        userId,
        ...donationDetails,
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

const getContriPartyController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const donationDetails = await PoliticalContribution.findOne({ userId });
    if (!donationDetails) {
      return res.status(404).json({ error: "Personal details not found" });
    }
    res.status(200).json(donationDetails); // Return the personal details
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).json({ error: "Failed to fetch personal details" });
  }
};
module.exports = {
  posttaxInvestmentController,
  getTaxInvestmentController,
  post80GDonationController,
  get80GDonationController,
  postRuralGDonationController,
  getRuralDonationController,
  postContriPartyController,
  getContriPartyController,
};
