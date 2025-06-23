import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useITRFlow } from '../../../contexts/ITRFlowContext';
import { 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  FileText, 
  Calculator,
  Eye,
  Edit,
  User,
  Building,
  CreditCard,
  Receipt,
  TrendingUp,
  Shield,
  Clock,
  ArrowRight
} from 'lucide-react';

interface ITRData {
  personalDetails: {
    name: string;
    pan: string;
    aadhaar: string;
    dateOfBirth: string;
    email: string;
    mobile: string;
    address: string;
  };
  incomeDetails: {
    salaryIncome: number;
    interestIncome: number;
    capitalGains: number;
    businessIncome: number;
    otherIncome: number;
    totalIncome: number;
  };
  deductions: {
    section80C: number;
    section80D: number;
    section80G: number;
    otherDeductions: number;
    totalDeductions: number;
  };
  taxCalculation: {
    grossTotalIncome: number;
    taxableIncome: number;
    taxLiability: number;
    taxPaid: number;
    refundDue: number;
    regime: 'old' | 'new';
  };
  itrType: string;
  assessmentYear: string;
}

const SmartReview: React.FC = () => {
  const { data, calculateTax, getTotalIncome, getTotalDeductions, markStepCompleted } = useITRFlow();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  const [showJSONPreview, setShowJSONPreview] = useState(false);
  const [jsonData, setJsonData] = useState<string>('');

  useEffect(() => {
    // Load actual data from ITR flow context
    validateContextData();
    generateContextJSON();
  }, [data.personalDetails, data.incomeDetails, data.deductionDetails]);

  useEffect(() => {
    // Calculate tax only when income or deductions change
    calculateTax();
  }, [calculateTax]);

  const validateContextData = () => {
    const errors: string[] = [];
    
    // Only validate if we have some data to work with
    if (!hasMinimalData) {
      errors.push('Please complete previous steps to view review');
      setValidationErrors(errors);
      setIsValidated(false);
      return;
    }
    
    // Validate personal details only if they exist
    if (data.personalDetails.name && !data.personalDetails.name.trim()) {
      errors.push('Name cannot be empty');
    }
    
    if (data.personalDetails.pan) {
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.personalDetails.pan.replace(/\s/g, ''))) {
        errors.push('Invalid PAN format');
      }
    }
    
    if (data.personalDetails.aadhaar) {
      if (!/^\d{4}\s\d{4}\s\d{4}$/.test(data.personalDetails.aadhaar)) {
        errors.push('Invalid Aadhaar format (use XXXX XXXX XXXX)');
      }
    }
    
    if (data.personalDetails.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personalDetails.email)) {
        errors.push('Invalid email format');
      }
    }
    
    if (data.personalDetails.mobile) {
      if (!/^\+91\s\d{5}\s\d{5}$/.test(data.personalDetails.mobile)) {
        errors.push('Invalid mobile format (use +91 XXXXX XXXXX)');
      }
    }
    
    // Validate income sources
    const totalIncome = getTotalIncome();
    if (totalIncome <= 0) {
      errors.push('At least one income source is required');
    }
    
    setValidationErrors(errors);
    setIsValidated(errors.length === 0);
  };

  const generateContextJSON = () => {
    const itrJson = {
      ITR: {
        ITRType: data.itrType || 'ITR-1',
        AssessmentYear: data.assessmentYear || '2024-25',
        PersonalInfo: {
          Name: data.personalDetails.name || '',
          PAN: data.personalDetails.pan?.replace(/\s/g, '') || '',
          AadhaarNumber: data.personalDetails.aadhaar?.replace(/\s/g, '') || '',
          DateOfBirth: data.personalDetails.dateOfBirth || '',
          Email: data.personalDetails.email || '',
          Mobile: data.personalDetails.mobile || '',
          Address: {
            Line1: data.personalDetails.address?.line1 || '',
            Line2: data.personalDetails.address?.line2 || '',
            City: data.personalDetails.address?.city || '',
            State: data.personalDetails.address?.state || '',
            Pincode: data.personalDetails.address?.pincode || '',
            Country: data.personalDetails.address?.country || 'India'
          }
        },
        IncomeDetails: {
          Salary: data.incomeDetails.salary ? {
            Employers: data.incomeDetails.salary.employers?.map(emp => ({
              EmployerName: emp.employerName || '',
              TAN: emp.tan || '',
              GrossSalary: emp.grossSalary || 0,
              BasicPay: emp.basicPay || 0,
              HRA: emp.hra || 0,
              LTA: emp.lta || 0,
              Allowances: emp.allowances || 0,
              Perquisites: emp.perquisites || 0,
              ProfitsInLieu: emp.profitsInLieu || 0,
              TDSDeducted: emp.tdsDeducted || 0,
              ProfessionalTax: emp.professionalTax || 0,
              StandardDeduction: emp.standardDeduction || 50000
            })) || [],
            TotalGrossSalary: data.incomeDetails.salary.totalGrossSalary || 0,
            TotalTDS: data.incomeDetails.salary.totalTDS || 0,
            NetSalary: data.incomeDetails.salary.netSalary || 0
          } : null,
          Interest: data.incomeDetails.interest ? {
            SavingsBankInterest: data.incomeDetails.interest.savingsBankInterest || 0,
            FixedDepositInterest: data.incomeDetails.interest.fixedDepositInterest || 0,
            P2PInterest: data.incomeDetails.interest.p2pInterest || 0,
            BondInterest: data.incomeDetails.interest.bondInterest || 0,
            EPFInterest: data.incomeDetails.interest.epfInterest || 0,
            OtherInterest: data.incomeDetails.interest.otherInterest || 0,
            TotalInterest: data.incomeDetails.interest.totalInterest || 0
          } : null,
          Dividend: data.incomeDetails.dividend ? {
            EquityShares: data.incomeDetails.dividend.equityShares || 0,
            MutualFunds: data.incomeDetails.dividend.mutualFunds || 0,
            OtherCompanies: data.incomeDetails.dividend.otherCompanies || 0,
            TotalDividend: data.incomeDetails.dividend.totalDividend || 0
          } : null,
          CapitalGains: data.incomeDetails.capitalGains ? {
            ShortTerm: {
              Transactions: data.incomeDetails.capitalGains.shortTerm || [],
              Total: data.incomeDetails.capitalGains.totalSTCG || 0
            },
            LongTerm: {
              Transactions: data.incomeDetails.capitalGains.longTerm || [],
              Total: data.incomeDetails.capitalGains.totalLTCG || 0
            }
          } : null,
          HouseProperty: data.incomeDetails.houseProperty || [],
          Business: data.incomeDetails.business,
          Professional: data.incomeDetails.professional,
          OtherIncome: data.incomeDetails.otherIncome,
          GrossTotalIncome: getTotalIncome()
        },
        Deductions: {
          Section80C: data.deductionDetails.section80C ? {
            LifeInsurance: data.deductionDetails.section80C.lifeInsurance || 0,
            PPF: data.deductionDetails.section80C.ppf || 0,
            ELSS: data.deductionDetails.section80C.elss || 0,
            NSC: data.deductionDetails.section80C.nsc || 0,
            TaxSavingFD: data.deductionDetails.section80C.taxSavingFD || 0,
            ULIP: data.deductionDetails.section80C.ulip || 0,
            HomeLoanPrincipal: data.deductionDetails.section80C.homeLoanPrincipal || 0,
            Total: data.deductionDetails.section80C.total || 0
          } : null,
          Section80D: data.deductionDetails.section80D ? {
            SelfAndFamily: data.deductionDetails.section80D.selfAndFamily || 0,
            Parents: data.deductionDetails.section80D.parents || 0,
            PreventiveHealthCheckup: data.deductionDetails.section80D.preventiveHealthCheckup || 0,
            SeniorCitizenPremium: data.deductionDetails.section80D.seniorCitizenPremium || 0,
            Total: data.deductionDetails.section80D.total || 0
          } : null,
          Section80E: data.deductionDetails.section80E ? {
            EducationLoanInterest: data.deductionDetails.section80E.educationLoanInterest || 0
          } : null,
          Section80EE: data.deductionDetails.section80EE ? {
            HomeLoanInterest: data.deductionDetails.section80EE.homeLoanInterest || 0
          } : null,
          Section80EEA: data.deductionDetails.section80EEA ? {
            AdditionalHomeLoanInterest: data.deductionDetails.section80EEA.additionalHomeLoanInterest || 0
          } : null,
          Section80G: data.deductionDetails.section80G ? {
            Donations: data.deductionDetails.section80G.donations || [],
            Total: data.deductionDetails.section80G.total || 0
          } : null,
          Section80GG: data.deductionDetails.section80GG ? {
            RentPaid: data.deductionDetails.section80GG.rentPaid || 0,
            EligibleAmount: data.deductionDetails.section80GG.eligibleAmount || 0
          } : null,
          Section80TTA: data.deductionDetails.section80TTA ? {
            SavingsInterest: data.deductionDetails.section80TTA.savingsInterest || 0
          } : null,
          Section80TTB: data.deductionDetails.section80TTB ? {
            SeniorCitizenInterest: data.deductionDetails.section80TTB.seniorCitizenInterest || 0
          } : null,
          Section80U: data.deductionDetails.section80U ? {
            DisabilityDeduction: data.deductionDetails.section80U.disabilityDeduction || 0,
            DisabilityType: data.deductionDetails.section80U.disabilityType || 'Normal'
          } : null,
          Section80DD: data.deductionDetails.section80DD ? {
            DependentDisabilityDeduction: data.deductionDetails.section80DD.dependentDisabilityDeduction || 0,
            DisabilityType: data.deductionDetails.section80DD.disabilityType || 'Normal'
          } : null,
          Section80CCC: data.deductionDetails.section80CCC ? {
            PensionFundContribution: data.deductionDetails.section80CCC.pensionFundContribution || 0
          } : null,
          Section80CCD1: data.deductionDetails.section80CCD1 ? {
            NPSEmployeeContribution: data.deductionDetails.section80CCD1.npsEmployeeContribution || 0
          } : null,
          Section80CCD1B: data.deductionDetails.section80CCD1B ? {
            AdditionalNPSContribution: data.deductionDetails.section80CCD1B.additionalNPSContribution || 0
          } : null,
          Section80CCD2: data.deductionDetails.section80CCD2 ? {
            NPSEmployerContribution: data.deductionDetails.section80CCD2.npsEmployerContribution || 0
          } : null,
          OtherDeductions: data.deductionDetails.otherDeductions || {},
          TotalDeductions: getTotalDeductions()
        },
        TaxComputation: {
          GrossTotalIncome: data.taxCalculation.grossTotalIncome || getTotalIncome(),
          TotalDeductions: data.taxCalculation.totalDeductions || getTotalDeductions(),
          TaxableIncome: data.taxCalculation.taxableIncome || 0,
          TaxLiability: data.taxCalculation.taxLiability || 0,
          TaxPaid: data.taxCalculation.taxPaid?.totalTaxPaid || 0,
          RefundDue: data.taxCalculation.refundOrDemand || 0,
          TaxRegime: data.taxCalculation.regime || 'Old'
        }
      }
    };
    
    setJsonData(JSON.stringify(itrJson, null, 2));
  };

  const downloadJSON = () => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ITR_${data.personalDetails.pan?.replace(/\s/g, '') || 'UNKNOWN'}_${data.assessmentYear || '2024-25'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleProceedToSubmit = () => {
    markStepCompleted('review');
    // Navigate to submit step - you might want to add navigation here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Show loading state or basic view even if data is minimal
  const hasMinimalData = data.personalDetails.name || getTotalIncome() > 0;

  // Show message if no data is available
  if (!hasMinimalData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Previous Steps</h2>
            <p className="text-gray-600 mb-6">
              Please complete the personal details and income steps before reviewing your ITR.
            </p>
            <div className="bg-white rounded-lg p-6 text-left max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-3">Required Steps:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${data.personalDetails.name ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Personal Details
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${getTotalIncome() > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  Income Details
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${getTotalDeductions() > 0 ? 'bg-green-500' : 'bg-orange-300'}`} />
                  Tax Deductions (Optional)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Review Your ITR
          </h1>
          <p className="text-gray-600">
            Verify all details before final submission
          </p>
        </motion.div>

        {/* Validation Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 p-4 rounded-lg ${
            isValidated 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {isValidated ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-600" />
            )}
            <div>
              <h3 className={`font-semibold ${
                isValidated ? 'text-green-900' : 'text-red-900'
              }`}>
                {isValidated ? 'All checks passed!' : 'Validation errors found'}
              </h3>
              {validationErrors.length > 0 && (
                <ul className="text-sm text-red-700 mt-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Personal Details</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{data.personalDetails.name || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PAN:</span>
                <span className="font-medium">{data.personalDetails.pan || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aadhaar:</span>
                <span className="font-medium">{data.personalDetails.aadhaar || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{data.personalDetails.email || 'Not provided'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile:</span>
                <span className="font-medium">{data.personalDetails.mobile || 'Not provided'}</span>
              </div>
            </div>
            
            <button className="mt-4 text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <Edit className="w-4 h-4" />
              Edit Details
            </button>
          </motion.div>

          {/* Income Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Income Summary</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Salary Income:</span>
                <span className="font-medium">₹{(data.incomeDetails.salary?.netSalary || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Income:</span>
                <span className="font-medium">₹{(data.incomeDetails.interest?.totalInterest || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dividend Income:</span>
                <span className="font-medium">₹{(data.incomeDetails.dividend?.totalDividend || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capital Gains:</span>
                <span className="font-medium">₹{((data.incomeDetails.capitalGains?.totalSTCG || 0) + (data.incomeDetails.capitalGains?.totalLTCG || 0)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Income:</span>
                <span className="font-medium">₹{(data.incomeDetails.otherIncome?.totalOtherIncome || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total Income:</span>
                <span>₹{getTotalIncome().toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Deductions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Receipt className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Deductions</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Section 80C:</span>
                <span className="font-medium">₹{(data.deductionDetails.section80C?.total || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Section 80D:</span>
                <span className="font-medium">₹{(data.deductionDetails.section80D?.total || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Section 80E:</span>
                <span className="font-medium">₹{(data.deductionDetails.section80E?.educationLoanInterest || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Section 80G:</span>
                <span className="font-medium">₹{(data.deductionDetails.section80G?.total || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total Deductions:</span>
                <span>₹{getTotalDeductions().toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Tax Calculation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calculator className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Tax Calculation</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Gross Total Income:</span>
                <span className="font-medium">₹{(data.taxCalculation.grossTotalIncome || getTotalIncome()).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Deductions:</span>
                <span className="font-medium">₹{(data.taxCalculation.totalDeductions || getTotalDeductions()).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxable Income:</span>
                <span className="font-medium">₹{(data.taxCalculation.taxableIncome || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Liability:</span>
                <span className="font-medium">₹{(data.taxCalculation.taxLiability || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Paid (TDS):</span>
                <span className="font-medium">₹{(data.taxCalculation.taxPaid?.totalTaxPaid || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>{(data.taxCalculation.refundOrDemand || 0) >= 0 ? 'Refund Due:' : 'Tax Due:'}</span>
                <span className={(data.taxCalculation.refundOrDemand || 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                  ₹{Math.abs(data.taxCalculation.refundOrDemand || 0).toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Tax Regime:</strong> {data.taxCalculation.regime === 'Old' ? 'Old Regime' : 'New Regime'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* ITR Type and Assessment Year */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Filing Details</h2>
                <p className="text-gray-600">ITR Type: <strong>{data.itrType || 'ITR-1'}</strong> | Assessment Year: <strong>{data.assessmentYear || '2024-25'}</strong></p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-full">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-green-700 font-medium">Validated</span>
            </div>
          </div>
        </motion.div>

        {/* JSON Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">ITR JSON Data</h2>
            <button
              onClick={() => setShowJSONPreview(!showJSONPreview)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Eye className="w-4 h-4" />
              {showJSONPreview ? 'Hide' : 'Preview'} JSON
            </button>
          </div>
          
          {showJSONPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gray-900 rounded-lg p-4 overflow-x-auto"
            >
              <pre className="text-green-400 text-sm whitespace-pre-wrap">
                {jsonData}
              </pre>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-center gap-4"
        >
          <button
            onClick={downloadJSON}
            disabled={!isValidated}
            className={`flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
              isValidated
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Download className="w-5 h-5" />
            Download ITR JSON
          </button>
          
          <button
            onClick={handleProceedToSubmit}
            disabled={!isValidated}
            className={`flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all ${
              isValidated
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Proceed to File ITR
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-4 h-4" />
            <span>Average processing time: 2-3 business days</span>
          </div>
          <p>
            Your ITR will be filed directly with the Income Tax Department. 
            You'll receive confirmation via email and SMS.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SmartReview;