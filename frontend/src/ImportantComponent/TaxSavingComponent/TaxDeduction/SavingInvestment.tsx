import { fetchTaxInvestData } from '@/api/taxSaving'
import { RootState } from '@/stores/store'
import axios from 'axios'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const SavingInvestment = () => {

   const [formData, setFormData] = useState({
    section80C:0,
    savingsInterest80TTA:0,
    pensionContribution80CCC: 0,
    npsEmployeeContribution:0,
    npsEmployerContribution:0,
    });
      const [showForm, setShowForm] = useState(false);
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
    useEffect(() => {

      const fetchData = async () => {
        const token = localStorage.getItem('token');
        if(!token){
            return ;
        }
        try {
          
          const response = await fetchTaxInvestData(token);
          if(response){

            setFormData(response);
          }
        } catch (error) {
          console.error('Error fetching personal details:', error);
        }
      };
  
      if (isUserLoggedIn) {
       fetchData();
      }
    }, [isUserLoggedIn]);

    const updateDatabase = debounce(async (data) => {
      const token = localStorage.getItem("token")
      try {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/postTaxInvestment`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        
      } catch (error) {
        console.error("Error updating data:", error)
      }
    }, 300)
  
    const handleChange = (name: string, value: string) => {
      const updatedData = { ...formData, [name]: value }
      setFormData(updatedData)
      updateDatabase(updatedData)
    }
  
  return (
    <div className="rounded-xl p-6 shadow-sm border">
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
            <h2 className="text-xl font-semibold text-gray-900">Popular Tax Saving Investments</h2>
            <p className="text-sm text-gray-500">
            80C, PPF, ELSS, NPS, Savings Bank Interest, Pension, and more
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

      {showForm && ( 
  <div className="space-y-6 mt-6">
    <div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-gray-900 font-medium">Section 80C - PPF, ELSS, Life Insurance, etc.</h3>
          <p className="text-sm text-gray-500 mt-1">
            Deduction for investments under 80C.{' '}
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
          name="section80C"
          value={formData.section80C}
          onChange={(e) => handleChange("section80C", e.target.value)}
          className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-gray-900 font-medium">Savings Account Interest Deduction</h3>
          <p className="text-sm text-gray-500 mt-1">
            80TTA - Savings interest deductions.{' '}
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
          name="savingsInterest80TTA"
          value={formData.savingsInterest80TTA}
          onChange={(e) => handleChange("savingsInterest80TTA", e.target.value)}
          className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-gray-900 font-medium">Pension/Annuity Fund Contribution</h3>
          <p className="text-sm text-gray-500 mt-1">
            80CCC - Deduction for pension contributions.{' '}
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
          name="pensionContribution80CCC"
          value={formData.pensionContribution80CCC}
          onChange={(e) => handleChange("pensionContribution80CCC", e.target.value)}
          className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    <div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-gray-900 font-medium">NPS Employee Contribution</h3>
          <p className="text-sm text-gray-500 mt-1">
            Deduction for NPS under section 80CCD(1B).{' '}
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
          name="npsEmployeeContribution"
          value={formData.npsEmployeeContribution}
          onChange={(e) => handleChange("npsEmployeeContribution", e.target.value)}
          className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
    <div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-gray-900 font-medium">Employer's (Company's) contribution for your NPS</h3>
          <p className="text-sm text-gray-500 mt-1">
          80CCD(2) - This is applicable only for salaried individuals
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
          name="npsEmployerContribution"
          value={formData.npsEmployerContribution}
          onChange={(e) => handleChange("npsEmployerContribution", e.target.value)}
          className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  </div>
   )}
</div>
  )
}

export default SavingInvestment;