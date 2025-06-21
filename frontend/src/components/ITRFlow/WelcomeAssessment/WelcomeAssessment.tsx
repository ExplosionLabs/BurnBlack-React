import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Calculator, FileText } from 'lucide-react';

const WelcomeAssessment: React.FC = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/fileITR/smart-flow/personal');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart ITR Assessment
          </h1>
          <p className="text-xl text-gray-600">
            Let's understand your income sources and recommend the best ITR type for you
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quick Assessment
              </h3>
              <p className="text-gray-600">
                Answer 3 simple questions about your income
              </p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Calculator className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Smart Recommendation
              </h3>
              <p className="text-gray-600">
                Get ITR type and regime recommendations
              </p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Guided Filing
              </h3>
              <p className="text-gray-600">
                Step-by-step assistance throughout
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
            <p className="text-blue-100 mb-6">
              This smart assessment will take approximately 3 minutes and will help us 
              recommend the best ITR type and tax regime for your situation.
            </p>
            
            <button
              onClick={handleContinue}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg flex items-center gap-2 mx-auto"
            >
              Start Assessment
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              What We'll Cover
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Income sources identification
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                ITR type recommendation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Tax regime comparison
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Estimated completion time
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Why Smart Assessment?
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                Personalized recommendations
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                Avoid filing wrong ITR type
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                Maximize tax savings
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                Faster completion
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeAssessment;