import React, { useEffect, useState } from "react";
import axios from "axios";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import { fetchSelfTaxData } from "@/api/taxSaving";

const SelfTaxForm = () => {
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    bsrCode: "",
    challanSerialNo: "",
  });

  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn)

  const [error, setError] = useState("");
const [isDataPresent,setIsDataPresent]=useState("");
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      try {
        const response = await fetchSelfTaxData(token)
        if (response) {
            setIsDataPresent(response);
          setFormData(response)
        }
      } catch (error) {
        console.error('Error fetching personal details:', error)
      }
    }

    if (isUserLoggedIn) {
      fetchData()
    }
  }, [isUserLoggedIn])
  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const token = localStorage.getItem('token')
    // Validate required fields
    if (!formData.amount || !formData.date || !formData.bsrCode || !formData.challanSerialNo) {
      setError("All fields are required.");
      return;
    }

    setError("");

    const url=isDataPresent?`${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/updateSelfTaxPaid`:`${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/postSelfTaxPaid`
    try {
      const response = await axios.post( url, formData,  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Form submitted successfully!");
      console.log(response.data);
    } catch (err) {
      console.error(err);
      setError("Error submitting the form. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>Self Tax Form</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Amount*</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Date*</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>BSR Code</label>
          <input
            type="text"
            name="bsrCode"
            value={formData.bsrCode}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Challan Serial No*</label>
          <input
            type="text"
            name="challanSerialNo"
            value={formData.challanSerialNo}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", background: "#007BFF", color: "#FFF", border: "none" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default SelfTaxForm;
