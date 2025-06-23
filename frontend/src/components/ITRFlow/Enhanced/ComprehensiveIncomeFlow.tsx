import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useITRFlow } from '../../../contexts/ITRFlowContext';
import { 
  ArrowRight, 
  Upload, 
  FileText, 
  Calculator,
  Building,
  TrendingUp,
  Home,
  Briefcase,
  DollarSign,
  PiggyBank,
  Coins,
  Globe,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  AlertCircle
} from 'lucide-react';

interface IncomeSource {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  itrTypes: string[];
  category: 'basic' | 'advanced' | 'business';
  fields: string[];
  selected: boolean;
}

interface IncomeData {
  [key: string]: any;
}

const ComprehensiveIncomeFlow: React.FC = () => {
  const navigate = useNavigate();
  const { data, updateIncomeDetails, setITRType, markStepCompleted } = useITRFlow();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [incomeData, setIncomeData] = useState<IncomeData>({});
  const [recommendedITR, setRecommendedITR] = useState('ITR-1');

  const incomeSourcesConfig: IncomeSource[] = [
    {
      id: 'salary',
      name: 'Salary Income',
      icon: <Briefcase className="w-6 h-6" />,
      description: 'Salary from employers, Form 16, TDS details',
      itrTypes: ['ITR-1', 'ITR-2', 'ITR-3'],
      category: 'basic',
      fields: ['grossSalary', 'basicPay', 'hra', 'lta', 'professionalTax', 'tds'],
      selected: false
    },
    {
      id: 'interest',
      name: 'Interest Income',
      icon: <PiggyBank className="w-6 h-6" />,
      description: 'Bank interest, FD, P2P, Bonds, EPF interest',
      itrTypes: ['ITR-1', 'ITR-2', 'ITR-3'],
      category: 'basic',
      fields: ['savingsInterest', 'fdInterest', 'p2pInterest', 'bondInterest', 'epfInterest'],
      selected: false
    },
    {
      id: 'dividend',
      name: 'Dividend Income',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Dividends from shares, mutual funds',
      itrTypes: ['ITR-2', 'ITR-3'],
      category: 'basic',
      fields: ['equityDividend', 'mutualFundDividend', 'otherDividend'],
      selected: false
    },
    {
      id: 'capitalGains',
      name: 'Capital Gains',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Stocks, mutual funds, property, gold sales',
      itrTypes: ['ITR-2', 'ITR-3'],
      category: 'advanced',
      fields: ['shortTermGains', 'longTermGains', 'assetType', 'purchaseDate', 'saleDate', 'purchasePrice', 'salePrice'],
      selected: false
    },
    {
      id: 'houseProperty',
      name: 'House Property',
      icon: <Home className="w-6 h-6" />,
      description: 'Rental income, property details, home loan interest',
      itrTypes: ['ITR-2', 'ITR-3'],
      category: 'advanced',
      fields: ['rentalIncome', 'propertyType', 'municipalTax', 'homeLoanInterest', 'tenantDetails'],
      selected: false
    },
    {
      id: 'business',
      name: 'Business Income',
      icon: <Building className="w-6 h-6" />,
      description: 'Business profits, P&L statements, balance sheet',
      itrTypes: ['ITR-3', 'ITR-4'],
      category: 'business',
      fields: ['businessIncome', 'businessExpenses', 'depreciation', 'balanceSheet', 'profitLoss'],
      selected: false
    },
    {
      id: 'professional',
      name: 'Professional Income',
      icon: <FileText className="w-6 h-6" />,
      description: 'Freelancing, consultancy, professional services',
      itrTypes: ['ITR-3', 'ITR-4'],
      category: 'business',
      fields: ['professionalIncome', 'professionalExpenses', 'depreciation'],
      selected: false
    },
    {
      id: 'foreignAssets',
      name: 'Foreign Assets',
      icon: <Globe className="w-6 h-6" />,
      description: 'Foreign bank accounts, investments, properties',
      itrTypes: ['ITR-2', 'ITR-3'],
      category: 'advanced',
      fields: ['foreignBankAccount', 'foreignInvestments', 'foreignProperty', 'country'],
      selected: false
    },
    {
      id: 'virtualAssets',
      name: 'Virtual Digital Assets',
      icon: <Coins className="w-6 h-6" />,
      description: 'Cryptocurrency, NFTs, virtual digital assets',
      itrTypes: ['ITR-2', 'ITR-3'],
      category: 'advanced',
      fields: ['cryptoIncome', 'nftIncome', 'stakingIncome', 'miningIncome'],
      selected: false
    },
    {
      id: 'otherIncome',
      name: 'Other Income',
      icon: <DollarSign className="w-6 h-6" />,
      description: 'Agricultural income, lottery, gifts, other sources',
      itrTypes: ['ITR-2', 'ITR-3'],
      category: 'advanced',
      fields: ['agriculturalIncome', 'lotteryIncome', 'giftIncome', 'otherSources'],
      selected: false
    }
  ];

  const steps = [
    {
      title: 'Select Income Sources',
      description: 'Choose all your income sources for accurate ITR recommendation'
    },
    {
      title: 'Income Details',
      description: 'Provide detailed information for each selected income source'
    },
    {
      title: 'ITR Recommendation',
      description: 'Review your recommended ITR type and continue'
    }
  ];

  useEffect(() => {
    // Load existing income data from context
    if (data.incomeDetails) {
      // Set selected sources based on existing data
      const sources: string[] = [];
      if (data.incomeDetails.salary) sources.push('salary');
      if (data.incomeDetails.interest) sources.push('interest');
      if (data.incomeDetails.dividend) sources.push('dividend');
      if (data.incomeDetails.capitalGains) sources.push('capitalGains');
      if (data.incomeDetails.houseProperty) sources.push('houseProperty');
      if (data.incomeDetails.business) sources.push('business');
      if (data.incomeDetails.professional) sources.push('professional');
      if (data.incomeDetails.otherIncome) sources.push('otherIncome');
      
      setSelectedSources(sources);
    }
  }, [data.incomeDetails]);

  useEffect(() => {
    // Determine ITR type based on selected sources
    const determineITRType = () => {
      let itrType = 'ITR-1';
      
      if (selectedSources.includes('business') || selectedSources.includes('professional')) {
        itrType = 'ITR-3';
      } else if (
        selectedSources.includes('capitalGains') ||
        selectedSources.includes('houseProperty') ||
        selectedSources.includes('foreignAssets') ||
        selectedSources.includes('virtualAssets') ||
        selectedSources.some(source => 
          incomeSourcesConfig.find(config => config.id === source)?.category === 'advanced'
        )
      ) {
        itrType = 'ITR-2';
      }
      
      setRecommendedITR(itrType);
      setITRType(itrType);
    };

    determineITRType();
  }, [selectedSources, setITRType]);

  const toggleIncomeSource = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save income data to context before proceeding
      saveIncomeDataToContext();
      markStepCompleted('income');
      navigate('/fileITR/smart-flow/deductions');
    }
  };

  const saveIncomeDataToContext = () => {
    // Convert local income data to context format
    const contextIncomeData: any = {};
    
    selectedSources.forEach(sourceId => {
      const sourceData = incomeData[sourceId];
      if (!sourceData) return;
      
      switch (sourceId) {
        case 'salary':
          contextIncomeData.salary = {
            employers: [{
              employerName: sourceData.employerName || '',
              grossSalary: parseFloat(sourceData.grossSalary) || 0,
              basicPay: parseFloat(sourceData.basicPay) || 0,
              hra: parseFloat(sourceData.hra) || 0,
              lta: parseFloat(sourceData.lta) || 0,
              tdsDeducted: parseFloat(sourceData.tds) || 0,
              professionalTax: parseFloat(sourceData.professionalTax) || 0,
              standardDeduction: 50000
            }],
            totalGrossSalary: parseFloat(sourceData.grossSalary) || 0,
            totalTDS: parseFloat(sourceData.tds) || 0,
            netSalary: (parseFloat(sourceData.grossSalary) || 0) - (parseFloat(sourceData.tds) || 0)
          };
          break;
        case 'interest':
          contextIncomeData.interest = {
            savingsBankInterest: parseFloat(sourceData.savingsInterest) || 0,
            fixedDepositInterest: parseFloat(sourceData.fdInterest) || 0,
            p2pInterest: parseFloat(sourceData.p2pInterest) || 0,
            bondInterest: parseFloat(sourceData.bondInterest) || 0,
            epfInterest: parseFloat(sourceData.epfInterest) || 0,
            otherInterest: 0,
            totalInterest: (parseFloat(sourceData.savingsInterest) || 0) + 
                          (parseFloat(sourceData.fdInterest) || 0) + 
                          (parseFloat(sourceData.p2pInterest) || 0) + 
                          (parseFloat(sourceData.bondInterest) || 0) + 
                          (parseFloat(sourceData.epfInterest) || 0)
          };
          break;
        case 'dividend':
          contextIncomeData.dividend = {
            equityShares: parseFloat(sourceData.equityDividend) || 0,
            mutualFunds: parseFloat(sourceData.mutualFundDividend) || 0,
            otherCompanies: parseFloat(sourceData.otherDividend) || 0,
            totalDividend: (parseFloat(sourceData.equityDividend) || 0) + 
                          (parseFloat(sourceData.mutualFundDividend) || 0) + 
                          (parseFloat(sourceData.otherDividend) || 0)
          };
          break;
        // Add other income source mappings as needed
      }
    });
    
    updateIncomeDetails(contextIncomeData);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateIncomeData = (sourceId: string, field: string, value: any) => {
    setIncomeData(prev => ({
      ...prev,
      [sourceId]: {
        ...prev[sourceId],
        [field]: value
      }
    }));
  };

  // Load existing data from context when component mounts
  useEffect(() => {
    if (data.incomeDetails) {
      const existingData: IncomeData = {};
      
      // Map context data back to local form data
      if (data.incomeDetails.salary) {
        const employer = data.incomeDetails.salary.employers?.[0];
        if (employer) {
          existingData.salary = {
            grossSalary: employer.grossSalary?.toString() || '',
            basicPay: employer.basicPay?.toString() || '',
            hra: employer.hra?.toString() || '',
            lta: employer.lta?.toString() || '',
            tds: employer.tdsDeducted?.toString() || '',
            professionalTax: employer.professionalTax?.toString() || ''
          };
        }
      }
      
      if (data.incomeDetails.interest) {
        existingData.interest = {
          savingsInterest: data.incomeDetails.interest.savingsBankInterest?.toString() || '',
          fdInterest: data.incomeDetails.interest.fixedDepositInterest?.toString() || '',
          p2pInterest: data.incomeDetails.interest.p2pInterest?.toString() || '',
          bondInterest: data.incomeDetails.interest.bondInterest?.toString() || '',
          epfInterest: data.incomeDetails.interest.epfInterest?.toString() || ''
        };
      }
      
      if (data.incomeDetails.dividend) {
        existingData.dividend = {
          equityDividend: data.incomeDetails.dividend.equityShares?.toString() || '',
          mutualFundDividend: data.incomeDetails.dividend.mutualFunds?.toString() || '',
          otherDividend: data.incomeDetails.dividend.otherCompanies?.toString() || ''
        };
      }
      
      setIncomeData(existingData);
    }
  }, [data.incomeDetails]);

  const renderIncomeSourceSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Your Income Sources
        </h2>
        <p className="text-gray-600">
          Choose all income sources you have to get accurate ITR type recommendation
        </p>
      </div>

      {/* Basic Income Sources */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          Basic Income Sources (ITR-1 Compatible)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeSourcesConfig
            .filter(source => source.category === 'basic')
            .map((source) => (
              <motion.div
                key={source.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedSources.includes(source.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleIncomeSource(source.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedSources.includes(source.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {source.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{source.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{source.description}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {source.itrTypes.map(itr => (
                        <span 
                          key={itr} 
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {itr}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedSources.includes(source.id) && (
                    <Check className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Advanced Income Sources */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          Advanced Income Sources (ITR-2 Required)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeSourcesConfig
            .filter(source => source.category === 'advanced')
            .map((source) => (
              <motion.div
                key={source.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedSources.includes(source.id)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleIncomeSource(source.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedSources.includes(source.id)
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {source.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{source.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{source.description}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {source.itrTypes.map(itr => (
                        <span 
                          key={itr} 
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {itr}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedSources.includes(source.id) && (
                    <Check className="w-5 h-5 text-orange-600" />
                  )}
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Business Income Sources */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-purple-600" />
          Business/Professional Income (ITR-3/ITR-4 Required)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incomeSourcesConfig
            .filter(source => source.category === 'business')
            .map((source) => (
              <motion.div
                key={source.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedSources.includes(source.id)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleIncomeSource(source.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedSources.includes(source.id)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {source.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{source.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{source.description}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {source.itrTypes.map(itr => (
                        <span 
                          key={itr} 
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {itr}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedSources.includes(source.id) && (
                    <Check className="w-5 h-5 text-purple-600" />
                  )}
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Selected Sources Summary */}
      {selectedSources.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            Selected Income Sources ({selectedSources.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedSources.map(sourceId => {
              const source = incomeSourcesConfig.find(s => s.id === sourceId);
              return (
                <span 
                  key={sourceId}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {source?.name}
                  <button
                    onClick={() => toggleIncomeSource(sourceId)}
                    className="text-blue-200 hover:text-white"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
          <div className="mt-3 p-3 bg-blue-100 rounded-lg">
            <p className="text-blue-900 font-medium">
              Recommended ITR Type: <span className="text-blue-700">{recommendedITR}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderIncomeDetails = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Income Details
        </h2>
        <p className="text-gray-600">
          Provide details for your selected income sources
        </p>
      </div>

      {selectedSources.map(sourceId => {
        const source = incomeSourcesConfig.find(s => s.id === sourceId);
        if (!source) return null;

        return (
          <div key={sourceId} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                {source.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{source.name}</h3>
            </div>

            {/* Dynamic form fields based on source type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {source.fields.map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </label>
                  <input
                    type={field.includes('Amount') || field.includes('Price') || field.includes('Income') ? 'number' : 'text'}
                    value={incomeData[sourceId]?.[field] || ''}
                    onChange={(e) => updateIncomeData(sourceId, field, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            {/* File upload for documents */}
            <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload supporting documents</p>
              <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                Choose Files
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderITRRecommendation = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ITR Type Recommendation
        </h2>
        <p className="text-gray-600">
          Based on your income sources, here's our recommendation
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 text-center">
        <h3 className="text-3xl font-bold mb-4">Recommended: {recommendedITR}</h3>
        <p className="text-blue-100 mb-6">
          This ITR type covers all your selected income sources and ensures complete compliance.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold">Income Sources</h4>
            <p className="text-2xl font-bold">{selectedSources.length}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold">ITR Form</h4>
            <p className="text-2xl font-bold">{recommendedITR}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h4 className="font-semibold">Complexity</h4>
            <p className="text-2xl font-bold">
              {recommendedITR === 'ITR-1' ? 'Simple' : 
               recommendedITR === 'ITR-2' ? 'Medium' : 'Advanced'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Your Selected Income Sources
        </h4>
        <div className="space-y-3">
          {selectedSources.map(sourceId => {
            const source = incomeSourcesConfig.find(s => s.id === sourceId);
            return (
              <div key={sourceId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {source?.icon}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{source?.name}</h5>
                  <p className="text-sm text-gray-600">{source?.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">Compatible with</span>
                  <div className="flex gap-1">
                    {source?.itrTypes.map(itr => (
                      <span 
                        key={itr}
                        className={`text-xs px-2 py-1 rounded ${
                          itr === recommendedITR 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {itr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  index <= currentStep 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-1 mx-4 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && renderIncomeSourceSelection()}
              {currentStep === 1 && renderIncomeDetails()}
              {currentStep === 2 && renderITRRecommendation()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentStep === 0 && selectedSources.length === 0}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length - 1 ? 'Continue to Deductions' : 'Next'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveIncomeFlow;