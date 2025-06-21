import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    <div className="min-h-screen bg-gray-50">
      
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left - Logo & Back */}
            <div className="flex items-center">
              <button
                onClick={goHome}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <Home className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Smart ITR Filing
                </h1>
                <p className="text-sm text-gray-500">
                  FY 2024-25 (AY 2025-26)
                </p>
              </div>
            </div>

            {/* Center - Progress Steps */}
            <div className="hidden lg:flex items-center space-x-1">
              {flowSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => handleStepNavigation(step.id)}
                    disabled={!step.completed && !step.current}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${ 
                      step.current 
                        ? 'bg-blue-600 text-white' 
                        : step.completed 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <step.icon className="w-4 h-4 mr-2" />
                    <span className="hidden xl:inline">{step.title}</span>
                    <span className="xl:hidden">{index + 1}</span>
                  </button>
                  
                  {index < flowSteps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-1 ${ 
                      step.completed ? 'bg-green-400' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Right - Progress Summary */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  Step {progress.currentStep} of {progress.totalSteps}
                </div>
                <div className="text-xs text-gray-500">
                  ~{progress.estimatedTimeRemaining} remaining
                </div>
              </div>
              
              <div className="w-12 h-12 relative">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeDasharray={`${progress.dataCompleteness}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">
                    {progress.dataCompleteness}%
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">
            {flowSteps.find(s => s.current)?.title}
          </span>
          <span className="text-sm text-gray-500">
            {progress.currentStep}/{progress.totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(progress.currentStep / progress.totalSteps) * 100}%` }}
          />
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

    </div>
  );
};

export default SmartITRFlow;