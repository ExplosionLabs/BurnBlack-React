import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react'

// Types for ITR data structure
export interface PersonalDetails {
  name: string
  pan: string
  aadhaar: string
  dateOfBirth: string
  email: string
  mobile: string
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
    country: string
  }
  gender?: 'M' | 'F'
  status: 'Individual' | 'HUF' | 'Firm' | 'Company'
  residentialStatus: 'Resident' | 'Non-Resident' | 'Not Ordinary Resident'
}

export interface IncomeDetails {
  salary?: {
    employers: Array<{
      employerName: string
      tan?: string
      grossSalary: number
      basicPay?: number
      hra?: number
      lta?: number
      allowances?: number
      perquisites?: number
      profitsInLieu?: number
      tdsDeducted: number
      professionalTax?: number
      standardDeduction: number
    }>
    totalGrossSalary: number
    totalTDS: number
    netSalary: number
  }
  interest?: {
    savingsBankInterest: number
    fixedDepositInterest: number
    p2pInterest: number
    bondInterest: number
    epfInterest: number
    otherInterest: number
    totalInterest: number
  }
  dividend?: {
    equityShares: number
    mutualFunds: number
    otherCompanies: number
    totalDividend: number
  }
  capitalGains?: {
    shortTerm: Array<{
      assetType: string
      description: string
      dateOfPurchase: string
      dateOfSale: string
      purchasePrice: number
      salePrice: number
      expenses: number
      gainLoss: number
    }>
    longTerm: Array<{
      assetType: string
      description: string
      dateOfPurchase: string
      dateOfSale: string
      purchasePrice: number
      salePrice: number
      expenses: number
      indexation?: number
      gainLoss: number
    }>
    totalSTCG: number
    totalLTCG: number
  }
  houseProperty?: Array<{
    propertyType: 'Self-Occupied' | 'Let-Out' | 'Deemed Let-Out'
    address: string
    coOwnershipPercentage?: number
    annualValue: number
    municipalTax: number
    standardDeduction: number
    interestOnLoan: number
    otherExpenses: number
    netIncome: number
  }>
  business?: {
    natureOfBusiness: string
    businessCode: string
    tradeName?: string
    grossReceipts: number
    grossProfit: number
    expenses: {
      salaries: number
      rent: number
      interest: number
      depreciation: number
      otherExpenses: number
      totalExpenses: number
    }
    netProfit: number
    balanceSheet?: any
    profitLossAccount?: any
  }
  professional?: {
    natureOfProfession: string
    professionCode: string
    grossReceipts: number
    expenses: {
      salaries: number
      rent: number
      interest: number
      depreciation: number
      otherExpenses: number
      totalExpenses: number
    }
    netIncome: number
  }
  otherIncome?: {
    winningsFromLotteries: number
    winningsFromCrosswordPuzzles: number
    winningsFromHorseRace: number
    gifts: number
    interestOnIncomeTaxRefund: number
    agriculturalIncome: number
    otherSources: number
    totalOtherIncome: number
  }
}

export interface DeductionDetails {
  section80C: {
    lifeInsurance: number
    ppf: number
    elss: number
    nsc: number
    taxSavingFD: number
    ulip: number
    homeLoanPrincipal: number
    total: number
  }
  section80D: {
    selfAndFamily: number
    parents: number
    preventiveHealthCheckup: number
    seniorCitizenPremium: number
    total: number
  }
  section80E: {
    educationLoanInterest: number
  }
  section80EE: {
    homeLoanInterest: number
  }
  section80EEA: {
    additionalHomeLoanInterest: number
  }
  section80G: {
    donations: Array<{
      organizationName: string
      registrationNumber: string
      amount: number
      deductionPercentage: number
      eligibleAmount: number
    }>
    total: number
  }
  section80GG: {
    rentPaid: number
    eligibleAmount: number
  }
  section80TTA: {
    savingsInterest: number
  }
  section80TTB: {
    seniorCitizenInterest: number
  }
  section80U: {
    disabilityDeduction: number
    disabilityType: 'Normal' | 'Severe'
  }
  section80DD: {
    dependentDisabilityDeduction: number
    disabilityType: 'Normal' | 'Severe'
  }
  section80CCC: {
    pensionFundContribution: number
  }
  section80CCD1: {
    npsEmployeeContribution: number
  }
  section80CCD1B: {
    additionalNPSContribution: number
  }
  section80CCD2: {
    npsEmployerContribution: number
  }
  otherDeductions: {
    [section: string]: number
  }
  totalDeductions: number
}

export interface TaxCalculation {
  grossTotalIncome: number
  totalDeductions: number
  taxableIncome: number
  taxLiability: number
  surcharge: number
  educationCess: number
  totalTaxPayable: number
  taxPaid: {
    tds: number
    advanceTax: number
    selfAssessmentTax: number
    totalTaxPaid: number
  }
  refundOrDemand: number
  regime: 'Old' | 'New'
}

