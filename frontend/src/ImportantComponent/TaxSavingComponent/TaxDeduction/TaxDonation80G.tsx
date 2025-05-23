import { fetchTaxDonation80GData } from '@/api/taxSaving';
import { RootState } from '@/stores/store';
import axios from 'axios';
import { debounce } from 'lodash';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const TaxDonation80G = () => {
  const [formData, setFormData] = useState({
    section80G: "",
    nameDonee: "",
    cashAmount: 0,
    nonCashAmount: 0,
    panDonee: "",
    limitDeduction: "",
    qualifyPercent: "",
    addressLine: "",
    pinCode: 0,
    state: "",
    city: "",
  });

  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);


  const section80GData = {
    "PM Care-COVID-19": { nameDonee: "PM Care-COVID-19", panDonee: "AAETP3993P" },
    "Maharashtra CM COVID RELIEF Fund": { nameDonee: "Maharashtra CM COVID RELIEF Fund", panDonee: "AAATC0294J" },
    "WEST BENGAL STATE EMERGENCY RELIEF FUND-COVID 19": { nameDonee: "WEST BENGAL STATE EMERGENCY RELIEF FUND-COVID 19", panDonee: "AAAAC6443N" },
    "TAMIL NADU CM PUBLIC RELIEF FUND-COVID 19": { nameDonee: "TAMIL NADU CM PUBLIC RELIEF FUND-COVID 19", panDonee: "AAAGC0038F" },
    "NCT DELHI LT. GOVERNER/CHIEF MINISTER RELIEF FUND-COVID 19": { nameDonee: "NCT DELHI LT. GOVERNER/CHIEF MINISTER RELIEF FUND-COVID 19", panDonee: "AAATL5393B" },
  };

    useEffect(() => {
  
        const fetchData = async () => {
          const token = localStorage.getItem('token');
          if(!token){
              return ;
          }
          try {
            
            const response = await fetchTaxDonation80GData(token);
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
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/postDonation80G`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating data:", error);
    }
  }, 300);

  const handleChange = (name: string, value: string) => {
    let updatedData = { ...formData, [name]: value };

    // Update nameDonee and panDonee when section80G changes
    if (name === "section80G" && value in section80GData) {
      updatedData = {
        ...updatedData,
        nameDonee: section80GData[value as keyof typeof section80GData].nameDonee,
        panDonee: section80GData[value as keyof typeof section80GData].panDonee,
      };
    }

    setFormData(updatedData);
    updateDatabase(updatedData);
  };

  return (
  <>

   
    {/* <div className="flex items-center gap-4 mb-4">
          <Link to="/tax-saving/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
          <h1 className="text-2xl font-semibold">Popular Tax Saving Investments</h1>
         
                </div>
        </div> */}

      <div>
        <label htmlFor="section80G" className="block text-sm font-medium text-gray-700">
          Select 80G Organization
        </label>
        <select
          id="section80G"
          name="section80G"
          value={formData.section80G}
          onChange={(e) => handleChange("section80G", e.target.value)}
          className="w-full px-3 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select 80G Organization</option>
          {Object.keys(section80GData).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>
  
      <div>
          <label htmlFor="nameDonee" className="block text-sm font-medium text-gray-700">
            Name of the Donee
          </label>
          <input
            id="nameDonee"
            type="text"
            name="nameDonee"
            value={formData.nameDonee}
            onChange={(e) => handleChange("nameDonee", e.target.value)}
            className="w-full px-3 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

  
      <div>
        <label htmlFor="cashAmount" className="block text-sm font-medium text-gray-700">
          Donation Amount (Cash)
        </label>
        <input
          id="cashAmount"
          type="number"
          name="cashAmount"
          value={formData.cashAmount}
          onChange={(e) => handleChange("cashAmount", e.target.value)}
          className="w-full px-3 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      <div>
        <label htmlFor="nonCashAmount" className="block text-sm font-medium text-gray-700">
          Donation Amount (Non Cash)
        </label>
        <input
          id="nonCashAmount"
          type="number"
          name="nonCashAmount"
          value={formData.nonCashAmount}
          onChange={(e) => handleChange("nonCashAmount", e.target.value)}
          className="w-full px-3 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      <div>
          <label htmlFor="panDonee" className="block text-sm font-medium text-gray-700">
            PAN of Donee
          </label>
          <input
            id="panDonee"
            type="text"
            name="panDonee"
            value={formData.panDonee}
            onChange={(e) => handleChange("panDonee", e.target.value)}
            className="w-full px-3 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      <div>
        <label htmlFor="limitDeduction" className="block text-sm font-medium text-gray-700">
          Limit of Deduction
        </label>
        <select
          id="limitDeduction"
          name="limitDeduction"
          value={formData.limitDeduction}
          onChange={(e) => handleChange("limitDeduction", e.target.value)}
          className="w-full px-3 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Deduction Limit</option>
          <option value="No Limit">No Limit</option>
          <option value="Subject to Income">Subject to Income</option>
        </select>
      </div>
  
      <div>
        <label htmlFor="qualifyPercent" className="block text-sm font-medium text-gray-700">
          Qualifying Percentage
        </label>
        <select
          id="qualifyPercent"
          name="qualifyPercent"
          value={formData.qualifyPercent}
          onChange={(e) => handleChange("qualifyPercent", e.target.value)}
          className="w-full px-3 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Qualifying Percentage</option>
          <option value="50">50%</option>
          <option value="100">100%</option>
        </select>
      </div>
  
      <div>
        <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">
          Pin Code*
        </label>
        <input
          id="pinCode"
          type="text"
          name="pinCode"
          value={formData.pinCode}
          onChange={(e) => handleChange("pinCode", e.target.value)}
          className="w-full px-3 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
          State*
        </label>
        <input
          id="state"
          type="text"
          name="state"
          value={formData.state}
          onChange={(e) => handleChange("state", e.target.value)}
          className="w-full px-3 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City*
        </label>
        <input
          id="city"
          type="text"
          name="city"
          value={formData.city}
          onChange={(e) => handleChange("city", e.target.value)}
          className="w-full px-3 py-1 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      </>
  );
};

export default TaxDonation80G;
