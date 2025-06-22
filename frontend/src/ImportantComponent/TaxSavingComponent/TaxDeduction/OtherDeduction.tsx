import { fetchLoanData, fetchOtherDeductionData } from '@/api/taxSaving'
import { RootState } from '@/stores/store'
import axios from 'axios'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
const OtherDeduction = () => {
    const [formData, setFormData] = useState({
        copyRightFee: 0,
        patentIncome: 0,
        bioWasteIncome: 0,
        agniPathContri: 0,
        rentPerMonth:0,
        noOFMonth:0
      })
      const [showForm, setShowForm] = useState(false);
      const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null
      const isUserLoggedIn = useSelector(selectIsUserLoggedIn)
    
      useEffect(() => {
        const fetchData = async () => {
          const token = localStorage.getItem('token')
          if (!token) {
            return
          }
          try {
            const response = await fetchOtherDeductionData(token)
            if (response) {
              setFormData(response)
            }
          } catch (error) {
            console.error('Error fetching personal details:', error)
          }
        }
    
        if (isUserLoggedIn) {
          fetchData()
        }
      }, [isUserLoggedIn])
    
      const updateDatabase = debounce(async (data) => {
        const token = localStorage.getItem('token')
        try {
          await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/postOtherDeduction`,
            data,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        } catch (error) {
          console.error('Error updating data:', error)
        }
      }, 300)
    
      const handleChange = (name: string, value: string) => {
        const updatedData = { ...formData, [name]: value }
        setFormData(updatedData)
        updateDatabase(updatedData)
      }
    
      return (
        <div className="border rounded-2xl p-6 shadow-sm">
          <div
            className="flex items-center justify-between gap-3 cursor-pointer"
            onClick={() => setShowForm(!showForm)} // Toggle the form visibility
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-md flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Other Deductions</h2>
                <p className="text-sm text-gray-500">
                Deductions for patents, inventions, book writers, waste business etc.
                </p>
              </div>
            </div>
            <div>
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  showForm ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
    
          {showForm && ( // Render form only if `showForm` is true
    
          <div className="space-y-6 mt-6">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-gray-900 font-medium">
                  Royalty/Copyright-fees received on books
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                  80QQB - Deduction can be claimed only against business income
                    <a href="#" className="text-blue-600 hover:underline">
                      Learn More
                    </a>
                  </p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <input
                  type="number"
                  name="copyRightFee"
                  value={formData.copyRightFee}
                  onChange={(e) => handleChange('copyRightFee', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
    
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-gray-900 font-medium">
                  Income on Patents/Inventions
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                  80RRB - Deduction can be claimed only against business income
                    <a href="#" className="text-blue-600 hover:underline">
                      Learn More
                    </a>
                  </p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <input
                  type="number"
                  name="patentIncome"
                  value={formData.patentIncome}
                  onChange={(e) => handleChange('patentIncome', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
    
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-gray-900 font-medium">
                  Income from Bio-degradable waste business
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                  80JJA - Deduction can be claimed only against business income

                  </p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <input
                  type="number"
                  name="bioWasteIncome"
                  value={formData.bioWasteIncome}
                  onChange={(e) => handleChange('bioWasteIncome', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
    
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-gray-900 font-medium">
                  Contribution to Agnipath Scheme
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                  80CCH - Deduction can be claimed if employer is Central Governmen
                  </p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <input
                  type="number"
                  name="agniPathContri"
                  value={formData.agniPathContri}
                  onChange={(e) => handleChange('agniPathContri', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  
                  <p className="text-sm text-gray-500 mt-1">
                  Enter the rent paid per month
                  </p>
                </div>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <input
                  type="number"
                  name="rentPerMonth"
                  value={formData.rentPerMonth}
                  onChange={(e) => handleChange('rentPerMonth', e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
  <div className="flex justify-between items-start mb-2">
    <div>
      <p className="text-sm text-gray-500 mt-1">Select the number of months</p>
    </div>
  </div>
  <div className="relative">
    <select
      name="noOFMonth"
      value={formData.noOFMonth}
      onChange={(e) => handleChange('noOFMonth', e.target.value)}
      className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="" disabled>Select months</option>
      {[...Array(12)].map((_, index) => (
        <option key={index + 1} value={index + 1}>
          {index + 1}
        </option>
      ))}
    </select>
  </div>
</div>

          </div>
             )}
        </div>
      )
    }

export default OtherDeduction