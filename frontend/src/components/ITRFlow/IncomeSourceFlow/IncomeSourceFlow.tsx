import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Upload, FileText, Calculator } from 'lucide-react';

const IncomeSourceFlow: React.FC = () => {
  const navigate = useNavigate();
  const [salaryIncome, setSalaryIncome] = useState('');
  const [interestIncome, setInterestIncome] = useState('');

  const handleContinue = () => {
    navigate('/fileITR/smart-flow/deductions');
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
            Income Sources
          </h1>
          <p className="text-lg text-gray-600">
            Let's collect your income information for FY 2024-25
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Income Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Primary Income Sources
              </h2>

              {/* Salary Income */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Salary Income
                </h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Upload Form 16
                    </h4>
                    <p className="text-gray-600 mb-4">
                      We'll automatically extract your salary details
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Choose File
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Salary
                    </label>
                    <input
                      type="number"
                      value={salaryIncome}
                      onChange={(e) => setSalaryIncome(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="800000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Deducted (TDS)
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="25000"
                    />
                  </div>
                </div>
              </div>

              {/* Interest Income */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-green-600" />
                  Interest Income
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Savings Account Interest
                    </label>
                    <input
                      type="number"
                      value={interestIncome}
                      onChange={(e) => setInterestIncome(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      FD Interest
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="8000"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleContinue}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue to Deductions
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Income Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Income Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary Income:</span>
                  <span className="font-medium">
                    ₹{salaryIncome ? parseInt(salaryIncome).toLocaleString() : '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Income:</span>
                  <span className="font-medium">
                    ₹{interestIncome ? parseInt(interestIncome).toLocaleString() : '0'}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Income:</span>
                    <span className="text-blue-600">
                      ₹{(
                        (parseInt(salaryIncome) || 0) + 
                        (parseInt(interestIncome) || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Recommended ITR Type
                </h4>
                <p className="text-blue-700 text-sm">
                  Based on your income sources, ITR-1 would be suitable for your filing.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeSourceFlow;