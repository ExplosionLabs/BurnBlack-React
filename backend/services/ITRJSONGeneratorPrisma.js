// ITR JSON Generator Service for Prisma/PostgreSQL Backend
// Enhanced version implementing the PLATFORM_UPGRADE_PLAN.md specifications

const { PrismaClient } = require('@prisma/client');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const prisma = new PrismaClient();

class ITRJSONGeneratorPrisma {
  constructor(itrType = 'ITR-1', assessmentYear = '2024-25') {
    this.itrType = itrType;
    this.assessmentYear = assessmentYear;
    this.currentDate = new Date().toISOString().split('T')[0];
  }

  // ========================================
  // MAIN ITR GENERATION METHOD
  // ========================================
  
  async generateCompliantJSON(userId) {
    try {
      // 1. Aggregate all user data from PostgreSQL
      const userData = await this.aggregateUserData(userId);
      
      // 2. Validate data completeness
      const validation = await this.validateDataCompleteness(userData);
      if (!validation.isComplete) {
        throw new Error(`Missing required data: ${validation.missingFields.join(', ')}`);
      }

      // 3. Determine appropriate ITR type if not specified
      if (this.itrType === 'AUTO') {
        this.itrType = this.recommendITRType(userData);
      }

      // 4. Generate ITR JSON based on type
      let itrData;
      switch (this.itrType) {
        case 'ITR-1':
          itrData = await this.generateITR1(userData);
          break;
        case 'ITR-2':
          itrData = await this.generateITR2(userData);
          break;
        case 'ITR-3':
          itrData = await this.generateITR3(userData);
          break;
        case 'ITR-4':
          itrData = await this.generateITR4(userData);
          break;
        default:
          throw new Error(`Unsupported ITR type: ${this.itrType}`);
      }

      // 5. Validate against schema
      const schemaValidation = await this.validateAgainstSchema(itrData);
      if (!schemaValidation.isValid) {
        throw new Error(`Schema validation failed: ${schemaValidation.errors.join(', ')}`);
      }

      // 6. Generate metadata
      const fileName = `ITR-${this.itrType}_AY${this.assessmentYear}_${userData.user.contactDetails?.panNumber || 'UNKNOWN'}.json`;
      const checksum = this.generateChecksum(itrData);

      return {
        json: itrData,
        fileName,
        checksum,
        metadata: {
          generatedAt: new Date(),
          itrType: this.itrType,
          assessmentYear: this.assessmentYear,
          userPAN: userData.user.contactDetails?.panNumber,
          userId: userId,
          version: '1.2'
        }
      };

    } catch (error) {
      console.error('ITR JSON Generation Error:', error);
      throw new Error(`ITR Generation Failed: ${error.message}`);
    }
  }

  // ========================================
  // DATA AGGREGATION FROM PRISMA
  // ========================================

  async aggregateUserData(userId) {
    try {
      // Fetch comprehensive user data from PostgreSQL
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          personalDetails: true,
          contactDetails: true,
          bankDetails: true,
          addressDetails: true,
          form16Data: true,
          properties: true,
          capitalGains: true,
          businessIncome: true,
          professionalIncome: true,
          cryptoIncome: true,
          taxSavingInvestments: true,
          donations: true,
          medicalInsurance: true,
          taxPaid: true,
          interestIncome: true,
          dividendIncome: true,
          agriculturalIncome: true,
          exemptIncome: true,
          wallet: {
            include: {
              transactions: true
            }
          },
          taxSummaries: true,
          profitLoss: true,
          balanceSheets: true,
          depreciationEntries: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Calculate aggregated income data
      const incomeData = await this.calculateIncomeAggregates(user);
      const deductionData = await this.calculateDeductionAggregates(user);
      const taxData = await this.calculateTaxData(user);

      return {
        user,
        income: incomeData,
        deductions: deductionData,
        tax: taxData,
        aggregatedAt: new Date()
      };

    } catch (error) {
      console.error('Data aggregation error:', error);
      throw new Error(`Failed to aggregate user data: ${error.message}`);
    }
  }

  // ========================================
  // INCOME CALCULATIONS
  // ========================================