export interface ITRFlowData {
  personalDetails: Partial<PersonalDetails>
  incomeDetails: Partial<IncomeDetails>
  deductionDetails: Partial<DeductionDetails>
  taxCalculation: Partial<TaxCalculation>
  itrType: string
  assessmentYear: string
  filingDate: string
  submissionType: 'Original' | 'Revised' | 'Belated'
  completedSteps: string[]
  currentStep: string
}

// Action types
type ITRFlowAction = 
  | { type: 'UPDATE_PERSONAL_DETAILS'; payload: Partial<PersonalDetails> }
  | { type: 'UPDATE_INCOME_DETAILS'; payload: Partial<IncomeDetails> }
  | { type: 'UPDATE_DEDUCTION_DETAILS'; payload: Partial<DeductionDetails> }
  | { type: 'UPDATE_TAX_CALCULATION'; payload: Partial<TaxCalculation> }
  | { type: 'SET_ITR_TYPE'; payload: string }
  | { type: 'SET_CURRENT_STEP'; payload: string }
  | { type: 'MARK_STEP_COMPLETED'; payload: string }
  | { type: 'RESET_FLOW' }

// Initial state
const initialState: ITRFlowData = {
  personalDetails: {
    status: 'Individual',
    residentialStatus: 'Resident',
    address: {
      country: 'India'
    }
  },
  incomeDetails: {},
  deductionDetails: {
    section80C: {
      lifeInsurance: 0,
      ppf: 0,
      elss: 0,
      nsc: 0,
      taxSavingFD: 0,
      ulip: 0,
      homeLoanPrincipal: 0,
      total: 0
    },
    section80D: {
      selfAndFamily: 0,
      parents: 0,
      preventiveHealthCheckup: 0,
      seniorCitizenPremium: 0,
      total: 0
    },
    section80E: { educationLoanInterest: 0 },
    section80EE: { homeLoanInterest: 0 },
    section80EEA: { additionalHomeLoanInterest: 0 },
    section80G: { donations: [], total: 0 },
    section80GG: { rentPaid: 0, eligibleAmount: 0 },
    section80TTA: { savingsInterest: 0 },
    section80TTB: { seniorCitizenInterest: 0 },
    section80U: { disabilityDeduction: 0, disabilityType: 'Normal' },
    section80DD: { dependentDisabilityDeduction: 0, disabilityType: 'Normal' },
    section80CCC: { pensionFundContribution: 0 },
    section80CCD1: { npsEmployeeContribution: 0 },
    section80CCD1B: { additionalNPSContribution: 0 },
    section80CCD2: { npsEmployerContribution: 0 },
    otherDeductions: {},
    totalDeductions: 0
  },
  taxCalculation: {
    grossTotalIncome: 0,
    totalDeductions: 0,
    taxableIncome: 0,
    taxLiability: 0,
    surcharge: 0,
    educationCess: 0,
    totalTaxPayable: 0,
    taxPaid: {
      tds: 0,
      advanceTax: 0,
      selfAssessmentTax: 0,
      totalTaxPaid: 0
    },
    refundOrDemand: 0,
    regime: 'Old'
  },
  itrType: '',
  assessmentYear: '2024-25',
  filingDate: new Date().toISOString().split('T')[0],
  submissionType: 'Original',
  completedSteps: [],
  currentStep: 'assessment'
}

// Reducer
function itrFlowReducer(state: ITRFlowData, action: ITRFlowAction): ITRFlowData {
  switch (action.type) {
    case 'UPDATE_PERSONAL_DETAILS':
      return {
        ...state,
        personalDetails: { ...state.personalDetails, ...action.payload }
      }
    case 'UPDATE_INCOME_DETAILS':
      return {
        ...state,
        incomeDetails: { ...state.incomeDetails, ...action.payload }
      }
    case 'UPDATE_DEDUCTION_DETAILS':
      return {
        ...state,
        deductionDetails: { ...state.deductionDetails, ...action.payload }
      }
    case 'UPDATE_TAX_CALCULATION':
      return {
        ...state,
        taxCalculation: { ...state.taxCalculation, ...action.payload }
      }
    case 'SET_ITR_TYPE':
      return {
        ...state,
        itrType: action.payload
      }
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload
      }
    case 'MARK_STEP_COMPLETED':
      return {
        ...state,
        completedSteps: [...state.completedSteps.filter(step => step !== action.payload), action.payload]
      }
    case 'RESET_FLOW':
      return initialState
    default:
      return state
  }
}

// Context
interface ITRFlowContextType {
  data: ITRFlowData
  updatePersonalDetails: (details: Partial<PersonalDetails>) => void
  updateIncomeDetails: (details: Partial<IncomeDetails>) => void
  updateDeductionDetails: (details: Partial<DeductionDetails>) => void
  updateTaxCalculation: (calculation: Partial<TaxCalculation>) => void
  setITRType: (type: string) => void
  setCurrentStep: (step: string) => void
  markStepCompleted: (step: string) => void
  resetFlow: () => void
  calculateTax: () => void
  getTotalIncome: () => number
  getTotalDeductions: () => number
}

