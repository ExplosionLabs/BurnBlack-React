import React, { useState,useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";
function ContactDetail() {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  
  const [formData, setFormData] = useState({
    aadharNumber: "",
    panNumber: "",
    mobileNumber: "",
    email: "",
    secondaryMobileNumber: "",
    secondaryEmail: "",
    landlineNumber: "",
  });

  // Debounced function to update the database
  const updateDatabase = debounce(async (data) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updateContactDetails`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Data updated in database:", data);
    } catch (error) {
      console.error("Error updating contact details:", error);
    }
  }, 3000);

  useEffect(() => {
    const fetchContactDetail = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getContactDetails`, {
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
  // Handle input change and trigger autosave
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    updateDatabase(updatedData); // Call the debounced function
  };

  return (
    <div>
      <h2 className="text-3xl font-bold">Contact Details</h2>
      <form>
        <label>
          Aadhar Number:
          <input
            type="text"
            name="aadharNumber"
            value={formData.aadharNumber}
            onChange={handleChange}
          />
        </label>
        <label>
          PAN Number:
          <input
            type="text"
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
          />
        </label>
        <label>
          Mobile Number:
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Secondary Mobile Number (Optional):
          <input
            type="text"
            name="secondaryMobileNumber"
            value={formData.secondaryMobileNumber}
            onChange={handleChange}
          />
        </label>
        <label>
          Secondary Email (Optional):
          <input
            type="email"
            name="secondaryEmail"
            value={formData.secondaryEmail}
            onChange={handleChange}
          />
        </label>
        <label>
          Landline Number (Optional):
          <input
            type="text"
            name="landlineNumber"
            value={formData.landlineNumber}
            onChange={handleChange}
          />
        </label>
      </form>
    </div>
  );
}

export default ContactDetail;
