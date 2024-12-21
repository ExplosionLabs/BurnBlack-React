import { fetchContriPartyData, fetchRuralDonationData, fetchTaxDonation80GData } from '@/api/taxSaving';
import { RootState } from '@/stores/store';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const DonationParty = () => {
  const [formData, setFormData] = useState({
    cashAmount: 0,
    nonCashAmount: 0,
    contriDate:"",
      tranNo:"",
      ifscCode: ""
  });

  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);


    useEffect(() => {
  
        const fetchData = async () => {
          const token = localStorage.getItem('token');
          if(!token){
              return ;
          }
          try {
            
            const response = await fetchContriPartyData(token)
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
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/postContriParty`,
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

    setFormData(updatedData);
    updateDatabase(updatedData);
  };

  return (
    <div>
    <h2 className="text-xl font-semibold">Add contribution to political party (80GGC)</h2>
  
    <div className="space-y-6 mt-8">
    
  
  
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
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      <div>
          <label htmlFor="panDonee" className="block text-sm font-medium text-gray-700">
          Contribution Date*
          </label>
          <input
            id="contriDate"
            type="text"
            name="contriDate"
            value={formData.contriDate}
            onChange={(e) => handleChange("contriDate", e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

  
      <div>
        <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">
        Transaction Ref No.
        </label>
        <input
          id="tranNo"
          type="text"
          name="tranNo"
          value={formData.tranNo}
          onChange={(e) => handleChange("tranNo", e.target.value)}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
        IFSC Code of Bank
        </label>
        <input
          id="ifscCode"
          type="text"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={(e) => handleChange("ifscCode", e.target.value)}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
    </div>
  </div>
  
  );
};

export default DonationParty;
