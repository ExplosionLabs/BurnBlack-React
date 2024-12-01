import { useState } from "react";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";

const HouseAddressComponent: React.FC<{ data: any; onChange: (data: any) => void }> = ({
  data,
  onChange,
}) => {
  const [countryId, setCountryId] = useState(null);

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
          <label htmlFor="roadStreet">Road/Street</label>
          <input
            type="text"
            id="roadStreet"
            name="roadStreet"
            value={data.roadStreet}
            onChange={(e) => handleChange("roadStreet", e.target.value, e)}
          />
        </div>
        <div>
          <label htmlFor="areaLocality">Area/Locality*</label>
          <input
            type="text"
            id="areaLocality"
            name="areaLocality"
            value={data.areaLocality}
            onChange={(e) => handleChange("areaLocality", e.target.value, e)}
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
