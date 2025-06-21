import { ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";

const HouseAddressComponent: React.FC<{
  data: any;
  onChange: (data: any) => void;
}> = ({ data, onChange }) => {
  const [countryId, setCountryId] = useState(null);
  const [usePersonalDetails, setUsePersonalDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isFormVisible, setIsFormVisible] = useState(false); // State to toggle form visibility
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Function to fetch addressDetail from the API
  const fetchAddressDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true); // Start loading
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getAddressDetails`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); // Replace with your API endpoint
      if (!response.ok) throw new Error("Failed to fetch address details");
      const addressDetail = await response.json();

      // Populate the form with fetched address details
      onChange({
        flatNo: addressDetail.flatNo || "",
        premiseName: addressDetail.premiseName || "",
        road: addressDetail.road || "",
        area: addressDetail.area || "",
        pincode: addressDetail.pincode || "",
        country: addressDetail.country || "",
        state: addressDetail.state || "",
        city: addressDetail.city || "",
      });
      setCountryId(addressDetail.countryId || null);
    } catch (error) {
      console.error("Error fetching address detail:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setUsePersonalDetails(checked);

    if (checked) {
      // Fetch address details when checked
      await fetchAddressDetail();
    } else {
      // Clear the form fields if unchecked
      onChange({
        flatNo: "",
        premiseName: "",
        road: "",
        area: "",
        pincode: "",
        country: "",
        state: "",
        city: "",
      });
      setCountryId(null);
    }
  };

  const handleChange = (
    name: string,
    value: string | { name: string } | null,
    event?: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (event) {
      // For standard input elements
      onChange({ ...data, [event.target.name]: event.target.value });
    } else if (value && typeof value === "object" && "name" in value) {
      // For custom components like CountrySelect, where value is an object with a name property
      onChange({ ...data, [name]: value.name });
    } else {
      // For other cases (e.g., null or plain string values)
      onChange({ ...data, [name]: value || "" });
    }
  };
  return (
    <div className="w-full mx-auto">
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-rose-500" />
          <h3 className="text-lg font-medium">House Address</h3>
        </div>
      <button
            onClick={toggleFormVisibility}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transform transition-transform ${
                isFormVisible ? "rotate-180" : ""
              }`}
            />
          </button>

      </div>

      {isFormVisible && (
      <form className="space-y-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={usePersonalDetails}
            onChange={handleCheckboxChange}

            className="w-4 h-4 rounded border-gray-300 text-gray-600"
          />
          <span className="text-gray-600">Same as the address filled in Personal Information</span>
        </label>

        <div className="space-y-4">
          <div>
            <label className="flex gap-0.5">
              <span>Flat/Door/Block no.</span>
              <span className="text-gray-400">*</span>
            </label>
            <input
              type="text"
              value={data.flatNo}
              onChange={(e) => handleChange('flatNo', e.target.value)}
              required
              className="mt-1 w-full px-3 py-1 rounded-md border border-gray-200 focus:outline-none focus:border-gray-300"
            />
          </div>

          <div>
            <label>Premise Name</label>
            <input
              type="text"
              value={data.premiseName}
              onChange={(e) => handleChange('premiseName', e.target.value)}
              className="mt-1 w-full px-3 py-1 rounded-md border border-gray-200 focus:outline-none focus:border-gray-300"
            />
          </div>

          <div>
            <label>Road/Street</label>
            <input
              type="text"
              value={data.road}
              onChange={(e) => handleChange('road', e.target.value)}
              className="mt-1 w-full px-3 py-1 rounded-md border border-gray-200 focus:outline-none focus:border-gray-300"
            />
          </div>

          <div>
            <label className="flex gap-0.5">
              <span>Area/Locality</span>
              <span className="text-gray-400">*</span>
            </label>
            <input
              type="text"
              value={data.area}
              onChange={(e) => handleChange('area', e.target.value)}
              required
              className="mt-1 w-full px-3 py-1 rounded-md border border-gray-200 focus:outline-none focus:border-gray-300"
            />
          </div>

          <div>
            <label className="flex gap-0.5">
              <span>Pincode</span>
              <span className="text-gray-400">*</span>
            </label>
            <input
              type="text"
              value={data.pincode}
              onChange={(e) => handleChange('pincode', e.target.value)}
              required
              className="mt-1 w-full px-3 py-1 rounded-md border border-gray-200 focus:outline-none focus:border-gray-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
        <label className="block text-xs text-gray-500 mb-1">Country</label>
        <CountrySelect
  value={data.country || ""}
  onChange={(value) => {
    handleChange("country", value as { name: string } | null);
  }}
  className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
/>;

        </div>

        <div>
        <label className="block text-xs text-gray-500 mb-1">State</label>
          <StateSelect
            countryid={countryId ?? 0}
            value={data.state || ""}
            onChange={(value) => 
              {
 
                handleChange("state", value as { name: string } | null); 
              }
            }
          className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


            <div>
              <label className="block text-xs text-gray-400 mb-1">City</label>
              <input
                type="text"
                value={data.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-3 py-1 rounded-md border border-gray-200 focus:outline-none focus:border-gray-300"
              />
            </div>
          </div>
        </div>
      </form>
      )}
    </div>
  </div>
  );
};

export default HouseAddressComponent;
