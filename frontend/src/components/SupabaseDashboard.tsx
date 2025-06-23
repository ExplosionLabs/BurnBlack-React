import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/SupabaseAuthContext'
import { taxReturnService, profileService, TaxReturn, Profile } from '../services/supabaseService'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const SupabaseDashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([])
  const [loading, setLoading] = useState(true)

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

        {/* Tax Returns Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Your Tax Returns</h2>
              <button
                onClick={createNewTaxReturn}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                + New Tax Return
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            {taxReturns.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tax returns yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first tax return</p>
                <button
                  onClick={createNewTaxReturn}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Tax Return
                </button>
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
                        <button className="text-indigo-600 hover:text-indigo-800 font-medium">
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