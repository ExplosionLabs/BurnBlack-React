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
  getTaxSavingData,
  getTaxSection80GG,
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

const taxableIncomeController = async (req, res) => {
  try {
    const userId = req.user.id;

    // Parallelize all API calls using Promise.all
    const [
      interestData,
      stockMutualData,
      foreignData,
      landData,
      bondData,
      goldData,
      stockRsuData,
      longSData,
      propertyData,
      rentalData,
      virtualData,
      professData,
      busData,
      tax,
      tdsIncome,
      profitLossData,
      dividendData,
      loans,
      deduction,
      savingInvestment,
      hRA,
    ] = await Promise.all([
      getAllInterestData(userId).catch(() => ({ data: [] })),
      getAllStockMutualData(userId).catch(() => ({ data: [] })),
      getForeignData(userId).catch(() => ({ data: [] })),
      getLandFormData(userId).catch(() => ({ data: [] })),
      getBondData(userId).catch(() => ({ data: [] })),
      getGoldData(userId).catch(() => ({ data: { totalProfit: 0 } })),
      getStockRsuData(userId).catch(() => ({ data: { totalProfit: 0 } })),
      getLongShortData(userId).catch(() => ({ data: [] })),
      getPropertyData(userId).catch(() => ({ data: [] })),
      getRentalData(userId).catch(() => ({ data: [] })),
      getVirtualData(userId).catch(() => ({ data: [] })),
      getProfessionalData(userId).catch(() => ({ data: [] })),
      getBussinessData(userId).catch(() => ({ data: [] })),
      getTotalTaxPaid(userId).catch(() => ({ success: false, data: 0 })),
      getTDSData(userId).catch(() => ({ data: [] })),
      getProfitLossData(userId).catch(() => ({ data: [] })),
      getDivdendData(userId).catch(() => ({ data: [] })),
      getLoansData(userId).catch(() => ({ success: false, data: 0 })),
      getMedicalInsuranceData(userId).catch(() => ({
        success: false,
        data: 0,
      })),
      getTaxSavingData(userId).catch(() => ({ success: false, data: 0 })),
      getTaxSection80GG(userId).catch(() => ({ success: false, data: 0 })),
    ]);

    // Helper function to safely get positive numbers
    const safePositiveNumber = (value) => Math.max(0, value || 0);

    // Calculate values with safe defaults
    const stockData = calculateTotalProfit(stockMutualData.data);
    const totalInterestIncome = calculateInterestIncome(interestData.data);
    const foreignV = safePositiveNumber(foreignData.data?.[0]?.totalProfit);
    const landFormV = safePositiveNumber(landData.data?.[0]?.totalProfit);
    const bondDataV = safePositiveNumber(bondData.data?.[0]?.totalProfit);
    const goldDataV = safePositiveNumber(goldData.data?.[0]?.totalProfit);
    const stockRsuV = safePositiveNumber(stockRsuData.data?.totalProfit);
    const shortTermV = safePositiveNumber(
      longSData.data?.[0]?.shortTermDetails?.shortOtherAmountDeemed
    );
    const longTermV = safePositiveNumber(
      longSData.data?.[0]?.longTermDetails?.longOtherAmountDeemed
    );
    const dividendDataV = safePositiveNumber(
      dividendData.data?.[0]?.totalAmount
    );

    const propertyDataV = safePositiveNumber(propertyData.data);

    const rentalDataV = safePositiveNumber(rentalData.data);
    const profDataV = safePositiveNumber(professData.data?.[0]?.totalRevenue);

    // Calculate business data
    const busDataV = busData.data?.[0]
      ? safePositiveNumber(busData.data[0].profitcash) +
        safePositiveNumber(busData.data[0].profitMode) +
        safePositiveNumber(busData.data[0].profitDigitalMode)
      : 0;

    const profitV = safePositiveNumber(profitLossData.data?.[0]?.totalProfit);
    const incomeClaimedV = safePositiveNumber(
      tdsIncome.data?.[0]?.incomeClaimed
    );
    const excemptAllowanceV = safePositiveNumber(
      tdsIncome.data?.[0]?.exemptAllowance
    );

    // Calculate TDS income
    const tdsincomeV =
      tdsIncome.data?.[0]?.balance > 50000
        ? tdsIncome.data[0].balance - 50000 - incomeClaimedV - excemptAllowanceV
        : 0;

    // Calculate virtual gains
    const totalVirtualGains = Array.isArray(virtualData?.data)
      ? virtualData.data.reduce(
          (sum, item) => sum + safePositiveNumber(item.totalGains),
          0
        )
      : 0;

    // Calculate totals
    const totalTax = tax.success !== false ? tax.data : 0;
    const totalDedu = deduction.success !== false ? deduction.data : 0;
    const totalLoans = loans.success !== false ? loans.data : 0;
    const totalInvestment =
      savingInvestment.success !== false ? savingInvestment.data : 0;
    const totalHRA = hRA.success !== false ? hRA.data : 0;
    const totalDeductions = totalDedu + totalLoans + totalInvestment + totalHRA;

    const grossIncome = [
      totalInterestIncome,
      stockData,
      foreignV,
      landFormV,
      bondDataV,
      goldDataV,
      stockRsuV,
      dividendDataV,
      propertyDataV,
      rentalDataV,
      totalVirtualGains,
      profDataV,
      busDataV,
      profitV,
      tdsincomeV,
      shortTermV,
      longTermV,
    ].reduce((sum, value) => sum + Number(value), 0);

    const grossIncomeAfterDeductions = Math.max(
      grossIncome - totalDeductions,
      0
    );
    const taxableIncome = roundToNearestTen(grossIncomeAfterDeductions);

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

    // Calculate tax liability
    const {
      incomeTaxAtNormalRates,
      healthAndEducationCess,
      totalTaxLiability,
    } = calculateTaxLiability(grossIncomeAfterDeductions, taxSlabsNewRegime);

    const itrType = identifyItrType(
      grossIncome,
      stockMutualData,
      foreignData,
      landData,
      bondData,
      goldData,
      stockRsuData,
      longSData,
      professData,
      busData
    );

    res.status(200).json({
      success: true,
      grossIncome,
      taxableIncome,
      incomeTaxAtNormalRates,
      healthAndEducationCess,
      taxLiability: totalTaxLiability,
      taxPaid: totalTax,
      taxDue: totalTaxLiability - totalTax,
      totalTaxI: totalTaxLiability,
      itrType,
      totalDeductions,
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