  async calculateIncomeAggregates(user) {
    const income = {
      salary: {
        gross: 0,
        basicSalary: 0,
        hra: 0,
        allowances: 0,
        perquisites: 0,
        standardDeduction: 50000, // FY 2024-25
        netSalary: 0
      },
      houseProperty: {
        annualValue: 0,
        municipalTax: 0,
        standardDeduction: 0,
        interestOnLoan: 0,
        netIncome: 0
      },
      capitalGains: {
        shortTerm: 0,
        longTerm: 0,
        exemptLTCG: 0,
        taxableLTCG: 0
      },
      otherSources: {
        interest: 0,
        dividend: 0,
        other: 0,
        total: 0
      },
      business: {
        turnover: 0,
        grossProfit: 0,
        netProfit: 0,
        presumptiveIncome: 0
      },
      totalIncome: 0
    };

    // Calculate salary income from Form 16 data
    if (user.form16Data && user.form16Data.length > 0) {
      const latestForm16 = user.form16Data[0]; // Most recent
      income.salary.gross = Number(latestForm16.grossSalary) || 0;
      income.salary.basicSalary = Number(latestForm16.grossSalary) * 0.4 || 0; // Assumption
      income.salary.netSalary = income.salary.gross - income.salary.standardDeduction;
    }

    // Calculate house property income
    if (user.properties && user.properties.length > 0) {
      for (const property of user.properties) {
        income.houseProperty.annualValue += Number(property.annualValue) || 0;
        income.houseProperty.municipalTax += Number(property.municipalTax) || 0;
        income.houseProperty.interestOnLoan += Number(property.interestOnLoan) || 0;
      }
      income.houseProperty.standardDeduction = income.houseProperty.annualValue * 0.3; // 30%
      income.houseProperty.netIncome = income.houseProperty.annualValue - 
        income.houseProperty.municipalTax - 
        income.houseProperty.standardDeduction - 
        income.houseProperty.interestOnLoan;
    }

    // Calculate capital gains
    if (user.capitalGains && user.capitalGains.length > 0) {
      for (const gain of user.capitalGains) {
        const gainAmount = Number(gain.gainAmount) || 0;
        if (gain.gainType === 'SHORT_TERM') {
          income.capitalGains.shortTerm += gainAmount;
        } else if (gain.gainType === 'LONG_TERM') {
          income.capitalGains.longTerm += gainAmount;
        }
      }
      
      // LTCG exemption limit of ₹1 lakh
      income.capitalGains.exemptLTCG = Math.min(income.capitalGains.longTerm, 100000);
      income.capitalGains.taxableLTCG = Math.max(0, income.capitalGains.longTerm - 100000);
    }

    // Calculate other sources income
    if (user.interestIncome && user.interestIncome.length > 0) {
      income.otherSources.interest = user.interestIncome.reduce((sum, item) => 
        sum + (Number(item.amount) || 0), 0);
    }

    if (user.dividendIncome && user.dividendIncome.length > 0) {
      income.otherSources.dividend = user.dividendIncome.reduce((sum, item) => 
        sum + (Number(item.amount) || 0), 0);
    }

    income.otherSources.total = income.otherSources.interest + 
      income.otherSources.dividend + 
      income.otherSources.other;

    // Calculate business income
    if (user.businessIncome && user.businessIncome.length > 0) {
      for (const business of user.businessIncome) {
        income.business.turnover += Number(business.turnover) || 0;
        income.business.netProfit += Number(business.netProfit) || 0;
      }
      
      // Presumptive taxation under Section 44AD
      if (income.business.turnover <= 20000000) {
        income.business.presumptiveIncome = income.business.turnover * 0.08; // 8%
      }
    }

    // Calculate total income
    income.totalIncome = income.salary.netSalary + 
      income.houseProperty.netIncome + 
      income.capitalGains.shortTerm + 
      income.capitalGains.taxableLTCG + 
      income.otherSources.total + 
      Math.max(income.business.netProfit, income.business.presumptiveIncome);

    return income;
  }

  // ========================================
  // DEDUCTION CALCULATIONS
  // ========================================

