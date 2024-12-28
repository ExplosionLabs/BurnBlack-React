const CryptoIncome = require("../../model/CryptoIncome/CryptoIncome");
const dividentIncome = require("../../model/dividentIncome");
const IncomeInterest = require("../../model/IncomeInterest");
const BussinessIncome = require("../../model/Professionalncome/BussinessIncome");
const ProfessionalIncome = require("../../model/Professionalncome/ProfessionalIncome");
const profitLoss = require("../../model/Professionalncome/profitLoss");
const Property = require("../../model/propertyModel");
const RentalProperty = require("../../model/rentalModel");
const bondDebenture = require("../../model/StockGainAssets/bondDebenture");
const ForeignAssest = require("../../model/StockGainAssets/ForeignAssest");
const GoldForm = require("../../model/StockGainAssets/goldAssets");
const LandForm = require("../../model/StockGainAssets/landBuildModel");
const LongShortModel = require("../../model/StockGainAssets/LongShortModel");
const stockMututalassest = require("../../model/StockGainAssets/stockMututalassest");
const stockRsuData = require("../../model/StockGainAssets/stockRsuData");
const Form16DataManual = require("../../model/form16Data");
const Loans = require("../../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/Loan");
const MedicalInsuranece = require("../../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/MedicalInsuranece");
const SpecificDiseases = require("../../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/SpecficDiseasDisablity");
const Disablility = require("../../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/Disablility");
// Function to get all interest data for a user
const getAllInterestData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await IncomeInterest.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getAllStockMutualData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await stockMututalassest.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getForeignData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await ForeignAssest.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getLandFormData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await LandForm.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getBondData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await bondDebenture.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getGoldData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await GoldForm.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getStockRsuData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await stockRsuData.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getLongShortData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await LongShortModel.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getDivdendData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await dividentIncome.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getPropertyData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await Property.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getRentalData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await RentalProperty.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getVirtualData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await CryptoIncome.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getProfessionalData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await ProfessionalIncome.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getBussinessData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await BussinessIncome.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getProfitLossData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await profitLoss.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getTDSData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await Form16DataManual.find({ userId });

    if (data && data.length > 0) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
const getLoansData = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const loansData = await Loans.findOne({ userId });

    const eduLoanDeduction = loansData?.eduLoans > 0 ? loansData.eduLoans : 0; // Section 80E
    const homeLoanDeduction1617 =
      loansData?.homeLoans1617 > 0 ? loansData.homeLoans1617 : 0; // Section 80EE
    const homeLoanDeduction1922 =
      loansData?.homeLoans1922 > 0 ? loansData.homeLoans1922 : 0; // Section 80EEA
    const electricVehicleDeduction =
      loansData?.electricVehicle > 0 ? loansData.electricVehicle : 0; // Section 80EEB

    const totalLoans =
      eduLoanDeduction +
      homeLoanDeduction1617 +
      homeLoanDeduction1922 +
      electricVehicleDeduction;
    if (totalLoans) {
      return { success: true, data: totalLoans };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};

const calculateSection80DD = async (userId) => {
  try {
    const disabilityData = await Disablility.findOne({ userId }).exec();

    if (!disabilityData) {
      return 0; // No disability data found
    }

    const { disabilityNature } = disabilityData.disabilityDetails;

    let section80DDeduction = 0;

    if (disabilityNature === "SevereDisability") {
      section80DDeduction = 125000;
    } else if (disabilityNature === "40%Disablility") {
      section80DDeduction = 75000;
    }

    return section80DDeduction;
  } catch (error) {
    console.error("Error calculating Section 80DD deduction:", error);
    return 0;
  }
};

const calculateSection80DDeduction = (medical80DData) => {
  let section80DDeduction = 0;

  if (medical80DData) {
    const { selfAndFamily, parents } = medical80DData;

    // Deduction for self and family
    if (selfAndFamily) {
      const selfPremium = parseFloat(selfAndFamily.premium) || 0;
      const selfHealthCheckup = parseFloat(selfAndFamily.healthCheckup) || 0;
      const selfMedicalExpenditure =
        parseFloat(selfAndFamily.medicalExpenditure) || 0;
      const selfAndFamilyMaxLimit = selfAndFamily.isSeniorCitizen
        ? 50000
        : 25000;

      section80DDeduction += Math.min(
        selfPremium + selfHealthCheckup + selfMedicalExpenditure,
        selfAndFamilyMaxLimit
      );
    }

    // Deduction for parents
    if (parents) {
      const parentPremium = parseFloat(parents.premium) || 0;
      const parentHealthCheckup = parseFloat(parents.healthCheckup) || 0;
      const parentMedicalExpenditure =
        parseFloat(parents.medicalExpenditure) || 0;
      const parentsMaxLimit = parents.isSeniorCitizen ? 50000 : 25000;

      section80DDeduction += Math.min(
        parentPremium + parentHealthCheckup + parentMedicalExpenditure,
        parentsMaxLimit
      );
    }
  }

  return section80DDeduction;
};

const getMedicalInsuranceData = async (userId) => {
  try {
    // Query the database to get the data for the specified user

    const medical80DData = (await MedicalInsuranece.findOne({ userId })) || {};
    const section80DDeduction = calculateSection80DDeduction(medical80DData);
    const section80DDeductionFor80D = await calculateSection80DD(userId);

    const disabilityData = await SpecificDiseases.findOne({ userId });
    const section80UDeduction = disabilityData
      ? disabilityData.selfDisability?.disabilityType === "severe"
        ? 125000
        : 75000
      : 0;

    const totalDeductions =
      section80DDeduction + section80DDeductionFor80D + section80UDeduction;
    if (totalDeductions) {
      return { success: true, data: totalDeductions };
    } else {
      return {
        success: false,
        message: "No data found for the specified user",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};

module.exports = {
  getAllInterestData,
  getAllStockMutualData,
  getForeignData,
  getLandFormData,
  getBondData,
  getGoldData,
  getStockRsuData,
  getLongShortData,
  getDivdendData,
  getPropertyData,
  getRentalData,
  getVirtualData,
  getProfessionalData,
  getBussinessData,
  getProfitLossData,
  getTDSData,
  getLoansData,
  getMedicalInsuranceData,
};
