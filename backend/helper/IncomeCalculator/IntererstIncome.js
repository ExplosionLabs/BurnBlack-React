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
};
