import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [itrData, setItrData] = useState<ITRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  const [showJSONPreview, setShowJSONPreview] = useState(false);
  const [jsonData, setJsonData] = useState<string>('');

  useEffect(() => {
    // Simulate loading ITR data from previous steps
    setTimeout(() => {
      const mockData: ITRData = {
        personalDetails: {
          name: 'John Doe',
          pan: 'ABCDE1234F',
          aadhaar: '1234 5678 9012',
          dateOfBirth: '1990-01-15',
          email: 'john.doe@example.com',
          mobile: '+91 9876543210',
          address: '123 Main Street, Mumbai, Maharashtra - 400001'
        },
        incomeDetails: {
          salaryIncome: 800000,
          interestIncome: 15000,
          capitalGains: 50000,
          businessIncome: 0,
          otherIncome: 5000,
          totalIncome: 870000
        },
        deductions: {
          section80C: 150000,
          section80D: 25000,
          section80G: 10000,
          otherDeductions: 5000,
          totalDeductions: 190000
        },
        taxCalculation: {
          grossTotalIncome: 870000,
          taxableIncome: 630000,
          taxLiability: 19000,
          taxPaid: 25000,
          refundDue: 6000,
          regime: 'old'
        },
        itrType: 'ITR-2',
        assessmentYear: '2024-25'
      };
      
      setItrData(mockData);
      validateData(mockData);
      generateJSON(mockData);
      setLoading(false);
    }, 1500);
  }, []);

  const validateData = (data: ITRData) => {
    const errors: string[] = [];
    
    // Validate PAN format
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.personalDetails.pan.replace(/\s/g, ''))) {
      errors.push('Invalid PAN format');
    }
    
    // Validate Aadhaar format
    if (!/^\d{4}\s\d{4}\s\d{4}$/.test(data.personalDetails.aadhaar)) {
      errors.push('Invalid Aadhaar format');
    }
    
    // Validate income calculations
    const calculatedTotal = data.incomeDetails.salaryIncome + 
                           data.incomeDetails.interestIncome + 
                           data.incomeDetails.capitalGains + 
                           data.incomeDetails.businessIncome + 
                           data.incomeDetails.otherIncome;
    
    if (Math.abs(calculatedTotal - data.incomeDetails.totalIncome) > 1) {
      errors.push('Income calculation mismatch');
    }
    
    // Validate taxable income
    const expectedTaxableIncome = data.taxCalculation.grossTotalIncome - data.deductions.totalDeductions - 50000; // Standard deduction
    if (Math.abs(expectedTaxableIncome - data.taxCalculation.taxableIncome) > 1) {
      errors.push('Taxable income calculation error');
    }
    
    setValidationErrors(errors);
    setIsValidated(errors.length === 0);
  };

  const generateJSON = (data: ITRData) => {
    const itrJson = {
      ITR: {
        ITRType: data.itrType,
        AssessmentYear: data.assessmentYear,
        PersonalInfo: {
          Name: data.personalDetails.name,
          PAN: data.personalDetails.pan.replace(/\s/g, ''),
          AadhaarNumber: data.personalDetails.aadhaar.replace(/\s/g, ''),
          DateOfBirth: data.personalDetails.dateOfBirth,
          Email: data.personalDetails.email,
          Mobile: data.personalDetails.mobile,
          Address: data.personalDetails.address
        },
        IncomeDetails: {
          SalaryIncome: data.incomeDetails.salaryIncome,
          InterestIncome: data.incomeDetails.interestIncome,
          CapitalGains: data.incomeDetails.capitalGains,
          BusinessIncome: data.incomeDetails.businessIncome,
          OtherIncome: data.incomeDetails.otherIncome,
          GrossTotalIncome: data.taxCalculation.grossTotalIncome
        },
        Deductions: {
          Section80C: data.deductions.section80C,
          Section80D: data.deductions.section80D,
          Section80G: data.deductions.section80G,
          OtherDeductions: data.deductions.otherDeductions,
          TotalDeductions: data.deductions.totalDeductions
        },
        TaxComputation: {
          TaxableIncome: data.taxCalculation.taxableIncome,
          TaxLiability: data.taxCalculation.taxLiability,
          TaxPaid: data.taxCalculation.taxPaid,
          RefundDue: data.taxCalculation.refundDue,
          TaxRegime: data.taxCalculation.regime
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
    a.download = `ITR_${itrData?.personalDetails.pan}_${itrData?.assessmentYear}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  if (!itrData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">No Data Found</h2>
          <p className="text-gray-600">Please complete the previous steps first.</p>
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
                <span className="font-medium">{itrData.personalDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">PAN:</span>
                <span className="font-medium">{itrData.personalDetails.pan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aadhaar:</span>
                <span className="font-medium">{itrData.personalDetails.aadhaar}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{itrData.personalDetails.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile:</span>
                <span className="font-medium">{itrData.personalDetails.mobile}</span>
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
                <span className="font-medium">₹{itrData.incomeDetails.salaryIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interest Income:</span>
                <span className="font-medium">₹{itrData.incomeDetails.interestIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Capital Gains:</span>
                <span className="font-medium">₹{itrData.incomeDetails.capitalGains.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Income:</span>
                <span className="font-medium">₹{itrData.incomeDetails.otherIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total Income:</span>
                <span>₹{itrData.incomeDetails.totalIncome.toLocaleString()}</span>
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
                <span className="font-medium">₹{itrData.deductions.section80C.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Section 80D:</span>
                <span className="font-medium">₹{itrData.deductions.section80D.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Section 80G:</span>
                <span className="font-medium">₹{itrData.deductions.section80G.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Deductions:</span>
                <span className="font-medium">₹{itrData.deductions.otherDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total Deductions:</span>
                <span>₹{itrData.deductions.totalDeductions.toLocaleString()}</span>
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
                <span className="font-medium">₹{itrData.taxCalculation.grossTotalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxable Income:</span>
                <span className="font-medium">₹{itrData.taxCalculation.taxableIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Liability:</span>
                <span className="font-medium">₹{itrData.taxCalculation.taxLiability.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax Paid (TDS):</span>
                <span className="font-medium">₹{itrData.taxCalculation.taxPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Refund Due:</span>
                <span className="text-green-600">₹{itrData.taxCalculation.refundDue.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Tax Regime:</strong> {itrData.taxCalculation.regime === 'old' ? 'Old Regime' : 'New Regime'}
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
                <p className="text-gray-600">ITR Type: <strong>{itrData.itrType}</strong> | Assessment Year: <strong>{itrData.assessmentYear}</strong></p>
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