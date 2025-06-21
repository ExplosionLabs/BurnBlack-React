import React from "react";

interface FormProps {
  formData: any;
  activeTab: "Stocks" | "Mutual Funds";
  step: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
}

const StockMututalForm: React.FC<FormProps> = ({
  formData,
  activeTab,
  step,
  handleInputChange,
  handleNext,
  handleBack,
  handleSubmit,
}) => {
  return (
    <>
      {step === 1 && (
        <div>
          <h2 className="text-lg font-bold mb-4">{activeTab}</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Select Type of Asset</label>
            <select
              name="assetSubType"
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              value={formData.assetSubType}
            >
              {activeTab === "Stocks" ? (
                <>
                  <option value="">Select</option>
                  <option value="Listed Securities">Listed Securities</option>
                  <option value="Non Listed Securities">Non Listed Securities</option>
                </>
              ) : (
                <>
                  <option value="">Select</option>
                  <option value="Mutual Fund(Equity)">Mutual Fund (Equity)</option>
                  <option value="Mutual Fund(Other than Equity)">
                    Mutual Fund (Other than Equity)
                  </option>
                </>
              )}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date of Sale *</label>
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
            <label className="block text-gray-700">Date of Purchase *</label>
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
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Additional Details</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Description of Asset Sold</label>
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
            <label className="block text-gray-700">Total Sale Price *</label>
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
            <label className="block text-gray-700">Transfer Expenses</label>
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
            <label className="block text-gray-700">Purchase Price *</label>
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
            <label className="block text-gray-700">Was STT Paid? *</label>
            <select
              name="sttPaid"
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              value={formData.sttPaid}
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {(activeTab === "Stocks" && formData) || (activeTab === "Mutual Funds" && formData)
              ? "Edit Details"
              : "Add Details"}
          </button>
          <button
            onClick={handleBack}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded ml-4"
          >
            Back
          </button>
        </div>
      )}
    </>
  );
};

export default StockMututalForm;
