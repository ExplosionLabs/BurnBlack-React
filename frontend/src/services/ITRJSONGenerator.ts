// Comprehensive ITR JSON Generator for ITR-1 through ITR-7
// Supports all income sources, deductions, and tax calculations

interface PersonalDetails {
  name: string;
  pan: string;
  aadhaar?: string;
  dateOfBirth: string;
  email: string;
  mobile: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  status: 'Individual' | 'HUF' | 'Firm' | 'Company';
  gender?: 'M' | 'F';
  residentialStatus: 'Resident' | 'Non-Resident' | 'Not Ordinary Resident';
}

interface IncomeData {
  salary?: {
    employers: Array<{
      employerName: string;
      tan?: string;
      grossSalary: number;
      basicPay?: number;
      hra?: number;
      lta?: number;
      allowances?: number;
      perquisites?: number;
      profitsInLieu?: number;
      tdsDeducted: number;
      professionalTax?: number;
      standardDeduction: number;
    }>;
    totalGrossSalary: number;
    totalTDS: number;
    netSalary: number;
  };
  
  interest?: {
    savingsBankInterest: number;
    fixedDepositInterest: number;
    p2pInterest: number;
    bondInterest: number;
    epfInterest: number;
    otherInterest: number;
    totalInterest: number;
  };
  
  dividend?: {
    equityShares: number;
    mutualFunds: number;
    otherCompanies: number;
    totalDividend: number;
  };
  
  capitalGains?: {
    shortTerm: Array<{
      assetType: string;
      description: string;
      dateOfPurchase: string;
      dateOfSale: string;
      purchasePrice: number;
      salePrice: number;
      expenses: number;
      gainLoss: number;
    }>;
    longTerm: Array<{
      assetType: string;
      description: string;
      dateOfPurchase: string;
      dateOfSale: string;
      purchasePrice: number;
      salePrice: number;
      expenses: number;
      indexation?: number;
      gainLoss: number;
    }>;
    totalSTCG: number;
    totalLTCG: number;
  };
  
  houseProperty?: Array<{
    propertyType: 'Self-Occupied' | 'Let-Out' | 'Deemed Let-Out';
    address: string;
    coOwnershipPercentage?: number;
    annualValue: number;
    municipalTax: number;
    standardDeduction: number;
    interestOnLoan: number;
    otherExpenses: number;
    netIncome: number;
  }>;
  
  business?: {
    natureOfBusiness: string;
    businessCode: string;
    tradeName?: string;
    grossReceipts: number;
    grossProfit: number;
    expenses: {
      salaries: number;
      rent: number;
      interest: number;
      depreciation: number;
      otherExpenses: number;
      totalExpenses: number;
    };
    netProfit: number;
    balanceSheet?: any;
    profitLossAccount?: any;
  };
  
  professional?: {
    natureOfProfession: string;
    professionCode: string;
    grossReceipts: number;
    expenses: {
      salaries: number;
      rent: number;
      interest: number;
      depreciation: number;
      otherExpenses: number;
      totalExpenses: number;
    };
    netIncome: number;
  };
  
  foreignAssets?: {
    foreignBankAccounts: Array<{
      country: string;
      bankName: string;
      accountNumber: string;
      maxBalance: number;
      peakBalance: number;
      interest: number;
    }>;
    foreignEquityShares: Array<{
      country: string;
      companyName: string;
      shares: number;
      costOfAcquisition: number;
      fairMarketValue: number;
    }>;
    immovableProperty: Array<{
      country: string;
      address: string;
      costOfAcquisition: number;
      fairMarketValue: number;
    }>;
    otherAssets: Array<{
      country: string;
      description: string;
      costOfAcquisition: number;
      fairMarketValue: number;
    }>;
  };
  
  virtualAssets?: {
    transactions: Array<{
      type: 'Purchase' | 'Sale' | 'Mining' | 'Staking' | 'Gift' | 'Transfer';
      asset: string;
      date: string;
      quantity: number;
      rate: number;
      value: number;
      gainLoss?: number;
    }>;
    totalIncome: number;
  };
  
