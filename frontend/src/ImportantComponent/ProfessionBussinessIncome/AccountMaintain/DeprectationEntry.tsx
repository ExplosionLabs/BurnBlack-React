import { fetchDeprecatationData } from '@/api/incomeSoucre';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const DeprectationEntry = () => {

     const [existingData, setExistingData] = useState<any | null>(null);
     const depreciationOptions = [
        { value: "", label: "Select" },
        { value: "Plant and Machinery - 15%", label: "Plant and Machinery - 15%" },
        { value: "Land - 0%", label: "Land - 0%" },
        { value: "Ships - 20%", label: "Ships - 20%e" },
        { value: "Intangible Assets - 25%", label: "Intangible Assets - 25%" },
      ];
      
    const [formData, setFormData] = useState({
        deprectationBlock:"",
        description: "",
        openingAmount: 0,
        purAmtuptoOct4: 0,
        saleAmtuptoOct4:0,
        purAmtfromOct5:0,
        saleAmtfromOct5:0,
        dateofSale: "",
        perUsePer: "",
        addDepreciation:0,
        blockNil:"",
        additonlDep:""
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
              const url = existingData? `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updateDeprecationEntry`:`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addDeprecationEntry`;
        
              const response = await axios.post(url, formData, {
                headers: { Authorization: `Bearer ${token}` },
              });
        
              alert(response.data.message);
            
            } catch (error: any) {
              alert(error.response?.data?.error || "Error submitting form");
            }
          };
  return (
    
   
    <>
    <h2 className="text-xl font-bold mb-4">Add Depreciation Entry</h2>
    
        
    
     
          <div>
          <div className="mb-4">
  <label className="block text-gray-700 mb-2">Depreciation Block</label>
  <select
    name="deprectationBlock"
    onChange={handleInputChange}
    className="w-full border rounded px-3 py-2"
    value={formData.deprectationBlock}
  >
    {depreciationOptions.map((option, index) => (
      <option key={index} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <input
                type="text"
                name="description"
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                value={formData.description}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Opening Amount
              *</label>
              <div className="flex items-center">
                <span className="mr-2">₹</span>
                <input
                  type="number"
                  name="openingAmount"
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.openingAmount}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Purchase Amount (Upto October 4)</label>
              <div className="flex items-center">
                <span className="mr-2">₹</span>
                <input
                  type="number"
                  name="purAmtuptoOct4"
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.purAmtuptoOct4}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Sale Amount (On assets purchased upto October 4)</label>
              <div className="flex items-center">
                <span className="mr-2">₹</span>
                <input
                  type="number"
                  name="saleAmtuptoOct4"
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.saleAmtuptoOct4}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Purchase Amount (From October 5)</label>
              <div className="flex items-center">
                <span className="mr-2">₹</span>
                <input
                  type="number"
                  name="purAmtfromOct5"
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.purAmtfromOct5}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Sale Amount (On assets purchased from October 5)</label>
              <div className="flex items-center">
                <span className="mr-2">₹</span>
                <input
                  type="number"
                  name="saleAmtfromOct5"
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.saleAmtfromOct5}
                  required
                />
              </div>
            </div>
        
          
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Date on which sale was made, if any (Optional)              </label>
              <div className="flex items-center">
                <span className="mr-2">₹</span>
                <input
                  type="text"
                  name="dateofSale"
                  placeholder='dd/mm/yy'
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.dateofSale}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Personal Usage Percentage              </label>
              <div className="flex items-center">
                <span className="mr-2">₹</span>
                <input
                  type="text"
                  name="perUsePer"
                  placeholder='0'
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.perUsePer}
                  required
                />
              </div>
            </div>
           
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Additional depreciation claimed during the previous A.Y.</label>
              <div className="flex items-center">
                <span className="mr-2">₹</span>
                <input
                  type="text"
                  name="addDepreciation"
                  placeholder='0'
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.addDepreciation}
                  required
                />
              </div>
              <div className="mb-4">
  <label className="block text-gray-700 mb-2">
    Block Nil
  </label>
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
    className="mr-2"
  />
  <span>{formData.blockNil === "Yes" ? "Selected" : "Not Selected"}</span>
</div>

<div className="mb-4">
  <label className="block text-gray-700 mb-2">
    Additional Depreciation Claimed During Previous A.Y.
  </label>
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
    className="mr-2"
  />
  <span>{formData.additonlDep === "Yes" ? "Selected" : "Not Selected"}</span>
</div>

            </div>
        
            <div className="flex space-x-4">
              
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                {formData ? "Edit Details" : "Add Details"}
              </button>
            </div>
          </div>
       
  </>
  )
}

export default DeprectationEntry