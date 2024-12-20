import { fetchTaxInvestData } from '@/api/taxSaving'
import { RootState } from '@/stores/store'
import axios from 'axios'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const TaxDashboard = () => {

   const [formData, setFormData] = useState({
    section80C:0,
    savingsInterest80TTA:0,
    pensionContribution80CCC: 0,
    npsEmployeeContribution:0,
    npsEmployerContribution:0,
    })
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
    useEffect(() => {

      const fetchData = async () => {
        const token = localStorage.getItem('token');
        if(!token){
            return ;
        }
        try {
          
          const response = await fetchTaxInvestData(token)
          setFormData(response);
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
    <div>TaxDashboard
    <div className="space-y-2">
              <input
                type="number"
                name="section80C"
                value={formData.section80C}
                onChange={(e) => handleChange("section80C", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">80C - PPF, ELSS, Life Insurance, etc</span>
            </div>
    <div className="space-y-2">
              <input
                type="number"
                name="savingsInterest80TTA"
                value={formData.savingsInterest80TTA}
                onChange={(e) => handleChange("savingsInterest80TTA", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">Savings Account Interest deduction</span>
            </div>
    <div className="space-y-2">
              <input
                type="number"
                name="pensionContribution80CCC"
                value={formData.pensionContribution80CCC}
                onChange={(e) => handleChange("pensionContribution80CCC", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">Pension/Annuity fund contribution

</span>
            </div>
    <div className="space-y-2">
              <input
                type="number"
                name="npsEmployeeContribution"
                value={formData.npsEmployeeContribution}
                onChange={(e) => handleChange("npsEmployeeContribution", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">Employee's (Your) contribution to NPS



</span>
            </div>
    <div className="space-y-2">
              <input
                type="number"
                name="npsEmployerContribution"
                value={formData.npsEmployerContribution}
                onChange={(e) => handleChange("npsEmployerContribution", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-500">Employer's (Company's) contribution for your NPS



</span>
            </div>

    </div>
  )
}

export default TaxDashboard