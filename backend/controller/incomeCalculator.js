const {
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
} = require("../helper/IncomeCalculator/IntererstIncome");
const { getTotalTaxPaid } = require("../helper/IncomeCalculator/taxPaid");
const Disablility = require("../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/Disablility");
const MedicalInsuranece = require("../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/MedicalInsuranece");
const SpecificDiseases = require("../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/SpecficDiseasDisablity");
// Function to round to the nearest 10
function roundToNearestTen(value) {
  return Math.round(value / 10) * 10;
}

const identifyItrType = (
  grossIncome,
  stockMututaldata,
  foreignData,
  landData,
  bondData,
  goldData,
  stockRsuData,
  longSData,
  professData,
  busData
) => {
  // Condition for ITR-1
  if (
    grossIncome <= 5000000 &&
    !foreignData &&
    !stockMututaldata &&
    !landData &&
    !bondData &&
    !goldData &&
    !stockRsuData &&
    !longSData &&
    !professData &&
    !busData
  ) {
    return "ITR-1"; // Eligibility for ITR-1
  }

  // Default case: If none of the conditions match
  return "ITR-2";
};

// Helper function to calculate deductions from medical insurance
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

const calculateTaxLiability = (taxableIncome, taxSlabs) => {
  let incomeTaxAtNormalRates = 0;

  for (let i = 0; i < taxSlabs.length; i++) {
    const { limit, rate } = taxSlabs[i];
    const previousLimit = taxSlabs[i - 1]?.limit || 0;

    if (taxableIncome > limit) {
      incomeTaxAtNormalRates += (limit - previousLimit) * rate;
    } else {
      incomeTaxAtNormalRates += (taxableIncome - previousLimit) * rate;
      break;
    }
  }

  const healthAndEducationCess = incomeTaxAtNormalRates * 0.04;
  const totalTaxLiability = roundToNearestTen(
    incomeTaxAtNormalRates + healthAndEducationCess
  );

  return { incomeTaxAtNormalRates, healthAndEducationCess, totalTaxLiability };
};

const calculateInterestIncome = (interestData) => {
  return interestData.reduce((sum, item) => {
    const amount =
      item.data && Array.isArray(item.data) ? item.data[0]?.amount || 0 : 0;
    return sum + (amount > 0 ? amount : 0);
  }, 0);
};