  async calculateDeductionAggregates(user) {
    const deductions = {
      section80C: 0,
      section80D: 0,
      section80G: 0,
      section80E: 0,
      section80TTA: 0,
      totalDeductions: 0
    };

    // Section 80C investments
    if (user.taxSavingInvestments && user.taxSavingInvestments.length > 0) {
      deductions.section80C = user.taxSavingInvestments.reduce((sum, investment) => {
        if (investment.section === '80C') {
          return sum + (Number(investment.amount) || 0);
        }
        return sum;
      }, 0);
      
      // Cap at ₹1.5 lakh
      deductions.section80C = Math.min(deductions.section80C, 150000);
    }

    // Section 80D medical insurance
    if (user.medicalInsurance && user.medicalInsurance.length > 0) {
      deductions.section80D = user.medicalInsurance.reduce((sum, insurance) => 
        sum + (Number(insurance.premiumAmount) || 0), 0);
      
      // Cap based on age and type
      deductions.section80D = Math.min(deductions.section80D, 75000); // Max limit
    }

    // Section 80G donations
    if (user.donations && user.donations.length > 0) {
      deductions.section80G = user.donations.reduce((sum, donation) => {
        if (donation.section === '80G') {
          const deductibleAmount = donation.deductionPercentage === 100 ? 
            Number(donation.amount) : 
            Number(donation.amount) * 0.5; // 50% for most 80G donations
          return sum + deductibleAmount;
        }
        return sum;
      }, 0);
    }

    // Section 80TTA/80TTB interest deduction
    if (user.interestIncome && user.interestIncome.length > 0) {
      const savingsInterest = user.interestIncome
        .filter(income => income.sourceType === 'SAVINGS_ACCOUNT')
        .reduce((sum, income) => sum + (Number(income.amount) || 0), 0);
      
      deductions.section80TTA = Math.min(savingsInterest, 10000); // ₹10,000 limit
    }

    deductions.totalDeductions = deductions.section80C + 
      deductions.section80D + 
      deductions.section80G + 
      deductions.section80E + 
      deductions.section80TTA;

    return deductions;
  }

  // ========================================
  // TAX CALCULATIONS
  // ========================================

  async calculateTaxData(user) {
    const income = await this.calculateIncomeAggregates(user);
    const deductions = await this.calculateDeductionAggregates(user);
    
    const taxableIncome = Math.max(0, income.totalIncome - deductions.totalDeductions);
    
    // Old regime tax calculation
    const oldRegimeTax = this.calculateOldRegimeTax(taxableIncome);
    
    // New regime tax calculation
    const newRegimeTax = this.calculateNewRegimeTax(income.totalIncome);
    
    // TDS and advance tax
    let tdsTotal = 0;
    let advanceTax = 0;
    
    if (user.taxPaid && user.taxPaid.length > 0) {
      tdsTotal = user.taxPaid
        .filter(tax => tax.taxType === 'TDS')
        .reduce((sum, tax) => sum + (Number(tax.amount) || 0), 0);
      
      advanceTax = user.taxPaid
        .filter(tax => tax.taxType === 'ADVANCE_TAX')
        .reduce((sum, tax) => sum + (Number(tax.amount) || 0), 0);
    }

    return {
      grossIncome: income.totalIncome,
      totalDeductions: deductions.totalDeductions,
      taxableIncome,
      oldRegime: oldRegimeTax,
      newRegime: newRegimeTax,
      recommendedRegime: oldRegimeTax.totalTax <= newRegimeTax.totalTax ? 'OLD' : 'NEW',
      tdsTotal,
      advanceTax,
      totalTaxPaid: tdsTotal + advanceTax,
      refundDue: Math.max(0, (tdsTotal + advanceTax) - Math.min(oldRegimeTax.totalTax, newRegimeTax.totalTax)),
      balanceTax: Math.max(0, Math.min(oldRegimeTax.totalTax, newRegimeTax.totalTax) - (tdsTotal + advanceTax))
    };
  }

  calculateOldRegimeTax(taxableIncome) {
    const slabs = [
      { min: 0, max: 250000, rate: 0 },
      { min: 250001, max: 500000, rate: 0.05 },
      { min: 500001, max: 1000000, rate: 0.20 },
      { min: 1000001, max: Infinity, rate: 0.30 }
    ];

    let tax = 0;
    for (const slab of slabs) {
      if (taxableIncome > slab.min - 1) {
        const taxableAtThisSlab = Math.min(taxableIncome, slab.max) - Math.max(slab.min - 1, 0);
        tax += taxableAtThisSlab * slab.rate;
      }
    }

    // Rebate under Section 87A
    const rebate = taxableIncome <= 500000 ? Math.min(tax, 12500) : 0;
    const taxAfterRebate = Math.max(0, tax - rebate);

    // Health and Education Cess (4%)
    const cess = taxAfterRebate * 0.04;
    
    return {
      taxBeforeRebate: Math.round(tax),
      rebate87A: Math.round(rebate),
      taxAfterRebate: Math.round(taxAfterRebate),
      cess: Math.round(cess),
      totalTax: Math.round(taxAfterRebate + cess)
    };
  }

