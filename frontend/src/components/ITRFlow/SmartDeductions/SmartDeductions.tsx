import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
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
  Briefcase
} from 'lucide-react';

interface DeductionItem {
  id: string;
  section: string;
  description: string;
  amount: number;
  maxLimit?: number;
  category: string;
  documents?: string[];
}

interface TaxSaving {
  oldRegime: number;
  newRegime: number;
  recommendedRegime: 'old' | 'new';
  totalDeductions: number;
}

const deductionCategories = [
  {
    id: '80C',
    title: 'Section 80C',
    icon: <Save className="w-5 h-5" />,
    description: 'Life Insurance, PPF, ELSS, NSC, Tax-saving FD',
    maxLimit: 150000,
    color: 'blue'
  },
  {
    id: '80D',
    title: 'Section 80D',
    icon: <Heart className="w-5 h-5" />,
    description: 'Medical Insurance Premiums',
    maxLimit: 75000,
    color: 'red'
  },
  {
    id: '80E',
    title: 'Section 80E',
    icon: <GraduationCap className="w-5 h-5" />,
    description: 'Education Loan Interest',
    maxLimit: null,
    color: 'green'
  },
  {
    id: '80G',
    title: 'Section 80G',
    icon: <Heart className="w-5 h-5" />,
    description: 'Donations to Charitable Organizations',
    maxLimit: null,
    color: 'purple'
  },
  {
    id: '80EEA',
    title: 'Section 80EEA',
    icon: <Home className="w-5 h-5" />,
    description: 'Home Loan Interest',
    maxLimit: 150000,
    color: 'orange'
  },
  {
    id: '80TTA',
    title: 'Section 80TTA',
    icon: <Receipt className="w-5 h-5" />,
    description: 'Interest on Savings Account',
    maxLimit: 10000,
    color: 'indigo'
  }
];

const SmartDeductions: React.FC = () => {
  const [deductions, setDeductions] = useState<DeductionItem[]>([]);
  const [taxSaving, setTaxSaving] = useState<TaxSaving | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('80C');
  const [newDeduction, setNewDeduction] = useState({
    section: '80C',
    description: '',
    amount: 0
  });

  // Mock annual income for calculation
  const [annualIncome] = useState(800000);

  useEffect(() => {
    calculateTaxSaving();
  }, [deductions]);

  const calculateTaxSaving = () => {
    const totalDeductions = deductions.reduce((sum, item) => sum + item.amount, 0);
    
    // Simple tax calculation for demonstration
    const taxableIncomeOld = Math.max(0, annualIncome - totalDeductions - 50000); // Standard deduction
    const taxableIncomeNew = Math.max(0, annualIncome - 50000); // Only standard deduction
    
    const oldRegimeTax = calculateTax(taxableIncomeOld, 'old');
    const newRegimeTax = calculateTax(taxableIncomeNew, 'new');
    
    setTaxSaving({
      oldRegime: oldRegimeTax,
      newRegime: newRegimeTax,
      recommendedRegime: oldRegimeTax < newRegimeTax ? 'old' : 'new',
      totalDeductions
    });
  };

  const calculateTax = (income: number, regime: 'old' | 'new'): number => {
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

  const addDeduction = () => {
    if (newDeduction.description && newDeduction.amount > 0) {
      const category = deductionCategories.find(cat => cat.id === newDeduction.section);
      const existingTotal = deductions
        .filter(d => d.section === newDeduction.section)
        .reduce((sum, d) => sum + d.amount, 0);
      
      if (category?.maxLimit && existingTotal + newDeduction.amount > category.maxLimit) {
        alert(`Maximum limit for ${category.title} is ₹${category.maxLimit.toLocaleString()}`);
        return;
      }

      const deduction: DeductionItem = {
        id: Date.now().toString(),
        section: newDeduction.section,
        description: newDeduction.description,
        amount: newDeduction.amount,
        category: category?.title || '',
        maxLimit: category?.maxLimit
      };

      setDeductions([...deductions, deduction]);
      setNewDeduction({ section: '80C', description: '', amount: 0 });
    }
  };

  const removeDeduction = (id: string) => {
    setDeductions(deductions.filter(d => d.id !== id));
  };

  const getUsedAmount = (section: string): number => {
    return deductions
      .filter(d => d.section === section)
      .reduce((sum, d) => sum + d.amount, 0);
  };

  const getRemainingLimit = (section: string): number | null => {
    const category = deductionCategories.find(cat => cat.id === section);
    if (!category?.maxLimit) return null;
    return Math.max(0, category.maxLimit - getUsedAmount(section));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Smart Tax Deductions
          </h1>
          <p className="text-gray-600">
            Maximize your tax savings with intelligent deduction recommendations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Deduction Categories */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Tax Deduction Categories
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {deductionCategories.map((category) => {
                  const usedAmount = getUsedAmount(category.id);
                  const remainingLimit = getRemainingLimit(category.id);
                  const progressPercentage = category.maxLimit 
                    ? (usedAmount / category.maxLimit) * 100 
                    : 0;

                  return (
                    <motion.div
                      key={category.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        activeCategory === category.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg bg-${category.color}-100 text-${category.color}-600`}>
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Used: ₹{usedAmount.toLocaleString()}</span>
                          {category.maxLimit && (
                            <span>Limit: ₹{category.maxLimit.toLocaleString()}</span>
                          )}
                        </div>
                        
                        {category.maxLimit && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-${category.color}-500 h-2 rounded-full transition-all`}
                              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                            />
                          </div>
                        )}
                        
                        {remainingLimit !== null && (
                          <p className="text-xs text-gray-500 mt-1">
                            Remaining: ₹{remainingLimit.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Add New Deduction Form */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Add New Deduction
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section
                    </label>
                    <select
                      value={newDeduction.section}
                      onChange={(e) => setNewDeduction({...newDeduction, section: e.target.value})}
                      className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {deductionCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newDeduction.description}
                      onChange={(e) => setNewDeduction({...newDeduction, description: e.target.value})}
                      placeholder="e.g., LIC Premium"
                      className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={newDeduction.amount || ''}
                      onChange={(e) => setNewDeduction({...newDeduction, amount: Number(e.target.value)})}
                      placeholder="0"
                      className="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <button
                  onClick={addDeduction}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Deduction
                </button>
              </div>

              {/* Added Deductions List */}
              {deductions.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Your Deductions
                  </h3>
                  
                  <div className="space-y-3">
                    {deductions.map((deduction) => (
                      <motion.div
                        key={deduction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-blue-600">
                              {deduction.section}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-600">
                              {deduction.description}
                            </span>
                          </div>
                          <p className="text-lg font-semibold text-gray-900">
                            ₹{deduction.amount.toLocaleString()}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => removeDeduction(deduction.id)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tax Calculation Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Tax Calculation
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
                          ? 'Continue with deductions to maximize savings'
                          : 'Consider New Regime for better tax efficiency'
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

export default SmartDeductions;