import React, { useState ,useEffect} from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";

function AddressSection() {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const [formData, setFormData] = useState({
    flatNo: "",
    premiseName: "",
    road: "",
    area: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
  });

  const [countryid, setCountryid] = useState(null);
  const [stateid, setStateid] = useState(null);

  useEffect(() => {
    const fetchContactDetail = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getAddressDetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setFormData(data);
        
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };

    if (isUserLoggedIn) {
      fetchContactDetail(); // Fetch details if the user is logged in
    }
  }, [isUserLoggedIn]); 
  // Debounced function to update the database
  const updateDatabase = debounce(async (data) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updateAddressDetails`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Data updated in database:", data);
    } catch (error) {
      console.error("Error updating address:", error);
    }
  }, 300);

  // Handle input change and trigger autosave
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    updateDatabase(updatedData); // Call the debounced function
  };

  const handleCountrySelect = (selectedCountry) => {
    setCountryid(selectedCountry.id);
    const updatedData = { ...formData, country: selectedCountry.name, state: "", city: "" };
    setFormData(updatedData);
    updateDatabase(updatedData);
  };

  const handleStateSelect = (selectedState: { id: React.SetStateAction<null>; name: any; }) => {
    setStateid(selectedState.id);
    const updatedData = { ...formData, state: selectedState.name, city: "" };
    setFormData(updatedData);
    updateDatabase(updatedData);
  };

  const handleCitySelect = (selectedCity: { name: any; }) => {
    const updatedData = { ...formData, city: selectedCity.name };
    setFormData(updatedData);
    updateDatabase(updatedData);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold">Address Details</h2>
      <form>
        <label>
          Flat No:
          <input
            type="text"
            name="flatNo"
            value={formData.flatNo}
            onChange={handleChange}
          />
        </label>
        <label>
          Premise Name:
          <input
            type="text"
            name="premiseName"
            value={formData.premiseName}
            onChange={handleChange}
          />
        </label>
        <label>
          Road:
          <input
            type="text"
            name="road"
            value={formData.road}
            onChange={handleChange}
          />
        </label>
        <label>
          Area:
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
          />
        </label>
        <label>
          Pincode:
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
        </label>
        <label>
          <h6>Country</h6>
          <CountrySelect
            onChange={handleCountrySelect}
            placeHolder="Select Country"
          />
        </label>
        <label>
          <h6>State</h6>
          <StateSelect
            countryid={countryid}
            onChange={handleStateSelect}
            placeHolder="Select State"
          />
        </label>
        <label>
          <h6>City</h6>
          <CitySelect
            countryid={countryid}
            stateid={stateid}
            onChange={handleCitySelect}
            placeHolder="Select City"
          />
        </label>
      </form>
    </div>
  );
}

export default AddressSection;