  calculateNewRegimeTax(grossIncome) {
    const slabs = [
      { min: 0, max: 300000, rate: 0 },
      { min: 300001, max: 600000, rate: 0.05 },
      { min: 600001, max: 900000, rate: 0.10 },
      { min: 900001, max: 1200000, rate: 0.15 },
      { min: 1200001, max: 1500000, rate: 0.20 },
      { min: 1500001, max: Infinity, rate: 0.30 }
    ];

    // Standard deduction of ₹50,000
    const taxableIncome = Math.max(0, grossIncome - 50000);

    let tax = 0;
    for (const slab of slabs) {
      if (taxableIncome > slab.min - 1) {
        const taxableAtThisSlab = Math.min(taxableIncome, slab.max) - Math.max(slab.min - 1, 0);
        tax += taxableAtThisSlab * slab.rate;
      }
    }

    // Rebate under Section 87A
    const rebate = taxableIncome <= 700000 ? Math.min(tax, 25000) : 0;
    const taxAfterRebate = Math.max(0, tax - rebate);

    // Health and Education Cess (4%)
    const cess = taxAfterRebate * 0.04;

    return {
      taxBeforeRebate: Math.round(tax),
      rebate87A: Math.round(rebate),
      taxAfterRebate: Math.round(taxAfterRebate),
      cess: Math.round(cess),
      totalTax: Math.round(taxAfterRebate + cess)
    };
  }

  // ========================================
  // ITR-1 JSON GENERATION
  // ========================================

  async generateITR1(userData) {
    const { user, income, deductions, tax } = userData;
    
    return {
      ITR: {
        ITR1: {
          CreationInfo: {
            SWVersionNo: "1.2",
            SWCreatedBy: "BurnBlack",
            JSONCreatedBy: "BurnBlack",
            XMLCreationDate: this.currentDate,
            IntermediaryCity: user.addressDetails?.city || "Mumbai",
            Digest: this.generateDigest()
          },
          Form_ITR1: {
            FormName: "ITR-1",
            Description: "For individuals having Income from Salary/Pension/Family Pension and Interest",
            AssessmentYear: this.assessmentYear,
            SchemaVer: "Ver1.2",
            FormVer: "Ver1.2"
          },
          PersonalInfo: this.mapPersonalInfo(user),
          FilingStatus: this.mapFilingStatus(user),
          PartA_139_8A: this.mapPartA139_8A(user),
          ITR1_IncomeDeductions: this.mapITR1IncomeDeductions(income, deductions),
          ITR1_TaxComputation: this.mapITR1TaxComputation(tax),
          TaxPaid: this.mapTaxPaid(user, tax),
          Refund: this.mapRefund(user, tax),
          Verification: this.mapVerification(user),
          // Additional schedules
          Schedule80G: this.mapSchedule80G(user.donations || []),
          Schedule80D: this.mapSchedule80D(user.medicalInsurance || []),
          TDSonSalaries: this.mapTDSonSalaries(user.form16Data || []),
          TDSonOthThanSals: this.mapTDSonOthThanSals(user.taxPaid || [])
        }
      }
    };
  }

  // ========================================
  // MAPPING FUNCTIONS FOR ITR-1
  // ========================================

  mapPersonalInfo(user) {
    return {
      AssesseeName: {
        FirstName: user.personalDetails?.firstName || "",
        MiddleName: user.personalDetails?.middleName || "",
        SurNameOrOrgName: user.personalDetails?.lastName || ""
      },
      PAN: user.contactDetails?.panNumber || "",
      DOB: user.personalDetails?.dob?.toISOString().split('T')[0] || "1990-01-01",
      Gender: user.personalDetails?.gender || "M",
      Status: user.personalDetails?.maritalStatus || "SINGLE",
      ResidentialStatus: "RES",
      EmployerCategory: "OTH",
      AadhaarCardNo: user.contactDetails?.aadharNumber || "",
      Address: {
        ResidenceNo: user.addressDetails?.flatNo || "",
        ResidenceName: user.addressDetails?.premiseName || "",
        RoadOrStreet: user.addressDetails?.road || "",
        LocalityOrArea: user.addressDetails?.area || "",
        CityOrTownOrDistrict: user.addressDetails?.city || "",
        StateCode: this.getStateCode(user.addressDetails?.state) || "01",
        CountryCode: "91",
        PinCode: user.addressDetails?.pincode || "110001",
        Phone: {
          STDCode: "011",
          PhoneNo: user.phone?.replace(/\D/g, '').slice(-10) || "9999999999"
        },
        EmailAddress: user.email || ""
      }
    };
  }

