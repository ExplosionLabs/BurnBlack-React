import React ,{useState} from "react";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import { Country, State } from "react-country-state-city/dist/esm/types";
interface LandBuildFormProps {
  landFormData: any;
  setLandFormData: React.Dispatch<React.SetStateAction<any>>;
  step: number;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; // Add this
}

// Define the type for each buyer
type Buyer = {
  buyerName: string | undefined;
  ownershipPercentage: string | number | undefined;
  aadhaar: string | number | undefined;
  pan: string | number | undefined;
  amountPaid: string | number | undefined;
};
const LandBuildForm: React.FC<LandBuildFormProps> = ({
  landFormData,
  setLandFormData,
  step,
  handleNext,
  handleBack,
  handleSubmit,
  handleInputChange, // Accept handleInputChange as a prop
}) => {
  const [countryid, setCountryid] = useState<number | null>(null);
  type PropertyAddressChangeValue = 
  | string 
  | { name: string } 
  | React.ChangeEvent<HTMLInputElement>;
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
    value: PropertyAddressChangeValue, 
    additionalData?: Country | State | React.ChangeEvent<HTMLInputElement>
  ) => {
    // Extract value based on input type
    let finalValue: string = '';

    // Handle input change events
    if (value && typeof value === 'object' && 'target' in value) {
      finalValue = value.target.value;
    } 
    // Handle objects with name property (like Country/State)
    else if (value && typeof value === 'object' && 'name' in value) {
      finalValue = value.name;
    } 
    // Handle string values
    else if (typeof value === 'string') {
      finalValue = value;
    }

    // Handle country/state selections with additional data
    if (additionalData && 'id' in additionalData) {
      setCountryid(additionalData.id);
    }

    setLandFormData((prevState: any) => ({
      ...prevState,
      propertyAddress: {
        ...prevState.propertyAddress,
        [key]: finalValue,
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
          <h2 className="text-lg font-bold mb-4">Land Build Assets</h2>

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
          <div className="mb-4">
            <label className="block text-gray-700">Is this a House Property?</label>
            <input
              type="checkbox"
              name="isHouseProperty"
              onChange={handleInputChange}
              className="ml-2"
              checked={landFormData.isHouseProperty}
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
            <label className="block text-gray-700">
              Value of Property on which stamp duty paid (in Rs.)
            </label>
            <div className="flex items-center">
              <span className="mr-2">₹</span>
              <input
                type="number"
                name="stampDutyPrice"
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                value={landFormData.stampDutyPrice}
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


<div>
          <h2 className="text-lg font-bold mb-4">Property Address</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Pincode *</label>
            <input
  type="text"
  name="pincode"
  onChange={(e) =>
    handlePropertyAddressChange("pincode", e.target.value)
  }
  className="w-full border rounded px-3 py-2"
  value={landFormData.propertyAddress?.pincode || ""}
/>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address Line *</label>
            <input
  type="text"
  name="addressLine"
  onChange={(e) =>
    handlePropertyAddressChange("addressLine", e.target.value)
  }
  className="w-full border rounded px-3 py-2"
  value={landFormData.propertyAddress?.addressLine || ""}
/>
          </div>
          <div className="mb-4">
  <label className="block text-gray-700">Country *</label>
  <CountrySelect
        value={landFormData.propertyAddress?.country || ""}
        onChange={(value) =>
          handlePropertyAddressChange("country", value, value)
        }
        className="w-full border rounded px-3 py-2"
      />


</div>
<div className="mb-4">
  <label className="block text-gray-700">State *</label>
  <StateSelect
  countryid={countryid?? 0}
  value={landFormData.propertyAddress?.state || ""}
  onChange={(value) =>
    handlePropertyAddressChange("state", value, value)
  }
  className="w-full border rounded px-3 py-2"
/>
</div>

          <div className="mb-4">
            <label className="block text-gray-700">Town/City *</label>
            <input
  type="text"
  name="city"
  onChange={(e) =>
    handlePropertyAddressChange("city", e.target.value)
  }
  className="w-full border rounded px-3 py-2"
  value={landFormData.propertyAddress?.city || ""}
/>
          </div>
</div>

<div>
  <h2 className="text-lg font-semibold">Buyer Details</h2>
  {landFormData.buyers.map((buyer: Buyer, index: number) => (
    <div key={index !== undefined ? index : 0} className="border p-4 rounded mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="buyerName"
          placeholder="Buyer Name"
          value={buyer.buyerName}
          onChange={(e) => handleInputChangeBuyer(e, index)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="ownershipPercentage"
          placeholder="Ownership Percentage (%)"
          value={buyer.ownershipPercentage}
          onChange={(e) => handleInputChangeBuyer(e, index)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="aadhaar"
          placeholder="Aadhaar *"
          value={buyer.aadhaar}
          onChange={(e) => handleInputChangeBuyer(e, index)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="pan"
          placeholder="PAN *"
          value={buyer.pan}
          onChange={(e) => handleInputChangeBuyer(e, index)}
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="number"
          name="amountPaid"
          placeholder="Amount Paid *"
          value={buyer.amountPaid}
          onChange={(e) => handleInputChangeBuyer(e, index)}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      {/* {landFormData.buyers.length > 1 && (
        <button
          type="button"
          onClick={() => removeBuyer(index)}
          className="text-red-500 mt-2"
        >
          Remove Buyer
        </button>
      )} */}
    </div>
  ))}
  <button
    type="button"
    onClick={addBuyer}
    className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
  >
    Add More Buyer
  </button>
</div>


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

export default LandBuildForm;
