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
} = require("../helper/IncomeCalculator/IntererstIncome");
const { getTotalTaxPaid } = require("../helper/IncomeCalculator/taxPaid");

// Function to round to the nearest 10
function roundToNearestTen(value) {
  return Math.round(value / 10) * 10;
}

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

    // Prepare interest array
    const interestArray = Array.isArray(interestData.data)
      ? interestData.data
      : [];

    const dividenData = await getDivdendData(userId);

    // Calculate total stock data (ensure no negative values are added)
    const stockData = stockMututaldata.data
      ? stockMututaldata.data.reduce(
          (sum, item) => sum + (item.totalProfit > 0 ? item.totalProfit : 0),
          0
        ) || 0
      : 0;

    // Calculate total interest income (ensure no negative values are added)
    const totalInterestIncome = interestArray.reduce((sum, item) => {
      if (item.data && Array.isArray(item.data)) {
        const amount = item.data[0]?.amount || 0; // Adjust based on your data structure
        return sum + (amount > 0 ? amount : 0);
      }
      return sum;
    }, 0);

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
    const tdsincomeV = tdsIncome.data
      ? tdsIncome.data[0]?.balance > 50000
        ? tdsIncome.data[0].balance - 50000
        : 0
      : 0;

    let totalVirtualGains = 0;

    if (virtualData?.success && Array.isArray(virtualData.data)) {
      totalVirtualGains = virtualData.data.reduce((sum, item) => {
        return sum + (item.totalGains > 0 ? item.totalGains : 0);
      }, 0);
    }

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

    // Round gross income to the nearest 10 to get taxable income
    const taxableIncome = roundToNearestTen(grossIncome);

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

    // Calculate tax liability (Income Tax at Normal Rates)
    let incomeTaxAtNormalRates = 0;

    for (let i = 0; i < taxSlabsNewRegime.length; i++) {
      const { limit, rate } = taxSlabsNewRegime[i];
      const previousLimit = taxSlabsNewRegime[i - 1]?.limit || 0;

      if (taxableIncome > limit) {
        incomeTaxAtNormalRates += (limit - previousLimit) * rate;
      } else {
        incomeTaxAtNormalRates += (taxableIncome - previousLimit) * rate;
        break;
      }
    }

    // Include Health and Education Cess @ 4%
    const healthAndEducationCess = incomeTaxAtNormalRates * 0.04;

    console.log("inceome tax", incomeTaxAtNormalRates);
    console.log("Health ", healthAndEducationCess);
    // Calculate total tax liability
    const totalTaxLiability = roundToNearestTen(
      incomeTaxAtNormalRates + healthAndEducationCess
    );

    const taxDue = totalTaxLiability - totalTax;

    const totalTaxI = roundToNearestTen(
      incomeTaxAtNormalRates + healthAndEducationCess
    );
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
      totalTaxI,
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