  mapFilingStatus(user) {
    return {
      ReturnFileSec: 11,
      OptOutNewTaxRegime: "N", // Default to new regime
      SeventhProvisio139: "N",
      clauseiv7provisio139i: "N",
      ItrFilingDueDate: `${this.assessmentYear.split('-')[0]}-07-31`
    };
  }

  mapPartA139_8A(user) {
    return {
      PAN: user.contactDetails?.panNumber || "",
      Name: `${user.personalDetails?.firstName || ""} ${user.personalDetails?.lastName || ""}`.trim(),
      AssessmentYear: this.assessmentYear.split('-')[0],
      PreviouslyFiledForThisAY: "N",
      LaidOutIn_139_8A: "N",
      ITRFormUpdatingInc: "ITR1"
    };
  }

  mapITR1IncomeDeductions(income, deductions) {
    return {
      GrossSalary: Math.round(income.salary.gross),
      IncomeNotified89A: 0,
      NetSalary: Math.round(income.salary.netSalary),
      DeductionUs16: Math.round(income.salary.standardDeduction),
      AnnualValue: Math.round(income.houseProperty.annualValue),
      StandardDeduction: Math.round(income.houseProperty.standardDeduction),
      IncomeFromSal: Math.round(income.salary.netSalary),
      TotalIncomeOfHP: Math.round(income.houseProperty.netIncome),
      IncomeOthSrc: Math.round(income.otherSources.total),
      GrossTotIncome: Math.round(income.totalIncome),
      UsrDeductUndChapVIA: {
        Section80C: Math.round(deductions.section80C),
        Section80D: Math.round(deductions.section80D),
        Section80G: Math.round(deductions.section80G),
        Section80TTA: Math.round(deductions.section80TTA)
      },
      DeductUndChapVIA: {
        TotalChapVIADeductions: Math.round(deductions.totalDeductions)
      },
      TotalIncome: Math.round(income.totalIncome - deductions.totalDeductions)
    };
  }

  mapITR1TaxComputation(tax) {
    const regime = tax.recommendedRegime === 'OLD' ? tax.oldRegime : tax.newRegime;
    
    return {
      TotalTaxPayable: Math.round(regime.taxBeforeRebate),
      Rebate87A: Math.round(regime.rebate87A),
      TaxPayableOnRebate: Math.round(regime.taxAfterRebate),
      EducationCess: Math.round(regime.cess),
      GrossTaxLiability: Math.round(regime.totalTax),
      Section89: 0,
      NetTaxLiability: Math.round(regime.totalTax),
      TotalIntrstPay: 0,
      IntrstPay: {
        IntrstPayUs234A: 0,
        IntrstPayUs234B: 0,
        IntrstPayUs234C: 0
      },
      TotTaxPlusIntrstPay: Math.round(regime.totalTax)
    };
  }

  mapTaxPaid(user, tax) {
    return {
      TaxesPaid: {
        TDS: Math.round(tax.tdsTotal),
        AdvanceTax: Math.round(tax.advanceTax),
        SelfAssessmentTax: 0,
        TotalTaxesPaid: Math.round(tax.totalTaxPaid)
      },
      BalTaxPayable: Math.round(tax.balanceTax)
    };
  }

  mapRefund(user, tax) {
    return {
      RefundDue: Math.round(tax.refundDue),
      BankAccountDtls: user.bankDetails ? {
        AddtnlBankDetails: [{
          BankName: user.bankDetails.bankName || "",
          BankAccountNo: user.bankDetails.accountNumber || "",
          IFSCCode: user.bankDetails.ifscCode || ""
        }]
      } : {}
    };
  }