const ITRFlowContext = createContext<ITRFlowContextType | undefined>(undefined)

// Provider component
export const ITRFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, dispatch] = useReducer(itrFlowReducer, initialState)

  const updatePersonalDetails = (details: Partial<PersonalDetails>) => {
    dispatch({ type: 'UPDATE_PERSONAL_DETAILS', payload: details })
  }

  const updateIncomeDetails = (details: Partial<IncomeDetails>) => {
    dispatch({ type: 'UPDATE_INCOME_DETAILS', payload: details })
  }

  const updateDeductionDetails = (details: Partial<DeductionDetails>) => {
    dispatch({ type: 'UPDATE_DEDUCTION_DETAILS', payload: details })
  }

  const updateTaxCalculation = (calculation: Partial<TaxCalculation>) => {
    dispatch({ type: 'UPDATE_TAX_CALCULATION', payload: calculation })
  }

  const setITRType = (type: string) => {
    dispatch({ type: 'SET_ITR_TYPE', payload: type })
  }

  const setCurrentStep = (step: string) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step })
  }

  const markStepCompleted = (step: string) => {
    dispatch({ type: 'MARK_STEP_COMPLETED', payload: step })
  }

  const resetFlow = () => {
    dispatch({ type: 'RESET_FLOW' })
  }

  const getTotalIncome = useCallback((): number => {
    const income = data.incomeDetails
    let total = 0
    
    if (income.salary) total += income.salary.netSalary || 0
    if (income.interest) total += income.interest.totalInterest || 0
    if (income.dividend) total += income.dividend.totalDividend || 0
    if (income.capitalGains) {
      total += income.capitalGains.totalSTCG || 0
      total += income.capitalGains.totalLTCG || 0
    }
    if (income.houseProperty) {
      total += income.houseProperty.reduce((sum, prop) => sum + prop.netIncome, 0)
    }
    if (income.business) total += income.business.netProfit || 0
    if (income.professional) total += income.professional.netIncome || 0
    if (income.otherIncome) total += income.otherIncome.totalOtherIncome || 0
    
    return total
  }, [data.incomeDetails])

  const getTotalDeductions = useCallback((): number => {
    return data.deductionDetails.totalDeductions || 0
  }, [data.deductionDetails.totalDeductions])

  const calculateTax = useCallback(() => {
    const grossTotalIncome = getTotalIncome()
    const totalDeductions = getTotalDeductions()
    const standardDeduction = 50000 // Standard deduction for FY 2024-25
    
    const taxableIncome = Math.max(0, grossTotalIncome - totalDeductions - standardDeduction)
    
    // Simple tax calculation for old regime (FY 2024-25)
    let taxLiability = 0
    
    if (taxableIncome <= 250000) {
      taxLiability = 0
    } else if (taxableIncome <= 500000) {
      taxLiability = (taxableIncome - 250000) * 0.05
    } else if (taxableIncome <= 1000000) {
      taxLiability = 12500 + (taxableIncome - 500000) * 0.20
    } else {
      taxLiability = 112500 + (taxableIncome - 1000000) * 0.30
    }
    
    const educationCess = taxLiability * 0.04
    const totalTaxPayable = taxLiability + educationCess
    
    const totalTDS = data.incomeDetails.salary?.totalTDS || 0
    const refundOrDemand = totalTDS - totalTaxPayable
    
    updateTaxCalculation({
      grossTotalIncome,
      totalDeductions,
      taxableIncome,
      taxLiability,
      surcharge: 0, // No surcharge for income <= 50 lakhs
      educationCess,
      totalTaxPayable,
      taxPaid: {
        tds: totalTDS,
        advanceTax: 0,
        selfAssessmentTax: 0,
        totalTaxPaid: totalTDS
      },
      refundOrDemand,
      regime: 'Old'
    })
  }, [getTotalIncome, getTotalDeductions, data.incomeDetails.salary?.totalTDS, updateTaxCalculation])

  const value: ITRFlowContextType = {
    data,
    updatePersonalDetails,
    updateIncomeDetails,
    updateDeductionDetails,
    updateTaxCalculation,
    setITRType,
    setCurrentStep,
    markStepCompleted,
    resetFlow,
    calculateTax,
    getTotalIncome,
    getTotalDeductions
  }

  return <ITRFlowContext.Provider value={value}>{children}</ITRFlowContext.Provider>
}

// Hook to use the context
export const useITRFlow = () => {
  const context = useContext(ITRFlowContext)
  if (context === undefined) {
    throw new Error('useITRFlow must be used within an ITRFlowProvider')
  }
  return context
}

export default ITRFlowContext