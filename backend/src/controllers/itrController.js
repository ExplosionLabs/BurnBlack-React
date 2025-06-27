const PersonalDetail = require("../model/personalDetailModel");
const User = require("../model/User");
const AddressDetail = require("../model/addressDetail");
const BankDetail = require("../model/bankDetail");
const Form16Data = require("../model/form16Data");
const ContactDetail = require("../model/contactDetail");
const generateITR = async (req, res) => {
  try {
    const userId = req.params.userId;

    const [user, personalDetails, addressDetails, contactDetail] =
      await Promise.all([
        User.findById(userId),
        PersonalDetail.findOne({ userId }),
        AddressDetail.findOne({ userId }),
        ContactDetail.findOne({ userId }),
      ]);

    const currentDate = new Date().toISOString().split("T")[0];

    const itrJson = {
      ITR: {
        ITR1: {
          CreationInfo: {
            SWVersionNo: "1.0",
            SWCreatedBy: "SW00000001",
            JSONCreatedBy: "SW00000001",
            JSONCreationDate: currentDate,
            IntermediaryCity: addressDetails?.city || "Delhi",
            Digest: "-", // Replace with actual digest if needed
          },
          Form_ITR1: {
            FormName: "ITR-1",
            Description:
              "For individuals having Income from Salary/Pension/Family Pension and Interest",
            AssessmentYear: "2024",
            SchemaVer: "Ver1.0",
            FormVer: "Ver1.0",
          },
          PersonalInfo: {
            AssesseeName: {
              FirstName: personalDetails?.firstName || "",
              MiddleName: personalDetails?.middleName || "",
              SurNameOrOrgName: personalDetails?.lastName || "",
            },
            PAN: user?.pan || "ABCDE1234F",
            DOB:
              personalDetails?.dob?.toISOString().split("T")[0] || "1990-01-01",
            Gender: personalDetails?.gender || "M",
            EmployerCategory: "OTH",
            AadhaarCardNo: contactDetail.aadharNumber,
            Address: {
              ResidenceNo: addressDetails?.houseNo || "",
              ResidenceName: addressDetails?.buildingName || "",
              RoadOrStreet: addressDetails?.street || "",
              LocalityOrArea: addressDetails?.locality || "",
              CityOrTownOrDistrict: addressDetails?.city || "",
              StateCode: addressDetails?.state || "01",
              CountryCode: "91",
              PinCode: addressDetails?.pincode || "110001",
              Phone: user?.phone || "9999999999",
              EmailAddress: user?.email || "user@example.com",
            },
          },
          FilingStatus: {
            ReturnFileSec: 11,
            OptOutNewTaxRegime: "N",
            SeventhProvisio139: "N",
            IncrExpAggAmt2LkTrvFrgnCntryFlg: "N",
            IncrExpAggAmt1LkElctrctyPrYrFlg: "N",
            clauseiv7provisio139i: "N",
            ItrFilingDueDate: "2024-07-31",
          },
          ITR1_IncomeDeductions: {
            GrossSalary: 0,
            IncomeNotified89A: 0,
            NetSalary: 0,
            DeductionUs16: 0,
            AnnualValue: 0,
            StandardDeduction: 0,
            IncomeFromSal: 0,
            TotalIncomeOfHP: 0,
            IncomeOthSrc: 0,
            GrossTotIncome: 0,
            UsrDeductUndChapVIA: {},
            DeductUndChapVIA: {},
            TotalIncome: 0,
          },
          ITR1_TaxComputation: {
            TotalTaxPayable: 0,
            Rebate87A: 0,
            TaxPayableOnRebate: 0,
            EducationCess: 0,
            GrossTaxLiability: 0,
            Section89: 0,
            NetTaxLiability: 0,
            TotalIntrstPay: 0,
            IntrstPay: {},
            TotTaxPlusIntrstPay: 0,
          },
          TaxPaid: {
            TaxesPaid: {},
            BalTaxPayable: 0,
          },
          Refund: {
            RefundDue: 0,
            BankAccountDtls: {},
          },
          Verification: {
            Declaration: {
              AssesseeVerName: `${personalDetails?.firstName || ""} ${
                personalDetails?.lastName || ""
              }`,
              Place: addressDetails?.city || "",
              Date: currentDate,
            },
          },
          PartA_139_8A: {
            PAN: user?.pan || "ABCDE1234F",
            Name: `${personalDetails?.firstName || ""} ${
              personalDetails?.lastName || ""
            }`,
            AssessmentYear: "2024",
            PreviouslyFiledForThisAY: "N",
            LaidOutIn_139_8A: "N",
            ITRFormUpdatingInc: "ITR1",
            UpdatedReturnDuringPeriod: "1",
          },
          "PartB-ATI": {
            UpdatedTotInc: 0,
            AmtPayable: 0,
            FeeIncUS234F: 0,
            AggrLiabilityRefund: 0,
            AggrLiabilityNoRefund: 0,
            AddtnlIncTax: 0,
            NetPayable: 0,
            TaxUS140B: 0,
            TaxDue10_11: 0,
            ReleifUS89: 0,
          },
          Schedule80G: {
            TotalDonationsUs80GCash: 0,
            TotalDonationsUs80GOtherMode: 0,
            TotalDonationsUs80G: 0,
            TotalEligibleDonationsUs80G: 0,
          },
          Schedule80GGA: {
            TotalDonationAmtCash80GGA: 0,
            TotalDonationAmtOtherMode80GGA: 0,
            TotalDonationsUs80GGA: 0,
            TotalEligibleDonationAmt80GGA: 0,
          },
          Schedule80GGC: {
            TotalDonationAmtCash80GGC: 0,
            TotalDonationAmtOtherMode80GGC: 0,
            TotalDonationsUs80GGC: 0,
            TotalEligibleDonationAmt80GGC: 0,
          },
          Schedule80D: {
            Sec80DSelfFamSrCtznHealth: {
              SeniorCitizenFlag: "N",
              ParentsSeniorCitizenFlag: "N",
              EligibleAmountOfDedn: 0,
            },
          },
          Schedule80DD: {
            NatureOfDisability: "1",
            DeductionAmount: 0,
            DependentType: "1",
          },
          Schedule80U: {
            NatureOfDisability: "1",
            DeductionAmount: 0,
          },
          TDSonSalaries: {
            TotalTDSonSalaries: 0,
          },
          TDSonOthThanSals: {
            TotalTDSonOthThanSals: 0,
          },
          ScheduleTDS3Dtls: {
            TotalTDS3Details: 0,
          },
          ScheduleTCS: {
            TotalSchTCS: 0,
          },
          TaxPayments: {
            TotalTaxPayments: 0,
          },
          TaxReturnPreparer: {
            TRPName: "",
            TRPPAN: "",
            TRPReImbursement: 0,
            TRPFormNo: "",
            TRPSection: "",
          },
        },
      },
    };

    res.json(itrJson);
  } catch (error) {
    console.error("Error generating ITR JSON:", error);
    res.status(500).json({ message: "Error generating ITR JSON" });
  }
};

module.exports = {
  generateITR,
};
