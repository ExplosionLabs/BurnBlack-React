import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/SupabaseAuthContext'
import { taxReturnService, profileService, TaxReturn, Profile } from '../services/supabaseService'
import { ITRJSONGenerator } from '../services/ITRJSONGenerator'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  FileText, 
  Download, 
  Calculator, 
  Eye, 
  Plus,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

const SupabaseDashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([])
  const [loading, setLoading] = useState(true)
  const [showQuickActions, setShowQuickActions] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Load profile
      const profileData = await profileService.getProfile(user.id)
      setProfile(profileData)

      // Load tax returns
      const taxReturnsData = await taxReturnService.getTaxReturns(user.id)
      setTaxReturns(taxReturnsData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const createNewTaxReturn = async () => {
    if (!user) return

    try {
      const currentYear = new Date().getFullYear()
      const financialYear = `${currentYear}-${currentYear + 1}`
      
      const newTaxReturn = await taxReturnService.createTaxReturn(user.id, {
        financial_year: financialYear,
        itr_type: 'ITR-1',
        status: 'draft'
      })

      if (newTaxReturn) {
        setTaxReturns([newTaxReturn, ...taxReturns])
        toast.success('New tax return created successfully!')
      }
    } catch (error) {
      console.error('Error creating tax return:', error)
      toast.error('Failed to create tax return')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to sign out')
    }
  }

  const startNewITRFlow = () => {
    navigate('/fileITR/smart-flow/assessment')
  }

  const generateQuickJSON = async (taxReturn: TaxReturn) => {
    try {
      // Create a basic ITR data structure with dummy/placeholder data
      const quickITRData = {
        personalDetails: {
          name: profile?.name || user?.email?.split('@')[0] || 'User',
          pan: 'ABCDE1234F', // Placeholder - should be from profile
          aadhaar: '1234 5678 9012', // Placeholder
          dateOfBirth: '1990-01-01', // Placeholder
          email: user?.email || '',
          mobile: '+91 9876543210', // Placeholder
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
          taxableIncome: 580000, // After standard deduction
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
          refundOrDemand: 9400, // Refund
          regime: 'Old' as const
        },
        itrType: taxReturn.itr_type as any,
        assessmentYear: '2024-25',
        filingDate: new Date().toISOString().split('T')[0],
        submissionType: 'Original' as const
      }

      // Generate JSON using the ITRJSONGenerator
      const jsonData = ITRJSONGenerator.generateComprehensiveJSON(quickITRData)
      
      // Download the JSON file
      const filename = `ITR_Quick_${taxReturn.itr_type}_${taxReturn.financial_year}.json`
      ITRJSONGenerator.downloadJSON(jsonData, filename)
      
      toast.success('ITR JSON downloaded successfully!')
    } catch (error) {
      console.error('Error generating ITR JSON:', error)
      toast.error('Failed to generate ITR JSON')
    }
  }

  const downloadTaxReturnJSON = async (taxReturn: TaxReturn) => {
    try {
      // For completed tax returns, download their stored JSON
      toast.info('Downloading completed ITR JSON...')
      // TODO: Implement download from Supabase storage
    } catch (error) {
      console.error('Error downloading ITR JSON:', error)
      toast.error('Failed to download ITR JSON')
    }
  }

  const viewTaxReturnDetails = (taxReturn: TaxReturn) => {
    // Navigate to detailed view
    navigate(`/dashboard/tax-return/${taxReturn.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {profile?.name || user?.email}
              </h1>
              <p className="text-gray-600">Manage your tax returns with ease</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tax Returns</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{taxReturns.length}</dd>
                </dl>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {taxReturns.filter(tr => tr.status === 'completed').length}
                  </dd>
                </dl>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {taxReturns.filter(tr => ['draft', 'submitted', 'processing'].includes(tr.status)).length}
                  </dd>
                </dl>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Ready to File Your ITR?</h2>
                <p className="text-blue-100 mb-4">Complete your tax filing in just 6 simple steps with our Smart ITR Flow</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={startNewITRFlow}
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Start ITR Filing
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={createNewTaxReturn}
                    className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create Draft
                  </button>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Smart Assessment</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Auto Tax Calculation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    <span className="font-medium">JSON Download</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tax Returns Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Your Tax Returns</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={startNewITRFlow}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Smart Filing
                </button>
                <button
                  onClick={createNewTaxReturn}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Draft
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            {taxReturns.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tax returns yet</h3>
                <p className="text-gray-600 mb-6">Start your tax filing journey with our smart assessment</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={startNewITRFlow}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    Start Smart Filing
                  </button>
                  <button
                    onClick={createNewTaxReturn}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Create Draft
                  </button>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">Smart Assessment</h4>
                    <p className="text-sm text-gray-600">AI-powered ITR type recommendation</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">Auto Calculate</h4>
                    <p className="text-sm text-gray-600">Automatic tax computation</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Download className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900">JSON Export</h4>
                    <p className="text-sm text-gray-600">Ready-to-file ITR JSON</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {taxReturns.map((taxReturn, index) => (
                  <motion.div
                    key={taxReturn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {taxReturn.itr_type} - FY {taxReturn.financial_year}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Created: {new Date(taxReturn.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          taxReturn.status === 'completed' ? 'bg-green-100 text-green-800' :
                          taxReturn.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                          taxReturn.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {taxReturn.status.charAt(0).toUpperCase() + taxReturn.status.slice(1)}
                        </span>
                        
                        {taxReturn.status === 'draft' && (
                          <>
                            <button 
                              onClick={() => navigate(`/fileITR/smart-flow/assessment`)}
                              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                            >
                              <FileText className="w-4 h-4" />
                              Continue Filing
                            </button>
                            <button 
                              onClick={() => generateQuickJSON(taxReturn)}
                              className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
                            >
                              <Download className="w-4 h-4" />
                              Quick JSON
                            </button>
                          </>
                        )}
                        
                        {taxReturn.status === 'completed' && (
                          <button 
                            onClick={() => downloadTaxReturnJSON(taxReturn)}
                            className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            Download JSON
                          </button>
                        )}
                        
                        <button 
                          onClick={() => viewTaxReturnDetails(taxReturn)}
                          className="text-gray-600 hover:text-gray-800 font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default SupabaseDashboard