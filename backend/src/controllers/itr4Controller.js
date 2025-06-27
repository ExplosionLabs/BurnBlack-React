const PersonalDetail = require("../model/personalDetailModel");
const User = require("../model/User");
const AddressDetail = require("../model/addressDetail");
const BankDetail = require("../model/bankDetail");
const Form16Data = require("../model/form16Data");
const DividendIncome = require("../model/dividentIncome");
const IncomeInterest = require("../model/IncomeInterest");
const FinanceParticular = require("../model/FinanceParticular");
const GSTData = require("../model/GSTData");

// Import Donation Models
const Donation80G = require("../model/TaxSaving/TaxSavingDeduction/Donation/80GDonation");
const PoliticalContribution = require("../model/TaxSaving/TaxSavingDeduction/Donation/PoliticalContribution");

// Import Medical Insurance Models
const Medical80D = require("../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/MedicalInsuranece");
const Disability = require("../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/Disablility");
const SpecificDiseases = require("../model/TaxSaving/TaxSavingDeduction/MedicalInsuration/SpecficDiseasDisablity");

// Import Tax Payment Models
const NonSalary = require("../model/TaxSaving/TaxPaid/NonSalary");
const SelfTaxPaid = require("../model/TaxSaving/TaxPaid/SelfTaxPaid");
const TaxCollected = require("../model/TaxSaving/TaxPaid/taxCollected");
const TDSRent = require("../model/TaxSaving/TaxPaid/TDSRent");

const generateITR4 = async (req, res) => {
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
      financeParticulars,
      gstData,
      medicalInsurance,
      donation80G,
      politicalContribution,
      disability,
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
      FinanceParticular.findOne({ userId }),
      GSTData.findOne({ userId }),
      Medical80D.findOne({ userId }),
      Donation80G.findOne({ userId }),
      PoliticalContribution.findOne({ userId }),
      Disability.findOne({ userId }),
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

    // Prepare TDS, TCS, and Tax Payment details
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

    // Calculate total taxes
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

    // Prepare business income details from finance particulars and GST data
    const businessIncome = financeParticulars
      ? {
          GrossTurnover: financeParticulars.grossTurnover || 0,
          NetProfit: financeParticulars.netProfit || 0,
          TotalExpenses: financeParticulars.totalExpenses || 0,
          GSTNumber: gstData?.gstNumber || "",
        }
      : null;

    const itr4Json = {
      ITR: {
        ITR4: {
          CreationInfo: {
            SWVersionNo: "1.0",
            SWCreatedBy: "SW12345678",
            JSONCreatedBy: "SW12345678",
            JSONCreationDate: currentDate,
            IntermediaryCity: addressDetails?.city || "Delhi",
            Digest: "-",
          },
          Form_ITR4: {
            FormName: "ITR-4",
            Description: "For Presumptive Business Income",
            AssessmentYear: "2024-25",
          },
          PersonalInfo: {
            AssesseeName: {
              FirstName: personalDetails.firstName,
              MiddleName: personalDetails.middleName,
              LastName: personalDetails.lastName,
            },
            PAN: personalDetails.pan,
            Address: {
              ResidenceNo: addressDetails?.residenceNo || "",
              ResidenceName: addressDetails?.residenceName || "",
              RoadStreet: addressDetails?.street || "",
              LocalityArea: addressDetails?.locality || "",
              CityTown: addressDetails?.city || "",
              StateCode: addressDetails?.state || "",
              CountryCode: "91",
              PinCode: addressDetails?.pinCode || "",
              Phone: addressDetails?.mobile || "",
              EmailAddress: user.email || "",
            },
            DOB: personalDetails.dateOfBirth,
            Status: "I", // Individual
            AadhaarCardNo: personalDetails.aadhaarNumber || "",
          },
          FilingStatus: {
            ReturnFileSec: "11",
            NewTaxRegime: "N", // Default to old tax regime
            ResidentialStatus: personalDetails.residentialStatus || "RES",
          },
          IncomeDeductions: {
            BusinessProfInc44AD: businessIncome?.NetProfit || 0,
            GrossTurnover44AD: businessIncome?.GrossTurnover || 0,
            IncFromOtherSources: {
              InterestIncome: interestIncome?.amount || 0,
              DividendIncome: dividendIncome?.amount || 0,
            },
            DeductionUs80C: 0, // To be calculated based on investments
            DeductionUs80D: medicalInsurance?.premiumAmount || 0,
            TotalChapVIADeductions: 0, // To be calculated
          },
          TaxComputation: {
            TotalTaxPayable: 0, // To be calculated based on income
            TotalTaxesPaid: totalTaxesPaid,
            BalTaxPayable: -totalTaxesPaid,
          },
          TaxPaid: {
            TDS: {
              TDSonOthThanSals: TDSonOthThanSalsList,
              TDS3Details: ScheduleTDS3DtlsList,
            },
            TCS: ScheduleTCSList,
            Taxes: TaxPaymentsList,
          },
          ScheduleBP: businessIncome
            ? {
                BusinessIncome44AD: {
                  GSTNo: businessIncome.GSTNumber,
                  GrossTurnover: businessIncome.GrossTurnover,
                  PresumptiveIncome: businessIncome.NetProfit,
                },
              }
            : {},
          Verification: {
            Declaration: {
              AssesseeVerName: `${personalDetails.firstName} ${personalDetails.lastName}`,
              Place: addressDetails?.city || "",
              Date: currentDate,
              Capacity: "SELF",
            },
          },
        },
      },
    };

    res.json(itr4Json);
  } catch (error) {
    console.error("Error generating ITR-4 JSON:", error);
    res.status(500).json({ message: "Error generating ITR-4 JSON" });
  }
};

module.exports = {
  generateITR4,
};
