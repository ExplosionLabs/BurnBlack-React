import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ITRFlowProvider } from '../../contexts/ITRFlowContext';
import { 
  CheckCircle, 
  Clock,
  FileText,
  Calculator,
  Download,
  ArrowLeft,
  Home
} from 'lucide-react';

// Import new components
import WelcomeAssessment from './WelcomeAssessment/WelcomeAssessment';
import SmartPersonalDetails from './SmartPersonalDetails/SmartPersonalDetails';
import ComprehensiveIncomeFlow from './Enhanced/ComprehensiveIncomeFlow';
import ComprehensiveDeductions from './Enhanced/ComprehensiveDeductions';
import SmartReview from './SmartReview/SmartReview';
import SmartSubmit from './SmartSubmit/SmartSubmit';
import TestDataCapture from './TestDataCapture';

interface FlowStep {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<any>;
  estimatedTime: string;
  completed: boolean;
  current: boolean;
}

interface ITRProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  estimatedTimeRemaining: string;
  dataCompleteness: number;
}

const SmartITRFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [progress, setProgress] = useState<ITRProgress>({
    currentStep: 1,
    totalSteps: 6,
    completedSteps: [],
    estimatedTimeRemaining: '20 mins',
    dataCompleteness: 0
  });

  const [flowSteps, setFlowSteps] = useState<FlowStep[]>([
    {
      id: 'assessment',
      title: 'Smart Assessment',
      description: 'Income sources & ITR recommendation',
      path: '/fileITR/smart-flow/assessment',
      icon: FileText,
      estimatedTime: '3 mins',
      completed: false,
      current: true
    },
    {
      id: 'personal',
      title: 'Personal Details',
      description: 'Identity, contact & bank information',
      path: '/fileITR/smart-flow/personal',
      icon: CheckCircle,
      estimatedTime: '4 mins',
      completed: false,
      current: false
    },
    {
      id: 'income',
      title: 'Income Sources',
      description: 'Salary, property, investments',
      path: '/fileITR/smart-flow/income',
      icon: Calculator,
      estimatedTime: '8 mins',
      completed: false,
      current: false
    },
    {
      id: 'deductions',
      title: 'Tax Deductions',
      description: '80C, 80D, home loan interest',
      path: '/fileITR/smart-flow/deductions',
      icon: Clock,
      estimatedTime: '5 mins',
      completed: false,
      current: false
    },
    {
      id: 'review',
      title: 'Review & Calculate',
      description: 'Tax calculation & regime comparison',
      path: '/fileITR/smart-flow/review',
      icon: CheckCircle,
      estimatedTime: '3 mins',
      completed: false,
      current: false
    },
    {
      id: 'submit',
      title: 'Generate ITR',
      description: 'Download JSON for e-filing',
      path: '/fileITR/smart-flow/submit',
      icon: Download,
      estimatedTime: '2 mins',
      completed: false,
      current: false
    }
  ]);

  // Update current step based on route
  useEffect(() => {
    const currentPath = location.pathname;
    const stepIndex = flowSteps.findIndex(step => currentPath.includes(step.id));
    
    if (stepIndex !== -1) {
      setProgress(prev => ({ ...prev, currentStep: stepIndex + 1 }));
      
      setFlowSteps(prev => prev.map((step, index) => ({
        ...step,
        current: index === stepIndex,
        completed: index < stepIndex
      })));
    }
  }, [location.pathname]);

  // Calculate data completeness
  useEffect(() => {
    const completedCount = flowSteps.filter(step => step.completed).length;
    const completeness = Math.round((completedCount / flowSteps.length) * 100);
    setProgress(prev => ({ ...prev, dataCompleteness: completeness }));
  }, [flowSteps]);

  const handleStepNavigation = (stepId: string) => {
    const step = flowSteps.find(s => s.id === stepId);
    if (step) {
      navigate(step.path);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <ITRFlowProvider>
      <div className="min-h-screen bg-gray-50">
        
        {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left - Logo & Back */}
            <div className="flex items-center min-w-0 flex-shrink-0">
              <button
                onClick={goHome}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <Home className="w-5 h-5" />
              </button>
              
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">
                  Smart ITR Filing
                </h1>
                <p className="text-sm text-gray-500">
                  FY 2024-25 (AY 2025-26)
                </p>
              </div>
            </div>

            {/* Center - Progress Steps */}
            <div className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-8">
              <div className="flex items-center space-x-2">
                {flowSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      {/* Step Circle */}
                      <button
                        onClick={() => handleStepNavigation(step.id)}
                        disabled={!step.completed && !step.current}
                        className={`relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-all duration-200 ${ 
                          step.current 
                            ? 'bg-blue-600 text-white shadow-lg scale-110' 
                            : step.completed 
                              ? 'bg-green-500 text-white hover:bg-green-600 shadow-md' 
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </button>
                      
                      {/* Step Label */}
                      <div className="mt-2 text-center">
                        <div className={`text-xs font-medium whitespace-nowrap ${
                          step.current 
                            ? 'text-blue-600' 
                            : step.completed 
                              ? 'text-green-600' 
                              : 'text-gray-500'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {step.estimatedTime}
                        </div>
                      </div>
                    </div>
                    
                    {/* Connection Line */}
                    {index < flowSteps.length - 1 && (
                      <div className="flex items-center mx-4 mb-8">
                        <div className={`h-0.5 w-12 transition-colors duration-300 ${ 
                          step.completed ? 'bg-green-400' : 'bg-gray-300'
                        }`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Medium Screen Steps - Simplified */}
            <div className="hidden md:flex lg:hidden items-center space-x-1 flex-1 justify-center max-w-lg mx-4">
              {flowSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => handleStepNavigation(step.id)}
                    disabled={!step.completed && !step.current}
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all ${ 
                      step.current 
                        ? 'bg-blue-600 text-white' 
                        : step.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </button>
                  
                  {index < flowSteps.length - 1 && (
                    <div className={`w-4 h-0.5 mx-1 ${ 
                      step.completed ? 'bg-green-400' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Right - Progress Summary */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-gray-900">
                  Step {progress.currentStep} of {progress.totalSteps}
                </div>
                <div className="text-xs text-gray-500">
                  ~{progress.estimatedTimeRemaining} remaining
                </div>
              </div>
              
              <div className="w-14 h-14 relative">
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${progress.dataCompleteness}, 100`}
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {progress.dataCompleteness}%
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-sm font-semibold text-gray-900">
              {flowSteps.find(s => s.current)?.title}
            </span>
            <div className="text-xs text-gray-500 mt-1">
              {flowSteps.find(s => s.current)?.description}
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-gray-900">
              {progress.currentStep}/{progress.totalSteps}
            </span>
            <div className="text-xs text-gray-500">
              {flowSteps.find(s => s.current)?.estimatedTime}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${(progress.currentStep / progress.totalSteps) * 100}%` }}
          />
        </div>
        
        {/* Step Dots */}
        <div className="flex justify-between mt-3">
          {flowSteps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-2 h-2 rounded-full ${
                step.current 
                  ? 'bg-blue-600' 
                  : step.completed 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
              }`} />
              <span className="text-xs text-gray-400 mt-1 text-center">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              
              {/* Welcome Assessment */}
              <Route 
                path="assessment" 
                element={<WelcomeAssessment />} 
              />
              
              {/* Smart Personal Details */}
              <Route 
                path="personal" 
                element={<SmartPersonalDetails />} 
              />
              
              {/* Income Source Flow */}
              <Route 
                path="income" 
                element={<ComprehensiveIncomeFlow />} 
              />
              
              {/* Deductions Flow */}
              <Route 
                path="deductions" 
                element={<ComprehensiveDeductions />} 
              />
              
              {/* Review & Calculate */}
              <Route 
                path="review" 
                element={<SmartReview />} 
              />
              
              {/* ITR Generation & Submit */}
              <Route 
                path="submit" 
                element={<SmartSubmit />} 
              />
              
              {/* Default redirect to assessment */}
              <Route 
                path="*" 
                element={<WelcomeAssessment />} 
              />
              
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Help & Support Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Auto-save Indicator */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-lg flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          <span className="text-sm text-gray-600">Auto-saving...</span>
        </div>
      </div>

      {/* Test Data Capture Component (Development Only) */}
      <TestDataCapture />

      </div>
    </ITRFlowProvider>
  );
};

export default SmartITRFlow;