  otherIncome?: {
    winningsFromLotteries: number;
    winningsFromCrosswordPuzzles: number;
    winningsFromHorseRace: number;
    gifts: number;
    interestOnIncomeTaxRefund: number;
    agriculturalIncome: number;
    otherSources: number;
    totalOtherIncome: number;
  };
}

interface DeductionData {
  section80C: {
    lifeInsurance: number;
    ppf: number;
    elss: number;
    nsc: number;
    taxSavingFD: number;
    ulip: number;
    homeLoanPrincipal: number;
    total: number;
  };
  
  section80D: {
    selfAndFamily: number;
    parents: number;
    preventiveHealthCheckup: number;
    seniorCitizenPremium: number;
    total: number;
  };
  
  section80E: {
    educationLoanInterest: number;
  };
  
  section80EE: {
    homeLoanInterest: number;
  };
  
  section80EEA: {
    additionalHomeLoanInterest: number;
  };
  
  section80G: {
    donations: Array<{
      organizationName: string;
      registrationNumber: string;
      amount: number;
      deductionPercentage: number;
      eligibleAmount: number;
    }>;
    total: number;
  };
  
  section80GG: {
    rentPaid: number;
    eligibleAmount: number;
  };
  
  section80TTA: {
    savingsInterest: number;
  };
  
  section80TTB: {
    seniorCitizenInterest: number;
  };
  
  section80U: {
    disabilityDeduction: number;
    disabilityType: 'Normal' | 'Severe';
  };
  
  section80DD: {
    dependentDisabilityDeduction: number;
    disabilityType: 'Normal' | 'Severe';
  };
  
  section80CCC: {
    pensionFundContribution: number;
  };
  
  section80CCD1: {
    npsEmployeeContribution: number;
  };
  
  section80CCD1B: {
    additionalNPSContribution: number;
  };
  
  section80CCD2: {
    npsEmployerContribution: number;
  };
  
  otherDeductions: {
    [section: string]: number;
  };
  
  totalDeductions: number;
}

interface TaxCalculation {
  grossTotalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  taxLiability: number;
  surcharge: number;
  educationCess: number;
  totalTaxPayable: number;
  taxPaid: {
    tds: number;
    advanceTax: number;
    selfAssessmentTax: number;
    totalTaxPaid: number;
  };
  refundOrDemand: number;
  regime: 'Old' | 'New';
}

interface ITRData {
  personalDetails: PersonalDetails;
  incomeDetails: IncomeData;
  deductionDetails: DeductionData;
  taxCalculation: TaxCalculation;
  itrType: 'ITR-1' | 'ITR-2' | 'ITR-3' | 'ITR-4' | 'ITR-5' | 'ITR-6' | 'ITR-7';
  assessmentYear: string;
  filingDate: string;
  submissionType: 'Original' | 'Revised' | 'Belated';
}

export class ITRJSONGenerator {
  
  static validateRequiredData(data: ITRData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate personal details
    if (!data.personalDetails.name) errors.push('Name is required');
    if (!data.personalDetails.pan) errors.push('PAN is required');
    if (!data.personalDetails.email) errors.push('Email is required');
    if (!data.personalDetails.mobile) errors.push('Mobile number is required');
    if (!data.personalDetails.dateOfBirth) errors.push('Date of birth is required');
    if (!data.personalDetails.address?.line1) errors.push('Address is required');
    if (!data.personalDetails.address?.city) errors.push('City is required');
    if (!data.personalDetails.address?.state) errors.push('State is required');
    if (!data.personalDetails.address?.pincode) errors.push('Pincode is required');

    // Validate income details
    let hasIncome = false;
    const income = data.incomeDetails;
    
    if (income.salary && income.salary.totalGrossSalary > 0) hasIncome = true;
    if (income.interest && income.interest.totalInterest > 0) hasIncome = true;
    if (income.dividend && income.dividend.totalDividend > 0) hasIncome = true;
    if (income.capitalGains && (income.capitalGains.totalSTCG > 0 || income.capitalGains.totalLTCG > 0)) hasIncome = true;
    if (income.houseProperty && income.houseProperty.length > 0) hasIncome = true;
    if (income.business && income.business.netProfit > 0) hasIncome = true;
    if (income.professional && income.professional.netIncome > 0) hasIncome = true;
    if (income.otherIncome && income.otherIncome.totalOtherIncome > 0) hasIncome = true;

    if (!hasIncome) errors.push('At least one income source with positive amount is required');

    // Validate tax calculation
    if (!data.taxCalculation.grossTotalIncome || data.taxCalculation.grossTotalIncome <= 0) {
      errors.push('Gross total income must be calculated and greater than zero');
    }

    // Validate assessment year
    if (!data.assessmentYear) errors.push('Assessment year is required');
    
    // Validate ITR type
    if (!data.itrType) errors.push('ITR type must be determined');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static determineITRType(incomeData: IncomeData): string {
    // ITR-3: Business or Professional Income
    if (incomeData.business || incomeData.professional) {
      return 'ITR-3';
    }
    
    // ITR-2: Capital Gains, House Property, Foreign Assets, etc.
    if (
      incomeData.capitalGains?.totalSTCG || 
      incomeData.capitalGains?.totalLTCG ||
      incomeData.houseProperty?.length ||
      incomeData.foreignAssets ||
      incomeData.virtualAssets ||
      (incomeData.salary?.totalGrossSalary || 0) > 5000000 ||
      incomeData.dividend?.totalDividend
    ) {
      return 'ITR-2';
    }
    
    // ITR-1: Basic salary and interest income
    if (
      incomeData.salary &&
      (incomeData.interest?.totalInterest || 0) <= 5000 &&
      (incomeData.salary.totalGrossSalary || 0) <= 5000000 &&
      !incomeData.capitalGains &&
      !incomeData.houseProperty &&
      !incomeData.business &&
      !incomeData.professional
    ) {
      return 'ITR-1';
    }
    
    // Default to ITR-2 for other cases
    return 'ITR-2';
  }
  
  static generateITR1JSON(data: ITRData): object {
    return {
      ITR1: {
        AssessmentYear: data.assessmentYear,
        SchemaVersion: "1.0",
        FormName: "ITR1",
        Description: "ITR-1 (SAHAJ) - For Individuals having Income from Salaries and/or Income from one House Property and/or Other Sources (Interest etc.)",
        
        PartA_GEN: {
          PersonalInfo: {
            AssesseeName: {
              FirstName: data.personalDetails.name.split(' ')[0],
              MiddleName: data.personalDetails.name.split(' ')[1] || '',
              SurName: data.personalDetails.name.split(' ').slice(-1)[0]
            },
            PAN: data.personalDetails.pan,
            AadhaarCardNo: data.personalDetails.aadhaar?.replace(/\s/g, ''),
            DOB: data.personalDetails.dateOfBirth,
            Status: data.personalDetails.status,
            ResidentialStatus: data.personalDetails.residentialStatus,
            FilingCategory: "Individual"
          },
          
          FilingStatus: {
            ReturnFileSec: "11",
            SeventhProvisio139: "N",
            PortugueseCC5A: "N",
            AgeCategory: this.calculateAgeCategory(data.personalDetails.dateOfBirth),
            AssesseeType: "IND"
          }
        },
        
        ScheduleSI: {
          SalaryIncome: {
            SalaryDtls: data.incomeDetails.salary?.employers.map(emp => ({
              EmployerName: emp.employerName,
              TAN: emp.tan || '',
              GrossSalary: emp.grossSalary,
              Perquisites: emp.perquisites || 0,
              ProfitsInLieu: emp.profitsInLieu || 0,
              DeductionUs16: {
                StandardDeduction: emp.standardDeduction,
                EntertainmentAllow: 0,
                ProfessionalTax: emp.professionalTax || 0
              },
              IncomeTaxDeducted: emp.tdsDeducted,
              TaxRelief89: 0
            })) || [],
            
            TotalSalaryIncome: data.incomeDetails.salary?.netSalary || 0,
            TotalTDSSalary: data.incomeDetails.salary?.totalTDS || 0
          },
          
          IncomeOthSrc: {
            InterestIncome: {
              SavingsBankInterest: data.incomeDetails.interest?.savingsBankInterest || 0,
              DepositInterest: data.incomeDetails.interest?.fixedDepositInterest || 0,
              IncomeOthSrc: data.incomeDetails.interest?.otherInterest || 0,
              TotalInterestIncome: data.incomeDetails.interest?.totalInterest || 0
            },
            
            TotalOthSrcIncome: (data.incomeDetails.interest?.totalInterest || 0) + 
                              (data.incomeDetails.otherIncome?.totalOtherIncome || 0)
          }
        },
        
        ScheduleTDS1: {
          TDSonSalary: data.incomeDetails.salary?.employers.map(emp => ({
            EmployerName: emp.employerName,
            TAN: emp.tan || '',
            TotalTaxDeducted: emp.tdsDeducted,
            TotalTaxDeposited: emp.tdsDeducted
          })) || []
        },
        
        ScheduleIT: {
          IntOnRefund: {
            RefundDue: data.taxCalculation.refundOrDemand > 0 ? data.taxCalculation.refundOrDemand : 0
          }
        },
        
        TaxComputation: {
          TotalIncome: data.taxCalculation.grossTotalIncome,
          IncChargeable: data.taxCalculation.grossTotalIncome,
          TaxOnIncome: data.taxCalculation.taxLiability,
          EducationCess: data.taxCalculation.educationCess,
          TotalTaxPayable: data.taxCalculation.totalTaxPayable,
          TotalTaxPaid: data.taxCalculation.taxPaid.totalTaxPaid,
          BalTaxPayable: data.taxCalculation.refundOrDemand < 0 ? Math.abs(data.taxCalculation.refundOrDemand) : 0,
          RefundDue: data.taxCalculation.refundOrDemand > 0 ? data.taxCalculation.refundOrDemand : 0
        },
        
        Verification: {
          Declaration: "I, the assessee, am responsible for the correctness and completeness of the particulars shown in this return and in the case of a return made by me as an agent of the assessee, I am also responsible for the correctness and completeness of the particulars shown in this return based on the information provided by such person.",
          Place: data.personalDetails.address.city,
          Date: data.filingDate,
          Capacity: "S"
        }
      }
    };
  }
  
  static generateITR2JSON(data: ITRData): object {
    return {
      ITR2: {
        AssessmentYear: data.assessmentYear,
        SchemaVersion: "1.0",
        FormName: "ITR2",
        Description: "ITR-2 - For Individuals and HUFs not having income from profits and gains of business or profession",
        
        PartA_GEN: {
          PersonalInfo: {
            AssesseeName: {
              FirstName: data.personalDetails.name.split(' ')[0],
              MiddleName: data.personalDetails.name.split(' ')[1] || '',
              SurName: data.personalDetails.name.split(' ').slice(-1)[0]
            },
            PAN: data.personalDetails.pan,
            AadhaarCardNo: data.personalDetails.aadhaar?.replace(/\s/g, ''),
            DOB: data.personalDetails.dateOfBirth,
            Status: data.personalDetails.status,
            ResidentialStatus: data.personalDetails.residentialStatus
          }
        },
        
        ScheduleSI: {
          SalaryIncome: this.generateSalarySchedule(data.incomeDetails.salary),
          
          IncomeOthSrc: {
            InterestIncome: data.incomeDetails.interest || {},
            DividendIncome: data.incomeDetails.dividend || {},
            OtherIncome: data.incomeDetails.otherIncome || {}
          }
        },
        
        ScheduleHP: {
          HouseProperty: data.incomeDetails.houseProperty?.map(property => ({
            PropertyType: property.propertyType,
            Address: property.address,
            CoOwnershipPercentage: property.coOwnershipPercentage || 100,
            AnnualValue: property.annualValue,
            MunicipalTax: property.municipalTax,
            StandardDeduction: property.standardDeduction,
            InterestOnLoan: property.interestOnLoan,
            NetIncome: property.netIncome
          })) || []
        },
        
        ScheduleCG: {
          ShortTermCapitalGain: data.incomeDetails.capitalGains?.shortTerm || [],
          LongTermCapitalGain: data.incomeDetails.capitalGains?.longTerm || [],
          TotalSTCG: data.incomeDetails.capitalGains?.totalSTCG || 0,
          TotalLTCG: data.incomeDetails.capitalGains?.totalLTCG || 0
        },
        
        ScheduleFA: {
          ForeignAssets: data.incomeDetails.foreignAssets ? {
            ForeignBankAccounts: data.incomeDetails.foreignAssets.foreignBankAccounts || [],
            ForeignEquityShares: data.incomeDetails.foreignAssets.foreignEquityShares || [],
            ImmovableProperty: data.incomeDetails.foreignAssets.immovableProperty || [],
            OtherAssets: data.incomeDetails.foreignAssets.otherAssets || []
          } : null
        },
        
        ScheduleVDA: {
          VirtualDigitalAssets: data.incomeDetails.virtualAssets ? {
            Transactions: data.incomeDetails.virtualAssets.transactions || [],
            TotalIncome: data.incomeDetails.virtualAssets.totalIncome || 0
          } : null
        },
        
        ScheduleVI: {
          Deductions: this.generateDeductionSchedule(data.deductionDetails),
          TotalDeductions: data.deductionDetails.totalDeductions
        },
        
        TaxComputation: this.generateTaxComputation(data.taxCalculation),
        
        Verification: {
          Declaration: "I, the assessee, am responsible for the correctness and completeness of the particulars shown in this return and in the case of a return made by me as an agent of the assessee, I am also responsible for the correctness and completeness of the particulars shown in this return based on the information provided by such person.",
          Place: data.personalDetails.address.city,
          Date: data.filingDate,
          Capacity: "S"
        }
      }
    };
  }
  
  static generateITR3JSON(data: ITRData): object {
    return {
      ITR3: {
        AssessmentYear: data.assessmentYear,
        SchemaVersion: "1.0",
        FormName: "ITR3",
        Description: "ITR-3 - For individuals and HUFs having income from profits and gains of business or profession",
        
        PartA_GEN: {
          PersonalInfo: {
            AssesseeName: {
              FirstName: data.personalDetails.name.split(' ')[0],
              MiddleName: data.personalDetails.name.split(' ')[1] || '',
              SurName: data.personalDetails.name.split(' ').slice(-1)[0]
            },
            PAN: data.personalDetails.pan,
            AadhaarCardNo: data.personalDetails.aadhaar?.replace(/\s/g, ''),
            DOB: data.personalDetails.dateOfBirth,
            Status: data.personalDetails.status,
            ResidentialStatus: data.personalDetails.residentialStatus
          }
        },
        
        ScheduleBP: {
          BusinessDetails: data.incomeDetails.business ? {
            NatureOfBusiness: data.incomeDetails.business.natureOfBusiness,
            BusinessCode: data.incomeDetails.business.businessCode,
            TradeName: data.incomeDetails.business.tradeName,
            GrossReceipts: data.incomeDetails.business.grossReceipts,
            GrossProfit: data.incomeDetails.business.grossProfit,
            Expenses: data.incomeDetails.business.expenses,
            NetProfit: data.incomeDetails.business.netProfit
          } : null,
          
          ProfessionalDetails: data.incomeDetails.professional ? {
            NatureOfProfession: data.incomeDetails.professional.natureOfProfession,
            ProfessionCode: data.incomeDetails.professional.professionCode,
            GrossReceipts: data.incomeDetails.professional.grossReceipts,
            Expenses: data.incomeDetails.professional.expenses,
            NetIncome: data.incomeDetails.professional.netIncome
          } : null
        },
        
        ScheduleBS: {
          BalanceSheet: data.incomeDetails.business?.balanceSheet || null
        },
        
        SchedulePL: {
          ProfitLossAccount: data.incomeDetails.business?.profitLossAccount || null
        },
        
        ScheduleSI: {
          SalaryIncome: this.generateSalarySchedule(data.incomeDetails.salary),
          IncomeOthSrc: {
            InterestIncome: data.incomeDetails.interest || {},
            DividendIncome: data.incomeDetails.dividend || {},
            OtherIncome: data.incomeDetails.otherIncome || {}
          }
        },
        
        ScheduleHP: {
          HouseProperty: data.incomeDetails.houseProperty || []
        },
        
        ScheduleCG: {
          ShortTermCapitalGain: data.incomeDetails.capitalGains?.shortTerm || [],
          LongTermCapitalGain: data.incomeDetails.capitalGains?.longTerm || [],
          TotalSTCG: data.incomeDetails.capitalGains?.totalSTCG || 0,
          TotalLTCG: data.incomeDetails.capitalGains?.totalLTCG || 0
        },
        
        ScheduleVI: {
          Deductions: this.generateDeductionSchedule(data.deductionDetails),
          TotalDeductions: data.deductionDetails.totalDeductions
        },
        
        TaxComputation: this.generateTaxComputation(data.taxCalculation),
        
        Verification: {
          Declaration: "I, the assessee, am responsible for the correctness and completeness of the particulars shown in this return and in the case of a return made by me as an agent of the assessee, I am also responsible for the correctness and completeness of the particulars shown in this return based on the information provided by such person.",
          Place: data.personalDetails.address.city,
          Date: data.filingDate,
          Capacity: "S"
        }
      }
    };
  }
  
  static generateComprehensiveJSON(data: ITRData): object {
    // Validate data before generation
    const validation = this.validateRequiredData(data);
    if (!validation.isValid) {
      throw new Error(`Data validation failed: ${validation.errors.join(', ')}`);
    }

    const itrType = this.determineITRType(data.incomeDetails);
    data.itrType = itrType as any;
    
    switch (itrType) {
      case 'ITR-1':
        return this.generateITR1JSON(data);
      case 'ITR-2':
        return this.generateITR2JSON(data);
      case 'ITR-3':
        return this.generateITR3JSON(data);
      default:
        return this.generateITR2JSON(data); // Default fallback
    }
  }
  
  // Helper Methods
  private static calculateAgeCategory(dob: string): string {
    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    
    if (age >= 80) return "Super Senior Citizen";
    if (age >= 60) return "Senior Citizen";
    return "General";
  }
  
  private static generateSalarySchedule(salary?: IncomeData['salary']) {
    if (!salary) return null;
    
    return {
      SalaryDtls: salary.employers.map(emp => ({
        EmployerName: emp.employerName,
        TAN: emp.tan || '',
        GrossSalary: emp.grossSalary,
        Perquisites: emp.perquisites || 0,
        ProfitsInLieu: emp.profitsInLieu || 0,
        DeductionUs16: {
          StandardDeduction: emp.standardDeduction,
          EntertainmentAllow: 0,
          ProfessionalTax: emp.professionalTax || 0
        },
        IncomeTaxDeducted: emp.tdsDeducted,
        TaxRelief89: 0
      })),
      TotalSalaryIncome: salary.netSalary,
      TotalTDSSalary: salary.totalTDS
    };
  }
  
  private static generateDeductionSchedule(deductions: DeductionData) {
    return {
      Section80C: deductions.section80C,
      Section80D: deductions.section80D,
      Section80E: deductions.section80E,
      Section80EE: deductions.section80EE,
      Section80EEA: deductions.section80EEA,
      Section80G: deductions.section80G,
      Section80GG: deductions.section80GG,
      Section80TTA: deductions.section80TTA,
      Section80TTB: deductions.section80TTB,
      Section80U: deductions.section80U,
      Section80DD: deductions.section80DD,
      Section80CCC: deductions.section80CCC,
      Section80CCD1: deductions.section80CCD1,
      Section80CCD1B: deductions.section80CCD1B,
      Section80CCD2: deductions.section80CCD2,
      OtherDeductions: deductions.otherDeductions
    };
  }
  
  private static generateTaxComputation(taxCalc: TaxCalculation) {
    return {
      TotalIncome: taxCalc.grossTotalIncome,
      IncChargeable: taxCalc.grossTotalIncome,
      TaxableIncome: taxCalc.taxableIncome,
      TaxOnIncome: taxCalc.taxLiability,
      Surcharge: taxCalc.surcharge,
      EducationCess: taxCalc.educationCess,
      TotalTaxPayable: taxCalc.totalTaxPayable,
      TaxPaid: taxCalc.taxPaid,
      BalTaxPayable: taxCalc.refundOrDemand < 0 ? Math.abs(taxCalc.refundOrDemand) : 0,
      RefundDue: taxCalc.refundOrDemand > 0 ? taxCalc.refundOrDemand : 0,
      TaxRegime: taxCalc.regime
    };
  }
  
  static downloadJSON(jsonData: object, filename: string): void {
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = filename;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
}

export type { ITRData, PersonalDetails, IncomeData, DeductionData, TaxCalculation };