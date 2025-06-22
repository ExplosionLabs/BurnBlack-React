import React, { useEffect, useState } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { fetchNonTDSData, fetchTaxCollectedData, fetchTDSRentData } from '@/api/taxSaving';
import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';

const TaxCollectedForm = () => {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const [formData, setFormData] = useState({
    tan: '',
    name: '',
    totalTax: '',
    transferTDS: false,
    tdsCreditRelating: '',
    tdsCredit: '',
    incomeRelatingTDS: '',
    panOtherPerson: '',
    taxClaimed: '',
    incomeAgainstTDS: '',
    typeOfIncome: '',
    financialYear: '',
  });

    useEffect(() => {
    
          const fetchData = async () => {
            const token = localStorage.getItem('token');
            if(!token){
                return ;
            }
            try {
              
              const response = await fetchTaxCollectedData(token);
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

  const autoSave = debounce(async (data) => {
    const token = localStorage.getItem("token")
    try {
      await axios.put(          `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/postTaxCollected`, data,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      console.log('Form auto-saved');
    } catch (error) {
      console.error('Error auto-saving:', error);
    }
  }, 300);

  const handleChange = (name: string, value: string | boolean) => {
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    autoSave(updatedData);
  };

  return (
    <form className="max-w-2xl mx-auto p-4 bg-white border rounded-md">
      <h2 className="text-lg font-semibold mb-4">Tax Deducted at Source</h2>
      
      <label className="block mb-2">TAN of Deductor *</label>
      <input
        type="text"
        value={formData.tan}
        name="tan"
        onChange={(e) => handleChange('tan', e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <label className="block mb-2">Name of Deductor *</label>
      <input
        type="text"
        value={formData.name}
        name="name"
        onChange={(e) => handleChange('name', e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <label className="block mb-2">Total Tax Deducted *</label>
      <input
        type="number"
        name="totalTax"
        value={formData.totalTax}
        onChange={(e) => handleChange('totalTax', e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <label className="block mb-2">Claim or Transfer TDS Credits *</label>
      <div className="flex items-center mb-4">
        <label className="mr-2">No</label>
        <input
          type="checkbox"
          name="transferTDS"
          checked={formData.transferTDS}
          onChange={(e) => handleChange('transferTDS', e.target.checked)}
        />
        <label className="ml-2">Yes</label>
      </div>

      {formData.transferTDS && (
        <>
          <label className="block mb-2">TDS Credit Relating to *</label>
          <select
            value={formData.tdsCreditRelating}
            name="tdsCreditRelating"
            onChange={(e) => handleChange('tdsCreditRelating', e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
          >
            <option value="">Select</option>
            <option value="self">Self (For transfer of TDS Credit)</option>
            <option value="Other">Other (For claiming of TDS Credit)</option>
          </select>

          <label className="block mb-2">TDS Credit *</label>
          <input
            type="number"
            name="tdsCredit"
            value={formData.tdsCredit}
            onChange={(e) => handleChange('tdsCredit', e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          <label className="block mb-2">Income Relating to TDS Credit *</label>
          <input
            type="number"
            name="incomeRelatingTDS"
            value={formData.incomeRelatingTDS}
            onChange={(e) => handleChange('incomeRelatingTDS', e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
          />

          <label className="block mb-2">PAN of Other Person *</label>
          <input
            type="text"
            name="panOtherPerson"
            value={formData.panOtherPerson}
            onChange={(e) => handleChange('panOtherPerson', e.target.value)}
            className="w-full border px-3 py-2 rounded mb-4"
          />
        </>
      )}

      <label className="block mb-2">Tax Deducted Claimed for This Year *</label>
      <input
        type="number"
        name="taxClaimed"
        value={formData.taxClaimed}
        onChange={(e) => handleChange('taxClaimed', e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <label className="block mb-2">Income Against Which TDS was Deducted *</label>
      <input
        type="number"
        name="incomeAgainstTDS"
        value={formData.incomeAgainstTDS}
        onChange={(e) => handleChange('incomeAgainstTDS', e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
      />

      <label className="block mb-2">Type of Income *</label>
      <select
      name="typeOfIncome"
        value={formData.typeOfIncome}
        onChange={(e) => handleChange('typeOfIncome', e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
      >
        <option value="">Choose Option</option>
        <option value="salary">Salary</option>
        <option value="business">Business</option>
      </select>

      <label className="block mb-2">Financial Year *</label>
      <input
        type="text"
        name="financialYear"
        value={formData.financialYear}
        onChange={(e) => handleChange('financialYear', e.target.value)}
        className="w-full border px-3 py-2 rounded mb-4"
      />
    </form>
  );
};

export default TaxCollectedForm;
