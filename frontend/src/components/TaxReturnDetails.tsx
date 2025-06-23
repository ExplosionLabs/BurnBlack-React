import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/SupabaseAuthContext'
import { taxReturnService, TaxReturn } from '../services/supabaseService'
import { ITRJSONGenerator } from '../services/ITRJSONGenerator'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Download, 
  Edit, 
  FileText, 
  Calculator,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  User,
  Building,
  CreditCard
} from 'lucide-react'

const TaxReturnDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [taxReturn, setTaxReturn] = useState<TaxReturn | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id && user) {
      loadTaxReturnDetails()
    }
  }, [id, user])

  const loadTaxReturnDetails = async () => {
    if (!id || !user) return

    try {
      setLoading(true)
      const taxReturnData = await taxReturnService.getTaxReturn(user.id, id)
      if (taxReturnData) {
        setTaxReturn(taxReturnData)
      } else {
        setError('Tax return not found')
      }
    } catch (error) {
      console.error('Error loading tax return details:', error)
      setError('Failed to load tax return details')
      toast.error('Failed to load tax return details')
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    navigate('/dashboard')
  }

  const editTaxReturn = () => {
    if (taxReturn) {
      navigate('/fileITR/smart-flow/assessment')
    }
  }

  const downloadJSON = async () => {
    if (!taxReturn) return

    try {
      // Create sample ITR data for this tax return
      const itrData = {
        personalDetails: {
          name: user?.email?.split('@')[0] || 'User',
          pan: 'ABCDE1234F', // TODO: Get from profile
          aadhaar: '1234 5678 9012', // TODO: Get from profile
          dateOfBirth: '1990-01-01', // TODO: Get from profile
          email: user?.email || '',
          mobile: '+91 9876543210', // TODO: Get from profile
          address: {
            line1: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India'
          },
          status: 'Individual' as const,
          residentialStatus: 'Resident' as const
        },
        incomeDetails: {
          salary: {
            employers: [{
              employerName: 'Sample Employer',
              grossSalary: 800000,
              basicPay: 400000,
              hra: 200000,
              allowances: 100000,
              perquisites: 0,
              profitsInLieu: 0,
              tdsDeducted: 25000,
              professionalTax: 2500,
              standardDeduction: 50000
            }],
            totalGrossSalary: 800000,
            totalTDS: 25000,
            netSalary: 750000
          },
          interest: {
            savingsBankInterest: 5000,
            fixedDepositInterest: 10000,
            p2pInterest: 0,
            bondInterest: 0,
            epfInterest: 0,
            otherInterest: 0,
            totalInterest: 15000
          }
        },
        deductionDetails: {
          section80C: {
            lifeInsurance: 25000,
            ppf: 50000,
            elss: 50000,
            nsc: 0,
            taxSavingFD: 0,
            ulip: 0,
            homeLoanPrincipal: 25000,
            total: 150000
          },
          section80D: {
            selfAndFamily: 25000,
            parents: 0,
            preventiveHealthCheckup: 5000,
            seniorCitizenPremium: 0,
            total: 30000
          },
          section80E: { educationLoanInterest: 0 },
          section80EE: { homeLoanInterest: 0 },
          section80EEA: { additionalHomeLoanInterest: 0 },
          section80G: { donations: [], total: 0 },
          section80GG: { rentPaid: 0, eligibleAmount: 0 },
          section80TTA: { savingsInterest: 5000 },
          section80TTB: { seniorCitizenInterest: 0 },
          section80U: { disabilityDeduction: 0, disabilityType: 'Normal' as const },
          section80DD: { dependentDisabilityDeduction: 0, disabilityType: 'Normal' as const },
          section80CCC: { pensionFundContribution: 0 },
          section80CCD1: { npsEmployeeContribution: 0 },
          section80CCD1B: { additionalNPSContribution: 0 },
          section80CCD2: { npsEmployerContribution: 0 },
          otherDeductions: {},
          totalDeductions: 185000
        },
        taxCalculation: {
          grossTotalIncome: 815000,
          totalDeductions: 185000,
          taxableIncome: 580000,
          taxLiability: 15000,
          surcharge: 0,
          educationCess: 600,
          totalTaxPayable: 15600,
          taxPaid: {
            tds: 25000,
            advanceTax: 0,
            selfAssessmentTax: 0,
            totalTaxPaid: 25000
          },
          refundOrDemand: 9400,
          regime: 'Old' as const
        },
        itrType: taxReturn.itr_type as any,
        assessmentYear: taxReturn.financial_year,
        filingDate: new Date().toISOString().split('T')[0],
        submissionType: 'Original' as const
      }

      const jsonData = ITRJSONGenerator.generateComprehensiveJSON(itrData)
      const filename = `ITR_${taxReturn.itr_type}_${taxReturn.financial_year}_${taxReturn.id}.json`
      ITRJSONGenerator.downloadJSON(jsonData, filename)
      
      toast.success('ITR JSON downloaded successfully!')
    } catch (error) {
      console.error('Error downloading JSON:', error)
      toast.error('Failed to download ITR JSON')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tax return details...</p>
        </div>
      </div>
    )
  }

  if (error || !taxReturn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tax Return Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested tax return could not be found.'}</p>
          <button
            onClick={goBack}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />
      case 'submitted': return <FileText className="w-5 h-5" />
      case 'processing': return <Clock className="w-5 h-5" />
      default: return <Edit className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <button
                onClick={goBack}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {taxReturn.itr_type} - FY {taxReturn.financial_year}
                </h1>
                <p className="text-gray-600">
                  Created on {new Date(taxReturn.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(taxReturn.status)}`}>
                {getStatusIcon(taxReturn.status)}
                <span className="font-medium capitalize">{taxReturn.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tax Return Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Tax Return Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">ITR Type</label>
                  <p className="text-lg font-semibold text-gray-900">{taxReturn.itr_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Financial Year</label>
                  <p className="text-lg font-semibold text-gray-900">{taxReturn.financial_year}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{taxReturn.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(taxReturn.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Sample Tax Data */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calculator className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Tax Summary (Sample Data)</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Income</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Salary Income:</span>
                      <span className="font-medium">₹8,00,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Income:</span>
                      <span className="font-medium">₹15,000</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total Income:</span>
                      <span>₹8,15,000</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Tax Calculation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Deductions:</span>
                      <span className="font-medium">₹1,85,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax Payable:</span>
                      <span className="font-medium">₹15,600</span>
                    </div>
                    <div className="flex justify-between font-semibold text-green-600 border-t pt-2">
                      <span>Refund Due:</span>
                      <span>₹9,400</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Actions Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                {taxReturn.status === 'draft' && (
                  <button
                    onClick={editTaxReturn}
                    className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Continue Filing</p>
                      <p className="text-sm text-blue-600">Complete your tax return</p>
                    </div>
                  </button>
                )}
                
                <button
                  onClick={downloadJSON}
                  className="w-full flex items-center gap-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Download JSON</p>
                    <p className="text-sm text-green-600">Export ITR data</p>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">View Form 26AS</p>
                    <p className="text-sm text-gray-600">TDS statement</p>
                  </div>
                </button>
              </div>
            </motion.div>
            
            {/* Help & Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Having trouble with your tax return? Our support team is here to help.
                </p>
                <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                  Contact Support
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TaxReturnDetails