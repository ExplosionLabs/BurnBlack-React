import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Upload, 
  Clock, 
  Download, 
  FileText, 
  Shield,
  AlertCircle,
  ArrowRight,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Receipt,
  Smartphone,
  Globe,
  RefreshCw,
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubmissionStatus {
  stage: 'uploading' | 'processing' | 'validating' | 'filing' | 'completed' | 'error';
  progress: number;
  message: string;
  estimatedTime?: string;
}

interface ITRFilingResult {
  acknowledgmentNumber: string;
  filingDate: string;
  assessmentYear: string;
  itrType: string;
  refundAmount: number;
  status: 'Filed Successfully' | 'Processing' | 'Verified' | 'Error';
  processingTime: string;
  downloadLinks: {
    acknowledgment: string;
    itrXML: string;
    taxComputationSheet: string;
  };
}

const SmartSubmit: React.FC = () => {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>({
    stage: 'uploading',
    progress: 0,
    message: 'Preparing your ITR for submission...'
  });
  
  const [filingResult, setFilingResult] = useState<ITRFilingResult | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    simulateSubmissionProcess();
  }, []);

  const simulateSubmissionProcess = async () => {
    const stages: SubmissionStatus[] = [
      {
        stage: 'uploading',
        progress: 20,
        message: 'Uploading your ITR data to Income Tax Portal...',
        estimatedTime: '30 seconds'
      },
      {
        stage: 'processing',
        progress: 40,
        message: 'Processing and validating tax calculations...',
        estimatedTime: '1 minute'
      },
      {
        stage: 'validating',
        progress: 60,
        message: 'Validating against IT Department schemas...',
        estimatedTime: '45 seconds'
      },
      {
        stage: 'filing',
        progress: 80,
        message: 'Filing ITR with Income Tax Department...',
        estimatedTime: '30 seconds'
      },
      {
        stage: 'completed',
        progress: 100,
        message: 'ITR filed successfully! Generating confirmation...',
        estimatedTime: 'Complete'
      }
    ];

    for (let i = 0; i < stages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmissionStatus(stages[i]);
      
      if (stages[i].stage === 'completed') {
        // Generate mock filing result
        const result: ITRFilingResult = {
          acknowledgmentNumber: `${Date.now()}-ITR-ACK`,
          filingDate: new Date().toLocaleDateString('en-IN'),
          assessmentYear: '2024-25',
          itrType: 'ITR-2',
          refundAmount: 6000,
          status: 'Filed Successfully',
          processingTime: '2 minutes 30 seconds',
          downloadLinks: {
            acknowledgment: '/downloads/acknowledgment.pdf',
            itrXML: '/downloads/itr.xml',
            taxComputationSheet: '/downloads/tax-computation.pdf'
          }
        };
        
        setFilingResult(result);
        setShowCelebration(true);
        
        // Hide celebration after 3 seconds
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }
  };

  const downloadFile = (type: string, url: string) => {
    // In a real implementation, this would download the actual file
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_${filingResult?.acknowledgmentNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (stage: string) => {
    switch (stage) {
      case 'uploading':
        return <Upload className="w-6 h-6" />;
      case 'processing':
        return <RefreshCw className="w-6 h-6 animate-spin" />;
      case 'validating':
        return <Shield className="w-6 h-6" />;
      case 'filing':
        return <FileText className="w-6 h-6" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return <AlertCircle className="w-6 h-6" />;
    }
  };

  const getStatusColor = (stage: string) => {
    switch (stage) {
      case 'uploading':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'validating':
        return 'text-purple-600';
      case 'filing':
        return 'text-orange-600';
      case 'completed':
        return 'text-green-600';
      default:
        return 'text-red-600';
    }
  };

  if (filingResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              >
                <div className="bg-white rounded-xl p-8 text-center max-w-md mx-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 Congratulations!</h2>
                  <p className="text-gray-600">Your ITR has been filed successfully!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ITR Filed Successfully!
            </h1>
            <p className="text-gray-600">
              Your Income Tax Return has been filed with the Income Tax Department
            </p>
          </motion.div>

          {/* Filing Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Filing Summary</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                <p className="text-green-800 font-semibold">
                  Acknowledgment Number: <span className="font-mono">{filingResult.acknowledgmentNumber}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-blue-600 font-medium">Filing Date</p>
                <p className="text-lg font-bold text-blue-900">{filingResult.filingDate}</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-purple-600 font-medium">ITR Type</p>
                <p className="text-lg font-bold text-purple-900">{filingResult.itrType}</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-600 font-medium">Refund Amount</p>
                <p className="text-lg font-bold text-green-900">₹{filingResult.refundAmount.toLocaleString()}</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-orange-600 font-medium">Processing Time</p>
                <p className="text-lg font-bold text-orange-900">{filingResult.processingTime}</p>
              </div>
            </div>
          </motion.div>

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Download className="w-6 h-6" />
              Download Documents
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => downloadFile('acknowledgment', filingResult.downloadLinks.acknowledgment)}
                className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <Receipt className="w-8 h-8 text-blue-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Acknowledgment</p>
                  <p className="text-sm text-gray-600">PDF Receipt</p>
                </div>
              </button>
              
              <button
                onClick={() => downloadFile('itr-xml', filingResult.downloadLinks.itrXML)}
                className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <FileText className="w-8 h-8 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">ITR XML</p>
                  <p className="text-sm text-gray-600">Data File</p>
                </div>
              </button>
              
              <button
                onClick={() => downloadFile('tax-computation', filingResult.downloadLinks.taxComputationSheet)}
                className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
              >
                <Receipt className="w-8 h-8 text-purple-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Tax Computation</p>
                  <p className="text-sm text-gray-600">Detailed Sheet</p>
                </div>
              </button>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">What Happens Next?</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Processing</h4>
                  <p className="text-gray-600 text-sm">
                    Income Tax Department will process your return within 2-3 business days. 
                    You'll receive email updates on the status.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Verification</h4>
                  <p className="text-gray-600 text-sm">
                    Verify your ITR within 120 days using Aadhaar OTP, Net Banking, or sending 
                    ITR-V by post to Bangalore.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Refund Processing</h4>
                  <p className="text-gray-600 text-sm">
                    If eligible, your refund of ₹{filingResult.refundAmount.toLocaleString()} will be 
                    processed within 20-45 days after successful verification.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 mb-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Need Help or Have Questions?</h3>
              <p className="text-blue-100">Our expert team is here to assist you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 mb-2" />
                <p className="font-semibold">Email Support</p>
                <p className="text-blue-100 text-sm">support@burnblack.com</p>
              </div>
              
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 mb-2" />
                <p className="font-semibold">Phone Support</p>
                <p className="text-blue-100 text-sm">1800-123-4567</p>
              </div>
              
              <div className="flex flex-col items-center">
                <Smartphone className="w-8 h-8 mb-2" />
                <p className="font-semibold">WhatsApp</p>
                <p className="text-blue-100 text-sm">+91 98765-43210</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4"
          >
            <Link
              to="/"
              className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Home className="w-5 h-5" />
              Return Home
            </Link>
            
            <Link
              to="/fileITR"
              className="flex items-center gap-2 bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
            >
              File Another ITR
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-8 text-sm text-gray-600"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-4 h-4" />
              <span>Your data is protected with bank-grade security</span>
            </div>
            <p>
              BURNBLACK is an authorized E-Return Intermediary (ERI) licensed by 
              the Income Tax Department, Government of India.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Filing Your ITR
          </h1>
          <p className="text-gray-600">
            Please wait while we submit your return to the Income Tax Department
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className={`flex items-center gap-3 ${getStatusColor(submissionStatus.stage)}`}>
              {getStatusIcon(submissionStatus.stage)}
              <h2 className="text-xl font-semibold">
                {submissionStatus.stage.charAt(0).toUpperCase() + submissionStatus.stage.slice(1)}
              </h2>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{submissionStatus.progress}%</p>
              {submissionStatus.estimatedTime && (
                <p className="text-sm text-gray-600">ETA: {submissionStatus.estimatedTime}</p>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <motion.div
              className="bg-blue-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${submissionStatus.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <p className="text-gray-700 text-center">{submissionStatus.message}</p>
        </motion.div>

        {/* Status Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Submission Process</h3>
          
          <div className="space-y-4">
            {[
              { stage: 'uploading', title: 'Uploading Data', description: 'Securely uploading your ITR data' },
              { stage: 'processing', title: 'Processing', description: 'Validating tax calculations and deductions' },
              { stage: 'validating', title: 'Validating', description: 'Checking compliance with IT Department rules' },
              { stage: 'filing', title: 'Filing', description: 'Submitting to Income Tax Portal' },
              { stage: 'completed', title: 'Completed', description: 'ITR filed successfully' }
            ].map((step, index) => {
              const isActive = step.stage === submissionStatus.stage;
              const isCompleted = ['uploading', 'processing', 'validating', 'filing', 'completed'].indexOf(step.stage) < 
                                ['uploading', 'processing', 'validating', 'filing', 'completed'].indexOf(submissionStatus.stage);
              
              return (
                <div key={step.stage} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isCompleted || isActive
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="font-bold">{index + 1}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  
                  {isActive && (
                    <div className="animate-pulse">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <p className="text-green-800 font-medium">
              Your data is being transmitted securely using 256-bit SSL encryption
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SmartSubmit;