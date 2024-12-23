const TaxSavingInvestment = require("../model/TaxSaving/TaxSavingDeduction/TaxSavingInvestment");
const Donation80G = require("../model/TaxSaving/TaxSavingDeduction/Donation/80GDonation");
const RuralDonation80GG = require("../model/TaxSaving/TaxSavingDeduction/Donation/RuralDonation80GG");
const PoliticalContribution = require("../model/TaxSaving/TaxSavingDeduction/Donation/PoliticalContribution");
const Medical80D = require("../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/MedicalInsuranece");
const Disablility = require("../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/Disablility");
const SpecficDiseasDisablity = require("../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/SpecficDiseasDisablity");
const Loan = require("../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/Loan");
const OtherDeduction = require("../model/TaxSaving/TaxSavingDeduction/OtherDeduction/OtherDeduction");
const SelfTaxPaid = require("../model/TaxSaving/TaxPaid/SelfTaxPaid");
const NonSalary = require("../model/TaxSaving/TaxPaid/NonSalary");
const TDSRent = require("../model/TaxSaving/TaxPaid/TDSRent");
const taxCollected = require("../model/TaxSaving/TaxPaid/taxCollected");
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
const postMedical80DController = async (req, res) => {
  const { ...medicalDetails } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      updatedDetail = await Medical80D.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: medicalDetails },
        { new: true }
      );
    }

    if (!updatedDetail) {
      const newDetail = new Medical80D({
        userId,
        ...medicalDetails,
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

const getMedical80DController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const donationDetails = await Medical80D.findOne({ userId });
    if (!donationDetails) {
      return res.status(404).json({ error: "Personal details not found" });
    }
    res.status(200).json(donationDetails); // Return the personal details
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).json({ error: "Failed to fetch personal details" });
  }
};
const postDisablityController = async (req, res) => {
  const { ...disabilityDetails } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      updatedDetail = await Disablility.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: disabilityDetails },
        { new: true }
      );
    }

    if (!updatedDetail) {
      const newDetail = new Disablility({
        userId,
        ...disabilityDetails,
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

const getDisablilityController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const disabilityDetails = await Disablility.findOne({ userId });
    if (!disabilityDetails) {
      return res.status(404).json({ error: "Personal details not found" });
    }
    res.status(200).json(disabilityDetails); // Return the personal details
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).json({ error: "Failed to fetch personal details" });
  }
};
const postSpecficDieaseController = async (req, res) => {
  const { ...disabilityDetails } = req.body;
  const userId = req.user.id;

  console.log("sd", req.body);
  try {
    let updatedDetail;

    if (userId) {
      updatedDetail = await SpecficDiseasDisablity.findOneAndUpdate(
        { userId }, // Find by userId instead of _id
        { $set: disabilityDetails },
        { new: true }
      );
    }

    if (!updatedDetail) {
      const newDetail = new SpecficDiseasDisablity({
        userId,
        ...disabilityDetails,
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

const getSpecificDieaseaseController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const disabilityDetails = await SpecficDiseasDisablity.findOne({ userId });
    if (!disabilityDetails) {
      return res.status(404).json({ error: "Personal details not found" });
    }
    res.status(200).json(disabilityDetails); // Return the personal details
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).json({ error: "Failed to fetch personal details" });
  }
};
const postLoansController = async (req, res) => {
  const { ...loansDetails } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      updatedDetail = await Loan.findOneAndUpdate(
        { userId },
        { $set: loansDetails },
        { new: true }
      );
    }

    if (!updatedDetail) {
      const newDetail = new Loan({
        userId,
        ...loansDetails,
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

const getLoansController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const loansDetails = await Loan.findOne({ userId });
    if (!loansDetails) {
      return res.status(404).json({ error: "Personal details not found" });
    }
    res.status(200).json(loansDetails); // Return the personal details
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).json({ error: "Failed to fetch personal details" });
  }
};
const postOtherDeductionController = async (req, res) => {
  const { ...deductionDetails } = req.body;
  const userId = req.user.id;

  try {
    let updatedDetail;

    if (userId) {
      updatedDetail = await OtherDeduction.findOneAndUpdate(
        { userId },
        { $set: deductionDetails },
        { new: true }
      );
    }

    if (!updatedDetail) {
      const newDetail = new OtherDeduction({
        userId,
        ...deductionDetails,
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

const getOtherDeductionController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const details = await OtherDeduction.findOne({ userId });
    if (!details) {
      return res.status(404).json({ error: "Personal details not found" });
    }
    res.status(200).json(details); // Return the personal details
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).json({ error: "Failed to fetch personal details" });
  }
};
const postSelfTaxPaidController = async (req, res) => {
  try {
    const userId = req.user.id;
    const taxAssest = new SelfTaxPaid({
      userId,
      ...req.body,
    });

    await taxAssest.save();
    res.status(201).json({ message: "Data saved successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSelfTaxPaidController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const details = await SelfTaxPaid.findOne({ userId });
    if (!details) {
      return res.status(404).json({ error: "Personal details not found" });
    }
    res.status(200).json(details); // Return the personal details
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).json({ error: "Failed to fetch personal details" });
  }
};

const updateSelfTaxData = async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;

    // Find the user's existing data and update it
    const existingData = await SelfTaxPaid.findOneAndUpdate(
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

const postNonSalaryController = async (req, res) => {
  const { ...details } = req.body;
  const userId = req.user.id; // Get the userId from the authenticated user middleware

  try {
    // Find a record for the userId
    let existingDetail = await NonSalary.findOne({ userId });

    if (existingDetail) {
      // If a record exists, update it
      existingDetail = await NonSalary.findOneAndUpdate(
        { userId },
        { $set: details },
        { new: true }
      );
      return res.status(200).json({
        message: "Details updated successfully",
        data: existingDetail,
      });
    }

    // If no record exists, create a new one
    const newDetail = new NonSalary({
      userId,
      ...details,
    });
    const savedDetail = await newDetail.save();

    return res.status(201).json({
      message: "Details created successfully",
      data: savedDetail,
    });
  } catch (error) {
    console.error("Error updating or creating personal details:", error);
    res.status(500).json({ error: "Failed to process the request" });
  }
};

const getNonSalaryController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const details = await NonSalary.findOne({ userId });
    if (!details) {
      return res.status(404).json({ error: "Personal details not found" });
    }
    res.status(200).json(details); // Return the personal details
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).json({ error: "Failed to fetch personal details" });
  }
};
const postTDSRentController = async (req, res) => {
  const { ...details } = req.body;
  const userId = req.user.id; // Get the userId from the authenticated user middleware

  try {
    let existingDetail = await TDSRent.findOne({ userId });

    if (existingDetail) {
      existingDetail = await TDSRent.findOneAndUpdate(
        { userId },
        { $set: details },
        { new: true }
      );
      return res.status(200).json({
        message: "Details updated successfully",
        data: existingDetail,
      });
    }

    // If no record exists, create a new one
    const newDetail = new TDSRent({
      userId,
      ...details,
    });
    const savedDetail = await newDetail.save();

    return res.status(201).json({
      message: "Details created successfully",
      data: savedDetail,
    });
  } catch (error) {
    console.error("Error updating or creating personal details:", error);
    res.status(500).json({ error: "Failed to process the request" });
  }
};

const getTDSRentController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const details = await TDSRent.findOne({ userId });
    if (!details) {
      return res.status(404).json({ error: "Personal details not found" });
    }
    res.status(200).json(details); // Return the personal details
  } catch (error) {
    console.error("Error fetching personal details:", error);
    res.status(500).json({ error: "Failed to fetch personal details" });
  }
};
const postTaxCollectedController = async (req, res) => {
  const { ...details } = req.body;
  const userId = req.user.id; // Get the userId from the authenticated user middleware

  try {
    let existingDetail = await taxCollected.findOne({ userId });

    if (existingDetail) {
      existingDetail = await taxCollected.findOneAndUpdate(
        { userId },
        { $set: details },
        { new: true }
      );
      return res.status(200).json({
        message: "Details updated successfully",
        data: existingDetail,
      });
    }

    // If no record exists, create a new one
    const newDetail = new taxCollected({
      userId,
      ...details,
    });
    const savedDetail = await newDetail.save();

    return res.status(201).json({
      message: "Details created successfully",
      data: savedDetail,
    });
  } catch (error) {
    console.error("Error updating or creating personal details:", error);
    res.status(500).json({ error: "Failed to process the request" });
  }
};

const getTaxCollectedController = async (req, res) => {
  const userId = req.user.id; // Assume userId is available from the token

  try {
    const details = await taxCollected.findOne({ userId });
    if (!details) {
      return res.status(404).json({ error: "Personal details not found" });
    }
    res.status(200).json(details); // Return the personal details
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
  postMedical80DController,
  getMedical80DController,
  postDisablityController,
  getDisablilityController,
  postSpecficDieaseController,
  getSpecificDieaseaseController,
  postLoansController,
  getLoansController,
  postOtherDeductionController,
  getOtherDeductionController,
  postSelfTaxPaidController,
  getSelfTaxPaidController,
  updateSelfTaxData,
  postNonSalaryController,
  getNonSalaryController,
  postTDSRentController,
  getTDSRentController,
  postTaxCollectedController,
  getTaxCollectedController,
};
