import React ,{useState} from "react";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import { Country, State } from "react-country-state-city/dist/esm/types";
interface GoldAssetsFormProps {
  landFormData: any;
  setLandFormData: React.Dispatch<React.SetStateAction<any>>;
  step: number;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; // Add this
}

const GoldAssestsForm: React.FC< GoldAssetsFormProps> = ({
  landFormData,
  setLandFormData,
  step,
  handleNext,
  handleBack,
  handleSubmit,
  handleInputChange, // Accept handleInputChange as a prop
}) => {
  const [countryid, setCountryid] = useState(null);
  const handleImprovementInputChange = (
    index: number,
    field: "description" | "amount",
    value: string
  ) => {
    const updatedDetails = [...landFormData.improvementDetails];
    updatedDetails[index][field] = value;
    setLandFormData({
      ...landFormData,
      improvementDetails: updatedDetails,
    });
  };
  const handlePropertyAddressChange = (
    key: string,
    value: string,
    additionalData?: Country | State
  ) => {
    if (additionalData && "id" in additionalData) {
      setCountryid(additionalData.id);
    }
  
    setLandFormData((prevState: any) => ({
      ...prevState,
      propertyAddress: {
        ...prevState.propertyAddress,
        [key]: value,
      },
    }));
  };
  
  
  const addImprovementField = () => {
    setLandFormData({
      ...landFormData,
      improvementDetails: [
        ...landFormData.improvementDetails,
        { description: "", amount: "" },
      ],
    });
  };

  const removeImprovementField = (index: number) => {
    const updatedDetails = landFormData.improvementDetails.filter((_: any, i: number) => i !== index);
    setLandFormData({
      ...landFormData,
      improvementDetails: updatedDetails,
    });
  };

  const handleInputChangeBuyer = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value } = e.target;
  
    // Update buyer details by index
    const updatedBuyers = [...landFormData.buyers];
    updatedBuyers[index] = { ...updatedBuyers[index], [name]: value };
  
    // Update the landFormData state
    setLandFormData((prevState: any) => ({
      ...prevState,
      buyers: updatedBuyers,
    }));
  };
  

  const addBuyer = () => {
    setLandFormData((prevState: { buyers: any; }) => ({
      ...prevState,
      buyers: [
        ...prevState.buyers,
        { buyerName: "", ownershipPercentage: "", aadhaar: "", pan: "", amountPaid: "" },
      ],
    }));
  };

  return (
    <>
      {step === 1 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Gold Form Assets</h2>

          <div className="mb-4">
            <label className="block text-gray-700">Date of Sale *</label>
            <input
              type="date"
              name="dateOfSale"
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              value={landFormData.dateOfSale}
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
              value={landFormData.dateOfPurchase}
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
        <div className="">
          <h2 className="text-lg font-bold mb-4">Additional Details</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Description of Asset Sold</label>
            <input
              type="text"
              name="description"
              onChange={handleInputChange} // Use handleInputChange
              className="w-full border rounded px-3 py-2"
              value={landFormData.description}
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
                onChange={handleInputChange} // Use handleInputChange
                className="w-full border rounded px-3 py-2"
                value={landFormData.salePrice}
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
                value={landFormData.transferExpenses}
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
                value={landFormData.purchasePrice}
                required
              />
            </div>
          </div>
        
          <div className="mb-4">
            <label className="block text-gray-700">Do you want to add cost of improvement details?</label>
            <div className="flex items-center">
              <input
                type="radio"
                name="addCostImprovement"
                value="yes"
                onChange={() =>
                  setLandFormData({ ...landFormData, addCostImprovement: true })
                }
                className="ml-2"
                checked={landFormData.addCostImprovement === true}
              />
              <span className="ml-2">Yes</span>
              <input
                type="radio"
                name="addCostImprovement"
                value="no"
                onChange={() =>
                  setLandFormData({ ...landFormData, addCostImprovement: false })
                }
                className="ml-4"
                checked={landFormData.addCostImprovement === false}
              />
              <span className="ml-2">No</span>
            </div>
          </div>

          {landFormData.addCostImprovement && (
            <div className="mb-4">
              <h3 className="text-md font-semibold mb-2">Cost of Improvement Details</h3>
              {landFormData.improvementDetails.map((detail: any, index: number) => (
                <div key={index} className="mb-4 border p-2 rounded">
                  <div className="mb-2">
                    <label className="block text-gray-700">Description</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={detail.description}
                      onChange={(e) =>
                        handleImprovementInputChange(index, "description", e.target.value)
                      }
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block text-gray-700">Amount (₹)</label>
                    <input
                      type="number"
                      className="w-full border rounded px-3 py-2"
                      value={detail.amount}
                      onChange={(e) =>
                        handleImprovementInputChange(index, "amount", e.target.value)
                      }
                    />
                  </div>
                  {landFormData.improvementDetails.length > 1 && (
                    <button
                      onClick={() => removeImprovementField(index)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addImprovementField}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Add More
              </button>
            </div>
          )}


          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {landFormData ? "Edit Details" : "Add Details"}
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

export default GoldAssestsForm;