const calculateTotalProfit = (data) => {
  return Array.isArray(data)
    ? data.reduce(
        (sum, item) => sum + (item.totalProfit > 0 ? item.totalProfit : 0),
        0
      )
    : 0;
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

const taxableIncomeController = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch data with fallbacks
    const interestData = (await getAllInterestData(userId)) || { data: [] };
    const stockMututaldata = (await getAllStockMutualData(userId)) || {
      data: [],
    };
    const foreignData = (await getForeignData(userId)) || { data: [] };
    const landData = (await getLandFormData(userId)) || { data: [] };
    const bondData = (await getBondData(userId)) || { data: [] };
    const goldData = (await getGoldData(userId)) || {
      data: { totalProfit: 0 },
    };
    const stockRsuData = (await getStockRsuData(userId)) || {
      data: { totalProfit: 0 },
    };

    const longSData = await getLongShortData(userId);
    const propertyData = await getPropertyData(userId);
    const rentalData = await getRentalData(userId);
    const virtualData = await getVirtualData(userId);
    const professData = await getProfessionalData(userId);
    const busData = await getBussinessData(userId);

    const tax = await getTotalTaxPaid(userId);
    const totalTax = tax.success !== false ? tax.data : 0;

    const tdsIncome = await getTDSData(userId);
    const profitLossData = await getProfitLossData(userId);

    const dividenData = await getDivdendData(userId);

    // Calculate total stock data (ensure no negative values are added)
    const stockData = calculateTotalProfit(stockMututaldata.data);

    // Calculate total interest income (ensure no negative values are added)
    const totalInterestIncome = calculateInterestIncome(interestData.data);

    // Fallbacks for other data points, excluding negatives
    const foreignV = foreignData.data
      ? foreignData.data[0]?.totalProfit > 0
        ? foreignData.data[0]?.totalProfit
        : 0
      : 0;
    const landFormV = landData.data
      ? landData.data[0]?.totalProfit > 0
        ? landData.data[0]?.totalProfit
        : 0
      : 0;
    const bondDataV = bondData.data
      ? bondData.data[0]?.totalProfit > 0
        ? bondData.data[0]?.totalProfit
        : 0
      : 0;
    const goldDataV = goldData.data
      ? goldData.data[0]?.totalProfit > 0
        ? goldData.data[0]?.totalProfit
        : 0
      : 0;
    const stockRsuV = stockRsuData.data
      ? stockRsuData.data?.totalProfit > 0
        ? stockRsuData.data.totalProfit
        : 0
      : 0;
    const shortTermV = longSData.data
      ? longSData.data[0].shortTermDetails.shortOtherAmountDeemed > 0
        ? longSData.data[0].shortTermDetails.shortOtherAmountDeemed
        : 0
      : 0;
    const longTermV = longSData.data
      ? longSData.data[0].longTermDetails.longOtherAmountDeemed > 0
        ? longSData.data[0].longTermDetails.longOtherAmountDeemed
        : 0
      : 0;

    const dividendDataV = dividenData.data
      ? dividenData.data[0]?.totalAmount > 0
        ? dividenData.data[0].totalAmount
        : 0
      : 0;
    const propertDataV = propertyData.data
      ? propertyData.data[0]?.netTaxableIncome > 0
        ? propertyData.data[0].netTaxableIncome
        : 0
      : 0;
    const rentalDataV = rentalData.data
      ? rentalData.data[0]?.netTaxableIncome > 0
        ? rentalData.data[0].netTaxableIncome
        : 0
      : 0;
    const profDataV = professData.data
      ? professData.data[0]?.totalRevenue > 0
        ? professData.data[0].totalRevenue
        : 0
      : 0;
    const busDataV = busData.data
      ? (busData.data[0].profitcash > 0 ? busData.data[0].profitcash : 0) +
        (busData.data[0].profitMode > 0 ? busData.data[0].profitMode : 0) +
        (busData.data[0].profitDigitalMode > 0
          ? busData.data[0].profitDigitalMode
          : 0)
      : 0;

    const profitV = profitLossData.data
      ? profitLossData.data[0]?.totalProfit > 0
        ? profitLossData.data[0].totalProfit
        : 0
      : 0;
    const incomeClaimedV = tdsIncome.data ? tdsIncome.data[0].incomeClaimed : 0;
    const excemptAllowanceV = tdsIncome.data
      ? tdsIncome.data[0].exemptAllowance
      : 0;

    const tdsincomeV = tdsIncome.data
      ? tdsIncome.data[0]?.balance > 50000
        ? tdsIncome.data[0].balance - 50000 - incomeClaimedV - excemptAllowanceV
        : 0
      : 0;

    let totalVirtualGains = 0;

    if (virtualData?.success && Array.isArray(virtualData.data)) {
      totalVirtualGains = virtualData.data.reduce((sum, item) => {
        return sum + (item.totalGains > 0 ? item.totalGains : 0);
      }, 0);
    }

    const medical80DData = (await MedicalInsuranece.findOne({ userId })) || {};
    const section80DDeduction = calculateSection80DDeduction(medical80DData);
    const section80DDeductionFor80D = await calculateSection80DD(userId);

    const disabilityData = await SpecificDiseases.findOne({ userId });
    const section80UDeduction = disabilityData
      ? disabilityData.selfDisability?.disabilityType === "severe"
        ? 125000
        : 75000
      : 0;

    const loans = await getLoansData(userId);
    const totalLoans = loans.success !== false ? loans.data : 0;

    const deduction = await getMedicalInsuranceData(userId);
    const totalDedu = deduction.success !== false ? deduction.data : 0;
    const totalDeductions = totalDedu + totalLoans;
    // Calculate gross income, excluding negative values
    const grossIncome =
      totalInterestIncome +
      stockData +
      foreignV +
      landFormV +
      bondDataV +
      goldDataV +
      stockRsuV +
      dividendDataV +
      propertDataV +
      rentalDataV +
      totalVirtualGains +
      profDataV +
      busDataV +
      profitV +
      tdsincomeV +
      Number(shortTermV) +
      Number(longTermV);

    const taxableIncome = roundToNearestTen(grossIncome);
    const grossIncomeAfterDeductions = Math.max(
      grossIncome - totalDeductions,
      0
    );

    // Define New Regime tax slabs
    const taxSlabsNewRegime = [
      { limit: 250000, rate: 0 },
      { limit: 300000, rate: 0 },
      { limit: 500000, rate: 0.05 },
      { limit: 750000, rate: 0.1 },
      { limit: 1000000, rate: 0.15 },
      { limit: 1250000, rate: 0.2 },
      { limit: 1500000, rate: 0.2 },
      { limit: Infinity, rate: 0.3 },
    ];

    const itrType = identifyItrType(
      grossIncome,
      stockMututaldata,
      foreignData,
      landData,
      bondData,
      goldData,
      stockRsuData,
      longSData,
      professData,
      busData
    );

    // Calculate tax liability (Income Tax at Normal Rates)
    const {
      incomeTaxAtNormalRates,
      healthAndEducationCess,
      totalTaxLiability,
    } = calculateTaxLiability(grossIncomeAfterDeductions, taxSlabsNewRegime);

    // Calculate tax due
    const taxDue = totalTaxLiability - totalTax;
    // Send response
    res.status(200).json({
      success: true,
      grossIncome, // Before rounding
      taxableIncome, // After rounding
      incomeTaxAtNormalRates, // Tax calculated at normal rates
      healthAndEducationCess, // Additional cess
      taxLiability: totalTaxLiability, // Final liability after adding cess
      taxPaid: totalTax,
      taxDue: taxDue,
      totalTaxI: totalTaxLiability,
      itrType,
    });
  } catch (error) {
    console.error("Error calculating gross income and tax liability:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getTaxPaidController = async (req, res) => {
  try {
    const userId = req.user.id;
    const taxPaidResult = await getTotalTaxPaid(userId);
    const totalTax = taxPaidResult.success !== false ? taxPaidResult.data : 0;
    res.status(200).json(totalTax);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { taxableIncomeController, getTaxPaidController };
