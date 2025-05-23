const PersonalDetail = require("../model/personalDetailModel");
const User = require("../model/User");
const AddressDetail = require("../model/addressDetail");
const BankDetail = require("../model/bankDetail");
const Form16Data = require("../model/form16Data");
const DividendIncome = require("../model/dividentIncome");
const IncomeInterest = require("../model/IncomeInterest");
const RentalIncome = require("../model/rentalModel");
const PropertyModel = require("../model/propertyModel");

// Import Donation Models
const Donation80G = require("../model/TaxSaving/TaxSavingDeduction/Donation/80GDonation");
const RuralDonation = require("../model/TaxSaving/TaxSavingDeduction/Donation/RuralDonation80GG");
const PoliticalContribution = require("../model/TaxSaving/TaxSavingDeduction/Donation/PoliticalContribution");

// Import Other Deduction Models
const OtherDeduction = require("../model/TaxSaving/TaxSavingDeduction/OtherDeduction/OtherDeduction");

// Import Tax Loss Models
const DepreciationLoss = require("../model/TaxSaving/TaxLoss/DeprectationLoss");

const RuralDonation80GG = require("../model/TaxSaving/TaxSavingDeduction/Donation/RuralDonation80GG");
const Loan = require("../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/Loan");
const Disablility = require("../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/Disablility");
const SpecificDiseases = require("../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/SpecficDiseasDisablity");
const NonSalary = require("../model/TaxSaving/TaxPaid/NonSalary");
const SelfTaxPaid = require("../model/TaxSaving/TaxPaid/SelfTaxPaid");
const TaxCollected = require("../model/TaxSaving/TaxPaid/taxCollected");
const TDSRent = require("../model/TaxSaving/TaxPaid/TDSRent");
const Medical80D = require("../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/MedicalInsuranece");
// Full generateITR2 with Medical + TaxPaid integration
const generateITR2 = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [
      user,
      personalDetails,
      addressDetails,
      bankDetails,
      form16Data,
      dividendIncome,
      interestIncome,
      rentalIncome,
      propertyDetails,
      medicalInsurance,
      donation80G,
      ruralDonation,
      politicalContribution,
      otherDeduction,
      depreciationLoss,

      disability,
      loans,
      specificDiseases,
      nonSalary,
      selfTaxPaid,
      taxCollected,
      tdsRent,
    ] = await Promise.all([
      User.findById(userId),
      PersonalDetail.findOne({ userId }),
      AddressDetail.findOne({ userId }),
      BankDetail.findOne({ userId }),
      Form16Data.findOne({ userId }),
      DividendIncome.findOne({ userId }),
      IncomeInterest.findOne({ userId }),
      RentalIncome.findOne({ userId }),
      PropertyModel.findOne({ userId }),
      Medical80D.findOne({ userId }),
      Donation80G.findOne({ userId }),
      RuralDonation80GG.findOne({ userId }),
      PoliticalContribution.findOne({ userId }),
      OtherDeduction.findOne({ userId }),
      DepreciationLoss.findOne({ userId }),

      Disablility.findOne({ userId }),
      Loan.findOne({ userId }),
      SpecificDiseases.findOne({ userId }),
      NonSalary.find({ userId }),
      SelfTaxPaid.find({ userId }),
      TaxCollected.find({ userId }),
      TDSRent.find({ userId }),
    ]);

    if (!user || !personalDetails) {
      return res.status(404).json({ message: "User data not found" });
    }

    const currentDate = new Date().toISOString().split("T")[0];

    const TDSonOthThanSalsList = nonSalary.map((e) => ({
      TAN: e.tan || "",
      Name: e.name || "",
      IncomeAgainstTDS: e.incomeAgainstTDS || 0,
      TaxDeducted: e.tdsCredit || 0,
      TaxClaimedThisYear: e.taxClaimed || 0,
    }));

    const ScheduleTDS3DtlsList = tdsRent.map((e) => ({
      PAN: e.pan || "",
      Name: e.name || "",
      IncomeAgainstTDS: e.incomeAgainstTDS || 0,
      TaxDeducted: e.tdsCredit || 0,
      TaxClaimedThisYear: e.taxClaimed || 0,
    }));

    const ScheduleTCSList = taxCollected.map((e) => ({
      TAN: e.tan || "",
      Name: e.name || "",
      AmountCollected: e.totalTax || 0,
      TCSClaimedThisYear: e.taxClaimed || 0,
    }));

    const TaxPaymentsList = selfTaxPaid.map((e) => ({
      BSRCode: e.bsrCode || "",
      DateDep: e.date?.toISOString().split("T")[0] || "",
      ChallanSerialNo: e.challanSerialNo || "",
      Amt: e.amount || 0,
    }));

    const totalTDS =
      TDSonOthThanSalsList.reduce(
        (s, t) => s + (t.TaxClaimedThisYear || 0),
        0
      ) +
      ScheduleTDS3DtlsList.reduce((s, t) => s + (t.TaxClaimedThisYear || 0), 0);
    const totalTCS = ScheduleTCSList.reduce(
      (s, t) => s + (t.TCSClaimedThisYear || 0),
      0
    );
    const totalSelfTax = TaxPaymentsList.reduce((s, t) => s + (t.Amt || 0), 0);

    const totalTaxesPaid = totalTDS + totalTCS + totalSelfTax;

    const itr2Json = {
      ITR: {
        ITR2: {
          PartB_TTI: {
            TotalTaxPayable: 0,
            TotalTaxesPaid: totalTaxesPaid,
            BalTaxPayable: -totalTaxesPaid,
          },
          ScheduleTDS2: {
            TDSonOthThanSals: TDSonOthThanSalsList,
          },
          ScheduleTDS3Dtls: {
            TDS3Details: ScheduleTDS3DtlsList,
          },
          ScheduleTCS: {
            TCS: ScheduleTCSList,
          },
          TaxPayments: {
            Taxes: TaxPaymentsList,
            TotalTaxPayments: totalSelfTax,
          },
          Verification: {
            Declaration: {
              AssesseeVerName: `${personalDetails.firstName} ${personalDetails.lastName}`,
              Place: addressDetails.city || "",
              Date: currentDate,
            },
          },
        },
      },
    };

    res.json(itr2Json);
  } catch (error) {
    console.error("Error generating ITR-2 JSON:", error);
    res.status(500).json({ message: "Error generating ITR-2 JSON" });
  }
};

module.exports = {
  generateITR2,
};
