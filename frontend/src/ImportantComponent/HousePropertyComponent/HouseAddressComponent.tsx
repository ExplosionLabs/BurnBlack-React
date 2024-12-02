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
    value: string | null,
    event?: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (event) {
      // For standard input elements
      onChange({ ...data, [event.target.name]: event.target.value });
    } else {
      // For custom components like CountrySelect and StateSelect
      onChange({ ...data, [name]: value });
    }
  };

  return (
    <div>
      <h3>House Address</h3>
      <form>
        {/* Checkbox for using personal details */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={usePersonalDetails}
              onChange={handleCheckboxChange}
              disabled={loading} // Disable checkbox during loading
            />
            {loading ? "Loading address details..." : "Use Personal Details Address"}
          </label>
        </div>

        <div>
          <label htmlFor="flatNo">Flat/Door/Block No.*</label>
          <input
            type="text"
            id="flatNo"
            name="flatNo"
            value={data.flatNo}
            onChange={(e) => handleChange("flatNo", e.target.value, e)}
            required
          />
        </div>
        <div>
          <label htmlFor="premiseName">Premise Name</label>
          <input
            type="text"
            id="premiseName"
            name="premiseName"
            value={data.premiseName}
            onChange={(e) => handleChange("premiseName", e.target.value, e)}
          />
        </div>
        <div>
          <label htmlFor="road">Road/Street</label>
          <input
            type="text"
            id="road"
            name="road"
            value={data.road}
            onChange={(e) => handleChange("road", e.target.value, e)}
          />
        </div>
        <div>
          <label htmlFor="area">Area/Locality*</label>
          <input
            type="text"
            id="area"
            name="area"
            value={data.area}
            onChange={(e) => handleChange("area", e.target.value, e)}
            required
          />
        </div>
        <div>
          <label htmlFor="pincode">Pincode*</label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={data.pincode}
            onChange={(e) => handleChange("pincode", e.target.value, e)}
            required
          />
        </div>
        <div>
          <label htmlFor="country">Country*</label>
          <CountrySelect
            value={data.country || ""}
            onChange={(value) => {
              handleChange("country", value?.name || "");
              setCountryId(value?.id || null);
            }}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="state">State*</label>
          <StateSelect
            countryid={countryId}
            value={data.state || ""}
            onChange={(value) => handleChange("state", value?.name || "")}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={data.city}
            onChange={(e) => handleChange("city", e.target.value, e)}
            required
          />
        </div>
      </form>
    </div>
  );
};

export default HouseAddressComponent;
