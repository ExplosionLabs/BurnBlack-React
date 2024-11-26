import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";
import { format } from "date-fns";

function PersonalDetail() {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
    const [formData, setFormData] = useState({
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      martialStatus: "",
    });
  
    // Fetch user details from the database when the component mounts
    useEffect(() => {
      const fetchPersonalDetails = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getPersonalDetail`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = response.data;
          setFormData({
            ...data,
            dob: data.dob ? format(new Date(data.dob), "yyyy-MM-dd") : "", // Format the date
          });
          
        } catch (error) {
          console.error("Error fetching personal details:", error);
        }
      };
  
      if (isUserLoggedIn) {
        fetchPersonalDetails(); // Fetch details if the user is logged in
      }
    }, [isUserLoggedIn]); // Fetch data when the component mounts
  
    // Debounced function to update the database
    const updateDatabase = debounce(async (data) => {
      const token = localStorage.getItem("token");
      try {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updatePersonalDetail`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Data updated in database:", data);
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }, 300);
  
    // Handle input change and trigger autosave
    const handleChange = (e: { target: { name: any; value: any; }; }) => {
      const { name, value } = e.target;
      const updatedData = { ...formData, [name]: value };
      setFormData(updatedData);
      updateDatabase(updatedData); // Call the debounced function
    };
  
    return (
      <>
        <div>
          <div className="text-3xl font-bold">Personal Details</div>
          <form>
            <label>
              First Name:
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </label>
            <label>
              Middle Name:
              <input
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </label>
            <label>
              Date of Birth:
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </label>
            <label>
              Marital Status:
              <select
                name="martialStatus"
                value={formData.martialStatus}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefernottodisclose">Prefer Not to Disclose</option>
              </select>
            </label>
          </form>
        </div>
      </>
    );
  }
  
  export default PersonalDetail;