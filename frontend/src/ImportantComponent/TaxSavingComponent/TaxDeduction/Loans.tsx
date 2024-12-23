
import { fetchLoanData } from '@/api/taxSaving'
import { RootState } from '@/stores/store'
import axios from 'axios'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const Loans = () => {
  const [formData, setFormData] = useState({
    eduLoans: 0,
    homeLoans1617: 0,
    homeLoans1922: 0,
    electricVehicle: 0,
    npsEmployerContribution: 0,
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
        const response = await fetchLoanData(token)
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
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/postLoansData`,
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
    <div className=" rounded-xl p-6 shadow-sm">
      <div
        className="flex items-center justify-between gap-3 cursor-pointer"
        onClick={() => setShowForm(!showForm)} // Toggle the form visibility
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
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
            <h2 className="text-xl font-semibold text-gray-900">Loans</h2>
            <p className="text-sm text-gray-500">
              Deduction for Educational, Home or Electric Vehicle Loans
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
                Interest on Education Loan for higher studies
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                80E - Applicable for Graduation or Post Graduation.{' '}
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
              name="eduLoans"
              value={formData.eduLoans}
              onChange={(e) => handleChange('eduLoans', e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-gray-900 font-medium">
                Interest on Home Loan taken b/w Apr 2016 - Mar 2017
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                80EE: Valid on 1st house purchase of value less than 50 Lakhs.{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Learn More
                </a>
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              Limit: 50,000
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
            <input
              type="number"
              name="homeLoans1617"
              value={formData.homeLoans1617}
              onChange={(e) => handleChange('homeLoans1617', e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-gray-900 font-medium">
                Interest on Home Loan taken b/w Apr 2019 - Mar 2022
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                80EEA: Valid on 1st house purchase of value less than 45 Lakhs.{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Learn More
                </a>
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              Limit: 1,50,000
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
            <input
              type="number"
              name="homeLoans1922"
              value={formData.homeLoans1922}
              onChange={(e) => handleChange('homeLoans1922', e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-gray-900 font-medium">
                Interest on Electric Vehicle Loan
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                80EEB - Valid for fully (non-hybrid) electric vehicle.{' '}
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
              name="electricVehicle"
              value={formData.electricVehicle}
              onChange={(e) => handleChange('electricVehicle', e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
         )}
    </div>
  )
}

export default Loans

