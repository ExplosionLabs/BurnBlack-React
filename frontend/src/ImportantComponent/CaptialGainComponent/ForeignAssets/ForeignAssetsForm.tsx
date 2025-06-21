import React from "react";

interface ForeignAssetFormProps {
  formData: any;
  step: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
}

const ForeignAssetForm: React.FC<ForeignAssetFormProps> = ({
  formData,
  step,
  handleInputChange,
  handleNext,
  handleBack,
  handleSubmit,
}) => {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">Add Foreign Assets</h2>
          <p className="text-sm text-gray-600 mb-4">Items held for more than two years qualify as long term</p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: step === 1 ? "50%" : "100%" }}
            ></div>
          </div>

          {step === 1 && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Type of Asset</label>
                <select
                  name="assetSubType"
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.assetSubType}
                >   
                  <option value="">Select</option>
                  <option value="Foreign Listed Shares">Foreign Listed Shares</option>
                  <option value="Foreign Non-Listed Shares">Foreign Non-Listed Shares</option>
                </select>
              </div>
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
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description of Asset Sold</label>
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
                <label className="block text-gray-700 mb-2">Transfer Expenses</label>
                <div className="flex items-center">
                  <span className="mr-2">₹</span>
                  <input
                    type="number"
                    name="transferExpenses"
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    value={formData.transferExpenses}
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
              <div className="flex space-x-4">
                <button
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  {formData ? "Edit Details" : "Add Details"}
                </button>
              </div>
            </div>
          )}
    </>
  );
};

export default ForeignAssetForm;
