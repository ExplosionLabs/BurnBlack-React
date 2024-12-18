import React from "react";

interface NFTComponentProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: () => void;
}

const NFTComponent: React.FC<NFTComponentProps> = ({
  formData,
  handleInputChange,
  handleSubmit,
}) => {
    
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Add gains from NFT</h2>
          <p className="text-sm text-gray-600 mb-4">Items held for more than two years qualify as long term</p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: "50" }}
            ></div>
          </div>

         
            <div>
           
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date of Sale *</label>
                <input
                  type="date"
                  name="dateOfSale"
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.dateOfSale}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Date of Purchase *</label>
                <input
                  type="date"
                  name="dateOfPurchase"
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.dateOfPurchase}
                  required
                />
              </div>
            
            </div>
      
       
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Enter Crypto / VDA asset name</label>
                <input
                  type="text"
                  name="assestName"
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.assestName}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Total Sale Price *</label>
                <div className="flex items-center">
                  <span className="mr-2">₹</span>
                  <input
                    type="number"
                    name="salePrice"
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    value={formData.salePrice}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Purchase Price *</label>
                <div className="flex items-center">
                  <span className="mr-2">₹</span>
                  <input
                    type="number"
                    name="purchasePrice"
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    value={formData.purchasePrice}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Total Gains *</label>
                <div className="flex items-center">
                  <span className="mr-2">₹</span>
                  <input
                    type="number"
                    name="totalGains"
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    value={formData.totalGains}
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Type of Asset</label>
                <select
                  name="incomeType"
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.incomeType}
                >   
                  <option value="">Select</option>
                  <option value="Capital Gains">Capital Gains</option>
                  <option value="Bussiness Income">Bussiness Income</option>
                </select>
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
  );
};

export default NFTComponent;