  mapVerification(user) {
    return {
      Declaration: {
        AssesseeVerName: `${user.personalDetails?.firstName || ""} ${user.personalDetails?.lastName || ""}`.trim(),
        FatherName: user.personalDetails?.fatherName || "",
        Place: user.addressDetails?.city || "",
        Date: this.currentDate
      }
    };
  }

  mapSchedule80G(donations) {
    const totalDonations = donations.reduce((sum, donation) => 
      sum + (Number(donation.amount) || 0), 0);
    
    return {
      TotalDonationsUs80GCash: Math.round(totalDonations),
      TotalDonationsUs80GOtherMode: 0,
      TotalDonationsUs80G: Math.round(totalDonations),
      TotalEligibleDonationsUs80G: Math.round(totalDonations * 0.5) // Assuming 50% deduction
    };
  }

  mapSchedule80D(medicalInsurance) {
    const totalPremium = medicalInsurance.reduce((sum, insurance) => 
      sum + (Number(insurance.premiumAmount) || 0), 0);
    
    return {
      Sec80DSelfFamSrCtznHealth: {
        SeniorCitizenFlag: "N",
        ParentsSeniorCitizenFlag: "N",
        EligibleAmountOfDedn: Math.min(Math.round(totalPremium), 25000)
      }
    };
  }

  mapTDSonSalaries(form16Data) {
    const totalTDS = form16Data.reduce((sum, form16) => 
      sum + (Number(form16.totalTax) || 0), 0);
    
    return {
      TotalTDSonSalaries: Math.round(totalTDS)
    };
  }

  mapTDSonOthThanSals(taxPaid) {
    const otherTDS = taxPaid
      .filter(tax => tax.taxType === 'TDS' && tax.source !== 'SALARY')
      .reduce((sum, tax) => sum + (Number(tax.amount) || 0), 0);
    
    return {
      TotalTDSonOthThanSals: Math.round(otherTDS)
    };
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================

  async validateDataCompleteness(userData) {
    const missingFields = [];
    const { user } = userData;

    // Essential fields validation
    if (!user.contactDetails?.panNumber) missingFields.push('PAN Number');
    if (!user.personalDetails?.firstName) missingFields.push('First Name');
    if (!user.personalDetails?.dob) missingFields.push('Date of Birth');
    if (!user.email) missingFields.push('Email Address');
    if (!user.addressDetails?.pincode) missingFields.push('Address Details');

    return {
      isComplete: missingFields.length === 0,
      missingFields,
      completionPercentage: Math.round(((7 - missingFields.length) / 7) * 100)
    };
  }

  recommendITRType(userData) {
    const { income } = userData;
    
    // ITR-3 for business income (highest priority)
    if (income.business.netProfit > 0) {
      return 'ITR-3';
    }
    
    // ITR-2 for capital gains
    if (income.capitalGains.shortTerm > 0 || income.capitalGains.longTerm > 0) {
      return 'ITR-2';
    }
    
    // ITR-1 criteria (most restrictive)
    if (income.totalIncome <= 5000000 && 
        income.business.netProfit === 0 && 
        income.capitalGains.longTerm <= 100000) {
      return 'ITR-1';
    }
    
    return 'ITR-2'; // Default fallback
  }

  async validateAgainstSchema(itrData) {
    try {
      // Basic structure validation
      const errors = [];
      
      if (!itrData.ITR) errors.push('Missing ITR root element');
      if (!itrData.ITR.ITR1?.PersonalInfo?.PAN) errors.push('Missing PAN');
      if (!itrData.ITR.ITR1?.PersonalInfo?.AssesseeName?.FirstName) errors.push('Missing Name');
      
      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error.message]
      };
    }
  }

  generateChecksum(data) {
    return crypto.createHash('md5')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  generateDigest() {
    return crypto.createHash('sha256')
      .update(`${this.currentDate}-BurnBlack-${Math.random()}`)
      .digest('hex')
      .substring(0, 32);
  }

  getStateCode(stateName) {
    const stateCodes = {
      'MAHARASHTRA': '27',
      'DELHI': '07',
      'KARNATAKA': '29',
      'TAMIL NADU': '33',
      'GUJARAT': '24',
      'RAJASTHAN': '08',
      'UTTAR PRADESH': '09'
    };
    
    return stateCodes[stateName?.toUpperCase()] || '01';
  }
}

module.exports = ITRJSONGeneratorPrisma;