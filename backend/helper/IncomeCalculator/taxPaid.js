const NonSalary = require("../../model/TaxSaving/TaxPaid/NonSalary");
const SelfTaxPaid = require("../../model/TaxSaving/TaxPaid/SelfTaxPaid");
const taxCollected = require("../../model/TaxSaving/TaxPaid/taxCollected");
const TDSRent = require("../../model/TaxSaving/TaxPaid/TDSRent");
const { getLandFormData, getTDSData } = require("./IntererstIncome");

const getNonTDSTaxPaid = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await NonSalary.find({ userId });

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
const getSelfTaxPaid = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await SelfTaxPaid.find({ userId });

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
const getTaxCollected = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await taxCollected.find({ userId });

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
const getTaxRent = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const data = await TDSRent.find({ userId });

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

const getTotalTaxPaid = async (userId) => {
  try {
    // Query the database to get the data for the specified user
    const tdsTax = await getTDSData(userId);
    const nontdsTax = await getNonTDSTaxPaid(userId);
    const selfTax = await getSelfTaxPaid(userId);
    const taxCollected = await getTaxCollected(userId);
    const taxRent = await getTaxRent(userId);
    const totalTax =
      Number(tdsTax.data ? tdsTax.data[0].totalTax : 0) +
      Number(nontdsTax.data ? nontdsTax.data[0].totalTax : 0) +
      Number(selfTax.data ? selfTax.data[0].amount : 0) +
      Number(taxCollected.data ? taxCollected.data[0].totalTax : 0) +
      Number(taxRent.data ? taxRent.data[0].totalTax : 0);
    if (totalTax) {
      return { data: totalTax };
    } else {
      return {
        success: false,
        message: "No data found for the specified u",
      };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
};
module.exports = { getNonTDSTaxPaid, getTotalTaxPaid };
