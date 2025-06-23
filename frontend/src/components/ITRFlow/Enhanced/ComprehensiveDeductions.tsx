import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useITRFlow } from '../../../contexts/ITRFlowContext';
import { 
  ArrowRight, 
  Plus, 
  Trash2, 
  Calculator, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  BookOpen,
  Receipt,
  Heart,
  GraduationCap,
  Home,
  Briefcase,
  PiggyBank,
  Shield,
  Users,
  Building,
  FileText,
  CreditCard,
  Coins
} from 'lucide-react';

interface DeductionSection {
  id: string;
  section: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  maxLimit?: number | null;
  category: 'popular' | 'medical' | 'investment' | 'loan' | 'donation' | 'special';
  fields: DeductionField[];
  selected: boolean;
}

interface DeductionField {
  id: string;
  name: string;
  type: 'number' | 'text' | 'select' | 'file';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface DeductionData {
  [sectionId: string]: {
    [fieldId: string]: any;
  };
}

interface TaxSaving {
  oldRegime: number;
  newRegime: number;
  recommendedRegime: 'old' | 'new';
  totalDeductions: number;
  sectionWiseSavings: { [section: string]: number };
}

const ComprehensiveDeductions: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateDeductionDetails, markStepCompleted, getTotalIncome, calculateTax } = useITRFlow();
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [deductionData, setDeductionData] = useState<DeductionData>({});
  const [taxSaving, setTaxSaving] = useState<TaxSaving | null>(null);
  
  // Get actual income from context instead of hardcoded value
  const annualIncome = getTotalIncome();

  const deductionSections: DeductionSection[] = [
    // Popular Deductions
    {
      id: '80C',
      section: '80C',
      title: 'Section 80C',
      icon: <PiggyBank className="w-6 h-6" />,
      description: 'Life Insurance, PPF, ELSS, NSC, Tax-saving FD, ULIP',
      maxLimit: 150000,
      category: 'popular',
      fields: [
        { id: 'lifeInsurance', name: 'Life Insurance Premium', type: 'number', placeholder: 'Enter premium amount', required: false },
        { id: 'ppf', name: 'PPF Contribution', type: 'number', placeholder: 'Enter PPF amount' },
        { id: 'elss', name: 'ELSS Mutual Funds', type: 'number', placeholder: 'Enter investment amount' },
        { id: 'nsc', name: 'NSC Investment', type: 'number', placeholder: 'Enter NSC amount' },
        { id: 'taxSavingFD', name: 'Tax Saving FD', type: 'number', placeholder: 'Enter FD amount' },
        { id: 'ulip', name: 'ULIP Premium', type: 'number', placeholder: 'Enter ULIP amount' },
        { id: 'homeLoanPrincipal', name: 'Home Loan Principal', type: 'number', placeholder: 'Enter principal amount' }
      ],
      selected: false
    },
    {
      id: '80D',
      section: '80D',
      title: 'Section 80D',
      icon: <Heart className="w-6 h-6" />,
      description: 'Medical Insurance Premiums (Self, Family, Parents)',
      maxLimit: 75000,
      category: 'medical',
      fields: [
        { id: 'selfFamily', name: 'Self & Family Premium', type: 'number', placeholder: 'Enter premium amount' },
        { id: 'parents', name: 'Parents Premium', type: 'number', placeholder: 'Enter premium amount' },
        { id: 'preventiveHealth', name: 'Preventive Health Checkup', type: 'number', placeholder: 'Enter checkup amount' },
        { id: 'seniorCitizen', name: 'Senior Citizen Premium', type: 'number', placeholder: 'Enter premium amount' }
      ],
      selected: false
    },
    {
      id: '80TTA',
      section: '80TTA',
      title: 'Section 80TTA',
      icon: <Receipt className="w-6 h-6" />,
      description: 'Interest on Savings Bank Account',
      maxLimit: 10000,
      category: 'investment',
      fields: [
        { id: 'savingsInterest', name: 'Savings Account Interest', type: 'number', placeholder: 'Enter interest amount' }
      ],
      selected: false
    },
    {
      id: '80TTB',
      section: '80TTB',
      title: 'Section 80TTB',
      icon: <Users className="w-6 h-6" />,
      description: 'Interest on Deposits (Senior Citizens)',
      maxLimit: 50000,
      category: 'investment',
      fields: [
        { id: 'depositInterest', name: 'Interest on Deposits', type: 'number', placeholder: '50000' }
      ],
      selected: false
    },
    {
      id: '80E',
      section: '80E',
      title: 'Section 80E',
      icon: <GraduationCap className="w-6 h-6" />,
      description: 'Education Loan Interest (No Upper Limit)',
      maxLimit: null,
      category: 'loan',
      fields: [
        { id: 'loanInterest', name: 'Education Loan Interest', type: 'number', placeholder: '50000' },
        { id: 'studentName', name: 'Student Name', type: 'text', placeholder: 'Student Name' },
        { id: 'loanAccount', name: 'Loan Account Number', type: 'text', placeholder: 'Loan Account' }
      ],
      selected: false
    },
    {
      id: '80EE',
      section: '80EE',
      title: 'Section 80EE',
      icon: <Home className="w-6 h-6" />,
      description: 'Home Loan Interest (First Time Buyers)',
      maxLimit: 50000,
      category: 'loan',
      fields: [
        { id: 'homeLoanInterest', name: 'Home Loan Interest', type: 'number', placeholder: '50000' },
        { id: 'loanDate', name: 'Loan Sanction Date', type: 'text', placeholder: 'DD/MM/YYYY' },
        { id: 'propertyValue', name: 'Property Value', type: 'number', placeholder: '5000000' }
      ],
      selected: false
    },
    {
      id: '80EEA',
      section: '80EEA',
      title: 'Section 80EEA',
      icon: <Home className="w-6 h-6" />,
      description: 'Additional Home Loan Interest',
      maxLimit: 150000,
      category: 'loan',
      fields: [
        { id: 'additionalInterest', name: 'Additional Interest', type: 'number', placeholder: '150000' },
        { id: 'stampDutyValue', name: 'Stamp Duty Value', type: 'number', placeholder: '4500000' }
      ],
      selected: false
    },
    {
      id: '80G',
      section: '80G',
      title: 'Section 80G',
      icon: <Heart className="w-6 h-6" />,
      description: 'Donations to Charitable Organizations',
      maxLimit: null,
      category: 'donation',
      fields: [
        { id: 'donation100', name: '100% Deduction Donations', type: 'number', placeholder: '25000' },
        { id: 'donation50', name: '50% Deduction Donations', type: 'number', placeholder: '10000' },
        { id: 'organizationName', name: 'Organization Name', type: 'text', placeholder: 'Organization Name' },
        { id: 'receiptNumber', name: 'Receipt Number', type: 'text', placeholder: 'Receipt Number' }
      ],
      selected: false
    },
    {
      id: '80GG',
      section: '80GG',
      title: 'Section 80GG',
      icon: <Building className="w-6 h-6" />,
      description: 'House Rent Allowance (No HRA from Employer)',
      maxLimit: null,
      category: 'special',
      fields: [
        { id: 'rentPaid', name: 'Annual Rent Paid', type: 'number', placeholder: '120000' },
        { id: 'landlordName', name: 'Landlord Name', type: 'text', placeholder: 'Landlord Name' },
        { id: 'landlordPAN', name: 'Landlord PAN', type: 'text', placeholder: 'ABCDE1234F' }
      ],
      selected: false
    },
    {
      id: '80GGA',
      section: '80GGA',
      title: 'Section 80GGA',
      icon: <BookOpen className="w-6 h-6" />,
      description: 'Donations for Scientific Research',
      maxLimit: null,
      category: 'donation',
      fields: [
        { id: 'researchDonation', name: 'Research Donation', type: 'number', placeholder: '50000' },
        { id: 'instituteName', name: 'Research Institute', type: 'text', placeholder: 'Institute Name' }
      ],
      selected: false
    },
    {
      id: '80GGC',
      section: '80GGC',
      title: 'Section 80GGC',
      icon: <Users className="w-6 h-6" />,
      description: 'Donations to Political Parties',
      maxLimit: null,
      category: 'donation',
      fields: [
        { id: 'politicalDonation', name: 'Political Donation', type: 'number', placeholder: '10000' },
        { id: 'partyName', name: 'Political Party', type: 'text', placeholder: 'Party Name' }
      ],
      selected: false
    },
    {
      id: '80U',
      section: '80U',
      title: 'Section 80U',
      icon: <Shield className="w-6 h-6" />,
      description: 'Disability Deduction (Self)',
      maxLimit: 125000,
      category: 'special',
      fields: [
        { id: 'disabilityType', name: 'Disability Type', type: 'select', options: ['Normal', 'Severe'], required: true },
        { id: 'certificateNumber', name: 'Medical Certificate Number', type: 'text', placeholder: 'Certificate Number' }
      ],
      selected: false
    },
    {
      id: '80DD',
      section: '80DD',
      title: 'Section 80DD',
      icon: <Users className="w-6 h-6" />,
      description: 'Disability Deduction (Dependent)',
      maxLimit: 125000,
      category: 'special',
      fields: [
        { id: 'dependentDisability', name: 'Disability Type', type: 'select', options: ['Normal', 'Severe'], required: true },
        { id: 'dependentName', name: 'Dependent Name', type: 'text', placeholder: 'Dependent Name' },
        { id: 'relationship', name: 'Relationship', type: 'text', placeholder: 'Son/Daughter/Spouse' }
      ],
      selected: false
    },
    {
      id: '80CCC',
      section: '80CCC',
      title: 'Section 80CCC',
      icon: <Briefcase className="w-6 h-6" />,
      description: 'Pension Fund Contribution',
      maxLimit: 150000,
      category: 'investment',
      fields: [
        { id: 'pensionContribution', name: 'Pension Fund Contribution', type: 'number', placeholder: '50000' },
        { id: 'fundName', name: 'Pension Fund Name', type: 'text', placeholder: 'Fund Name' }
      ],
      selected: false
    },
    {
      id: '80CCD1',
      section: '80CCD(1)',
      title: 'Section 80CCD(1)',
      icon: <PiggyBank className="w-6 h-6" />,
      description: 'NPS Employee Contribution',
      maxLimit: 150000,
      category: 'investment',
      fields: [
        { id: 'npsContribution', name: 'NPS Contribution', type: 'number', placeholder: '50000' },
        { id: 'npsAccount', name: 'NPS Account Number', type: 'text', placeholder: 'NPS Account' }
      ],
      selected: false
    },
    {
      id: '80CCD1B',
      section: '80CCD(1B)',
      title: 'Section 80CCD(1B)',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Additional NPS Contribution',
      maxLimit: 50000,
      category: 'investment',
      fields: [
        { id: 'additionalNPS', name: 'Additional NPS Contribution', type: 'number', placeholder: '50000' }
      ],
      selected: false
    },
    {
      id: '80CCD2',
      section: '80CCD(2)',
      title: 'Section 80CCD(2)',
      icon: <Building className="w-6 h-6" />,
      description: 'NPS Employer Contribution',
      maxLimit: null,
      category: 'investment',
      fields: [
        { id: 'employerNPS', name: 'Employer NPS Contribution', type: 'number', placeholder: '100000' }
      ],
      selected: false
    }
  ];

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const updateDeductionData = (sectionId: string, fieldId: string, value: any) => {
    setDeductionData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [fieldId]: value
      }
    }));
  };

  const calculateTaxSaving = () => {
    const totalDeductions = Object.keys(deductionData).reduce((total, sectionId) => {
      const sectionData = deductionData[sectionId];
      const sectionTotal = Object.values(sectionData).reduce((sum: number, value: any) => {
        const numValue = parseFloat(value) || 0;
        return sum + numValue;
      }, 0);
      
      // Apply section limits
      const section = deductionSections.find(s => s.id === sectionId);
      const limitedAmount = section?.maxLimit ? Math.min(sectionTotal, section.maxLimit) : sectionTotal;
      
      return total + limitedAmount;
    }, 0);

    // Tax calculation using context method
    const taxableIncomeOld = Math.max(0, annualIncome - totalDeductions - 50000); // Standard deduction
    const taxableIncomeNew = Math.max(0, annualIncome - 50000); // Only standard deduction

    const oldRegimeTax = calculateTaxInternal(taxableIncomeOld, 'old');
    const newRegimeTax = calculateTaxInternal(taxableIncomeNew, 'new');

    setTaxSaving({
      oldRegime: oldRegimeTax,
      newRegime: newRegimeTax,
      recommendedRegime: oldRegimeTax < newRegimeTax ? 'old' : 'new',
      totalDeductions,
      sectionWiseSavings: {} // Calculate section-wise savings
    });
  };

  const calculateTaxInternal = (income: number, regime: 'old' | 'new'): number => {
    if (regime === 'old') {
      if (income <= 250000) return 0;
      if (income <= 500000) return (income - 250000) * 0.05;
      if (income <= 1000000) return 12500 + (income - 500000) * 0.2;
      return 112500 + (income - 1000000) * 0.3;
    } else {
      if (income <= 300000) return 0;
      if (income <= 600000) return (income - 300000) * 0.05;
      if (income <= 900000) return 15000 + (income - 600000) * 0.1;
      if (income <= 1200000) return 45000 + (income - 900000) * 0.15;
      if (income <= 1500000) return 90000 + (income - 1200000) * 0.2;
      return 150000 + (income - 1500000) * 0.3;
    }
  };

  // Load existing deduction data from context
  useEffect(() => {
    if (data.deductionDetails) {
      const existingData: DeductionData = {};
      const existingSections: string[] = [];
      
      // Map context data back to local form data
      if (data.deductionDetails.section80C && data.deductionDetails.section80C.total > 0) {
        existingSections.push('80C');
        existingData['80C'] = {
          lifeInsurance: data.deductionDetails.section80C.lifeInsurance?.toString() || '',
          ppf: data.deductionDetails.section80C.ppf?.toString() || '',
          elss: data.deductionDetails.section80C.elss?.toString() || '',
          nsc: data.deductionDetails.section80C.nsc?.toString() || '',
          taxSavingFD: data.deductionDetails.section80C.taxSavingFD?.toString() || '',
          ulip: data.deductionDetails.section80C.ulip?.toString() || '',
          homeLoanPrincipal: data.deductionDetails.section80C.homeLoanPrincipal?.toString() || ''
        };
      }
      
      if (data.deductionDetails.section80D && data.deductionDetails.section80D.total > 0) {
        existingSections.push('80D');
        existingData['80D'] = {
          selfFamily: data.deductionDetails.section80D.selfAndFamily?.toString() || '',
          parents: data.deductionDetails.section80D.parents?.toString() || '',
          preventiveHealth: data.deductionDetails.section80D.preventiveHealthCheckup?.toString() || '',
          seniorCitizen: data.deductionDetails.section80D.seniorCitizenPremium?.toString() || ''
        };
      }
      
      if (data.deductionDetails.section80E && data.deductionDetails.section80E.educationLoanInterest > 0) {
        existingSections.push('80E');
        existingData['80E'] = {
          loanInterest: data.deductionDetails.section80E.educationLoanInterest?.toString() || ''
        };
      }
      
      setSelectedSections(existingSections);
      setDeductionData(existingData);
    }
  }, [data.deductionDetails]);

  useEffect(() => {
    calculateTaxSaving();
  }, [deductionData, annualIncome]);

  const handleContinue = () => {
    // Save deduction data to context before proceeding
    saveDeductionDataToContext();
    markStepCompleted('deductions');
    navigate('/fileITR/smart-flow/review');
  };

  const saveDeductionDataToContext = () => {
    // Convert local deduction data to context format
    const contextDeductionData: any = {};
    
    selectedSections.forEach(sectionId => {
      const sectionData = deductionData[sectionId];
      if (!sectionData) return;
      
      switch (sectionId) {
        case '80C':
          contextDeductionData.section80C = {
            lifeInsurance: parseFloat(sectionData.lifeInsurance) || 0,
            ppf: parseFloat(sectionData.ppf) || 0,
            elss: parseFloat(sectionData.elss) || 0,
            nsc: parseFloat(sectionData.nsc) || 0,
            taxSavingFD: parseFloat(sectionData.taxSavingFD) || 0,
            ulip: parseFloat(sectionData.ulip) || 0,
            homeLoanPrincipal: parseFloat(sectionData.homeLoanPrincipal) || 0,
            total: Math.min(150000, (parseFloat(sectionData.lifeInsurance) || 0) + 
                                   (parseFloat(sectionData.ppf) || 0) + 
                                   (parseFloat(sectionData.elss) || 0) + 
                                   (parseFloat(sectionData.nsc) || 0) + 
                                   (parseFloat(sectionData.taxSavingFD) || 0) + 
                                   (parseFloat(sectionData.ulip) || 0) + 
                                   (parseFloat(sectionData.homeLoanPrincipal) || 0))
          };
          break;
        case '80D':
          contextDeductionData.section80D = {
            selfAndFamily: parseFloat(sectionData.selfFamily) || 0,
            parents: parseFloat(sectionData.parents) || 0,
            preventiveHealthCheckup: parseFloat(sectionData.preventiveHealth) || 0,
            seniorCitizenPremium: parseFloat(sectionData.seniorCitizen) || 0,
            total: Math.min(75000, (parseFloat(sectionData.selfFamily) || 0) + 
                                  (parseFloat(sectionData.parents) || 0) + 
                                  (parseFloat(sectionData.preventiveHealth) || 0) + 
                                  (parseFloat(sectionData.seniorCitizen) || 0))
          };
          break;
        case '80E':
          contextDeductionData.section80E = {
            educationLoanInterest: parseFloat(sectionData.loanInterest) || 0
          };
          break;
        // Add other section mappings as needed
      }
    });
    
    // Calculate total deductions
    const totalDeductions = Object.values(contextDeductionData).reduce((total: number, section: any) => {
      if (section && typeof section === 'object' && section.total !== undefined) {
        return total + section.total;
      }
      return total;
    }, 0);
    
    contextDeductionData.totalDeductions = totalDeductions;
    
    updateDeductionDetails(contextDeductionData);
  };

  const categorizedSections = {
    popular: deductionSections.filter(s => s.category === 'popular'),
    medical: deductionSections.filter(s => s.category === 'medical'),
    investment: deductionSections.filter(s => s.category === 'investment'),
    loan: deductionSections.filter(s => s.category === 'loan'),
    donation: deductionSections.filter(s => s.category === 'donation'),
    special: deductionSections.filter(s => s.category === 'special')
  };

  const renderSectionCategory = (title: string, sections: DeductionSection[], color: string) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedSections.includes(section.id)
                ? `border-${color}-500 bg-${color}-50`
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => toggleSection(section.id)}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                selectedSections.includes(section.id)
                  ? `bg-${color}-600 text-white`
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {section.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{section.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                {section.maxLimit && (
                  <p className="text-xs text-gray-500 mt-1">
                    Max: ₹{section.maxLimit.toLocaleString()}
                  </p>
                )}
              </div>
              {selectedSections.includes(section.id) && (
                <CheckCircle className={`w-5 h-5 text-${color}-600`} />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tax Deductions & Investments
          </h1>
          <p className="text-gray-600">
            Maximize your tax savings with comprehensive deduction coverage
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Deductions Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8">
              
              {/* Popular Deductions */}
              {renderSectionCategory('Popular Tax Saving Options', categorizedSections.popular, 'blue')}
              
              {/* Medical & Health */}
              {renderSectionCategory('Medical & Health Insurance', categorizedSections.medical, 'red')}
              
              {/* Investment Deductions */}
              {renderSectionCategory('Investment & Retirement', categorizedSections.investment, 'green')}
              
              {/* Loan Interest */}
              {renderSectionCategory('Loan Interest Deductions', categorizedSections.loan, 'orange')}
              
              {/* Donations */}
              {renderSectionCategory('Donations & Charitable Giving', categorizedSections.donation, 'purple')}
              
              {/* Special Deductions */}
              {renderSectionCategory('Special Circumstances', categorizedSections.special, 'indigo')}

              {/* Selected Deductions Details */}
              {selectedSections.length > 0 && (
                <div className="mt-8 border-t pt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Deduction Details
                  </h3>
                  
                  <div className="space-y-8">
                    {selectedSections.map(sectionId => {
                      const section = deductionSections.find(s => s.id === sectionId);
                      if (!section) return null;

                      return (
                        <div key={sectionId} className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                {section.icon}
                              </div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {section.title}
                              </h4>
                            </div>
                            <button
                              onClick={() => toggleSection(sectionId)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {section.fields.map(field => (
                              <div key={field.id}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  {field.name}
                                  {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                                
                                {field.type === 'select' ? (
                                  <select
                                    value={deductionData[sectionId]?.[field.id] || ''}
                                    onChange={(e) => updateDeductionData(sectionId, field.id, e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    <option value="">Select {field.name}</option>
                                    {field.options?.map(option => (
                                      <option key={option} value={option}>{option}</option>
                                    ))}
                                  </select>
                                ) : field.type === 'file' ? (
                                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600">Upload supporting documents</p>
                                    <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                                      Choose Files
                                    </button>
                                  </div>
                                ) : (
                                  <input
                                    type={field.type}
                                    value={deductionData[sectionId]?.[field.id] || ''}
                                    onChange={(e) => updateDeductionData(sectionId, field.id, e.target.value)}
                                    placeholder={field.placeholder}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleContinue}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Review
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tax Calculation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Tax Impact
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Annual Income</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{annualIncome.toLocaleString()}
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">Total Deductions</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ₹{taxSaving?.totalDeductions.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {selectedSections.length} sections selected
                  </p>
                </div>
                
                {taxSaving && (
                  <>
                    <div className="border-t pt-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Tax Comparison</h3>
                      
                      <div className="space-y-3">
                        <div className={`p-3 rounded-lg ${
                          taxSaving.recommendedRegime === 'old' 
                            ? 'bg-green-50 border-2 border-green-200' 
                            : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Old Regime</span>
                            {taxSaving.recommendedRegime === 'old' && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            ₹{taxSaving.oldRegime.toLocaleString()}
                          </p>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${
                          taxSaving.recommendedRegime === 'new' 
                            ? 'bg-green-50 border-2 border-green-200' 
                            : 'bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">New Regime</span>
                            {taxSaving.recommendedRegime === 'new' && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            ₹{taxSaving.newRegime.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-900">Tax Savings</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">
                        ₹{Math.abs(taxSaving.oldRegime - taxSaving.newRegime).toLocaleString()}
                      </p>
                      <p className="text-sm text-green-700">
                        with {taxSaving.recommendedRegime === 'old' ? 'Old' : 'New'} Regime
                      </p>
                    </div>
                  </>
                )}
                
                <div className="pt-4 border-t">
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">Smart Recommendation</p>
                      <p>
                        {taxSaving?.recommendedRegime === 'old' 
                          ? 'Keep adding deductions to maximize savings'
                          : 'New Regime offers better tax efficiency for your income'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveDeductions;