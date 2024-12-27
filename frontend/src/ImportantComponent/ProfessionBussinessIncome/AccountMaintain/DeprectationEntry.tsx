import { fetchDeprecatationData } from '@/api/incomeSoucre';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const DeprectationEntry = () => {
  const [existingData, setExistingData] = useState<any | null>(null);
  const depreciationOptions = [
    { value: "", label: "Select" },
    { value: "Plant and Machinery - 15%", label: "Plant and Machinery - 15%" },
    { value: "Land - 0%", label: "Land - 0%" },
    { value: "Ships - 20%", label: "Ships - 20%" },
    { value: "Intangible Assets - 25%", label: "Intangible Assets - 25%" },
  ];
  
  const [formData, setFormData] = useState({
    deprectationBlock: "",
    description: "",
    openingAmount: 0,
    purAmtuptoOct4: 0,
    saleAmtuptoOct4: 0,
    purAmtfromOct5: 0,
    saleAmtfromOct5: 0,
    dateofSale: "",
    perUsePer: "",
    addDepreciation: 0,
    blockNil: "",
    additonlDep: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    const fetchCryptoAssest = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      
      try {
        const data = await fetchDeprecatationData(token);
        
        if(data){
          setExistingData(data);
          setFormData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchCryptoAssest();
  }, []);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = existingData
        ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updateDeprecationEntry`
        : `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addDeprecationEntry`;

      const response = await axios.post(url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data.message);
    } catch (error: any) {
      alert(error.response?.data?.error || "Error submitting form");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-lg">
            <div className="mb-6 flex items-center gap-4">
        <Link to="/fileITR/income-professional-freelancing-business" className="rounded-full p-2 hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Add Depreciation Entry</h1>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Depreciation Block</label>
          <select
            name="deprectationBlock"
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.deprectationBlock}
          >
            {depreciationOptions.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            name="description"
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.description}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Opening Amount", name: "openingAmount" },
            { label: "Purchase Amount (Upto October 4)", name: "purAmtuptoOct4" },
            { label: "Sale Amount (On assets purchased upto October 4)", name: "saleAmtuptoOct4" },
            { label: "Purchase Amount (From October 5)", name: "purAmtfromOct5" },
            { label: "Sale Amount (On assets purchased from October 5)", name: "saleAmtfromOct5" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="number"
                  name={field.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData[field.name as keyof typeof formData]}
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Sale (Optional)</label>
            <input
              type="text"
              name="dateofSale"
              placeholder="dd/mm/yy"
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.dateofSale}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Personal Usage Percentage</label>
            <input
              type="text"
              name="perUsePer"
              placeholder="0"
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.perUsePer}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional depreciation claimed during the previous A.Y.</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">₹</span>
            <input
              type="text"
              name="addDepreciation"
              placeholder="0"
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md shadow-sm pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.addDepreciation}
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="blockNil"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  blockNil: e.target.checked ? "Yes" : "No",
                })
              }
              checked={formData.blockNil === "Yes"}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Block Nil
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="additonlDep"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  additonlDep: e.target.checked ? "Yes" : "No",
                })
              }
              checked={formData.additonlDep === "Yes"}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Additional Depreciation Claimed During Previous A.Y.
            </label>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            {existingData ? "Edit Details" : "Add Details"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeprectationEntry

